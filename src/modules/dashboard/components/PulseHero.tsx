import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavView } from '../../../types';

interface PulseHeroProps {
    user: { name: string };
    prayerData: any; // Using the shape from usePrayerTimes
}

const PulseHero: React.FC<PulseHeroProps> = ({ user, prayerData }) => {
    const [timeLeft, setTimeLeft] = useState('');

    // Calculate next prayer and countdown
    // simple mock logic for visual demo, real logic usually in hook
    const nextPrayer = prayerData?.next || { name: 'Asar', time: '16:30' };
    const currentPrayer = prayerData?.current || { name: 'Zohor' };

    useEffect(() => {
        // Basic countdown timer mock
        const interval = setInterval(() => {
            const now = new Date();
            // Mock countdown
            setTimeLeft(`${59 - now.getMinutes()}m ${60 - now.getSeconds()}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-64 rounded-3xl overflow-hidden mb-6 group">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 transition-all duration-1000">
                {/* Ambient Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">

                {/* Top Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-6 flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
                        <span className="text-xl">👋</span>
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-cyan-200 font-medium tracking-wide">ASSALAMUALAIKUM</p>
                        <p className="text-white font-bold">{user.name.split(' ')[0]}</p>
                    </div>
                </motion.div>

                {/* Center: Prayer Pulse */}
                <div className="mt-8">
                    <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">Next Prayer Pulse</p>
                    <h1 className="text-5xl font-black text-white mb-1 tracking-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                        {nextPrayer.name}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-slate-300 font-mono text-sm bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/5 mx-auto w-fit">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                        <span>Closing in: {timeLeft}</span>
                    </div>
                </div>

                {/* Bottom: Location */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                    <i className="fa-solid fa-location-dot text-cyan-500"></i>
                    <span>Kuala Lumpur</span>
                </div>
            </div>
        </div>
    );
};

export default PulseHero;
