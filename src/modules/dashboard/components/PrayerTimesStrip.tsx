import React from 'react';
import { motion } from 'framer-motion';
import { PrayerTimeData } from '../../../hooks/usePrayerTimes';

interface PrayerTimesStripProps {
    theme: any;
    data: PrayerTimeData | null;
    loading: boolean;
}

const PrayerTimesStrip: React.FC<PrayerTimesStripProps> = ({ theme, data, loading }) => {
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
            <div className="col-span-2 py-4 flex justify-center text-white/50 animate-pulse text-xs">
                 Memuatkan Waktu Solat...
            </div>
        );
    }

    return (
        <div className="col-span-2 overflow-x-auto no-scrollbar py-2">
            <div className="flex gap-3">
                {prayers.map((p, i) => (
                    <motion.div 
                        key={p.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                        className={`flex-shrink-0 min-w-[100px] p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 backdrop-blur-md ${
                            p.active 
                                ? 'bg-primary/20 border-white shadow-neon-sm' 
                                : 'bg-sheet/40 border-white/30 opacity-60'
                        }`}
                    >
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${p.active ? 'text-primary' : 'text-white/50'}`}>{p.name}</span>
                        <span className={`font-mono text-lg font-bold ${p.active ? 'text-white' : 'text-white/70'}`}>{p.time}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PrayerTimesStrip;
