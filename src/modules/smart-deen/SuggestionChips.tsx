import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutGrid, Landmark, DollarSign, Shirt,
    HelpCircle, Sparkles, MessageCircle, ChevronRight
} from 'lucide-react';

interface SuggestionChipsProps {
    onSelect: (question: string) => void;
}

const suggestions = [
    { Icon: Landmark, label: 'Solat Jamak', query: 'Bagaimana cara solat jamak dan qasar?' },
    { Icon: DollarSign, label: 'Hukum Forex', query: 'Apakah hukum trading Forex dalam Islam?' },
    { Icon: Shirt, label: 'Batasan Aurat', query: 'Jelaskan batasan aurat lelaki dan wanita.' },
    { Icon: Sparkles, label: 'Zakat Simpanan', query: 'Bagaimana cara kira zakat simpanan?' },
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-4 mt-6">
            {suggestions.map((item, idx) => (
                <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onSelect(item.query)}
                    className="group relative p-4 rounded-3xl bg-white border-2 border-raudhah-teal/10 hover:border-raudhah-teal hover:bg-raudhah-teal/5 text-left transition-all shadow-sm active:scale-95 active:shadow-inner"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-raudhah-teal/10 flex items-center justify-center text-raudhah-teal group-hover:bg-raudhah-teal group-hover:text-white transition-all shadow-inner">
                            <item.Icon size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <span className="text-xs font-black text-raudhah-ink uppercase tracking-tight block truncate">{item.label}</span>
                            <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] text-raudhah-teal font-black uppercase tracking-widest">Tanya Sekarang</p>
                                <ChevronRight size={10} className="text-raudhah-teal" />
                            </div>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

export default SuggestionChips;
