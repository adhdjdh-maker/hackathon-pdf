import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme'; // Хук из предыдущего ответа

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: 'light', icon: <FiSun size={14} />, label: 'Light' },
    { id: 'system', icon: <FiMonitor size={14} />, label: 'Auto' },
    { id: 'dark', icon: <FiMoon size={14} />, label: 'Dark' },
  ];

  return (
    <div className="mx-4 mt-auto mb-4 p-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl flex items-center justify-between">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setTheme(opt.id)}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200
            ${theme === opt.id 
              ? 'bg-white text-black shadow-lg' 
              : 'text-[#444] hover:text-[#ededed]'}
          `}
          title={opt.label}
        >
          {opt.icon}
          {theme === opt.id && <span className="text-[10px] font-bold uppercase">{opt.label}</span>}
        </button>
      ))}
    </div>
  );
};
