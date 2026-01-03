import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavView } from '../../../types';

interface UstazAiWidgetProps {
    onNavigate: (view: NavView) => void;
}

const UstazAiWidget: React.FC<UstazAiWidgetProps> = ({ onNavigate }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="col-span-1 bg-gradient-to-br from-[#0A1E42] to-[#010409] rounded-[2rem] p-6 border border-cyan-500/20 shadow-xl relative overflow-hidden group cursor-pointer h-full min-h-[160px] flex flex-col justify-between"
            onClick={() => onNavigate(NavView.SMART_DEEN)}
        >
            {/* 🌌 Cyber Glow Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>

            <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <i className="fa-solid fa-sparkles text-lg"></i>
                </div>

                <h3 className="text-white font-black text-lg tracking-tight mb-1">Ustaz AI</h3>
                <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest">Syariah Intelligence</p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A1E42] bg-slate-800 flex items-center justify-center text-[8px] text-slate-400">
                            <i className="fa-solid fa-user"></i>
                        </div>
                    ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                </div>
            </div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </motion.div>
    );
};

export default UstazAiWidget;
