import React from 'react';
import { motion } from 'framer-motion';

interface StreakProps {
    currentStreak: number;
    longestStreak: number;
}

export const StreakTracker: React.FC<StreakProps> = ({ currentStreak, longestStreak }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between"
        >
            <div>
                <h3 className="text-white/70 text-sm font-medium">Daily Streak</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent mt-1">
                    {currentStreak} Hari
                </div>
                <p className="text-xs text-white/40 mt-1">Tertinggi: {longestStreak} hari</p>
            </div>
            <div className="flex gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-4 h-10 rounded-full ${i < (currentStreak % 7 !== 0 ? currentStreak % 7 : (currentStreak === 0 ? 0 : 7)) ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-white/10'}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};
