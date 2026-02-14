import asyncio
import datetime
import re
import unicodedata
import uuid
from typing import List, Optional, Dict
from difflib import SequenceMatcher
from concurrent.futures import ThreadPoolExecutor

import fitz 
import numpy as np
from fastapi import APIRouter, UploadFile, File, Depends, Body
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer

import io
import zipfile
from docx import Document

try:
    import rarfile  # type: ignore
except ImportError:  # безопасный фолбэк, если rarfile не установлен
    rarfile = None

try:
    import spacy  # type: ignore
except ImportError:
    spacy = None

_nlp_kk = None
if spacy is not None:
    try:
        # Пытаемся загрузить казахскую или мульти-языковую модель, если она установлена
        for model_name in ["kk_core_news_sm", "kk_core_news_md", "xx_sent_ud_sm"]:
            try:
                _nlp_kk = spacy.load(model_name)
                break
            except Exception:
                continue
    except Exception:
        _nlp_kk = None

from app.services.auth import jwt_auth_handler
from app.database.db import history, users, reports
import zippy

router = APIRouter()
executor = ThreadPoolExecutor(max_workers=4)

# Инициализация AI модели для семантического анализа (LaBSE)
# При первом запуске скачается около 1.8 ГБ весов модели
semantic_model = SentenceTransformer('sentence-transformers/LaBSE')

FILTER_RULES = {
    "gost": r'(?is)\n(Список литературы|Библиография|Пайдаланылған әдебиеттер).*$',
    "apa": r'(?is)\n(References|Bibliography).*$',
    "tables": r'(?i)(Таблица|Table|Кесте|Схема|Рисунок)\s+\d+.*?\n',
    "titles": r'(?is)^.*?(Министерство|УДК|МРНТИ|Дипломная работа|Thesis|Work|Проект).*?\n\n',
    "quotes": r'["«\'](.*?)["»\']'
}

# --- СЕРВИСНЫЕ ФУНКЦИИ ---

async def check_ai(text):
    detector = zippy.Zippy(zippy.CompressionEngine.BROTLI)
    loop = asyncio.get_running_loop()
    label, score = await loop.run_in_executor(None, detector.detector.score_text, text)
    percent = round(score * 100, 2)
    percent = min(max(percent, 0), 100)
    return {
        "label": "AI" if label == 'AI' else "Human",
        "score": percent,
        "isAI": label == 'AI'
    }

def get_semantic_dna_score(text_a: str, text_b: str) -> float:
    """Вычисляет семантическую близость через векторные эмбеддинги."""
    if not text_a.strip() or not text_b.strip():
        return 0.0
    
    # Кодируем тексты в векторы
    embeddings = semantic_model.encode([text_a, text_b])
    
    # Вычисляем косинусное сходство между векторами
    norm_a = np.linalg.norm(embeddings[0])
    norm_b = np.linalg.norm(embeddings[1])
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
        
    similarity = np.dot(embeddings[0], embeddings[1]) / (norm_a * norm_b)
    return float(similarity)

def apply_smart_filters(text: str, active_rules: List[str], custom_regex: Optional[str] = None) -> str:
    text = unicodedata.normalize('NFKC', text)
    for rule_key in active_rules:
        pattern = FILTER_RULES.get(rule_key)
        if pattern:
            text = re.sub(pattern, '', text)
    if custom_regex:
        try:
            lines = [line.split('//')[0].strip() for line in custom_regex.split('\n')]
            for pattern in lines:
                if pattern and len(pattern) > 1:
                    text = re.sub(pattern, '', text)
        except: pass
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()

    # Дополнительная лемматизация через spaCy (двуязычность KK/RU, если модель доступна)
    if _nlp_kk is not None and text:
        try:
            doc = _nlp_kk(text)
            text = " ".join(tok.lemma_ or tok.text for tok in doc)
        except Exception:
            pass
    return text

def get_diff_html(text_a: str, text_b: str) -> Dict:
    words_a, words_b = text_a.split(), text_b.split()
    s = SequenceMatcher(None, words_a, words_b)
    html_a, html_b = [], []
    for tag, i1, i2, j1, j2 in s.get_opcodes():
        chunk_a, chunk_b = " ".join(words_a[i1:i2]), " ".join(words_b[j1:j2])
        if tag == 'equal':
            html_a.append(f"<span class='diff-match'>{chunk_a}</span>")
            html_b.append(f"<span class='diff-match'>{chunk_b}</span>")
        elif tag == 'replace':
            html_a.append(f"<span class='diff-removed'>{chunk_a}</span>")
            html_b.append(f"<span class='diff-changed'>{chunk_b}</span>")
        elif tag == 'insert':
            html_b.append(f"<span class='diff-added'>{chunk_b}</span>")
        elif tag == 'delete':
            html_a.append(f"<span class='diff-removed'>{chunk_a}</span>")
    return {
        "htmlA": " ".join(html_a), 
        "htmlB": " ".join(html_b), 
        "lexical_similarity": round(s.ratio() * 100, 2)
    }

