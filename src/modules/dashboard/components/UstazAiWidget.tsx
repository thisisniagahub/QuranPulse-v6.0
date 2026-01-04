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

                <div className="flex items-center justify-between mt-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0c224b] bg-slate-800 flex items-center justify-center text-[8px] text-slate-400">
                                <i className="fa-solid fa-user"></i>
                            </div>
                        ))}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UstazAiWidget;
