import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiZap, FiShield, FiCpu, FiActivity } from 'react-icons/fi';

export const Footer = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('footer.sections.nav.title'),
      links: [
        { name: t('info.pages.doc.title'), path: '/documentation' },
        { name: 'API Integration', path: '/' }, // Оставил статично, если нет страницы
        { name: t('info.pages.base.title'), path: '/knowledge-base' }
      ]
    },
    {
      title: t('footer.sections.legal.title'),
      links: [
        { name: t('info.pages.priv.title'), path: '/privacy' },
        { name: t('info.pages.terms.title'), path: '/terms' },
        { name: t('info.pages.cookie.title'), path: '/cookie' }
      ]
    },
    {
      title: t('footer.sections.support.title'),
      links: [
        { name: t('info.pages.help.title'), path: '/help' },
        { name: t('info.pages.contacts.title'), path: '/contacts' }
      ]
    }
  ];

  return (
    <footer className="mt-auto bg-background border-t border-border px-6 py-16 md:px-16 relative transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* LOGO & DESCRIPTION */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-foreground rounded-xl flex items-center justify-center transition-colors">
                <FiZap size={20} className="text-background" />
              </div>
              <div>
                <h2 className="text-foreground font-black text-lg tracking-tighter leading-none uppercase italic">
                  QazZerep
                </h2>
                <span className="text-[9px] font-black text-muted-foreground opacity-30 uppercase tracking-[0.3em]">
                  Core v2.4.0
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-light opacity-60 italic">
              {t('footer.description')}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-card border border-border rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Online</span>
              </div>
            </div>
          </div>
          
          {/* LINKS */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {sections.map((col, i) => (
              <div key={i} className="space-y-5">
                <h4 className="text-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link 
                        to={link.path} 
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-all duration-300 font-light block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM PANEL */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground opacity-20 hover:opacity-100 transition-opacity cursor-help">
              <FiShield size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Security Verified</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground opacity-20 hover:opacity-100 transition-opacity cursor-help">
              <FiActivity size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cloud Sync</span>
            </div>
          </div>

          <div className="text-[9px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-20 italic">
            © 2026 QAZZEREP • {t('footer.engine_name')}
          </div>
        </div>
      </div>
    </footer>
  );
};
