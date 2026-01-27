import asyncio
import hashlib
import re
import unicodedata
from typing import List, Optional, Set, Dict
from difflib import SequenceMatcher

import fitz 
import spacy
from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Depends, Body
from fastapi.responses import JSONResponse
from concurrent.futures import ThreadPoolExecutor
from app.services.auth import jwt_auth_handler

try:
    nlp = spacy.load("xx_sent_ud_sm")
except:
    nlp = None

router = APIRouter()
executor = ThreadPoolExecutor(max_workers=4)

def clean_text(text: str) -> str:
    """Очистка текста для сравнения смыслов."""
    text = unicodedata.normalize('NFKC', text).lower()
    return re.sub(r'\s+', ' ', text).strip()

async def run_cpu_task(func, *args):
    """Запуск синхронной функции в отдельном потоке."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, func, *args)

def extract_pdf_sync(file_bytes: bytes) -> str:
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            return " ".join([page.get_text() for page in doc])
    except:
        return ""
def get_diff_html(text_a: str, text_b: str) -> Dict[str, str]:
    words_a = text_a.split()
    words_b = text_b.split()
    
    s = SequenceMatcher(None, words_a, words_b)
    html_a, html_b = [], []
    
    for tag, i1, i2, j1, j2 in s.get_opcodes():
        chunk_a = " ".join(words_a[i1:i2])
        chunk_b = " ".join(words_b[j1:j2])
        
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
        "similarity": round(s.ratio() * 100, 2)
    }

@router.post("/compare-batch")
async def compare_batch(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        return JSONResponse({"error": "Нужно минимум 2 файла"}, 400)

    docs = []
    for file in files:
        content = await file.read()
        text = await run_cpu_task(extract_pdf_sync, content)
        if text.strip():
            docs.append({"name": file.filename, "text": clean_text(text)})

    results = []
    for i in range(len(docs)):
        for j in range(i + 1, len(docs)):
            d1, d2 = docs[i], docs[j]
            
            diff_data = await run_cpu_task(get_diff_html, d1["text"], d2["text"])
            
            results.append({
                "pair": f"{d1['name']} vs {d2['name']}",
                "similarity": diff_data["similarity"],
                "originality": round(100 - diff_data["similarity"], 2),
                "docA": {
                    "name": d1['name'],
                    "html": diff_data["htmlA"]
                },
                "docB": {
                    "name": d2['name'],
                    "html": diff_data["htmlB"]
                }
            })

    return {"comparisons": sorted(results, key=lambda x: x["similarity"], reverse=True)}
