import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PulseControlCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Initialize from localStorage if available
    const [isCyberMode, setIsCyberMode] = useState(() => {
        const saved = localStorage.getItem('pulse_theme');
        return saved === 'cyber';
    });

    useEffect(() => {
        if (isCyberMode) {
            document.body.classList.add('cyber-mode');
            localStorage.setItem('pulse_theme', 'cyber');
        } else {
            document.body.classList.remove('cyber-mode');
            localStorage.setItem('pulse_theme', 'deep-space');
        }
    }, [isCyberMode]);

    const playSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Futuristic click
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed', e));
    };

    const handleThemeToggle = () => {
        playSound();
        setIsCyberMode(!isCyberMode);
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleAdminClick = () => {
        // Assuming standard navigation or window location for now
        window.location.href = '/admin'; 
    };

    return (
        <div className="fixed bottom-6 left-6 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[200px]"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pulse Control</div>
                            
                            {/* Theme Switcher */}
                            <button
                                onClick={handleThemeToggle}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${isCyberMode ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCyberMode ? 'bg-cyan-500 text-black' : 'bg-slate-900'}`}>
                                    <i className={`fa-solid ${isCyberMode ? 'fa-microchip' : 'fa-moon'}`}></i>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold">Theme</div>
                                    <div className="text-[10px] opacity-70">{isCyberMode ? 'Cyber Pulse' : 'Deep Space'}</div>
                                </div>
                            </button>

                            {/* Admin Dashboard */}
                            <button
                                onClick={handleAdminClick}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-gold-500">
                                    <i className="fa-solid fa-shield-halved"></i>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold">Admin</div>
                                    <div className="text-[10px] opacity-70">Dashboard</div>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center text-xl transition-all ${isOpen ? 'bg-white text-black rotate-45' : 'bg-cyan-500 text-black animate-pulse-slow'}`}
            >
                <i className={`fa-solid ${isOpen ? 'fa-plus' : 'fa-sliders'}`}></i>
            </motion.button>
        </div>
    );
};

export default PulseControlCenter;
