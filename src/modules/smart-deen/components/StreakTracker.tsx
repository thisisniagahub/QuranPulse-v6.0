import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Calendar } from 'lucide-react';

interface StreakProps {
    currentStreak: number;
    longestStreak: number;
}

export const StreakTracker: React.FC<StreakProps> = ({ currentStreak, longestStreak }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] border-2 border-raudhah-teal/10 flex flex-col md:flex-row items-center justify-between gap-6 glass-v7 shadow-sm"
        >
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-raudhah-teal to-raudhah-teal/60 flex items-center justify-center text-white shadow-lg shadow-raudhah-teal/20 relative">
                    <Zap size={32} fill="currentColor" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-raudhah-gold rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white text-white shadow-sm">
                        !
                    </div>
                </div>
                <div>
                    <h3 className="text-raudhah-ink/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                        <TrendingUp size={12} /> Istiqamah Streak
                    </h3>
                    <div className="text-4xl font-black text-raudhah-ink tracking-tighter">
                        {currentStreak} <span className="text-lg font-bold text-raudhah-teal/40 italic ml-1">Hari</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Calendar size={10} className="text-raudhah-teal/30" />
                        <p className="text-[10px] text-raudhah-teal/30 font-bold uppercase tracking-widest">
                            Rekod Terbaik: {longestStreak} hari
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 p-3 bg-raudhah-teal/5 rounded-3xl border border-raudhah-teal/10">
                {Array.from({ length: 7 }).map((_, i) => {
                    const isActive = i < (currentStreak % 7 !== 0 ? currentStreak % 7 : (currentStreak === 0 ? 0 : 7));
                    return (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={{
                                scale: isActive ? [1, 1.1, 1] : 1,
                                backgroundColor: isActive ? '#1B6B5A' : 'rgba(27, 107, 90, 0.1)'
                            }}
                            className={`w-6 h-12 rounded-full shadow-inner border border-white/20`}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
};
