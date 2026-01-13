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
            className="col-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer h-full min-h-[160px] flex flex-col justify-between border border-white/10 shadow-xl"
            onClick={() => onNavigate(NavView.SMART_DEEN)}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop" 
                    alt="Ustaz AI BG" 
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c224b] via-[#0c224b]/60 to-transparent mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <i className="fa-solid fa-sparkles text-lg"></i>
                    </div>

                    <h3 className="text-white font-black text-xl tracking-tight mb-1 drop-shadow-md">Ustaz AI</h3>
                    <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest bg-black/30 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">Syariah Intelligence</p>
                </div>

                {/* Input Prompt Visual */}
                <div className="mt-4 bg-black/40 border border-white/10 rounded-full px-3 py-2 flex items-center gap-2 backdrop-blur-sm group-hover:bg-black/50 group-hover:border-cyan-500/30 transition-all">
                    <span className="text-[10px] text-slate-400 font-medium truncate">Tanya soalan agama...</span>
                    <div className="ml-auto w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-black text-[10px]">
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UstazAiWidget;
