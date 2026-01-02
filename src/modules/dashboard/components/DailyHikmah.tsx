import React from 'react';
import { motion } from 'framer-motion';

const DailyHikmah: React.FC = () => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="col-span-2 md:col-span-1 bg-[#1a1528] rounded-3xl p-6 border border-purple-500/20 relative overflow-hidden h-full min-h-[180px] flex flex-col justify-between"
        >
            {/* Decorative */}
            <div className="absolute top-0 right-0 text-[100px] leading-none text-white/5 font-serif select-none pointer-events-none -mt-4 -mr-4">❞</div>

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mb-0.5"></span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Daily Hikmah</p>
                </div>

                <p className="font-amiri text-xl text-white leading-loose drop-shadow-md" dir="rtl">
                    إِنَّ مَعَ الْعُسْرِ يُسْرًا
                </p>
                <p className="text-xs text-slate-300 mt-2 font-medium italic">
                    "Verily, with every hardship comes ease."
                </p>
            </div>

            <div className="flex justify-between items-end mt-4">
                <span className="text-[10px] text-slate-500 font-mono">Surah Ash-Sharh : 6</span>
                <button className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition-all">
                    <i className="fa-regular fa-bookmark"></i>
                </button>
            </div>
        </motion.div>
    );
};

export default DailyHikmah;
