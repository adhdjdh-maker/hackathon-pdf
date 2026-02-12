import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FiArrowLeft, FiCpu, FiDatabase, FiLock, FiShield, FiFileText,
  FiActivity, FiTerminal, FiAlertCircle, FiGlobe, FiInfo, FiZap, FiChevronRight
} from 'react-icons/fi';

const InfoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pageMeta = {
    'documentation': { icon: <FiTerminal size={24} />, cat: 'architecture', key: 'doc', color: 'blue' },
    'knowledge-base': { icon: <FiDatabase size={24} />, cat: 'methodology', key: 'base', color: 'indigo' },
    'privacy': { icon: <FiLock size={24} />, cat: 'privacy', key: 'priv', color: 'emerald' },
    'terms': { icon: <FiFileText size={24} />, cat: 'legal', key: 'terms', color: 'zinc' },
    'cookie': { icon: <FiActivity size={24} />, cat: 'technical', key: 'cookie', color: 'amber' },
    'help': { icon: <FiInfo size={24} />, cat: 'manual', key: 'help', color: 'sky' },
    'contacts': { icon: <FiGlobe size={24} />, cat: 'channels', key: 'contacts', color: 'violet' }
  };

  const meta = pageMeta[slug] || { icon: <FiAlertCircle size={24}/>, cat: 'error', key: '404', color: 'red' };
  const items = t(`info.content.${meta.key}.items`, { returnObjects: true }) || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* BACKGROUND DECOR (AMBIENT LIGHT) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full" />
      </div>

      {/* NAV BAR */}
      <nav className="sticky top-0 z-[100] bg-background/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <FiArrowLeft size={14} />
            </div>
            {t('info.back')}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shadow-lg shadow-white/5">
              <FiZap size={16} className="text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tighter italic hidden sm:block">QazZerep</span>
          </div>

          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-[9px] font-black uppercase tracking-widest opacity-40">System Live</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-32">
        
        {/* HERO SECTION */}
        <header className="mb-24 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <span className="w-1 h-1 rounded-full bg-blue-500" />
             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">
               {t(`info.categories.${meta.cat}`)}
             </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-5xl md:text-8xl font-medium tracking-[ -0.04em] italic uppercase leading-[0.9]">
                {t(`info.pages.${meta.key}.title`)}
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground font-light leading-relaxed opacity-60">
                {t('info.version_desc')}
              </p>
            </div>
            
            <div className="hidden lg:block animate-in zoom-in duration-1000">
                <div className="w-32 h-32 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent blur-2xl opacity-50" />
                    <div className="relative text-foreground opacity-80">
                        {meta.icon}
                    </div>
                </div>
            </div>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 gap-6">
          {Array.isArray(items) && items.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-[1px] rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.01]"
            >
              {/* Градиентная рамка при ховере */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8 md:p-12 bg-[#0c0c0c]/80 backdrop-blur-md rounded-[31px] border border-white/5 flex flex-col md:flex-row gap-8 md:gap-20">
                <div className="md:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono text-blue-500 font-bold tracking-tighter">
                      [{ (i + 1).toString().padStart(2, '0') }]
                    </span>
                    <div className="h-[1px] w-8 bg-blue-500/30" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground uppercase italic leading-tight">
                    {item.t}
                  </h3>
                </div>
                
                <div className="md:w-2/3 flex justify-between items-start group/text">
                  <p className="text-[16px] text-zinc-400 leading-relaxed font-light group-hover:text-zinc-200 transition-colors duration-300">
                    {item.d}
                  </p>
                  <FiChevronRight className="shrink-0 mt-1 opacity-0 -translate-x-4 group-hover:opacity-10 group-hover:translate-x-0 transition-all duration-500" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER ACTION */}
        <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1">
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground italic">
               {t('info.copyright')}
             </span>
             <span className="text-[9px] font-medium text-muted-foreground/30 uppercase tracking-widest">
               Platform Version 2.0.4-stable
             </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex -space-x-2">
                {[FiShield, FiCpu, FiLock].map((Icon, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-help">
                        <Icon size={14} />
                    </div>
                ))}
            </div>
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all"
            >
                <FiZap size={14} className="rotate-180" />
            </button>
          </div>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoPage;
