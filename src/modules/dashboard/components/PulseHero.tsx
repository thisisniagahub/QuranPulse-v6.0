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
            className="relative w-full h-[300px] md:h-[350px] rounded-[3rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px]"></div>
                </motion.div>
            </AnimatePresence>

            {/* 💎 Glass Content Layer */}
            <div className="relative z-10 h-full flex flex-col p-8 md:p-10">

                {/* Greeting Header */}
                <div className="flex justify-between items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl flex items-center justify-center text-xl shadow-2xl shadow-black/40">
                            ✨
                        </div>
                        <div>
                            <p className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] uppercase opacity-80">Spiritual Rhythm</p>
                            <h2 className="text-white text-lg font-black tracking-tight">Salam, {user.name.split(' ')[0]}</h2>
                        </div>
                    </motion.div>

                    <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] backdrop-blur-xl shadow-lg">
                        ● Live Pulse
                    </div>
                </div>

                {/* Center: Next Prayer Intelligence */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <motion.div
                        key={nextPrayerGroup}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-1"
                    >
                        <p className="text-cyan-400/90 text-[11px] font-black tracking-[0.3em] uppercase drop-shadow-sm">Next Connection</p>
                        <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            {nextPrayerGroup}
                        </h1>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <div className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
                            <div className="flex items-center gap-3 text-slate-300 font-mono text-xs md:text-sm bg-black/60 px-6 py-2.5 rounded-full backdrop-blur-2xl border border-white/10 shadow-2xl">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]"></span>
                                <span className="text-cyan-100 font-bold uppercase tracking-wider text-[10px]">Closing in:</span>
                                <span className="text-white font-black text-base">{timeLeft}</span>
                            </div>
                            <div className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Metadata */}
                <div className="flex justify-between items-center text-[10px] font-black text-white/60 tracking-[0.2em] uppercase mt-auto">
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                        <i className="fa-solid fa-location-dot text-cyan-400"></i>
                        <span className="text-white/80">Kuala Lumpur, MY</span>
                    </div>
                    <span className="bg-black/30 px-3 py-2 rounded-xl border border-white/5 backdrop-blur-md text-white/80">
                        {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            export default PulseHero;
