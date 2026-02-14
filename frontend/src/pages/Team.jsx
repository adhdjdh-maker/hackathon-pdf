import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiZap, FiGithub, FiLinkedin, FiMail, FiArrowLeft } from 'react-icons/fi';

const members = [
  {
    name: 'Operator One',
    roleKey: 'core_architect',
    email: 'operator.one@example.com',
  },
  {
    name: 'Operator Two',
    roleKey: 'ml_engineer',
    email: 'operator.two@example.com',
  },
  {
    name: 'Operator Three',
    roleKey: 'frontend',
    email: 'operator.three@example.com',
  },
];

export default function TeamPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* NAV / BACK BUTTON */}
        <header className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-colors"
          >
            <span className="p-2 rounded-full bg-white/5 hover:bg-white/10">
              <FiArrowLeft size={14} />
            </span>
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
              <FiZap size={18} className="text-black" />
            </div>
            <span className="font-semibold text-lg tracking-tight italic">QazZerep</span>
          </div>
        </header>

        {/* HERO TITLE LIKE ROADMAP */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-3">
            {t('team.title')}
          </h1>
          <p className="text-[12px] md:text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            {t('team.subtitle')}
          </p>
          <div className="mt-6 h-1 w-20 bg-blue-500 mx-auto rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </section>

        {/* MEMBERS GRID */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m, idx) => (
            <div
              key={idx}
              className="relative bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col items-center text-center gap-4 hover:border-white/15 transition-all overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="w-24 h-24 rounded-[28px] bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-black tracking-tighter text-white shadow-[0_0_40px_rgba(59,130,246,0.4)] mb-2 relative z-10">
                {m.name.split(' ').map((p) => p[0]).join('')}
              </div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-white">{m.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] mt-1">
                  {t(`team.roles.${m.roleKey}`)}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 mt-2 text-zinc-500 relative z-10">
                <a href={`mailto:${m.email}`} className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                  <FiMail size={14} />
                </a>
                <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                  <FiGithub size={14} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                  <FiLinkedin size={14} />
                </button>
              </div>
              <p className="text-[10px] text-zinc-600 mt-4 leading-relaxed relative z-10">
                {t('team.note')}
              </p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
