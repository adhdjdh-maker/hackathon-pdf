import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { 
  FiUser, FiX, FiSave, FiCpu, FiCamera, 
  FiZap, FiTerminal, FiCheck, FiLayers, FiLogOut, FiActivity, FiKey
} from 'react-icons/fi';
import { useAuth } from '../utils/auth';

export const Profile = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, updateUserData, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [settings, setSettings] = useState({
    active_rules: ['gost'], 
    custom_regex: user?.settings?.custom_regex || '// Напишите регулярное выражение\n/([A-Z]{3}-\\d{4})/g',
    exclude_quotes: false,
    display_name: user?.display_name || '',
    system_email: user?.email || ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/auth/me');
        if (res.data.settings) setSettings(prev => ({...prev, ...res.data.settings}));
      } catch (err) {
        console.error("Config_Error: Link failed");
      }
    };
    fetchUserData();
  }, []);

  // ФУНКЦИЯ СМЕНЫ ПАРОЛЯ
  const handleChangePassword = async () => {
    const old_password = prompt("Введите текущий пароль:");
    if (!old_password) return;
    const new_password = prompt("Введите новый пароль:");
    if (!new_password) return;

    try {
      setLoading(true);
      await axios.post('/auth/change-password', { old_password, new_password });
      setMessage({ type: 'success', text: "Пароль обновлен" });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Ошибка смены пароля" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const res = await axios.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUserData({ avatar: res.data.avatar_url });
      setMessage({ type: 'success', text: t('profile.avatar_updated') });
    } catch (err) {
      setMessage({ type: 'error', text: t('profile.upload_failed') });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post('/auth/update-settings', { settings });
      setMessage({ type: 'success', text: t('profile.config_synced') });
    } catch (err) {
      setMessage({ type: 'error', text: 'CORE_ERROR' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-background text-foreground flex flex-col overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom duration-500 transition-colors duration-300">
      
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-[160] bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-foreground rounded-2xl flex items-center justify-center shadow-lg">
              <FiUser size={20} className="text-background" />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] leading-none italic text-foreground">{t('profile.title')}</h2>
              <p className="text-[9px] font-mono text-muted-foreground opacity-60 tracking-widest uppercase mt-1.5">
                ID: {user?.id?.substring(0,12) || 'anonymous'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.15em] rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <FiCpu className="animate-spin" /> : <FiSave />}
              {loading ? t('profile.syncing') : t('profile.save_btn')}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full text-foreground transition-colors">
              <FiX size={26} />
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-10">
        
        {/* AVATAR & PRIMARY DATA */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-card border border-border rounded-[40px] p-10 flex flex-col items-center justify-center relative group shadow-sm">
            <input type="file" id="avatar-up" className="hidden" onChange={handleAvatarChange} />
            
            <label htmlFor="avatar-up" className="cursor-pointer relative block w-40 h-40">
              <div className="absolute inset-0 z-10 bg-foreground/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[32px] flex flex-col items-center justify-center gap-3">
                <FiCamera size={24} className="text-background" />
                <span className="text-[9px] font-black text-background uppercase tracking-widest">Update</span>
              </div>
              
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username}`} 
                className="w-full h-full rounded-[32px] bg-background border border-border object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[0.98]"
                alt="Avatar"
              />

              {loading && (
                <div className="absolute inset-0 z-20 bg-background/90 rounded-[32px] flex items-center justify-center">
                  <FiCpu className="text-foreground animate-spin" size={32} />
                </div>
              )}
            </label>

            <div className="text-center mt-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">{settings.display_name || 'Operator'}</h3>
              <div className="flex items-center justify-center gap-2 mt-2 opacity-50">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] italic text-foreground">{t('profile.node_active')}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-card border border-border rounded-[40px] p-10 flex flex-col justify-center space-y-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">{t('profile.public_name')}</label>
                <input 
                  value={settings.display_name}
                  onChange={(e) => setSettings({...settings, display_name: e.target.value})}
                  className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm text-foreground focus:border-foreground/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">{t('profile.contact_email')}</label>
                <input 
                  value={settings.system_email}
                  onChange={(e) => setSettings({...settings, system_email: e.target.value})}
                  className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm text-foreground focus:border-foreground/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="pt-6 flex items-center gap-4 text-emerald-500">
                <FiActivity size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest italic">{t('profile.cloud_sync')}</span>
            </div>
          </div>
        </section>

        {/* ALGORITHMS & TERMINAL */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><FiLayers size={18}/></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-foreground">{t('profile.detectors')}</span>
            </div>
            
            <div className="space-y-3">
              {['gost', 'apa', 'tables', 'titles'].map((ruleId) => (
                <div 
                  key={ruleId} 
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    active_rules: prev.active_rules.includes(ruleId) ? prev.active_rules.filter(r => r !== ruleId) : [...prev.active_rules, ruleId]
                  }))}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${
                    settings.active_rules.includes(ruleId) 
                    ? 'bg-foreground/5 border-foreground/10 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-foreground/[0.02]'
                  }`}
                >
                  <span className={`text-[13px] tracking-tight ${settings.active_rules.includes(ruleId) ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                    {t(`profile.rules.${ruleId}`)}
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    settings.active_rules.includes(ruleId) 
                    ? 'bg-foreground text-background' 
                    : 'bg-foreground/5 border border-border text-transparent'
                  }`}>
                    <FiCheck size={14} strokeWidth={4} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card border border-border rounded-[40px] p-10 flex items-center justify-between group hover:bg-foreground/[0.02] transition-all shadow-sm">
              <div>
                <p className="text-[13px] font-bold tracking-tight text-foreground uppercase">{t('profile.ignore_quotes')}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60 italic">{t('profile.smart_quotes')}</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, exclude_quotes: !settings.exclude_quotes})}
                className={`w-14 h-7 rounded-full relative transition-all duration-500 ${settings.exclude_quotes ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings.exclude_quotes ? 'left-8' : 'left-1'}`} />
              </button>
            </div>

            {/* ИСПРАВЛЕННЫЙ ТЕРМИНАЛ */}
            <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <FiTerminal size={16} className="text-muted-foreground" /> 
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Custom Regex Filter</span>
              </div>
              <textarea 
                className="w-full h-40 bg-background border border-border rounded-2xl p-6 font-mono text-[11px] text-slate-700 dark:text-emerald-400 outline-none focus:border-foreground/10 resize-none transition-all custom-scrollbar"
                value={settings.custom_regex}
                onChange={(e) => setSettings({...settings, custom_regex: e.target.value})}
                spellCheck="false"
              />
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <section className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-border">
           <div className="flex gap-4">
             <button 
                onClick={handleChangePassword}
                className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all border border-border hover:bg-foreground/5 rounded-full"
             >
                <FiKey className="inline mr-2" /> {t('profile.change_pass')}
             </button>
             <button 
              onClick={logout}
              className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all rounded-full border border-red-500/20"
             >
                <FiLogOut className="inline mr-2" /> {t('profile.logout')}
             </button>
           </div>
           <p className="text-[9px] text-muted-foreground font-mono tracking-widest uppercase italic opacity-40">
             Secure Session Node: {Math.random().toString(36).substring(7).toUpperCase()}
           </p>
        </section>

      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className={`fixed bottom-12 right-12 px-8 py-4 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase border backdrop-blur-2xl animate-in slide-in-from-right duration-500 z-[200] shadow-2xl ${
          message.type === 'success' 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
          : 'bg-red-500/10 border-red-500/20 text-red-600'
        }`}>
          <div className="flex items-center gap-4">
              <FiZap size={16} className="animate-pulse" />
              {message.text}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
        ::selection { background: var(--foreground); color: var(--background); }
      `}</style>
    </div>
  );
};
