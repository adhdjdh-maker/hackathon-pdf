import React from 'react';
import { Link } from 'react-router-dom'; // Важно для переходов без перезагрузки
import { FiShield, FiMap, FiLock, FiInfo } from 'react-icons/fi';

export const Footer = () => {
  const sections = [
    {
      title: 'Навигатор',
      icon: <FiMap className="text-emerald-500" />,
      links: [
        { name: 'Документация', path: '/документация' },
        { name: 'API Интеграция', path: '/api-интеграция' },
        { name: 'База знаний', path: '/база-знаний' }
      ]
    },
    {
      title: 'Политика',
      icon: <FiLock className="text-blue-500" />,
      links: [
        { name: 'Конфиденциальность', path: '/конфиденциальность' },
        { name: 'Условия использования', path: '/условия-использования' },
        { name: 'Cookie', path: '/cookie' }
      ]
    },
    {
      title: 'Поддержка',
      icon: <FiInfo className="text-purple-500" />,
      links: [
        { name: 'Помощь', path: '/помощь' },
        { name: 'Контакты', path: '/контакты' }
      ]
    }
  ];

  return (
    <footer className="mt-auto bg-[#050505]/90 backdrop-blur-2xl border-t border-white/5 p-12 z-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Блок бренда */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 text-white font-black text-xl mb-6 italic tracking-tighter">
            <FiShield className="text-emerald-500 animate-pulse" /> QAZZEREP
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 font-medium uppercase tracking-wider">
            Ведущая система верификации контента. <br />
            Безопасность и точность на базе ИИ.
          </p>
        </div>
        
        {/* Динамические колонки */}
        {sections.map((col, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ delay: `${i * 100}ms` }}>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              {col.icon} {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link, j) => (
                <li key={j}>
                  <Link 
                    to={link.path} 
                    className="text-[10px] font-bold uppercase tracking-tight text-slate-400 hover:text-emerald-500 transition-all duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-emerald-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Нижняя плашка */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
        <div className="flex items-center gap-4">
          <span>© 2026 QazZerep Digital LTD.</span>
          <span className="hidden md:inline text-white/5">|</span>
          <span className="text-emerald-500/40">Казахстан, Актау</span>
        </div>
        
      </div>
    </footer>
  );
};
