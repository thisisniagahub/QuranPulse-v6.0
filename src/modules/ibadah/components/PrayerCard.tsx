import React from 'react';
import { motion } from 'framer-motion';

interface PrayerCardProps {
    name: string;
    time: string;
    icon: string;
    isNext?: boolean;
    isPast?: boolean;
    gradient: string;
    glow: string;
    bottomInfo?: string;
}

const PrayerCard: React.FC<PrayerCardProps> = ({
    name, time, icon, isNext, isPast, gradient, glow, bottomInfo
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative w-full p-6 rounded-[2.5rem] overflow-hidden border transition-all duration-500
                bg-gradient-to-br ${gradient}
                ${isNext ? `border-white/50 shadow-2xl ${glow}` : 'border-white/10 shadow-lg'}
                ${isPast ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}
            `}
        >
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

            {/* Background Decorative Element (Inspired by Weather Widget) */}
            <div className={`absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-30 ${isNext ? 'bg-white' : 'bg-transparent'}`}></div>

            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${isNext ? 'text-white' : 'text-white/60'}`}>
                        {name}
                    </p>
                    <h3 className="text-5xl font-black text-white tracking-tighter">
                        {time.split(' ')[0] || '--:--'}
                        <span className="text-xl ml-1 opacity-60">{time.split(' ')[1] || ''}</span>
                    </h3>
                </div>

                <div className={`
                    w-16 h-16 rounded-3xl flex items-center justify-center text-3xl
                    ${isNext ? 'bg-white/20 backdrop-blur-xl text-white' : 'bg-black/10 text-white/80'}
                `}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
            </div>

            {/* Bottom Forecast-style Bar */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{bottomInfo || 'Standard Time'}</span>
                </div>
                {isNext && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-tighter animate-pulse">
                        Seterusnya
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default PrayerCard;
