import React from 'react';
import { motion } from 'framer-motion';

const LiveAnalytics: React.FC = () => {
  // Mock Data
  const stats = [
    { label: 'Active Users', value: '1,240', trend: '+12%', color: 'text-cyan-400' },
    { label: 'Total Infaq (Today)', value: 'RM 450', trend: '+5%', color: 'text-emerald-400' },
    { label: 'AI Tokens Used', value: '45k', trend: '-2%', color: 'text-purple-400' },
    { label: 'Khatam Completed', value: '18', trend: '+1', color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
            >
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                    <i className={`fa-solid fa-chart-line text-4xl ${stat.color}`}></i>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">
                    <i className="fa-solid fa-arrow-up mr-1"></i> {stat.trend}
                </span>
            </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. REAL-TIME MAP (Visual Placeholder) */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-5 bg-center"></div>
              <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                      <h3 className="font-bold text-white">Live Activity Map</h3>
                      <p className="text-xs text-slate-500">Real-time user sessions globally</p>
                  </div>
                  <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs text-emerald-500 font-mono">LIVE</span>
                  </div>
              </div>
              
              {/* Pulsing Dots (Mock Locations) */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-ping"></div>
              <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse delay-700"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-pulse delay-300"></div>
          </div>

          {/* 3. ACTIVITY FEED */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4">Recent Actions</h3>
              <div className="space-y-4">
                  {[1,2,3,4,5].map((_, i) => (
                      <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                              <i className="fa-solid fa-user"></i>
                          </div>
                          <div>
                              <p className="text-sm text-slate-300"><span className="text-white font-bold">User_{100+i}</span> just completed <span className="text-emerald-400">Surah Yasin</span>.</p>
                              <p className="text-[10px] text-slate-500">{i * 2} mins ago</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default LiveAnalytics;