def extract_text_from_file(content: bytes, filename: str) -> str:
    if filename.lower().endswith('.pdf'):
        try:
            with fitz.open(stream=content, filetype="pdf") as doc:
                return " ".join([page.get_text() for page in doc])
        except: return ""

    elif filename.lower().endswith('.docx'):
        try:
            doc = Document(io.BytesIO(content))
            return " ".join([para.text for para in doc.paragraphs])
        except Exception as e:
            print(f"Docx error: {e}")
            return ""
        
    elif filename.lower().endswith('.txt'):
        try: return content.decode('utf-8')
        except: return content.decode('cp1251', errors='ignore')
    return ""


def extract_from_archive(content: bytes, filename: str) -> List[Dict[str, str]]:
    """Извлекает тексты из ZIP/RAR архива и возвращает список документов."""
    docs: List[Dict[str, str]] = []
    name_lower = filename.lower()

    # ZIP
    if name_lower.endswith('.zip'):
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as zf:
                for info in zf.infolist():
                    if info.is_dir():
                        continue
                    inner_name = info.filename
                    inner_lower = inner_name.lower()
                    if not (inner_lower.endswith('.pdf') or inner_lower.endswith('.docx') or inner_lower.endswith('.txt')):
                        continue
                    with zf.open(info) as f:
                        inner_bytes = f.read()
                    text = extract_text_from_file(inner_bytes, inner_name)
                    if text:
                        docs.append({"name": f"{filename}::{inner_name}", "text": text})
        except Exception:
            return docs

    # RAR (если поддерживается)
    elif name_lower.endswith('.rar') and rarfile is not None:
        try:
            with rarfile.RarFile(io.BytesIO(content)) as rf:  # type: ignore[attr-defined]
                for info in rf.infolist():
                    if info.isdir():
                        continue
                    inner_name = info.filename
                    inner_lower = inner_name.lower()
                    if not (inner_lower.endswith('.pdf') or inner_lower.endswith('.docx') or inner_lower.endswith('.txt')):
                        continue
                    with rf.open(info) as f:  # type: ignore[call-arg]
                        inner_bytes = f.read()
                    text = extract_text_from_file(inner_bytes, inner_name)
                    if text:
                        docs.append({"name": f"{filename}::{inner_name}", "text": text})
        except Exception:
            return docs

    return docs

async def run_cpu_task(func, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, func, *args)

# --- РОУТЫ ---

@router.get("/history")
async def get_history(user=Depends(jwt_auth_handler)):
    cursor = history.find({"email": user["sub"]}).sort("timestamp", -1)
    results = []
    async for entry in cursor:
        results.append({
            "id": str(entry["_id"]),
            "timestamp": entry["timestamp"].isoformat(),
            "total_pairs": len(entry.get("comparisons", [])),
            "comparisons": entry.get("comparisons", []),
            "settings": entry.get("settings_used", {})
        })
    return results


@router.delete("/history")
async def clear_history(user=Depends(jwt_auth_handler)):
    """Полностью очищает историю проверок для текущего пользователя."""
    await history.delete_many({"email": user["sub"]})
    return {"status": "ok"}


@router.post("/recalculate")
async def recalculate_from_text(
    payload: Dict = Body(...),
    user=Depends(jwt_auth_handler)
):
    """Пересчет коэффициента уникальности по отредактированным текстам без повторной загрузки файлов."""
    text_a = (payload.get("text_a") or "").strip()
    text_b = (payload.get("text_b") or "").strip()

    if not text_a or not text_b:
        return JSONResponse({"error": "Передайте оба текста для сравнения"}, 400)

    current_user = await users.find_one({"email": user["sub"]})
    u_settings = current_user.get("settings", {}) if current_user else {}
    active_rules = u_settings.get("active_rules", [])
    custom_regex = u_settings.get("custom_regex", "")

    if u_settings.get("exclude_quotes") and "quotes" not in active_rules:
        active_rules.append("quotes")

    # Применяем те же фильтры, что и при загрузке файлов
    filtered_a = apply_smart_filters(text_a, active_rules, custom_regex)
    filtered_b = apply_smart_filters(text_b, active_rules, custom_regex)

    if not filtered_a or not filtered_b:
        return JSONResponse({"error": "После фильтрации тексты пусты"}, 400)

    # Лексика
    diff = await run_cpu_task(get_diff_html, filtered_a, filtered_b)

    # Семантика через LaBSE
    embeddings = semantic_model.encode([filtered_a, filtered_b])
    emb_a, emb_b = embeddings[0], embeddings[1]
    norm_a, norm_b = float(np.linalg.norm(emb_a)), float(np.linalg.norm(emb_b))
    if norm_a == 0 or norm_b == 0:
        semantic_percent = 0.0
    else:
        semantic_percent = float(np.dot(emb_a, emb_b) / (norm_a * norm_b)) * 100.0
    semantic_percent = round(max(min(semantic_percent, 100.0), 0.0), 2)

    total_similarity = (diff["lexical_similarity"] * 0.7) + (semantic_percent * 0.3)
    total_similarity = round(min(max(total_similarity, 0), 100), 2)
    total_originality = round(100 - total_similarity, 2)

    # Оценка AI для каждого текста
    ai_a = await check_ai(filtered_a)
    ai_b = await check_ai(filtered_b)

    return {
        "similarity": total_similarity,
        "originality": total_originality,
        "semantic_info": {
            "dna_score": semantic_percent,
            "lexical_score": diff["lexical_similarity"]
        },
        "docA": {"name": payload.get("name_a", "Manual A"), "html": diff["htmlA"], "ai": ai_a},
        "docB": {"name": payload.get("name_b", "Manual B"), "html": diff["htmlB"], "ai": ai_b},
    }
