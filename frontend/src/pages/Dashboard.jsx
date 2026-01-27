import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Footer } from '../components/Footer'; // Импортируем наш новый модуль
import axios from '../utils/axios';
import { useAuth } from '../utils/auth';
import { 
  FiUploadCloud, FiFileText, FiX, FiShield, FiSettings, FiLogOut, 
  FiUser, FiDownload, FiTerminal, FiChevronRight, FiGithub, 
  FiTwitter, FiLinkedin, FiGlobe, FiInfo, FiLock, FiMap, FiActivity, FiCpu
} from 'react-icons/fi';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shingleLen, setShingleLen] = useState(3);
  const [logs, setLogs] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);
  const logEndRef = useRef(null);

  useEffect(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [logs]);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-25), `[${time}] ${msg}`]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ФУНКЦИЯ СКАЧИВАНИЯ ПОЛНОГО ОТЧЕТА
  const downloadReport = () => {
    if (!selectedPair) return;
    const { docA, docB, originality } = selectedPair;
    const reportId = Math.random().toString(36).toUpperCase().substring(2, 10);
    const timestamp = new Date().toLocaleString('ru-RU');

    const reportData = `
======================================================================
           ПОЛНЫЙ ТЕХНИЧЕСКИЙ ПРОТОКОЛ QAZZEREP PRO v2.4
======================================================================
ID ТРАНЗАКЦИИ: #${reportId}
ДАТА ПРОВЕРКИ: ${timestamp}
СТАТУС ЯДРА:   SUCCESS_SYNCHRONIZED
----------------------------------------------------------------------

1. АНАЛИЗ ОБЪЕКТОВ:
   [ФАЙЛ А]: ${docA.name}
   [ФАЙЛ Б]: ${docB.name}

2. РЕЗУЛЬТАТЫ СХОДСТВА:
   ОБЩАЯ УНИКАЛЬНОСТЬ: ${originality}%
   УРОВЕНЬ ЗАИМСТВОВАНИЙ: ${100 - originality}%
   ВИЗУАЛЬНАЯ ШКАЛА: [${'#'.repeat(Math.floor(originality / 5))}${'.'.repeat(20 - Math.floor(originality / 5))}]

3. ТЕКСТОВЫЕ ДАННЫЕ (ФРАГМЕНТЫ):
----------------------------------------------------------------------
ИСТОЧНИК А:
${docA.html.replace(/<[^>]*>?/gm, '').substring(0, 1500)}...

ИСТОЧНИК Б:
${docB.html.replace(/<[^>]*>?/gm, '').substring(0, 1500)}...

----------------------------------------------------------------------
Сгенерировано автоматически системой QazZerep Engine.
Данный отчет является техническим подтверждением анализа.
======================================================================
    `;

    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `QazZerep_Full_Report_${reportId}.txt`;
    link.click();
    addLog(`SYS: Протокол #${reportId} успешно экспортирован.`);
  };

  const handleCompare = async () => {
    if (files.length < 2) return addLog("CRITICAL: Нужно минимум 2 файла.");
    setLoading(true);
    setResult(null);
    setLogs([]);
    
    addLog("Инициализация QazZerep Core...");
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      setTimeout(() => addLog("ETL: Извлечение текста и очистка метаданных..."), 500);
      setTimeout(() => addLog("ALGO: Расчет хэш-сумм и шинглов..."), 1200);

      const res = await axios.post(`/documents/compare-batch?k=${shingleLen}`, formData);
      setResult(res.data);
      setLoading(false);
      addLog("SUCCESS: Анализ завершен. Данные готовы к просмотру.");
    } catch (e) {
      addLog("KERNEL PANIC: Ошибка связи с сервером.");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-slate-400 font-sans overflow-hidden">
      
      {/* SIDEBAR: COMMUNITY & NAV */}
      <aside className="w-72 border-r border-white/5 bg-[#050505] flex flex-col z-30 shadow-2xl">
        <div className="p-8 flex items-center gap-3 text-white font-black tracking-tighter text-2xl">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse">
            <FiShield size={22} />
          </div>
          QAZZEREP <span className="text-emerald-500 text-[10px] mt-1 tracking-[0.3em]">PRO</span>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-6">
  
  {/* Блок: Статус текущей группы (Синхронизация) */}
  <div className="mt-4 p-5 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Local Cluster</p>
      <div className="flex gap-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-400">Загружено работ:</span>
        <span className="text-white font-mono">{files.length}</span>
      </div>
    </div>
  </div>

  {/* Блок: Информационная поддержка */}
  <div className="px-2 space-y-1">
    <p className="text-[10px] font-black text-slate-600 uppercase px-4 mb-2 tracking-[0.2em]">Information</p>
    {[
      { label: 'Помощь', path: 'помощь', icon: <FiInfo /> },
      { label: 'Контакты', path: 'контакты', icon: <FiGlobe /> },
    ].map((item, i) => (
      <Link 
        key={i} 
        to={`/${item.path}`}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm font-semibold"
      >
        <span className="text-lg opacity-40">{item.icon}</span>
        {item.label}
      </Link>
    ))}
  </div>

</nav>

        <div className="p-6">
          <button onClick={handleLogout} className="w-full p-4 flex items-center justify-center gap-3 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-2xl transition-all border border-red-500/10 font-bold uppercase text-[10px] tracking-widest">
            <FiLogOut /> Завершить сеанс
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-[#020202] custom-scrollbar">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none" />

        <div className="p-12 max-w-5xl mx-auto w-full flex-1 z-10">
          <div className="flex justify-between items-end mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div>
              <h1 className="text-5xl font-bold text-white tracking-tighter mb-2 italic">Рабочая Среда</h1>
              <p className="text-slate-500 font-medium tracking-wide">Система анализа ПДФ и поиска заимствований</p>
            </div>
            <div className="bg-[#0A0A0A] p-2 rounded-2xl border border-white/5 flex gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500"><FiCpu /></div>
              <div className="flex flex-col justify-center pr-4">
                <span className="text-[8px] font-black uppercase text-slate-600">Статус узла</span>
                <span className="text-[10px] font-bold text-white uppercase">Online / KZ-01</span>
              </div>
            </div>
          </div>

          {!result && !loading && (
            <div className="border-2 border-dashed border-white/5 rounded-[3.5rem] p-20 text-center bg-[#050505]/40 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-500 group">
              <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="hidden" id="pdf-upload" />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 text-emerald-500 shadow-2xl">
                  <FiUploadCloud size={40} />
                </div>
                <h3 className="text-white text-2xl font-bold">Загрузите PDF / DOCX</h3>
                <p className="text-slate-500 mt-3">Перетащите файлы для кросс-анализа</p>
              </label>
              {files.length >= 2 && (
                <button onClick={handleCompare} className="mt-12 px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all text-[11px] uppercase tracking-[0.2em]">
                  Запустить Ядро Анализа
                </button>
              )}
            </div>
          )}

          {(loading || logs.length > 0) && (
            <div className="mb-12 bg-black/80 border border-white/10 rounded-[2.5rem] p-8 font-mono text-[11px] relative overflow-hidden backdrop-blur-md animate-in fade-in">
               <div className="flex items-center gap-3 mb-6 text-slate-500 font-bold uppercase tracking-widest">
                 <FiTerminal className="text-emerald-500" /> <span>Console_Log_Stream</span>
               </div>
               <div className="space-y-2 h-40 overflow-y-auto custom-scrollbar">
                 {logs.map((log, i) => (
                   <div key={i} className="flex gap-4 animate-in slide-in-from-left-2">
                     <span className="text-emerald-500/30">[{i}]</span>
                     <span className="text-slate-300">{log}</span>
                   </div>
                 ))}
                 <div ref={logEndRef} />
               </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700">
              <div className="flex justify-between items-center px-4 mb-4">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Обнаруженные совпадения</span>
                <button onClick={() => {setResult(null); setFiles([]);}} className="text-red-500 text-[10px] font-black uppercase hover:underline">Очистить всё</button>
              </div>
              {result.comparisons.map((item, idx) => (
                <div 
                  key={idx} onClick={() => setSelectedPair(item)}
                  className="p-8 bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem] flex justify-between items-center hover:border-emerald-500/40 hover:from-emerald-500/[0.05] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${item.originality < 50 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <FiFileText size={24}/>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{item.pair}</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Нажмите для детального протокола</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className={`text-4xl font-black tracking-tighter ${item.originality < 50 ? 'text-red-500' : 'text-emerald-500'}`}>{item.originality}%</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase">Уникальность</p>
                    </div>
                    <FiChevronRight className="text-slate-800 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" size={24} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER: NAVIGATION & POLICY */}
        <Footer />
      </main>

      {/* MODAL: FULL ANALYSIS VIEW */}
      {selectedPair && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col p-8 animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10 px-6">
            <div className="flex items-center gap-8">
               <div className={`text-6xl font-black tracking-tighter ${selectedPair.originality < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                 {selectedPair.originality}%
               </div>
               <div>
                  <h2 className="text-3xl font-bold text-white tracking-tighter italic">Детальная сверка документов</h2>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">Neural Comparison Mode / Active</p>
               </div>
            </div>
            <div className="flex gap-4">
              <button onClick={downloadReport} className="flex items-center gap-3 px-8 py-5 bg-white/5 rounded-2xl text-white hover:bg-white/10 text-[11px] font-black uppercase tracking-widest border border-white/10 transition-all shadow-2xl">
                <FiDownload size={18}/> Скачать протокол
              </button>
              <button onClick={() => setSelectedPair(null)} className="w-16 h-16 flex items-center justify-center text-white bg-red-500/10 rounded-2xl hover:bg-red-500 transition-all border border-red-500/20 group">
                <FiX size={28} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-4 gap-4 px-6 mb-8">
            {[
              { label: 'Объем выборки', val: `${(selectedPair.docA.html.length / 100).toFixed(0)} знаков` },
              { label: 'Пересечения', val: `${100 - selectedPair.originality}%`, color: 'text-red-500' },
              { label: 'Риск плагиата', val: selectedPair.originality < 50 ? 'КРИТИЧЕСКИЙ' : 'НИЗКИЙ', color: selectedPair.originality < 50 ? 'text-red-500' : 'text-emerald-500' },
              { label: 'Метод анализа', val: 'Шинглы (Jaccard)' }
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 text-center shadow-inner animate-in fade-in slide-in-from-top-2 duration-700">
                <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-1">{s.label}</p>
                <p className={`text-sm font-black tracking-tight ${s.color || 'text-white'}`}>{s.val}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden px-6 pb-6">
             {[
               { name: selectedPair.docA.name, color: 'emerald', tag: 'ИСТОЧНИК_A', html: selectedPair.docA.html },
               { name: selectedPair.docB.name, color: 'red', tag: 'ИСТОЧНИК_B', html: selectedPair.docB.html }
             ].map((doc, i) => (
               <div key={i} className="flex flex-col bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center px-10">
                    <span className="text-[11px] font-black text-white tracking-widest truncate max-w-[250px]">{doc.name}</span>
                    <span className={`text-[9px] font-black bg-white/5 text-slate-500 px-3 py-1 rounded-full border border-white/10 tracking-widest`}>{doc.tag}</span>
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto text-slate-300 leading-relaxed text-sm custom-scrollbar selection:bg-emerald-500/30" dangerouslySetInnerHTML={{ __html: doc.html }} />
               </div>
             ))}
          </div>
        </div>
      )}

      <style>{`
      /* Основной контейнер текста */
.text-display {
    color: #e0e0e0; /* Светло-серый текст, чтобы не резал глаза */
    line-height: 1.8;
    font-size: 15px;
    background: #1a1a1a;
    padding: 24px;
    border-radius: 12px;
}

/* 1. ПОЛНОЕ СОВПАДЕНИЕ (ПЛАГИАТ) */
.diff-match {
    color: #ff8080; /* Мягкий красный цвет текста */
    border-bottom: 1px solid rgba(255, 128, 128, 0.4);
    background: rgba(255, 128, 128, 0.05); /* Едва заметный фон */
}

/* 2. РЕРАЙТ (ИЗМЕНЕННОЕ СЛОВО) */
.diff-changed {
    color: #ffd966; /* Песочно-желтый */
    border-bottom: 1px dashed #ffd966;
}

/* 3. НОВЫЙ ТЕКСТ (ОРИГИНАЛЬНЫЙ) */
.diff-added {
    color: #a7ffeb; /* Мягкий бирюзовый */
    background: rgba(167, 255, 235, 0.05);
}

/* 4. УДАЛЕННЫЙ ТЕКСТ (ДЛЯ СРАВНЕНИЯ) */
.diff-removed {
    color: #666; /* Тусклый серый */
    text-decoration: line-through;
}
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
        
        /* Стили для подсветки, если бэк их присылает */
        .diff-match { background: rgba(239, 68, 68, 0.2); border-bottom: 2px solid #ef4444; color: #fff; }
        .diff-rewrite { background: rgba(245, 158, 11, 0.2); border-bottom: 2px dashed #f59e0b; color: #fff; }
      `}</style>
    </div>
  );
}
