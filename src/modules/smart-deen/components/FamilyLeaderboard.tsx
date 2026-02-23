import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';

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
            className="p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] border-2 border-raudhah-teal/10 shadow-sm glass-v7"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-raudhah-gold/10 flex items-center justify-center text-raudhah-gold">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <h3 className="text-raudhah-ink text-sm font-black uppercase tracking-tight leading-none">
                            {title}
                        </h3>
                        <p className="text-[10px] text-raudhah-teal/40 font-bold uppercase tracking-widest mt-1">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {sorted.map((m, idx) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-2xl transition-all border border-transparent hover:border-raudhah-teal/10 hover:bg-white active:scale-[0.98] ${idx === 0 ? 'bg-raudhah-gold/5 border-raudhah-gold/10' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <span className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm z-10 ${idx === 0 ? 'bg-raudhah-gold text-white' :
                                        idx === 1 ? 'bg-slate-200 text-slate-600' :
                                            idx === 2 ? 'bg-[#CD7F32] text-white' :
                                                'bg-raudhah-teal/5 text-raudhah-teal/30'
                                    }`}>
                                    {idx + 1}
                                </span>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm overflow-hidden ${idx === 0 ? 'border-raudhah-gold bg-white' : 'border-raudhah-teal/10 bg-white'
                                    }`}>
                                    {m.avatar ? (
                                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-raudhah-teal font-black text-lg">{m.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className={`text-sm font-black uppercase tracking-tight ${idx === 0 ? 'text-raudhah-ink' : 'text-raudhah-ink/70'}`}>
                                    {m.name}
                                </span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {idx === 0 && <Star size={10} className="fill-raudhah-gold text-raudhah-gold" />}
                                    <p className="text-[10px] text-raudhah-teal/30 font-bold">Aktif 5 minit lepas</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-raudhah-teal font-black text-base">{m.points.toLocaleString()}</span>
                            <span className="text-[9px] text-raudhah-teal/30 font-black ml-1 uppercase tracking-widest">QP</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
