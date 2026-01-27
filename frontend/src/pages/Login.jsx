import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../utils/auth';
import Card from '../components/Card';
import AccentButton from '../components/AccentButton';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError('Отказ в доступе: неверные данные');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative">
      {/* Мягкое свечение на фоне */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <Card className="w-full max-w-[400px] border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-8 rounded-[2rem]">
        <div className="mb-10 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <FiShield className="text-emerald-500 text-xl" />
          </div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-2">Terminal Access</h2>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Вход в систему</h1>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center uppercase tracking-widest rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
            <input
              className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
            <input
              className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <AccentButton className="w-full py-4 mt-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/5" type="submit">
            Авторизоваться
          </AccentButton>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold">
            Нет аккаунта? <Link to="/register" className="text-emerald-500 hover:text-white transition-colors ml-1">Создать ID</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
