import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImmersiveControlsProps {
    isZenMode: boolean;
    toggleZenMode: () => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    currentVerseKey: string | null;
    onNext: () => void;
    onPrev: () => void;
    showSettings: boolean;
    toggleSettings: () => void;
}

const ImmersiveControls: React.FC<ImmersiveControlsProps> = ({
    isZenMode,
    toggleZenMode,
    isPlaying,
    onPlayPause,
    currentVerseKey,
    onNext,
    onPrev,
    showSettings,
    toggleSettings
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Auto-hide logic on scroll (reappear on scroll up)
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
                >
                    {/* Main Control Pill */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl shadow-black/50">
                        {/* 1. Zen Toggle */}
                        <button
                            onClick={toggleZenMode}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isZenMode 
                                    ? 'bg-amber-500/20 text-amber-400 rotate-180' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                            title="Zen Mode"
                        >
                            <i className={`fa-solid ${isZenMode ? 'fa-minimize' : 'fa-expand'}`}></i>
                        </button>

                        <div className="w-px h-6 bg-white/10 mx-1"></div>

                        {/* 2. Audio Controls */}
                        <div className="flex items-center gap-1">
                             <button onClick={onPrev} className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center">
                                <i className="fa-solid fa-backward-step text-xs"></i>
                             </button>
                             
                             <button 
                                onClick={onPlayPause}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                    isPlaying
                                        ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                             </button>

                             <button onClick={onNext} className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center">
                                <i className="fa-solid fa-forward-step text-xs"></i>
                             </button>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1"></div>

                        {/* 3. Settings Toggle */}
                        <button
                            onClick={toggleSettings}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                showSettings
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <i className="fa-solid fa-sliders"></i>
                        </button>
                    </div>

                    {/* Quick Access Floating Info (if playing) */}
                    <AnimatePresence>
                        {isPlaying && currentVerseKey && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/20 whitespace-nowrap"
                            >
                                <span className="text-cyan-400 text-xs font-mono font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                                    PLAYING: {currentVerseKey}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImmersiveControls;
