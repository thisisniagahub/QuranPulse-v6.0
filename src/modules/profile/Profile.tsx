import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types';
import { useGamification } from '../../contexts/GamificationContext';

// Components
import ProfileHead from './components/ProfileHead';
import RaudhahBadges from './components/RaudhahBadges';
import RaudhahStatsRing from '../dashboard/components/RaudhahStatsRing';
import SubscriptionCard from './components/SubscriptionCard';

interface ProfileProps {
    user: UserProfile;
    onUpdateUser: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
    onUpdatePassword: (password: string) => Promise<{ error: any }>;
    onUploadAvatar: (file: File) => Promise<{ error: any, url?: string }>;
    onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onUpdatePassword, onUploadAvatar, onSignOut }) => {
    const { state: gamification, getLevelProgress } = useGamification();
    const [isEditing, setIsEditing] = useState(false);

    const LEVEL_TITLES = [
        "Pencari Hidayah", "Pelajar Tekun", "Qari Muda", "Sahabat Quran",
        "Duta Dakwah", "Hafiz Junior", "Imam Muda", "Scholar", "Murabbi", "Legendary"
    ];
    const userTitle = LEVEL_TITLES[Math.min(gamification.level - 1, LEVEL_TITLES.length - 1)];

    return (
        <div className="min-h-full bg-[#020617] relative overflow-x-hidden pb-32 font-sans selection:bg-raudhah-teal/30">
            {/* --- PREMIUM ATMOSPHERE BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-raudhah-teal/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-900/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 pt-6">
                <ProfileHead
                    user={user}
                    level={gamification.level}
                    userTitle={userTitle}
                    onEdit={() => setIsEditing(true)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-raudhah-teal/5 to-transparent pointer-events-none"></div>
                        <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 z-10">Performance</h3>
                        <div className="transform scale-90">
                            <RaudhahStatsRing
                                recitationProgress={getLevelProgress()}
                                memorizationProgress={Math.min(100, gamification.streak * 5)}
                            />
                        </div>
                        <div className="mt-8 w-full">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                <i className="fa-solid fa-medal text-raudhah-gold"></i>
                                Pencapaian Raudhah
                            </h3>
                            <RaudhahBadges badges={gamification.achievements} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-rows-3 gap-3"
                    >
                        {/* Total XP */}
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-raudhah-teal/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <i className="fa-solid fa-bolt"></i>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-white font-mono group-hover:text-raudhah-teal transition-colors">{gamification.xp.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total XP</span>
                                </div>
                            </div>
                        </div>

                        {/* Surah Read */}
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-raudhah-teal/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <i className="fa-solid fa-book-open"></i>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">{user.last_read_surah || 0}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Surah Selesai</span>
                                </div>
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-raudhah-teal/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                    <i className="fa-solid fa-fire"></i>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="block text-2xl font-bold text-white font-mono group-hover:text-orange-400 transition-colors">{gamification.streak}</span>
                                        <span className="text-xs text-orange-400">Hari</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Streak Semasa</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

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

                <div className="grid grid-cols-2 gap-4 pb-12">
                    <button
                        onClick={onSignOut}
                        className="col-span-2 py-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center justify-center gap-2 group"
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket group-hover:translate-x-1 transition-transform"></i>
                        Log Keluar
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm">
                            <h3 className="text-white font-bold mb-4">Edit Profil</h3>
                            <p className="text-slate-400 text-sm mb-6">Fungsi mengemaskini nama dan avatar akan tersedia tidak lama lagi.</p>
                            <button onClick={() => setIsEditing(false)} className="w-full py-3 bg-raudhah-teal rounded-xl text-white font-bold">Tutup</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;