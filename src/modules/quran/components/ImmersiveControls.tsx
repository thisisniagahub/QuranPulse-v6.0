import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuran } from '../contexts/QuranContext';

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
    const { isVoiceSearchActive, setIsVoiceSearchActive } = useQuran();

    // Auto-hide logic on scroll
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
            {isVisible && isZenMode && (
                <div className="fixed inset-0 pointer-events-none z-50">

                    {/* 🛠️ RIGHT VERTICAL SIDEBAR (GLASSMISM) */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto"
                    >
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl">
                            <SidebarItem icon="fa-book-open" label="Tafsir" />
                            <SidebarItem icon="fa-bookmark" label="Simpan" />
                            <SidebarItem icon="fa-share-nodes" label="Kongsi" />
                            <SidebarItem icon="fa-magnifying-glass" label="Cari" />
                            <div className="h-px bg-white/10 mx-2 my-1"></div>
                            <SidebarItem
                                icon={showSettings ? "fa-xmark" : "fa-sliders"}
                                label="Setting"
                                active={showSettings}
                                onClick={toggleSettings}
                            />
                        </div>
                    </motion.div>

                    {/* 🎵 BOTTOM PLAYER (MOCKUP STYLE) */}
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-lg pointer-events-auto"
                    >
                        <div className="bg-[#0A1E42]/80 backdrop-blur-[30px] border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden relative">

                            {/* Waveform Visualization */}
                            <div className="flex items-center justify-center gap-1 h-8 w-full opacity-60">
                                {[...Array(30)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={isPlaying || isVoiceSearchActive ? { height: [4, Math.random() * 24 + 4, 4] } : { height: 4 }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.05 }}
                                        className={`w-1 ${isVoiceSearchActive ? 'bg-rose-500' : 'bg-raudhah-teal'} rounded-full`}
                                    ></motion.div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between w-full px-4">
                                {/* Back */}
                                <button onClick={onPrev} className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
                                    <i className="fa-solid fa-backward-step"></i>
                                </button>

                                <div className="flex items-center gap-6">
                                    {/* VOICE RECITE BUTTON */}
                                    <button
                                        onClick={() => setIsVoiceSearchActive(!isVoiceSearchActive)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVoiceSearchActive 
                                            ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-110 animate-pulse' 
                                            : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                    >
                                        <i className="fa-solid fa-microphone"></i>
                                    </button>

                                    {/* Play/Pause */}
                                    <button
                                        onClick={onPlayPause}
                                        className="w-16 h-16 rounded-full bg-raudhah-teal text-black flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] group active:scale-95 transition-all"
                                    >
                                        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl`}></i>
                                    </button>
                                </div>

                                {/* Next */}
                                <button onClick={onNext} className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
                                    <i className="fa-solid fa-forward-step"></i>
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                                    <img loading="lazy" src="https://i.pravatar.cc/100?u=reciter" alt="Reciter" />
                                </div>
                                <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">Mishary Rashid Al-Afasy</span>
                            </div>

                            {/* Glow Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-raudhah-teal/5 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Return to Normal Button */}
                        <button
                            onClick={toggleZenMode}
                            className="absolute -top-14 right-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white/60 uppercase tracking-widest transition-all"
                        >
                            <i className="fa-solid fa-compress mr-2"></i> Exit Focus
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Standard Mode Bar */}
            {isVisible && !isZenMode && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
                        <button onClick={toggleZenMode} className="text-slate-400 hover:text-raudhah-teal transition-colors">
                            <i className="fa-solid fa-expand"></i>
                        </button>
                        <div className="w-px h-6 bg-white/10"></div>
                        <div className="flex items-center gap-6">
                            <button onClick={onPrev} className="text-slate-400 hover:text-white"><i className="fa-solid fa-backward-step"></i></button>
                            
                            <button
                                onClick={() => setIsVoiceSearchActive(!isVoiceSearchActive)}
                                className={`text-xl transition-all ${isVoiceSearchActive ? 'text-rose-500 animate-pulse scale-125' : 'text-slate-400 hover:text-rose-400'}`}
                            >
                                <i className="fa-solid fa-microphone"></i>
                            </button>

                            <button onClick={onPlayPause} className="w-10 h-10 rounded-full bg-raudhah-teal text-black flex items-center justify-center shadow-lg"><i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i></button>
                            <button onClick={onNext} className="text-slate-400 hover:text-white"><i className="fa-solid fa-forward-step"></i></button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
    <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${active ? 'bg-raudhah-teal text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
    >
        <i className={`fa-solid ${icon} text-lg`}></i>
        <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </motion.button>
);

export default ImmersiveControls;

