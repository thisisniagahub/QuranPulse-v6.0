import React from 'react';

interface LearningProgressProps {
  isDark: boolean;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ isDark }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 group ${
      isDark 
        ? 'bg-slate-900/40 border-white/10 hover:border-cyan-500/30 hover:bg-slate-900/60' 
        : 'bg-white/60 border-slate-200 hover:border-cyan-500/30 hover:bg-white/80'
    } backdrop-blur-md shadow-lg`}>
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Continue Learning
        </h3>
        <span className="text-xs font-mono text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
          WEEK 4
        </span>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {/* Thumbnail / Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-book-open text-2xl text-white"></i>
        </div>

        <div className="flex-1">
            <h4 className={`font-bold text-base mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Surah Al-Mulk
            </h4>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Verse 12/30</span>
                <span>40%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-700/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[40%] rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
            </div>
        </div>

        {/* Play Button */}
        <button className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-110 active:scale-95">
            <i className="fa-solid fa-play ml-1"></i>
        </button>
      </div>

    </div>
  );
};

export default LearningProgress;
