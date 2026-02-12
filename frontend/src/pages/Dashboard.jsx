import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "../utils/axios";
import { useTheme } from "../hooks/useTheme";
import { 
    FiUploadCloud, FiFileText, FiX, FiChevronRight, FiActivity, FiClock, 
    FiGrid, FiUser, FiZap, FiCalendar, FiCopy, FiCheck, FiSun, FiMoon, FiMonitor, FiNavigation 
} from "react-icons/fi";
import { QRCodeSVG } from 'qrcode.react';

// Компоненты
import ProcessingLoader from "../components/ProcessingLoader";
import { Footer } from "../components/Footer";
import ProjectRoadmap from "../components/ProjectRoadmap";
import { Profile } from "./Profile";
import Preloader from "../components/Preloader";

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (UI) ---

function SegmentedControl({ options, activeValue, onChange, type = "text", small = false }) {
    const activeIndex = options.findIndex(o => o.value === activeValue);
    return (
        <div className="relative flex bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/5 p-1 rounded-2xl w-full select-none shadow-inner">
            <div 
                className="absolute top-1 bottom-1 bg-white dark:bg-zinc-800 shadow-md rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"
                style={{
                    width: `calc(${100 / options.length}% - 4px)`,
                    left: `calc(${(activeIndex * 100) / options.length}% + 2px)`
                }}
            />
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`relative z-10 flex-1 flex items-center justify-center transition-all duration-500 ${small ? 'py-1.5' : 'py-2.5'} ${activeValue === option.value ? 'text-black dark:text-white' : 'text-muted-foreground opacity-60'}`}
                >
                    {type === "icon" ? option.icon : (
                        <span className={`font-black tracking-widest uppercase leading-none ${small ? 'text-[8px]' : 'text-[10px]'}`}>{option.label}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

function NavItem({ active, icon, label, onClick }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${active ? 'bg-foreground/5 text-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100'}`}>
            <span className={active ? 'text-foreground' : 'opacity-40'}>{icon}</span>
            <span className="text-[13px] tracking-tight">{label}</span>
        </button>
    );
}

// --- ОСНОВНОЙ КОМПОНЕНТ DASHBOARD ---

export default function Dashboard() {
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const [files, setFiles] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("new"); // 'new', 'history', 'roadmap'
    const [history, setHistory] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedPair, setSelectedPair] = useState(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => { 
        if (viewMode === "history") fetchHistory(); 
    }, [viewMode]);

    const fetchHistory = async () => {
        try { 
            const res = await axios.get('/documents/history'); 
            setHistory(res.data); 
        } catch (e) { console.error("Archive error"); }
    };

    const handleCompare = async () => {
        if (files.length < 2) return;
        setLoading(true);
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        
        const requestPromise = axios.post(`/documents/compare-batch`, formData);
        const delayPromise = new Promise(resolve => setTimeout(resolve, 2200));

        try {
            const [res] = await Promise.all([requestPromise, delayPromise]);
            setResult(res.data);
        } catch (e) { console.error("Server error"); }
        finally { setLoading(false); }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/verify/${selectedPair.report_id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isAppLoading) return <Preloader />;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-500">
            
            {loading && <ProcessingLoader t={t} />}

            {/* SIDEBAR */}
            <aside className="fixed bottom-0 left-0 w-full z-[100] md:relative md:w-64 md:h-full bg-card md:bg-background border-t md:border-t-0 md:border-r border-border flex md:flex-col">
                <div className="hidden md:flex p-8 items-center gap-3">
                    <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shadow-lg">
                        <FiZap size={18} className="text-background" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight italic">QazZerep</span>
                </div>
                
                <nav className="flex-1 flex md:flex-col justify-around md:justify-start p-3 gap-2">
                    <NavItem active={viewMode === 'new'} icon={<FiGrid size={18}/>} label={t('nav.check')} onClick={() => setViewMode('new')} />
                    <NavItem active={viewMode === 'history'} icon={<FiClock size={18}/>} label={t('nav.history')} onClick={() => setViewMode('history')} />
                    <div className="hidden md:block my-4 border-t border-border/50 mx-4"></div>
                    <NavItem active={viewMode === 'roadmap'} icon={<FiNavigation size={18}/>} label={t('nav.roadmap') || "Roadmap"} onClick={() => setViewMode('roadmap')} />
                    <NavItem active={isProfileOpen} icon={<FiUser size={18}/>} label={t('nav.account')} onClick={() => setIsProfileOpen(true)} />
                    
                    {/* Языки и Тема */}
                    <div className="hidden md:flex flex-col mt-auto gap-6 p-5 border-t border-border/20 bg-black/[0.02] dark:bg-white/[0.02] rounded-t-3xl">
                        <div className="space-y-3">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 px-1 italic">{t('settings.language')}</span>
                            <SegmentedControl small activeValue={i18n.language} onChange={(val) => i18n.changeLanguage(val)}
                                options={[{ value: 'rus', label: 'RU' }, { value: 'kaz', label: 'KZ' }, { value: 'eng', label: 'EN' }]} />
                        </div>
                        <div className="space-y-3">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 px-1 italic">{t('settings.theme')}</span>
                            <SegmentedControl small activeValue={theme} onChange={(val) => setTheme(val)} type="icon"
                                options={[{ value: 'light', icon: <FiSun size={12}/> }, { value: 'dark', icon: <FiMoon size={12}/> }, { value: 'system', icon: <FiMonitor size={12}/> }]} />
                        </div>
                    </div>
                </nav>
            </aside>

            {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
                <div className="p-6 md:p-16 max-w-6xl mx-auto w-full flex-1">
                    
                    {/* Условный рендеринг заголовков (не показываем для Roadmap) */}
                    {viewMode !== "roadmap" && (
                        <header className="mb-12 animate-in fade-in duration-500">
                            <h1 className="text-3xl font-medium tracking-tight italic">
                                {viewMode === "new" ? t('dash.title_new') : t('dash.title_history')}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-2 font-light opacity-60">
                                {viewMode === "new" ? t('dash.subtitle_new') : t('dash.subtitle_history')}
                            </p>
                        </header>
                    )}

                    {/* РЕНДЕРИНГ КОНТЕНТА ПО РЕЖИМАМ */}
                    
                    {viewMode === "new" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {!result && !loading && (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                                    <div className="relative bg-card border border-border rounded-3xl p-12 md:p-24 flex flex-col items-center border-dashed group-hover:border-foreground/20 transition-all">
                                        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="hidden" id="file-up" />
                                        <label htmlFor="file-up" className="cursor-pointer flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center mb-6">
                                                <FiUploadCloud size={28} className="text-foreground" />
                                            </div>
                                            <h2 className="text-lg font-medium">{t('upload.title')}</h2>
                                            <p className="text-muted-foreground text-sm mt-2 opacity-50">{t('upload.formats')}</p>
                                        </label>
                                        {files.length > 0 && (
                                            <div className="mt-8 flex flex-col items-center">
                                                <span className="text-[10px] text-blue-500 mb-4 font-black uppercase tracking-widest">{t('upload.selected')}: {files.length}</span>
                                                <button onClick={handleCompare} className="px-12 py-4 bg-foreground text-background font-black text-[11px] uppercase tracking-widest rounded-full hover:opacity-90 transition-all active:scale-95 shadow-xl">
                                                    {t('upload.btn_start')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {result && !loading && (
                                <div className="grid grid-cols-1 gap-4">
                                    {result.comparisons.map((item, idx) => (
                                        <ResultItem key={idx} item={item} onClick={() => setSelectedPair(item)} />
                                    ))}
                                    <button onClick={() => {setResult(null); setFiles([]);}} className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all">{t('dash.btn_reset')}</button>
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === "history" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                            {history.length > 0 ? history.map((session, i) => (
                                <HistoryCard key={i} session={session} onSelect={setSelectedPair} />
                            )) : (
                                <div className="col-span-full py-20 text-center opacity-30 italic">No records found</div>
                            )}
                        </div>
                    )}

                    {viewMode === "roadmap" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ProjectRoadmap />
                        </div>
                    )}
                </div>

                <Footer />
            </main>

            {/* --- REPORT MODAL --- */}
            {selectedPair && (
                <div className="fixed inset-0 z-[110] bg-background flex flex-col animate-in slide-in-from-bottom duration-500">
                    <header className="flex items-center justify-between px-8 py-6 border-b border-border bg-background/80 backdrop-blur-xl">
                        <div className="flex items-center gap-6">
                            <h2 className="text-2xl font-medium tracking-tighter italic text-foreground">{t('report.title')}</h2>
                            <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${selectedPair.originality < 50 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {selectedPair.originality}% {t('report.match_label')}
                            </div>
                        </div>
                        <button onClick={() => setSelectedPair(null)} className="p-3 hover:bg-foreground/5 rounded-full text-foreground transition-colors"><FiX size={24} /></button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-background">
                        <div className="max-w-7xl mx-auto space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <DetailCard doc={selectedPair.docA} title={t('report.source_a')} t={t} />
                                <div className="bg-card border border-border rounded-[40px] p-8 flex flex-col items-center justify-center shadow-xl">
                                    <div className="relative mb-8 cursor-pointer group" onClick={copyLink}>
                                        <div className="bg-white p-4 rounded-3xl shadow-lg transition-transform group-hover:scale-105">
                                            <QRCodeSVG value={`${window.location.origin}/verify/${selectedPair.report_id}`} size={120} level="H" fgColor="#000" />
                                        </div>
                                        {copied && (
                                            <div className="absolute inset-0 bg-background/95 rounded-3xl flex flex-col items-center justify-center border border-border animate-in zoom-in duration-200">
                                                <FiCheck size={32} className="text-emerald-500 mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{t('report.copied')}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={copyLink} className="text-[9px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-3 bg-foreground/5 px-5 py-2.5 rounded-full uppercase tracking-tighter transition-all">
                                        <FiCopy size={12}/> {selectedPair.report_id?.substring(0, 16)}...
                                    </button>
                                </div>
                                <DetailCard doc={selectedPair.docB} title={t('report.target_b')} t={t} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <TextPanel doc={selectedPair.docA} />
                                <TextPanel doc={selectedPair.docB} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
                .diff-match { color: #ef4444; background: rgba(239, 68, 68, 0.08); }
                ::selection { background: #3b82f6; color: #fff; }
            `}</style>
        </div>
    );
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ (ВНУТРЕННИЕ) ---

function ResultItem({ item, onClick }) {
    return (
        <div onClick={onClick} className="p-6 bg-card border border-border rounded-[32px] flex items-center justify-between hover:border-foreground/20 transition-all cursor-pointer group shadow-sm">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiFileText size={20} className="text-muted-foreground" />
                </div>
                <div>
                    <p className="text-[15px] font-medium tracking-tight text-foreground">{item.pair}</p>
                    <p className="text-[10px] text-muted-foreground font-mono opacity-60 mt-1 uppercase">ID: {item.report_id?.substring(0,8)}</p>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <span className={`text-xl font-bold tracking-tighter ${item.originality < 50 ? 'text-red-500' : 'text-emerald-500'}`}>{item.originality}%</span>
                <FiChevronRight className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" size={20} />
            </div>
        </div>
    );
}

function HistoryCard({ session, onSelect }) {
    return (
        <div className="bg-card border border-border rounded-[32px] p-8 hover:border-foreground/20 transition-all group">
            <div className="flex items-center gap-3 mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                <FiCalendar size={14} className="text-foreground"/><span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{new Date(session.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="space-y-4">
                {session.comparisons.map((comp, j) => (
                    <div key={j} onClick={() => onSelect(comp)} className="flex justify-between items-center cursor-pointer border-b border-border/50 pb-3 last:border-0 hover:translate-x-1 transition-transform">
                        <span className="text-[13px] text-muted-foreground hover:text-foreground transition-colors truncate pr-6">{comp.pair}</span>
                        <span className={`text-[13px] font-black ${comp.originality < 50 ? 'text-red-500' : 'text-emerald-500'}`}>{comp.originality}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DetailCard({ doc, title, t }) {
    const isHighRisk = doc.ai.score > 60;
    return (
        <div className="bg-card border border-border rounded-[40px] p-10 shadow-xl transition-all hover:scale-[1.02]">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic">{title}</span>
            <h3 className="text-xl font-medium mt-3 truncate text-foreground">{doc.name}</h3>
            <div className="mt-12">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('report.ai_prob')}</span>
                    <span className={`text-2xl font-black italic ${isHighRisk ? 'text-red-500' : 'text-emerald-500'}`}>{doc.ai.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${doc.ai.score}%`}} />
                </div>
            </div>
        </div>
    );
}

function TextPanel({ doc }) {
    return (
        <div className="flex flex-col bg-card border border-border rounded-[40px] overflow-hidden shadow-xl">
            <div className="px-8 py-5 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate max-w-[300px] italic opacity-60">{doc.name}</span>
                <FiActivity size={14} className="text-blue-500 animate-pulse" />
            </div>
            <div className="p-10 text-[15px] text-foreground/80 leading-[1.8] max-h-[600px] overflow-y-auto custom-scrollbar font-light tracking-tight" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
    );
}
