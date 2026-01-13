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

    // Background mapping based on prayer time (Unsplash Source)
    const backgroundMap: Record<string, string> = {
        'Subuh': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', // Dawn Field
        'Syuruk': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
        'Zohor': 'https://images.unsplash.com/photo-1561494262-2e4eb12d6aef?q=80&w=1000&auto=format&fit=crop', // Blue Sky Mosque
        'Asar': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop', // Golden Hour
        'Maghrib': 'https://images.unsplash.com/photo-1510253687831-0f982d7862fc?q=80&w=1000&auto=format&fit=crop', // Sunset
        'Isyak': 'https://images.unsplash.com/photo-1534234828569-1f3553dadd1d?q=80&w=1000&auto=format&fit=crop', // Starry Night
    };

    // Timer Logic
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

    // Circular Progress Calculation
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        if (!nextPrayerTime) return;
        const totalDuration = 1000 * 60 * 60 * 2; // Assume 2 hour window for visualization or calc real diff
        const now = new Date();
        const diff = nextPrayerTime.getTime() - now.getTime();
        const p = Math.max(0, Math.min(100, (1 - diff / totalDuration) * 100));
        setProgress(p);
    }, [timeLeft]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-[240px] rounded-[2.5rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
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
                        className="w-full h-full object-cover opacity-60 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0c224b]/80 via-[#0c224b]/40 to-[#031a38]"></div>
                </motion.div>
            </AnimatePresence>

            {/* 🌀 Rotating Geometric Halo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="w-[400px] h-[400px] bg-[url('/assets/patterns/cyber-islamic-grid.svg')] bg-center bg-no-repeat bg-contain animate-spin-slow duration-[60s]"></div>
            </div>

            {/* 💎 Glass Content Layer */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
                
                {/* Header: Greeting & Date */}
                <div className="flex justify-between items-start w-full opacity-80">
                    <div>
                        <p className="text-[10px] font-medium text-cyan-300 uppercase tracking-widest mb-0.5">Assalamualaikum</p>
                        <h2 className="text-sm font-bold text-white tracking-wide truncate max-w-[150px]">{user.name.split(' ')[0]}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-base font-bold text-white tracking-tight leading-none">
                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                            {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                </div>

                {/* CIRCULAR TIMER (Centered) */}
                <div className="relative flex-1 flex items-center justify-center -mt-2">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* SVG Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="50%" cy="50%" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                            <motion.circle 
                                cx="50%" cy="50%" r="70" 
                                fill="none" 
                                stroke="#22d3ee" 
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="440"
                                strokeDashoffset={440 - (440 * progress) / 100}
                                initial={{ strokeDashoffset: 440 }}
                                animate={{ strokeDashoffset: 440 - (440 * progress) / 100 }}        
                                transition={{ duration: 1 }}
                                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                            />
                        </svg>

                        {/* Center Text */}
                        <div className="flex flex-col items-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">SETERUSNYA</p>
                            <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">{nextPrayerGroup}</h1>
                            <p className="text-sm font-mono font-medium text-cyan-300 mt-1 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">{timeLeft}</p>
                        </div>
                    </div>
                </div>

                {/* Footer: Location & Masjid - Simplified */}
                <div className="flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-wider text-slate-300">
                    <div className="flex items-center gap-1.5 opacity-80">
                        <i className="fa-solid fa-location-dot text-cyan-400 text-xs"></i>
                        <span>{prayerData?.locationName || 'Kuala Lumpur'}</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-1.5 opacity-80">
                        <i className="fa-solid fa-mosque text-emerald-400 text-xs"></i>
                        <span>Masjid Al-Hidayah</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PulseHero;
