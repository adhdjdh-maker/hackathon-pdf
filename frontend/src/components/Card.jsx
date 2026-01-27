import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-[#0A0A0A] 
      border border-white/10 
      rounded-[2rem] 
      shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
      relative 
      overflow-hidden 
      ${className}
    `}>
      {/* Внутренний блик для объема */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
