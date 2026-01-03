import React from 'react';
import { motion } from 'framer-motion';
import { PrayerTimeData } from '../../../hooks/usePrayerTimes';

interface PrayerTimesStripProps {
    theme?: any;
    data: PrayerTimeData | null;
    loading: boolean;
}

const PrayerTimesStrip: React.FC<PrayerTimesStripProps> = ({ data, loading }) => {

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
            <div className="col-span-2 py-6 flex items-center justify-center gap-3 text-white/30 animate-pulse text-[10px] uppercase tracking-[0.3em] font-black">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
                Menyegerakan Waktu Solat
            </div>
        );
    }

    return (
        <div className="col-span-2 -mb-2">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-4 px-1 snap-x">
                {prayers.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        className={`flex-shrink-0 min-w-[90px] md:min-w-[105px] py-4 px-2 rounded-2xl border relative overflow-hidden group snap-start transition-all duration-500 ${p.active
                                ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                : 'bg-white/5 border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                            }`}
                    >
                        {/* Indicator for active */}
                        {p.active && (
                            <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                <span className="flex h-1 w-4 rounded-full bg-cyan-400/50"></span>
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col items-center gap-0.5 pt-1">
                            <span className={`text-[8px] font-black uppercase tracking-[0.25em] block ${p.active ? 'text-cyan-400' : 'text-slate-500'}`}>
                                {p.name}
                            </span>
                            <span className={`text-base md:text-lg font-black tracking-tight block ${p.active ? 'text-white' : 'text-slate-400'}`}>
                                {p.time}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PrayerTimesStrip;
