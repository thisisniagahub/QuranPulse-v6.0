import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../../types';

interface HeroHeaderProps {
    user: UserProfile;
    greeting: string;
    theme: any;
    onCycleTheme: () => void;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ user, greeting, theme, onCycleTheme }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dateStr = currentTime.toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeStr = currentTime.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex justify-between items-end mb-8 px-2">
            <div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mb-1"
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {theme.hijriDate || "15 Ramadhan 1446H"}
                    </span>
                    <span className="text-[10px] text-white/50">• {greeting}</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold text-white leading-tight"
                >
                    {user.name}
                </motion.h1>
            </div>
            <div className="text-right">
                <p className="text-xl font-mono font-medium text-primary brightness-125">{timeStr}</p>
                <p className="text-white/50 text-xs font-medium">{dateStr}</p>
            </div>
        </div>
    );
};

export default HeroHeader;
