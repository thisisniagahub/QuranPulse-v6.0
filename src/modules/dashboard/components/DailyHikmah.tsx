import React from 'react';
import { motion } from 'framer-motion';
import BentoCard from './BentoCard';

const DailyHikmah: React.FC = () => {
    return (
        <BentoCard
            className="col-span-2 md:col-span-1 h-full min-h-[220px] flex flex-col justify-between"
            bgImage="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute top-0 right-0 text-[120px] leading-none text-white/5 font-serif select-none pointer-events-none -mt-8 -mr-6 z-0">❞</div>

            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-200">Daily Hikmah</p>
                    </div>

                    <div className="space-y-4">
                        <p className="font-amiri text-2xl text-white leading-[1.8] drop-shadow-lg text-right" dir="rtl">
                            إِنَّ مَعَ الْعُسْرِ يُسْرًا
                        </p>
                        <div className="h-px w-12 bg-purple-500/30"></div>
                        <p className="text-sm text-slate-100 font-medium leading-relaxed italic border-l-2 border-purple-500/40 pl-4">
                            "Verily, with every hardship comes ease."
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tighter">SURAH ASH-SHARH : 6</span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 hover:bg-purple-500 hover:text-white transition-all border border-purple-500/20 backdrop-blur-md"
                    >
                        <i className="fa-regular fa-bookmark"></i>
                    </motion.button>
                </div>
            </div>
        </BentoCard>
    );
};

export default DailyHikmah;
