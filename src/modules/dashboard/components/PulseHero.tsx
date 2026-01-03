import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavView } from '../../../types';

interface PulseHeroProps {
    user: { name: string };
    prayerData: any;
}

const PulseHero: React.FC<PulseHeroProps> = ({ user, prayerData }) => {
    const [timeLeft, setTimeLeft] = useState('--m --s');

    const nextPrayer = prayerData?.next || { name: 'Asar', time: '16:30' };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            // In a real app, this would calculate actual diff from nextPrayer.time
            // For visual demo, we simulate a countdown
            const mins = 59 - now.getMinutes();
            const secs = 59 - now.getSeconds();
            setTimeLeft(`${mins}m ${secs}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[280px] md:h-[320px] rounded-[2.5rem] overflow-hidden group shadow-2xl"
        >
            {/* 🌊 Dynamic "Noor" Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E42] via-[#020617] to-black">
                {/* Pulsing Energy Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>

                {/* Floating Particles Mockup (CSS) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Mesh/Grid Light */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.4),transparent_70%)]"></div>
            </div>

            {/* 💎 Glass Content Layer */}
            <div className="relative z-10 h-full flex flex-col p-8 md:p-10">

                {/* Greeting Header */}
                <div className="flex justify-between items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-xl shadow-lg shadow-black/20">
                            ✨
                        </div>
                        <div>
                            <p className="text-[10px] text-cyan-400 font-black tracking-[0.3em] uppercase">Spiritual Rhythm</p>
                            <h2 className="text-white text-lg font-bold">Salam, {user.name.split(' ')[0]}</h2>
                        </div>
                    </motion.div>

                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] text-emerald-400 font-bold uppercase tracking-widest backdrop-blur-md">
                        ● Live Pulse
                    </div>
                </div>

                {/* Center: Next Prayer Intelligence */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-1"
                    >
                        <p className="text-cyan-400/80 text-[11px] font-bold tracking-[0.2em] uppercase">Next Connection</p>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                            {nextPrayer.name}
                        </h1>
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
                            <div className="flex items-center gap-2 text-slate-300 font-mono text-xs md:text-sm bg-black/40 px-5 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                                <span className="text-cyan-100 font-bold">Closing in:</span>
                                <span className="text-white">{timeLeft}</span>
                            </div>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Metadata */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-auto">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <i className="fa-solid fa-location-dot text-cyan-500"></i>
                        <span>Kuala Lumpur, MY</span>
                    </div>
                    <span>{new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long' })}</span>
                </div>
            </div>

            {/* Animated Bottom Border */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 shadow-[0_0_10px_#22d3ee]"></div>
        </motion.div>
    );
};

export default PulseHero;
