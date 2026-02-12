import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
    FiShield, FiActivity, FiCheckCircle, FiAlertTriangle, 
    FiCpu, FiFileText, FiCode, FiCopy, FiCheck, FiChevronRight, FiZap, FiDownload 
} from "react-icons/fi";
import axios from "../utils/axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { QRCodeSVG } from "qrcode.react";

export default function VerifyPage() {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPublicReport = async () => {
            try {
                const res = await axios.get(`/reports/${reportId}`);
                setReport(res.data);
            } catch (e) {
                console.error("Ошибка загрузки протокола:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicReport();
    }, [reportId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center font-sans overflow-hidden">
            <div className="relative">
                <div className="w-24 h-24 border-2 border-blue-500/10 rounded-full" />
                <div className="absolute top-0 w-24 h-24 border-t-2 border-blue-500 rounded-full animate-spin" />
                <FiZap className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={32} />
            </div>
            <span className="mt-8 tracking-[0.5em] text-[10px] text-blue-500 uppercase font-black animate-pulse">
                Decrypting Protocol...
            </span>
        </div>
    );

    if (!report) return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <FiAlertTriangle size={40} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Protocol Expired</h1>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Hash ID: {reportId?.substring(0, 16)} not found</p>
            <Link to="/" className="mt-10 px-10 py-4 bg-white text-black font-black rounded-full uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
                Return to Core
            </Link>
        </div>
    );

    const isDangerous = (report.originality || 0) < 50;

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-blue-500 selection:text-white">
            
            {/* BACKGROUND GLOW */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            {/* HEADER */}
            <header className="sticky top-0 z-[100] bg-black/60 backdrop-blur-2xl border-b border-white/5 h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <FiZap size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tighter text-white uppercase italic leading-none">QAZZEREP</span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Trust Protocol v2.0</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-3 px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                                copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                            }`}
                        >
                            {copied ? <FiCheck size={14}/> : <FiCopy size={14}/>} 
                            <span className="hidden sm:inline">{copied ? "Copied" : "Copy Proof Link"}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8">
                
                {/* VERDICT HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* STATS CARD */}
                    <div className="lg:col-span-2 bg-[#0c0c0c] border border-white/5 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <FiShield size={200} />
                        </div>

                        <div className="w-56 h-56 relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: report.originality }, { value: 100 - report.originality }]}
                                        innerRadius={75} outerRadius={95} stroke="none" dataKey="value" startAngle={90} endAngle={450}
                                    >
                                        <Cell fill={isDangerous ? "#ef4444" : "#10b981"} shadow="0 0 20px rgba(16,185,129,0.5)" />
                                        <Cell fill="#ffffff" opacity={0.03} />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-black italic tracking-tighter ${isDangerous ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {report.originality}%
                                </span>
                                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] mt-1">Similarity</span>
                            </div>
                        </div>

                        <div className="relative z-10 flex-1 space-y-6">
                            <div>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 block">Official Verification</span>
                                <h2 className="text-3xl md:text-4xl font-medium text-white uppercase italic tracking-tighter leading-tight">
                                    Report Integrity <br/>Node #{reportId.substring(0,8)}
                                </h2>
                            </div>
                            
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-md font-light">
                                {isDangerous 
                                    ? "Critical level of similarity detected. The document contains high-volume matches with existing sources and requires immediate review." 
                                    : "Verification successful. The level of originality meets the strict standards of academic and professional integrity protocols."}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <Badge label="Hash Verified" icon={<FiCode size={10}/>} active />
                                <Badge label="Immutable Trace" icon={<FiActivity size={10}/>} />
                            </div>
                        </div>
                    </div>

                    {/* QR CERTIFICATE */}
                    <div className="bg-[#0c0c0c] border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center shadow-2xl group hover:border-white/10 transition-all">
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative p-4 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500">
                                <QRCodeSVG value={window.location.href} size={140} level="H" />
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] block mb-1">Authentic Origin</span>
                            <span className="text-[8px] font-mono text-zinc-600 uppercase">Timestamp: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* AI ANALYSIS METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { doc: report.docA, label: 'Document Source A' },
                        { doc: report.docB, label: 'Document Source B' }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#0c0c0c] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between hover:bg-white/[0.01] transition-colors">
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                                    <h4 className="text-white font-medium truncate max-w-[200px] italic">{item.doc.name}</h4>
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-black italic ${item.doc.ai?.score > 60 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {item.doc.ai?.score}%
                                    </span>
                                    <span className="block text-[8px] font-black uppercase text-zinc-500 tracking-widest">AI Probability</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px] ${
                                            item.doc.ai?.score > 60 
                                                ? 'bg-red-500 shadow-red-500/20' 
                                                : 'bg-emerald-500 shadow-emerald-500/20'
                                        }`} 
                                        style={{ width: `${item.doc.ai?.score}%` }} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* COMPARISON VIEW */}
                <div className="pt-10 space-y-6">
                    <div className="flex items-center gap-6 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Comparison Archive</span>
                        </div>
                        <div className="flex-grow h-[1px] bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
                        {[report.docA, report.docB].map((doc, i) => (
                            <div key={i} className="flex flex-col bg-[#0c0c0c] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                                <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <FiFileText className="text-zinc-600" size={14} />
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate max-w-[250px] italic">
                                            {doc.name}
                                        </span>
                                    </div>
                                    <span className="text-[8px] font-black bg-white/5 text-zinc-400 px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-tighter">
                                        Layer 0{i + 1}
                                    </span>
                                </div>
                                <div 
                                    className="flex-1 p-10 md:p-14 overflow-y-auto text-zinc-400 leading-[1.8] text-[15px] font-light custom-scrollbar" 
                                    dangerouslySetInnerHTML={{ __html: doc.html }} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-20 text-center opacity-30">
                <span className="text-[9px] font-black uppercase tracking-[0.5em]">Securely Processed by QazZerep Neural Engine</span>
            </footer>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
                
                .diff-match { 
                    color: #ef4444; 
                    background: rgba(239, 68, 68, 0.05); 
                    padding: 2px 0;
                    border-bottom: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 2px;
                }
                
                .diff-changed { 
                    color: #fbbf24; 
                    border-bottom: 1px dashed rgba(251, 191, 36, 0.4); 
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                main > div {
                    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}

function Badge({ label, icon, active = false }) {
    return (
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
            active 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' 
            : 'bg-white/5 border-white/10 text-zinc-500'
        }`}>
            {icon}
            {label}
        </div>
    );
}
