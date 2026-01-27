import React from 'react';

export default function AccentButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`
        relative
        flex items-center justify-center
        bg-white hover:bg-emerald-400 
        text-black font-black 
        text-[11px] uppercase tracking-[0.2em] 
        py-4 px-6 
        rounded-xl 
        transition-all duration-300
        active:scale-[0.98]
        disabled:opacity-20 disabled:cursor-not-allowed
        shadow-[0_0_20px_rgba(255,255,255,0.05)]
        hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]
        ${className}
      `}
    >
      {children}
    </button>
  );
}
