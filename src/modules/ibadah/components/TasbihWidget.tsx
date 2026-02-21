import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Settings } from 'lucide-react';

interface TasbihWidgetProps {
    onClose: () => void;
}

const TasbihWidget: React.FC<TasbihWidgetProps> = ({ onClose }) => {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [isComplete, setIsComplete] = useState(false);

    // Haptic feedback
    const vibrate = (pattern: number | number[]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    const handleTap = () => {
        if (isComplete) return;

        const newCount = count + 1;
        setCount(newCount);

        // Feedback
        if (newCount === target) {
            setIsComplete(true);
            vibrate([50, 50, 50]); // Triple pulse
        } else {
            vibrate(10); // Light tap
        }
    };

    const reset = () => {
        setCount(0);
        setIsComplete(false);
        vibrate(20);
    };

    const toggleTarget = () => {
        setTarget(prev => prev === 33 ? 99 : 33);
        reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-sm bg-slate-900 border border-raudhah-teal/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-raudhah-teal/10 flex items-center justify-center">
                            <i className="fa-solid fa-fingerprint text-raudhah-teal"></i>
                        </div>
                        <h2 className="text-xl font-bold text-white">Digital Tasbih</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Tutup">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Main Counter Circle */}
                <div className="flex justify-center mb-8 relative z-10">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTap}
                        className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center border-4 
                        transition-colors duration-500
                        ${isComplete
                                ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                                : 'bg-cyan-900/10 border-raudhah-teal shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                            }`}
                    >
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle cx="50%" cy="50%" r="124" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle
                                cx="50%" cy="50%" r="124"
                                fill="none"
                                stroke={isComplete ? '#10b981' : '#22d3ee'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="779"
                                strokeDashoffset={779 - (779 * (count / target))}
                                className="transition-all duration-300"
                            />
                        </svg>

                        <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                            {isComplete ? 'Alhamdulillah' : 'Dzikir'}
                        </span>
                        <span className={`text-7xl font-black tabular-nums tracking-tighter ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
                            {count}
                        </span>
                        <span className="text-sm font-medium text-slate-500 mt-2">
                            / {target}
                        </span>
                    </motion.button>
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center z-10 relative">
                    <button
                        onClick={toggleTarget}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                        <span>Target: {target}</span>
                    </button>

                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-pattern-dots-raudhah opacity-5 pointer-events-none"></div>
                <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] transition-colors duration-500 ${isComplete ? 'bg-emerald-500/20' : 'bg-raudhah-teal/10'}`}></div>
            </div>
        </motion.div>
    );
};

export default TasbihWidget;
