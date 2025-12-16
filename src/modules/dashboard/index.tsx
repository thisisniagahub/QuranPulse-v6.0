import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, NavView } from '../../types';
import { useGreeting } from '../../hooks/useGreeting';
import { useGamification } from '../../contexts/GamificationContext';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: NavView) => void;
}

// --- Components ---

const BentoCard = ({ 
    children, 
    className = "", 
    onClick,
    delay = 0
}: { children: React.ReactNode; className?: string; onClick?: () => void; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative overflow-hidden rounded-3xl backdrop-blur-md border border-white/5 cursor-pointer shadow-lg ${className}`}
    >
        {children}
    </motion.div>
);

const HeroHeader = ({ user, greeting }: { user: UserProfile, greeting: string }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = currentTime.toLocaleDateString('ms-MY', dateOptions);
    const timeStr = currentTime.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });

    // Mock Hijri
    const hijriDate = "15 Ramadhan 1446H"; 

    return (
        <div className="flex justify-between items-end mb-8 px-2">
            <div>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-1"
                >
                    {hijriDate} • {greeting}
                </motion.p>
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
                <p className="text-white text-xl font-mono font-medium">{timeStr}</p>
                <p className="text-slate-500 text-xs font-medium">{dateStr}</p>
            </div>
        </div>
    );
};

const ContinueReadingCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="col-span-2 bg-gradient-to-r from-cyan-900/40 via-blue-900/20 to-slate-900/40 border-cyan-500/20 min-h-[160px] flex flex-col justify-between p-6 group"
        onClick={() => onNavigate(NavView.QURAN)}
        delay={0.1}
    >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-700"></div>
        
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Sambung Bacaan</p>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Surah Al-Mulk</h3>
                <p className="text-slate-400 text-sm">Ayat 3 • Juzuk 29</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 transition-all duration-300">
                <i className="fa-solid fa-play ml-1"></i>
            </div>
        </div>

        <div className="relative z-10 mt-4">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-widest">
                <span>Progress</span>
                <span>15%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>
        </div>
    </BentoCard>
);

const PrayerTimesStrip = () => {
    const prayers = [
        { name: 'Subuh', time: '05:45' },
        { name: 'Zohor', time: '13:15' },
        { name: 'Asar', time: '16:30', active: true },
        { name: 'Maghrib', time: '19:20' },
        { name: 'Isyak', time: '20:35' },
    ];

    return (
        <div className="col-span-2 overflow-x-auto no-scrollbar py-2">
            <div className="flex gap-3">
                {prayers.map((p, i) => (
                    <motion.div 
                        key={p.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                        className={`flex-shrink-0 min-w-[100px] p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${
                            p.active 
                                ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                : 'bg-slate-900/40 border-slate-800/50 grayscale opacity-70'
                        }`}
                    >
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${p.active ? 'text-emerald-400' : 'text-slate-500'}`}>{p.name}</span>
                        <span className={`font-mono text-lg font-bold ${p.active ? 'text-white' : 'text-slate-400'}`}>{p.time}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const SmartDeenCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20 p-5 group flex flex-col justify-between h-40"
        onClick={() => onNavigate(NavView.SMART_DEEN)}
        delay={0.2}
    >
        <div className="absolute bottom-0 right-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <i className="fa-solid fa-brain text-8xl -mb-4 -mr-4 text-purple-500"></i>
        </div>
        <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-sparkles"></i>
            </div>
            <h3 className="font-bold text-white text-lg leading-tight">Ustaz AI</h3>
            <p className="text-indigo-200/60 text-xs mt-1">Tanya Hukum & Fiqh</p>
        </div>
    </BentoCard>
);

const IqraCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-500/20 p-5 group flex flex-col justify-between h-40"
        onClick={() => onNavigate(NavView.IQRA)}
        delay={0.3}
    >
        <div className="absolute bottom-0 right-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <i className="fa-solid fa-book-open text-8xl -mb-4 -mr-4 text-amber-500"></i>
        </div>
        <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 className="font-bold text-white text-lg leading-tight">Belajar Iqra</h3>
            <p className="text-amber-200/60 text-xs mt-1">Mula dari Asas</p>
        </div>
    </BentoCard>
);

const IbadahCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="bg-slate-900/60 border-slate-700/50 p-4 group flex items-center gap-4 hover:bg-slate-800/80 transition-colors"
        onClick={() => onNavigate(NavView.IBADAH)}
        delay={0.4}
    >
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
            <i className="fa-solid fa-mosque"></i>
        </div>
        <div>
            <h3 className="font-bold text-white">Ibadah</h3>
            <p className="text-xs text-slate-400">Qiblat, Zikir & Doa</p>
        </div>
    </BentoCard>
);

const CollectionCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="bg-slate-900/60 border-slate-700/50 p-4 group flex items-center gap-4 hover:bg-slate-800/80 transition-colors"
        onClick={() => onNavigate(NavView.PROFILE)}
        delay={0.45}
    >
        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-black transition-colors">
            <i className="fa-solid fa-bookmark"></i>
        </div>
        <div>
            <h3 className="font-bold text-white">Koleksi</h3>
            <p className="text-xs text-slate-400">Ayat Kegemaran</p>
        </div>
    </BentoCard>
);

const DailyAyatCard = () => (
    <BentoCard 
        className="col-span-2 bg-slate-900/40 border-white/5 p-6 relative overflow-hidden group min-h-[140px]"
        delay={0.5}
    >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white/70">
                <i className="fa-solid fa-quote-right"></i>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Ayat Hari Ini</p>
                <p className="font-arabic text-xl text-white mb-2 leading-loose" dir="rtl">...فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ</p>
                <p className="text-sm text-slate-300 italic">"Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?"</p>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">Surah Ar-Rahman : 13</p>
            </div>
        </div>
    </BentoCard>
);


const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    const { greetingText } = useGreeting(user.name);

    return (
        <div className="min-h-full pb-32 bg-[#020617] relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-950/30 to-transparent opacity-60"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <div className="relative z-10 max-w-xl mx-auto px-5 pt-8">
                
                {/* 1. Greeting Header */}
                <HeroHeader user={user} greeting={greetingText} />

                {/* 2. Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* A. Hero: Continue Reading */}
                    <ContinueReadingCard onNavigate={onNavigate} />

                    {/* B. Prayer Times (Scrollable Strip) */}
                    <PrayerTimesStrip />

                    {/* C. Primary Features (Big Blocks) */}
                    <SmartDeenCard onNavigate={onNavigate} />
                    <IqraCard onNavigate={onNavigate} />

                    {/* D. Secondary Features (Pills) */}
                    <IbadahCard onNavigate={onNavigate} />
                    <CollectionCard onNavigate={onNavigate} />
                    
                    {/* E. Daily Inspiration (Wide) */}
                    <DailyAyatCard />

                </div>

            </div>
        </div>
    );
};

export default Dashboard;