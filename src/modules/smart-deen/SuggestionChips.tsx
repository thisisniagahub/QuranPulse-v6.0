import React from 'react';
import { motion } from 'framer-motion';

interface SuggestionChipsProps {
    onSelect: (question: string) => void;
}

const suggestions = [
    { icon: 'fa-kaaba', label: 'Cara Solat Jamak', query: 'Bagaimana cara solat jamak dan qasar?' },
    { icon: 'fa-hand-holding-dollar', label: 'Hukum Forex', query: 'Apakah hukum trading Forex dalam Islam?' },
    { icon: 'fa-shirt', label: 'Aurats', query: 'Jelaskan batasan aurat lelaki dan wanita.' },
    { icon: 'fa-coins', label: 'Zakat Calculation', query: 'How do I calculate Zakat on savings?' },
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-3 mt-4">
            {suggestions.map((item, idx) => (
                <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onSelect(item.query)}
                    className="group relative p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-cyan-900/20 hover:border-cyan-500/30 text-left transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all">
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white">{item.label}</span>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

export default SuggestionChips;
