import React from 'react';
import { UserProfile } from '../../types';

interface StatsCardsProps {
  user: UserProfile;
  isDark: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ user, isDark }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={`relative rounded-3xl p-5 border backdrop-blur-md overflow-hidden group transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-slate-900/40 border-slate-700/50 hover:border-teal-500/30' : 'bg-white/60 border-slate-200/50 hover:border-teal-500/30'} shadow-lg`}>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors"></div>
        
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
          <i className="fa-solid fa-star text-6xl text-teal-400"></i>
        </div>
        
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white border-t border-white/20 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-trophy text-sm"></i>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Deen Lvl</span>
        </div>
        <p className={`text-3xl font-bold relative z-10 ${isDark ? 'text-white' : 'text-slate-800'}`}>{Math.floor(user.xp_total / 100)}</p>
        <div className="w-full h-2 bg-slate-800/50 rounded-full mt-4 overflow-hidden relative z-10 box-inner-shadow">
          <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 w-3/4 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)] relative overflow-hidden">
             <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className={`relative rounded-3xl p-5 border backdrop-blur-md overflow-hidden group transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-slate-900/40 border-slate-700/50 hover:border-orange-500/30' : 'bg-white/60 border-slate-200/50 hover:border-orange-500/30'} shadow-lg`}>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>

        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
          <i className="fa-solid fa-fire text-6xl text-orange-500"></i>
        </div>
        
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white border-t border-white/20 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-fire-flame-curved text-sm"></i>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Streak</span>
        </div>
        <p className={`text-3xl font-bold relative z-10 ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.streak} <span className="text-xs text-slate-500 font-normal">Days</span></p>
        <p className="text-[10px] text-orange-400 mt-4 font-bold flex items-center gap-1 animate-pulse">
          <i className="fa-solid fa-arrow-trend-up"></i> Keep it burning!
        </p>
      </div>
    </div>
  );
};

export default StatsCards;