@router.post("/compare-batch")
async def compare_batch(
    files: List[UploadFile] = File(...), 
    user=Depends(jwt_auth_handler)
):
    current_user = await users.find_one({"email": user["sub"]})
    u_settings = current_user.get("settings", {})
    active_rules = u_settings.get("active_rules", [])
    custom_regex = u_settings.get("custom_regex", "")
    
    if u_settings.get("exclude_quotes") and "quotes" not in active_rules:
        active_rules.append("quotes")

    if len(files) < 2:
        return JSONResponse({"error": "Загрузите хотя бы 2 файла"}, 400)

    # --- ЭТАП 1: Быстрая подготовка текстов (поддержка ZIP/RAR) ---
    processed_docs = []
    for file in files:
        content = await file.read()

        # Если загружен архив, раскрываем его содержимое
        if file.filename.lower().endswith(('.zip', '.rar')):
            inner_docs = await run_cpu_task(extract_from_archive, content, file.filename)
            for doc in inner_docs:
                filtered = apply_smart_filters(doc["text"], active_rules, custom_regex)
                if filtered:
                    processed_docs.append({
                        "name": doc["name"],
                        "text": filtered
                    })
        else:
            raw_text = await run_cpu_task(extract_text_from_file, content, file.filename)
            filtered = apply_smart_filters(raw_text, active_rules, custom_regex)
            if filtered:
                processed_docs.append({
                    "name": file.filename,
                    "text": filtered
                })

    if not processed_docs:
        return JSONResponse({"error": "Файлы пусты или не распознаны"}, 400)

    # --- ЭТАП 2: Оптимизация AI (LaBSE запускается один раз для всех) ---
    # Кодируем все тексты в векторы ОДНИМ батчем - это КЛЮЧ к скорости
    all_texts = [doc["text"] for doc in processed_docs]
    all_embeddings = semantic_model.encode(all_texts, batch_size=len(all_texts))
    
    # Сразу считаем AI-вероятность для каждого файла один раз
    for idx, doc in enumerate(processed_docs):
        doc["embedding"] = all_embeddings[idx]
        doc["ai"] = await check_ai(doc["text"])

    # --- ЭТАП 3: Молниеносное сравнение готовых данных ---
    results = []
    for i in range(len(processed_docs)):
        for j in range(i + 1, len(processed_docs)):
            d1, d2 = processed_docs[i], processed_docs[j]
            
            # Лексика (SequenceMatcher)
            diff = await run_cpu_task(get_diff_html, d1["text"], d2["text"])
            
            # Семантика (Косинусное сходство векторов, которые уже в памяти)
            emb1, emb2 = d1["embedding"], d2["embedding"]
            cos_sim = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
            semantic_percent = round(float(cos_sim) * 100, 2)

            # Твоя новая формула весов
            total_similarity = (diff["lexical_similarity"] * 0.7) + (semantic_percent * 0.3)
            total_similarity = round(min(max(total_similarity, 0), 100), 2)
            total_originality = round(100 - total_similarity, 2)

            report_id = str(uuid.uuid4())[:12].upper()

            # Формируем результат
            res_entry = {
                "pair": f"{d1['name']} vs {d2['name']}",
                "similarity": total_similarity,
                "originality": total_originality,
                "semantic_info": {
                    "dna_score": semantic_percent,
                    "lexical_score": diff["lexical_similarity"]
                },
                "docA": {"name": d1['name'], "html": diff["htmlA"], "ai": d1["ai"]},
                "docB": {"name": d2['name'], "html": diff["htmlB"], "ai": d2["ai"]},
                "report_id": report_id
            }
            results.append(res_entry)

            # Сохраняем подробный отчет в БД (асинхронно)
            await reports.insert_one({
                "report_id": report_id,
                "docA": res_entry["docA"],
                "docB": res_entry["docB"],
                "originality": total_originality,
                "semantic_dna": semantic_percent,
                "lexical_match": diff["lexical_similarity"],
                "timestamp": datetime.datetime.utcnow(),
                "is_public": True
            })

    # Сохранение в общую историю
    await history.insert_one({
        "email": user["sub"],
        "timestamp": datetime.datetime.utcnow(),
        "comparisons": results,
        "settings_used": u_settings
    })

    return {"comparisons": sorted(results, key=lambda x: x["similarity"], reverse=True)}
