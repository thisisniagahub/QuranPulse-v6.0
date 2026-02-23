import React from 'react';
import { motion } from 'framer-motion';
import { PrayerTimeData } from '../../../hooks/usePrayerTimes';
import { Clock } from 'lucide-react';

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
            <div className="col-span-2 py-6 flex items-center justify-center gap-3 text-raudhah-teal/40 animate-pulse text-[10px] uppercase tracking-[0.4em] font-black">
                <Clock size={16} className="animate-spin-slow" />
                Menyegerakan Waktu Solat
            </div>
        );
    }

    return (
        <div className="col-span-2">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-full p-1.5 border-2 border-raudhah-teal/5 shadow-sm glass-v7">
                {prayers.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={false}
                        animate={{
                            backgroundColor: p.active ? '#1B6B5A1A' : 'transparent',
                            borderColor: p.active ? '#1B6B5A33' : 'transparent'
                        }}
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-full border transition-all duration-500 ${p.active
                                ? 'shadow-sm'
                                : 'opacity-40 hover:opacity-100'
                            }`}
                    >
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] block mb-0.5 ${p.active ? 'text-raudhah-teal' : 'text-raudhah-ink/40'}`}>
                            {p.name}
                        </span>
                        <span className={`text-xs md:text-sm font-black tracking-tighter block ${p.active ? 'text-raudhah-ink' : 'text-raudhah-ink/60'}`}>
                            {p.time}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PrayerTimesStrip;
