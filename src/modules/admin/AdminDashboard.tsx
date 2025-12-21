import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PosterGenerator from './tools/PosterGenerator';
import WorkflowEditor from './tools/WorkflowEditor';
import KnowledgeBaseManager from './tools/KnowledgeBaseManager';
import LiveAnalytics from './components/LiveAnalytics';
import { useNavigate } from 'react-router-dom';

type AdminView = 'OVERVIEW' | 'AI_STUDIO' | 'AUTOMATION' | 'KNOWLEDGE' | 'CRM' | 'FINANCE' | 'SETTINGS';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('OVERVIEW');
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { id: 'OVERVIEW', label: 'Command Center', icon: 'fa-chart-radar', color: 'text-cyan-400' },
    { id: 'AI_STUDIO', label: 'AI Content Studio', icon: 'fa-wand-magic-sparkles', color: 'text-purple-400' },
    { id: 'AUTOMATION', label: 'Pulse Automator', icon: 'fa-network-wired', color: 'text-blue-400' },
    { id: 'KNOWLEDGE', label: 'Knowledge Base', icon: 'fa-database', color: 'text-orange-400' },
    { id: 'CRM', label: 'Ummah CRM', icon: 'fa-users-rays', color: 'text-emerald-400' },
    { id: 'FINANCE', label: 'Treasury', icon: 'fa-vault', color: 'text-amber-400' },
    { id: 'SETTINGS', label: 'System', icon: 'fa-gears', color: 'text-slate-400' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      
      {/* 1. SIDEBAR (Glassmorphism) */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-20"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-neon">
                <i className="fa-solid fa-cube text-white text-sm"></i>
            </div>
            <div>
                <h1 className="font-bold text-sm tracking-wider">QP ADMIN</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Mission Control</p>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as AdminView)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                        activeView === item.id 
                        ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    <i className={`fa-solid ${item.icon} ${item.color} w-5 text-center group-hover:scale-110 transition-transform`}></i>
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={() => navigate('/')} className="w-full py-2 flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
                <i className="fa-solid fa-arrow-left"></i> Back to App
            </button>
        </div>
      </motion.aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

          {/* Top Bar */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-sm z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {NAV_ITEMS.find(n => n.id === activeView)?.label}
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-black tracking-widest border border-emerald-500/30">Live</span>
              </h2>
              <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                      <p className="text-xs text-white font-bold">Admin User</p>
                      <p className="text-[10px] text-slate-500">Superadmin</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10"></div>
              </div>
          </header>

          {/* Dynamic Viewport */}
          <div className="flex-1 overflow-y-auto p-8 relative z-0">
              <AnimatePresence mode="wait">
                  {activeView === 'OVERVIEW' && (
                      <motion.div 
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                          <LiveAnalytics />
                      </motion.div>
                  )}

                  {activeView === 'AI_STUDIO' && (
                      <motion.div 
                        key="studio"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="h-full"
                      >
                          <PosterGenerator />
                      </motion.div>
                  )}

                  {activeView === 'AUTOMATION' && (
                      <motion.div 
                        key="automation"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full"
                      >
                          <WorkflowEditor />
                      </motion.div>
                  )}

                  {activeView === 'KNOWLEDGE' && (
                      <motion.div 
                        key="knowledge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full"
                      >
                          <KnowledgeBaseManager />
                      </motion.div>
                  )}

                  {activeView === 'CRM' && (
                      <div className="text-center py-20 text-slate-500">
                          <i className="fa-solid fa-users-rays text-4xl mb-4 opacity-50"></i>
                          <p>Ummah CRM Module (Coming Soon)</p>
                      </div>
                  )}
              </AnimatePresence>
          </div>
      </main>
    </div>
  );
};

export default AdminDashboard;