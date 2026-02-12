import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiNavigation, FiZap, FiLayers } from 'react-icons/fi';

export default function ProjectRoadmap() {
    const { t } = useTranslation();

    // Структура данных, которая связывает иконки и статусы с ключами в i18n
    const roadmapData = [
        { 
            quarter: "Q1 2026", 
            status: "completed", 
            key: "q1", 
            icon: <FiZap size={24} className="text-blue-500" /> 
        },
        { 
            quarter: "Q2 2026", 
            status: "current", 
            key: "q2", 
            icon: <FiLayers size={24} className="text-indigo-500" /> 
        },
        { 
            quarter: "Q3 2026", 
            status: "pending", 
            key: "q3", 
            icon: <FiNavigation size={24} className="text-emerald-500" /> 
        },
        { 
            quarter: "Q4 2026", 
            status: "pending", 
            key: "q4", 
            icon: <FiCheckCircle size={24} className="text-zinc-500" /> 
        }
    ];

    return (
        <div className="py-20 px-6 max-w-5xl mx-auto animate-in fade-in duration-700">
            {/* Заголовок секции */}
            <header className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
                    {t('roadmap.title')} <span className="text-blue-600">{t('roadmap.year')}</span>
                </h2>
                <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            </header>

            <div className="relative">
                {/* Центральная линия (только для десктопа) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-600 via-indigo-500 to-transparent opacity-20 hidden md:block" />

                <div className="space-y-16">
                    {roadmapData.map((phase, index) => {
                        const items = t(`roadmap.${phase.key}.items`, { returnObjects: true }) || [];
                        
                        return (
                            <div 
                                key={index} 
                                className={`relative flex items-center justify-between w-full flex-col md:flex-row ${
                                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Точка на временной шкале */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-background border-2 border-blue-600 rounded-full z-10 hidden md:block shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                                    {phase.status === 'current' && (
                                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
                                    )}
                                </div>

                                {/* Карточка квартала */}
                                <div className="w-full md:w-[44%]">
                                    <div className={`
                                        relative p-8 rounded-[35px] border transition-all duration-300
                                        ${phase.status === 'current' 
                                            ? 'bg-foreground/[0.03] border-blue-500/40 shadow-2xl' 
                                            : 'bg-card border-border shadow-sm'}
                                    `}>
                                        {/* Шапка карточки */}
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="w-14 h-14 bg-foreground/[0.03] dark:bg-white/[0.03] border border-border rounded-2xl flex items-center justify-center shadow-inner">
                                                {phase.icon}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 block mb-1">
                                                    {phase.quarter}
                                                </span>
                                                <h3 className="text-xl font-bold tracking-tight italic leading-tight">
                                                    {t(`roadmap.${phase.key}.title`)}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Список задач */}
                                        <ul className="space-y-4">
                                            {items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[13px] text-muted-foreground leading-relaxed">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600/40 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Статус "В разработке" */}
                                        {phase.status === 'current' && (
                                            <div className="mt-8 pt-6 border-t border-blue-500/10 flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
                                                    {t('roadmap.active_status')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Пустой блок для баланса сетки на десктопе */}
                                <div className="hidden md:block md:w-[44%]" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
