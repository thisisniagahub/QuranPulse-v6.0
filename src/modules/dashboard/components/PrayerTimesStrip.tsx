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
        <div className="col-span-2">
            <div className="flex justify-between items-center bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/5 shadow-inner">
                {prayers.map((p, i) => (
                    <div
                        key={p.name}
                        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-500 ${p.active
                            ? 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'opacity-40 hover:opacity-100 hover:bg-white/5'
                            }`}
                    >
                        <span className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 ${p.active ? 'text-cyan-400' : 'text-slate-500'}`}>
                            {p.name}
                        </span>
                        <span className={`text-xs md:text-sm font-black tracking-tighter block ${p.active ? 'text-white' : 'text-slate-400'}`}>
                            {p.time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrayerTimesStrip;
