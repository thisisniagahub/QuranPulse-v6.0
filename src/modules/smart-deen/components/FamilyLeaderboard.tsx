import React from 'react';
import { motion } from 'framer-motion';

export interface Member {
    id: string;
    name: string;
    points: number;
    avatar?: string;
}

interface LeaderboardProps {
    members: Member[];
    title?: string;
    subtitle?: string;
}

export const FamilyLeaderboard: React.FC<LeaderboardProps> = ({
    members,
    title = "Keluarga Sakinah",
    subtitle = "Peringkat Mingguan"
}) => {
    const sorted = [...members].sort((a, b) => b.points - a.points);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
        >
            <h3 className="text-white/90 text-sm font-bold mb-4 flex items-center justify-between">
                <span>{title}</span>
                <span className="text-xs text-teal-400">{subtitle}</span>
            </h3>

            <div className="space-y-3">
                {sorted.map((m, idx) => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`font-bold w-5 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                                {idx + 1}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-teal-900/50 flex items-center justify-center border border-teal-500/30 text-teal-100 font-bold text-sm">
                                {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full rounded-full" /> : m.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white/80 font-medium">{m.name}</span>
                        </div>
                        <span className="text-teal-400 font-bold">{m.points} <span className="text-xs text-white/40">QP</span></span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
