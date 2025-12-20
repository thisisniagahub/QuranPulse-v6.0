import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../../types';
import { useGamification } from '../../contexts/GamificationContext';

// Components
import ProfileHead from './components/ProfileHead';
import CyberBadges from './components/CyberBadges';
import CyberStatsRing from '../dashboard/components/CyberStatsRing'; // Reusing from Dashboard
import SubscriptionCard from './components/SubscriptionCard';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  onUpdatePassword: (password: string) => Promise<{ error: any }>;
  onUploadAvatar: (file: File) => Promise<{ error: any, url?: string }>;
  onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onUpdatePassword, onUploadAvatar, onSignOut }) => {
  // 1. Hook into Gamification Context
  const { state: gamification, getLevelProgress } = useGamification();
  
  // 2. Local UI State
  const [isEditing, setIsEditing] = useState(false); // Only handle edit mode toggling, logic for edit inputs inside modal/view could be better
  // Simplification: We will just focus on the Display View for this Premium Pass
  
  // Level Calculation & Titles
  const LEVEL_TITLES = [
    "Pencari Hidayah", "Pelajar Tekun", "Qari Muda", "Sahabat Quran", 
    "Duta Dakwah", "Hafiz Junior", "Imam Muda", "Scholar", "Murabbi", "Legendary"
  ];
  const userTitle = LEVEL_TITLES[Math.min(gamification.level - 1, LEVEL_TITLES.length - 1)];

  return (
    <div className="min-h-full bg-[#020617] relative overflow-x-hidden pb-32 font-sans selection:bg-cyan-500/30">
        
        {/* --- PREMIUM ATMOSPHERE BACKGROUND --- */}
        <div className="fixed inset-0 pointer-events-none">
            {/* Starfield */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse-slow"></div>
            {/* Nebulas */}
            <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>

        {/* --- CONTENT CONTAINER --- */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-6">
            
            {/* 1. HOLOGRAPHIC ID CARD (Hero) */}
            <ProfileHead 
                user={user} 
                level={gamification.level} 
                userTitle={userTitle}
                onEdit={() => setIsEditing(true)} 
            />

            {/* 2. STATS DASHBOARD (Glassmorphism) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                
                {/* A. Usage Ring */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 z-10">Performance</h3>
                    
                    {/* Reusing existing component but customizing via props if possible, or just wrapping it */}
                    {/* The CyberStatsRing takes props: recitationProgress, memorizationProgress */}
                    {/* We map recitationProgress to Level Progress for now, and memorization to an arbitrary value or streak/cap */}
                    <div className="transform scale-90">
                         <CyberStatsRing 
                            recitationProgress={getLevelProgress()} 
                            memorizationProgress={Math.min(100, gamification.streak * 5)} // Example logic: Streak * 5% capped at 100
                         />
                    </div>
                    
                    <div className="mt-4 flex gap-6 text-[10px] uppercase font-bold text-slate-500 z-10">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span> Level
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Streak
                        </div>
                    </div>
                </motion.div>

                {/* B. Grid Stats */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-rows-3 gap-3"
                >
                    {/* Stat Item: Total XP */}
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <i className="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <span className="block text-2xl font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">{gamification.xp.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Item: Surah Read */}
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <i className="fa-solid fa-book-open"></i>
                            </div>
                            <div>
                                <span className="block text-2xl font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">{user.last_read_surah || 0}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Surah Diselesaikan</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Item: Streak */}
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                <i className="fa-solid fa-fire"></i>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="block text-2xl font-bold text-white font-mono group-hover:text-orange-400 transition-colors">{gamification.streak}</span>
                                    <span className="text-xs text-orange-400">Days</span>
                                </div>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Current Streak</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 3. PREMIUM SUBSCRIPTION */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
            >
                <SubscriptionCard 
                    userId={user.id!} 
                    onSuccess={() => alert("Alhamdulillah! Keahlian anda telah dikemaskini.")} 
                />
            </motion.div>

            {/* 4. ACHIEVEMENTS VAULT */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <i className="fa-solid fa-medal text-purple-400"></i>
                        Vault Pencapaian
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-white/5">
                        {gamification.achievements.length} Unlocked
                    </span>
                </div>
                
                <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5">
                    <CyberBadges badges={gamification.achievements} />
                    
                    {gamification.achievements.length === 0 && (
                        <div className="text-center py-8 opacity-50">
                            <i className="fa-solid fa-lock text-3xl text-slate-700 mb-2"></i>
                            <p className="text-sm text-slate-500">Tiada pencapaian lagi. Teruskan membaca!</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 4. SETTINGS & LOGOUT */}
            <div className="grid grid-cols-2 gap-4 pb-12">
                 {/* Logout */}
                <button 
                    onClick={onSignOut}
                    className="py-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center justify-center gap-2 group"
                >
                    <i className="fa-solid fa-arrow-right-from-bracket group-hover:translate-x-1 transition-transform"></i>
                    Log Keluar
                </button>
             </div>
             
             {/* Edit Modal Placeholder (Simple Overlay for now) */}
             {isEditing && (
                 <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                     <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm">
                         <h3 className="text-white font-bold mb-4">Edit Profil</h3>
                         <p className="text-slate-400 text-sm mb-6">Fungsi mengemaskini nama dan avatar akan datang sebentar lagi.</p>
                         <button onClick={() => setIsEditing(false)} className="w-full py-3 bg-cyan-600 rounded-xl text-white font-bold">Tutup</button>
                     </div>
                 </div>
             )}

        </div>
    </div>
  );
};

export default Profile;