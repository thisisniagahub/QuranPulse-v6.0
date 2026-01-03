import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PulseHeroProps {
    user: { name: string };
    prayerData: any;
}

const PulseHero: React.FC<PulseHeroProps> = ({ user, prayerData }) => {
    const [timeLeft, setTimeLeft] = useState('--m --s');

    const nextPrayerGroup = prayerData?.nextPrayer || 'Asar';
    const nextPrayerTime = prayerData ? (
        nextPrayerGroup === 'Subuh' ? prayerData.fajr :
            nextPrayerGroup === 'Zohor' ? prayerData.dhuhr :
                nextPrayerGroup === 'Asar' ? prayerData.asr :
                    nextPrayerGroup === 'Maghrib' ? prayerData.maghrib :
                        prayerData.isha
    ) : null;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!nextPrayerTime) return;
            const now = new Date();
            const diff = nextPrayerTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('0m 0s');
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (hours > 0) {
                setTimeLeft(`${hours}j ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [nextPrayerTime]);

    // Background mapping based on prayer time
    const backgroundMap: Record<string, string> = {
        'Subuh': '/assets/backgrounds/rhythm/subuh.png',
        'Zohor': '/assets/backgrounds/rhythm/zohor.png',
        'Asar': '/assets/backgrounds/rhythm/asar.png',
        'Maghrib': '/assets/backgrounds/rhythm/maghrib.png',
        'Isyak': '/assets/backgrounds/rhythm/isyak.jpg',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-[200px] md:h-[220px] rounded-[2rem] overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5"
        >
            {/* 🌊 Dynamic Themed Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={nextPrayerGroup}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={backgroundMap[nextPrayerGroup] || backgroundMap['Isyak']}
                        alt=""
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out"
                    />
                    {/* Artistic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-[#020617]/30 backdrop-blur-[1px]"></div>
                </motion.div>
            </AnimatePresence>

            {/* 💎 Glass Content Layer - Horizontal Layout */}
            <div className="relative z-10 h-full flex flex-row items-center justify-between p-6 md:p-8 gap-4">

                {/* Left: Greeting & Prayer Info */}
                <div className="flex flex-col justify-center h-full space-y-2 max-w-[50%]">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-2xl flex items-center justify-center text-lg shadow-xl shadow-black/40">
                            ✨
                        </div>
                        <div>
                            <p className="text-[9px] text-cyan-400 font-bold tracking-[0.2em] uppercase opacity-80">Spiritual Rhythm</p>
                            <h2 className="text-white text-base font-black tracking-tight leading-tight">Salam, {user.name.split(' ')[0]}</h2>
                        </div>
                    </motion.div>

                    <div className="mt-2">
                        <p className="text-cyan-400/90 text-[10px] font-black tracking-[0.2em] uppercase drop-shadow-sm">Next Connection</p>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                            {nextPrayerGroup}
                        </h1>
                    </div>
                </div>

                {/* Right: Timer & Metadata */}
                <div className="flex flex-col items-end justify-center h-full space-y-3">
                    <div className="flex items-center gap-3 text-slate-300 font-mono text-xs bg-black/60 px-5 py-2 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-2xl">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                        <span className="text-cyan-100 font-bold uppercase tracking-wider text-[9px]">Closing in:</span>
                        <span className="text-white font-black text-base">{timeLeft}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-[9px] font-black text-white/60 tracking-[0.1em] uppercase">
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
                            <i className="fa-solid fa-location-dot text-cyan-400"></i>
                            <span className="text-white/80">Kuala Lumpur</span>
                        </div>
                        <span className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md text-white/80">
                            {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PulseHero;
