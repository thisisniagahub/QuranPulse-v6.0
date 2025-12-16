import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onSignOut }) => {
  // Mock Data for "RPG" Elements
  const currentLevel = Math.floor(user.xp_total / 1000) + 1;
  const xpForNextLevel = currentLevel * 1000;
  const currentLevelXp = user.xp_total % 1000;
  const progressPercent = (currentLevelXp / 1000) * 100;

  const LEVEL_TITLES = [
    "Pencari Hidayah", // Lvl 1
    "Pelajar Tekun",   // Lvl 2
    "Qari Muda",       // Lvl 3
    "Sahabat Quran",   // Lvl 4
    "Duta Dakwah",     // Lvl 5
    "Hafiz Junior",    // Lvl 6
    "Imam Muda",       // Lvl 7
    "Scholar",         // Lvl 8
    "Murabbi",         // Lvl 9
    "Legendary"        // Lvl 10+
  ];

  const userTitle = LEVEL_TITLES[Math.min(currentLevel - 1, LEVEL_TITLES.length - 1)];

  // Mock Activity Data (Last 7 days)
  const activityData = [45, 80, 20, 90, 60, 100, 30]; // 0-100% completion

  const BADGES = [
    { id: 1, name: "Subuh Warrior", icon: "fa-sun", color: "text-amber-400", bg: "bg-amber-500/20", unlocked: true },
    { id: 2, name: "Khatam #1", icon: "fa-book-quran", color: "text-emerald-400", bg: "bg-emerald-500/20", unlocked: false },
    { id: 3, name: "7 Day Streak", icon: "fa-fire", color: "text-orange-400", bg: "bg-orange-500/20", unlocked: true },
    { id: 4, name: "Ustaz's Friend", icon: "fa-user-graduate", color: "text-cyan-400", bg: "bg-cyan-500/20", unlocked: false },
  ];

  const DAILY_QUESTS = [
    { id: 1, task: "Baca Surah Al-Mulk", reward: 50, completed: false },
    { id: 2, task: "Dengar 1 Juzuk Audio", reward: 30, completed: true },
    { id: 3, task: "Zikir Pagi 33x", reward: 20, completed: false },
  ];

  return (
    <div className="flex flex-col h-full bg-[#020617] overflow-y-auto pb-32">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900/50 pb-8 pt-12 px-6 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar Ring */}
          <div className="relative mb-4 group">
            <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden relative z-10 shadow-2xl">
               {user.avatar_url ? (
                   <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                   <span className="text-4xl">🧕</span>
               )}
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-3 py-1 rounded-full text-xs font-bold border-2 border-slate-900 z-20 shadow-lg">
              LVL {currentLevel}
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/40 transition-all duration-500"></div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
          <p className="text-cyan-400 text-sm font-medium tracking-wide uppercase mb-6">{userTitle}</p>

          {/* XP Progress Bar */}
          <div className="w-full max-w-xs bg-slate-800/50 rounded-full h-3 mb-2 overflow-hidden border border-slate-700/50 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            />
          </div>
          <div className="w-full max-w-xs flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{currentLevelXp} XP</span>
            <span>{xpForNextLevel} XP (Next Level)</span>
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-3 gap-3 px-6 -mt-6 relative z-20 mb-8">
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex flex-col items-center shadow-lg">
          <span className="text-2xl mb-1">🔥</span>
          <span className="text-lg font-bold text-white">{user.streak}</span>
          <span className="text-[10px] text-slate-500 uppercase">Day Streak</span>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex flex-col items-center shadow-lg">
          <span className="text-2xl mb-1">📖</span>
          <span className="text-lg font-bold text-white">{user.last_read_surah}</span>
          <span className="text-[10px] text-slate-500 uppercase">Surah Read</span>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex flex-col items-center shadow-lg">
          <span className="text-2xl mb-1">💎</span>
          <span className="text-lg font-bold text-white">{user.barakah_points}</span>
          <span className="text-[10px] text-slate-500 uppercase">Barakah Pts</span>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-6 space-y-8">
        
        {/* 1. Daily Quests */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-scroll text-amber-400"></i> Misi Harian
          </h3>
          <div className="space-y-3">
            {DAILY_QUESTS.map(quest => (
              <div key={quest.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${quest.completed ? 'bg-emerald-900/10 border-emerald-500/30 opacity-60' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${quest.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'}`}>
                    {quest.completed && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
                  <span className={`text-sm ${quest.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{quest.task}</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-[10px] text-amber-400 font-bold">
                  <span>+{quest.reward}</span>
                  <span>XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Badges Showcase */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-medal text-purple-400"></i> Pencapaian
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {BADGES.map(badge => (
              <div key={badge.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 p-2 border transition-all ${badge.unlocked ? `bg-slate-900 ${badge.bg} border-white/5` : 'bg-slate-900/30 border-slate-800 opacity-40 grayscale'}`}>
                <i className={`fa-solid ${badge.icon} text-xl ${badge.unlocked ? badge.color : 'text-slate-600'}`}></i>
                <span className="text-[9px] text-center leading-tight text-slate-400">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Activity Heatmap (Simple Visual) */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-cyan-400"></i> Aktiviti Mingguan
          </h3>
          <div className="flex justify-between items-end h-24 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            {activityData.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="w-2 rounded-full bg-slate-800 h-full relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${val}%` }}
                    className="absolute bottom-0 w-full bg-cyan-500 rounded-full"
                  />
                </div>
                <span className="text-[9px] text-slate-500">{['S','M','T','W','T','F','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Button */}
        <button 
            onClick={onSignOut}
            className="w-full py-4 rounded-xl border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
        >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Log Keluar
        </button>

        <div className="text-center text-xs text-slate-600 pb-4">
            QuranPulse v6.0 Genesis<br/>
            Made with ❤️ for Ummah
        </div>

      </div>
    </div>
  );
};

export default Profile;