import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { FiDatabase, FiTrash2, FiShield, FiActivity, FiArrowLeft, FiHardDrive } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [allDocs, setAllDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchAllDocs(); }, []);

  const fetchAllDocs = async () => {
    try {
      const res = await axios.get('/documents/admin/all-docs');
      setAllDocs(res.data.data);
    } catch (e) { console.error("Admin access error"); }
  };

  const deleteAnyDoc = async (id) => {
    if (!window.confirm("Удалить этот объект из глобальной базы?")) return;
    await axios.delete(`/documents/delete/${id}`);
    fetchAllDocs();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <FiArrowLeft className="text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Root Terminal</h1>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Global System Administration</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                <FiActivity className="text-red-500 animate-pulse" />
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Core Secured</span>
             </div>
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Clusters', val: allDocs.length, icon: <FiDatabase /> },
            { label: 'System Load', val: '12%', icon: <FiActivity /> },
            { label: 'Storage Ready', val: 'Active', icon: <FiHardDrive /> }
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl group hover:border-red-500/30 transition-all">
              <div className="text-slate-600 mb-4 group-hover:text-red-500 transition-colors">{s.icon}</div>
              <p className="text-3xl font-bold text-white mb-1">{s.val}</p>
              <p className="text-[10px] uppercase font-black text-slate-700 tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table/List */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-6 px-4">Global Data Nodes</p>
          {allDocs.map((doc) => (
            <div key={doc.id} className="group flex items-center justify-between p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl hover:bg-white/[0.02] transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-red-500 transition-colors">
                  <FiShield />
                </div>
                <div>
                  <p className="text-sm font-mono text-slate-300">NODE_{doc.id.slice(-8).toUpperCase()}</p>
                  <p className="text-[10px] text-slate-600 uppercase mt-1">Owner: <span className="text-emerald-500">{doc.owner}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right hidden sm:block">
                  <p className="text-white font-bold">{doc.hash_count}</p>
                  <p className="text-[9px] text-slate-700 uppercase font-bold">Signatures</p>
                </div>
                <button 
                  onClick={() => deleteAnyDoc(doc.id)}
                  className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
