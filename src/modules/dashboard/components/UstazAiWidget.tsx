import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavView } from '../../../types';

interface UstazAiWidgetProps {
    onNavigate: (view: NavView) => void;
}

const UstazAiWidget: React.FC<UstazAiWidgetProps> = ({ onNavigate }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // In a real app, pass the query as state/param to SmartDeen
            onNavigate(NavView.SMART_DEEN);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-2 bg-gradient-to-br from-[#0A1E42] to-[#020617] rounded-3xl p-5 border border-cyan-500/20 shadow-lg relative overflow-hidden group cursor-pointer"
            onClick={() => onNavigate(NavView.SMART_DEEN)}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                        <i className="fa-solid fa-sparkles"></i>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Ustaz AI</h3>
                        <p className="text-xs text-cyan-400/80">Digital Syariah Advisor</p>
                    </div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-cyan-900/30 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                    ONLINE
                </div>
            </div>

            {/* Fake Input for Interaction */}
            <div className="bg-black/30 w-full h-12 rounded-xl border border-white/10 flex items-center px-4 text-slate-400 text-sm group-hover:border-cyan-500/40 transition-colors">
                <span className="mr-2 opacity-50"><i className="fa-solid fa-magnifying-glass"></i></span>
                <span className="truncate">Hukum on Forex trading...</span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                {['Doa Harian', 'Fiqh Puasa', 'Solat Sunat'].map((tag, i) => (
                    <span key={i} className="text-[10px] whitespace-nowrap px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30 transition-all">
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

export default UstazAiWidget;
