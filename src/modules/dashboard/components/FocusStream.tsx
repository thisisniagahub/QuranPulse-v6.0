import React from 'react';
import { motion } from 'framer-motion';

const FocusStream: React.FC = () => {
    const cards = [
        { id: 1, type: 'continue', title: 'Resume Recitation', subtitle: 'Surah Al-Mulk: 3', icon: 'fa-play', bg: 'from-cyan-900 to-blue-900', accent: 'cyan' },
        { id: 2, type: 'daily', title: 'Daily Quiz', subtitle: 'Tajweed: Idgham', icon: 'fa-brain', bg: 'from-amber-900 to-orange-900', accent: 'amber' },
        { id: 3, type: 'sunnah', title: 'Friday Sunnah', subtitle: 'Read Al-Kahf', icon: 'fa-moon', bg: 'from-emerald-900 to-green-900', accent: 'emerald' },
    ];

    return (
        <div className="w-full overflow-x-auto no-scrollbar pb-4 pt-2 snap-x">
            <div className="flex gap-4 px-6 min-w-max">
                {cards.map((card, idx) => (
                     <motion.div 
                        key={card.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative w-64 h-32 rounded-2xl bg-gradient-to-br ${card.bg} border border-white/10 p-4 snap-center shrink-0 shadow-lg group cursor-pointer overflow-hidden`}
                     >
                         {/* Background Pattern */}
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                         
                         {/* Shine Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

                         <div className="relative z-10 flex flex-col h-full justify-between">
                             <div className="flex justify-between items-start">
                                 <div className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-${card.accent}-400 border border-white/5`}>
                                     <i className={`fa-solid ${card.icon}`}></i>
                                 </div>
                                 <span className={`text-[10px] uppercase font-bold text-${card.accent}-400 bg-${card.accent}-900/50 px-2 py-1 rounded-md border border-${card.accent}-500/30`}>
                                     {card.type}
                                 </span>
                             </div>
                             
                             <div>
                                 <h4 className="text-white font-bold text-lg leading-tight">{card.title}</h4>
                                 <p className="text-slate-300 text-xs">{card.subtitle}</p>
                             </div>
                         </div>
                     </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FocusStream;
