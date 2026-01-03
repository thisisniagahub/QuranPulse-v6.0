import React from 'react';
import { motion } from 'framer-motion';
import { PrayerTimeData } from '../../../hooks/usePrayerTimes';

interface PrayerTimesStripProps {
    theme?: any;
    data: PrayerTimeData | null;
    loading: boolean;
}

const PrayerTimesStrip: React.FC<PrayerTimesStripProps> = ({ data, loading }) => {

    const prayerIcons: Record<string, string> = {
        'Subuh': '/assets/icons/prayer/subuh.png',
        'Zohor': '/assets/icons/prayer/zohor.png',
        'Asar': '/assets/icons/prayer/asar.png',
        'Maghrib': '/assets/icons/prayer/maghrib.png',
        'Isyak': '/assets/icons/prayer/isyak.png',
    };

    const defaultPrayers = [
        { name: 'Subuh', time: '--:--', active: false },
        { name: 'Zohor', time: '--:--', active: false },
        { name: 'Asar', time: '--:--', active: false },
        { name: 'Maghrib', time: '--:--', active: false },
        { name: 'Isyak', time: '--:--', active: false },
    ];

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const prayers = data ? [
        { name: 'Subuh', time: formatTime(data.fajr), active: data.nextPrayer === 'Subuh' },
        { name: 'Zohor', time: formatTime(data.dhuhr), active: data.nextPrayer === 'Zohor' },
        { name: 'Asar', time: formatTime(data.asr), active: data.nextPrayer === 'Asar' },
        { name: 'Maghrib', time: formatTime(data.maghrib), active: data.nextPrayer === 'Maghrib' },
        { name: 'Isyak', time: formatTime(data.isha), active: data.nextPrayer === 'Isyak' },
    ] : defaultPrayers;

    if (loading) {
        return (
            <div className="col-span-2 py-8 flex items-center justify-center gap-3 text-white/50 animate-pulse text-xs uppercase tracking-widest font-black">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                Menyegerakan Waktu Solat...
            </div>
        );
    }

    return (
        <div className="col-span-2 mb-2">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-1 snap-x">
                {prayers.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`flex-shrink-0 min-w-[110px] md:min-w-[130px] p-4 rounded-[2rem] border relative overflow-hidden group snap-start transition-all duration-300 ${p.active
                                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-105'
                                : 'bg-white/5 border-white/10 opacity-70 grayscale-[0.3]'
                            }`}
                    >
                        {/* 🌟 Active Glow Background */}
                        {p.active && (
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none animated-active-gradient"></div>
                        )}

                        <div className="relative z-10 flex flex-col items-center gap-3">
                            {/* 🖼️ 3D Sticky Icon */}
                            <motion.div
                                animate={p.active ? { y: [0, -4, 0] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`w-14 h-14 md:w-16 md:h-16 relative flex items-center justify-center ${p.active ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : ''}`}
                            >
                                <img
                                    src={prayerIcons[p.name]}
                                    alt={p.name}
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>

                            <div className="text-center space-y-0.5">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] block ${p.active ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    {p.name}
                                </span>
                                <span className={`text-base md:text-lg font-black tracking-tighter block ${p.active ? 'text-white' : 'text-slate-300'}`}>
                                    {p.time}
                                </span>
                            </div>
                        </div>

                        {/* Status tag for active */}
                        {p.active && (
                            <div className="absolute top-2 right-2">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PrayerTimesStrip;
