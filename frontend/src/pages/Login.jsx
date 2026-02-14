import React, { useState, useEffect } from 'react';
import { FiZap, FiArrowRight, FiLock, FiMail, FiShield, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion'; // Оставляем только для работы сферы
import axios from '../utils/axios';

// --- ТВОЯ НЕЙРОСФЕРА (Оставлена как есть, это ядро дизайна) ---
const NeuralBlob = ({ mousePos }) => {
  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full blur-[80px] opacity-40"
      />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-white/10 rounded-full"
          animate={{
            width: [300 + i * 50, 400 + i * 50, 300 + i * 50],
            height: [300 + i * 50, 400 + i * 50, 300 + i * 50],
            rotate: i % 2 === 0 ? 360 : -360,
            x: (mousePos.x - 0.5) * (20 + i * 10),
            y: (mousePos.y - 0.5) * (20 + i * 10),
          }}
          transition={{
            width: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: i },
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
          style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%' }}
        />
      ))}
      <div className="z-10 text-center select-none">
        <div className="text-[120px] font-black tracking-tighter text-white/5">QAZZEREP</div>
      </div>
    </div>
  );
};

export default function AuthPage() {
  const [theme, setTheme] = useState("dark");
  const [isLogin, setIsLogin] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [formData, setFormData] = useState({
    email: '', password: '', fullName: '', role: 'STUDENT', school: '', schoolCode: ''
  });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await axios.post(endpoint, isLogin 
        ? { email: formData.email, password: formData.password } 
        : formData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
      }
    } catch (err) { alert(err.response?.data?.message || 'Ошибка'); }
  };

  return (
    <div onMouseMove={handleMouseMove} className="h-screen w-full flex bg-[#0a0a0a] text-zinc-100 font-sans overflow-hidden">
      
      {/* ФОРМА (БЕЗ АНИМАЦИЙ) */}
      <div className="w-full lg:w-[500px] flex flex-col p-12 bg-white/5 backdrop-blur-3xl border-r border-white/5 z-20 overflow-y-auto">
        <div className="flex items-center gap-4 mb-20">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <FiZap size={22} className="text-black fill-current" />
          </div>
          <span className="font-medium text-2xl tracking-tighter italic">QazZerep</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-5xl font-light tracking-tighter mb-2">
            {isLogin ? 'Авторизация' : 'Регистрация'}
          </h2>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] mb-12 font-mono">
            System.Access.Secure_Terminal
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" placeholder="Full Name" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                  </select>
                  <input 
                    type="text" placeholder="School"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none"
                    onChange={e => setFormData({...formData, school: e.target.value})}
                  />
                </div>
                {formData.role === 'TEACHER' && (
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input 
                      type="text" placeholder="School Access Code" required
                      className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl py-4 pl-12 pr-4 outline-none text-emerald-500"
                      onChange={e => setFormData({...formData, schoolCode: e.target.value})}
                    />
                  </div>
                )}
              </>
            )}

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="email" placeholder="Email" required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="password" placeholder="Password" required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button className="w-full bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 mt-8 hover:bg-blue-600 hover:text-white transition-colors">
              {isLogin ? 'Initialize' : 'Create Account'} <FiArrowRight />
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="mt-10 text-[9px] text-zinc-600 hover:text-blue-500 uppercase tracking-[0.3em] font-bold w-full">
            {isLogin ? '// Request Access' : '// Sign In'}
          </button>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ (СФЕРА) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#050505] relative">
        <NeuralBlob mousePos={mousePos} />
        <div className="absolute bottom-12 right-12 text-right font-mono text-[10px] opacity-20">
          CORE_ID: 0x2294 <br /> STATUS: OPERATIONAL
        </div>
      </div>

      <style>{`
        input::placeholder { color: #444; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
        body { cursor: crosshair; background: #0a0a0a; }
        select option { background: #0a0a0a; }
      `}</style>
    </div>
  );
}
