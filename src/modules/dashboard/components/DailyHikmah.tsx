import React from 'react';
import { motion } from 'framer-motion';

const DailyHikmah: React.FC = () => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="col-span-2 md:col-span-1 bg-[#162c51] rounded-3xl p-6 border border-purple-500/30 relative overflow-hidden h-full min-h-[220px] flex flex-col justify-between shadow-xl shadow-purple-500/5 group"
        >
            {/* Background Image - Clean No Front Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1534234828563-0254174097f3?q=80&w=1000&auto=format&fit=crop"
                    alt="Spiritual Night"
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c224b]/30 via-[#0c224b]/80 to-[#031a38]"></div>
            </div>
            {/* 🌌 Cyber Spiritual Atmosphere */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-0 text-[120px] leading-none text-purple-500/5 font-serif select-none pointer-events-none -mt-8 -mr-6">❞</div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]"></span>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-300">Daily Hikmah</p>
                </div>

                <div className="space-y-4">
                    <p className="font-amiri text-2xl text-white leading-[1.8] drop-shadow-lg text-right" dir="rtl">
                        إِنَّ مَعَ الْعُسْرِ يُسْرًا
                    </p>
                    <div className="h-px w-12 bg-purple-500/30"></div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed italic border-l-2 border-purple-500/20 pl-4">
                        "Verily, with every hardship comes ease."
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 relative z-10">
                <span className="text-[10px] text-slate-500 font-mono font-bold tracking-tighter">SURAH ASH-SHARH : 6</span>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition-all border border-purple-500/20"
                >
                    <i className="fa-regular fa-bookmark"></i>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DailyHikmah;
