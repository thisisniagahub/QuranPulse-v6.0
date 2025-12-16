import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavView } from '../../types';
import { useGreeting } from '../../hooks/useGreeting';
import { useGamification } from '../../contexts/GamificationContext';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: NavView) => void;
}

// --- THEME CONFIGURATION ---
type ThemeTypes = 'CYBER' | 'EMERALD' | 'ROYAL';

const THEMES = {
    CYBER: {
        id: 'CYBER',
        bg: 'bg-[#020617]', // Deep Blue
        accent: 'cyan',
        accentHex: '#22d3ee',
        gradient: 'from-cyan-900/40 via-blue-900/40 to-slate-900/40',
        glow: 'bg-cyan-500/20',
        border: 'border-cyan-500/20',
        text: 'text-cyan-400',
        heroImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070&auto=format&fit=crop',
        pageBg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop' // Vibrant Abstract
    },
    EMERALD: {
        id: 'EMERALD',
        bg: 'bg-[#021008]', // Deep Green
        accent: 'emerald',
        accentHex: '#34d399',
        gradient: 'from-emerald-900/40 via-teal-900/40 to-slate-900/40',
        glow: 'bg-emerald-500/20',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        heroImage: 'https://images.unsplash.com/photo-1542353347-19d1bb82823d?q=80&w=2070&auto=format&fit=crop',
        pageBg: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2727&auto=format&fit=crop' // Deep Nature/Ferns
    },
    ROYAL: {
        id: 'ROYAL',
        bg: 'bg-[#150216]', // Deep Purple
        accent: 'amber', // Gold for Royal
        accentHex: '#fbbf24',
        gradient: 'from-purple-900/40 via-fuchsia-900/40 to-slate-900/40',
        glow: 'bg-amber-500/20',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        heroImage: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop',
        pageBg: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?q=80&w=2636&auto=format&fit=crop' // Dark Islamic Geometry
    }
};

// --- Components ---

const BentoCard = ({ 
    children, 
    className = "", 
    onClick,
    delay = 0,
    bgImage, // Optional: Real Image Background
    disabled = false
}: { children: React.ReactNode; className?: string; onClick?: () => void; delay?: number; bgImage?: string; disabled?: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={!disabled ? onClick : undefined}
        className={`relative overflow-hidden rounded-3xl backdrop-blur-md border border-white/10 shadow-lg group ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
        {/* Real Image Background Layer */}
        {bgImage && (
            <>
                <div className="absolute inset-0">
                    <img src={bgImage} alt="bg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                </div>
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </>
        )}
        
        {/* Content Layer */}
        <div className="relative z-10 h-full">
            {children}
        </div>
    </motion.div>
);

// ... (Other components unchanged) ...



const HeroHeader = ({ user, greeting, theme, onCycleTheme }: { user: UserProfile, greeting: string, theme: any, onCycleTheme: () => void }) => {
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
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.text}`}>
                        15 Ramadhan 1446H
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); onCycleTheme(); }} className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" title="Tukar Tema">
                         <i className="fa-solid fa-palette text-[10px] text-white"></i>
                    </button>
                    <span className="text-[10px] text-slate-500">• {greeting}</span>
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
            <div className={`text-right ${theme.text}`}>
                <p className="text-xl font-mono font-medium brightness-125">{timeStr}</p>
                <p className="text-slate-500 text-xs font-medium">{dateStr}</p>
            </div>
        </div>
    );
};

const ContinueReadingCard = ({ onNavigate, theme }: { onNavigate: (view: NavView) => void, theme: any }) => (
    <BentoCard 
        className={`col-span-2 min-h-[180px] p-6`}
        onClick={() => onNavigate(NavView.QURAN)}
        delay={0.1}
        bgImage="https://images.unsplash.com/photo-1596791565345-0d24e4c27725?q=80&w=2072&auto=format&fit=crop" // Open Quran Image
    >
        <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: theme.accentHex }}></span>
                        <p className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>Sambung Bacaan</p>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">Surah Al-Mulk</h3>
                    <p className="text-white/80 text-sm font-medium drop-shadow-sm">Ayat 3 • Juzuk 29</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300`}>
                    <i className="fa-solid fa-play ml-1 text-inherit"></i>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-[10px] text-slate-300 mb-1 font-bold uppercase tracking-widest drop-shadow-sm">
                    <span>Progress</span>
                    <span>15%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full rounded-full" style={{ width: '15%', backgroundColor: theme.accentHex, boxShadow: `0 0 10px ${theme.accentHex}` }}></div>
                </div>
            </div>
        </div>
    </BentoCard>
);

const PrayerTimesStrip = ({ theme }: { theme: any }) => {
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
                        className={`flex-shrink-0 min-w-[100px] p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 backdrop-blur-md ${
                            p.active 
                                ? `${theme.glow} border-${theme.accent}-500/50 shadow-lg` 
                                : 'bg-slate-900/40 border-slate-800/50 grayscale opacity-70'
                        }`}
                        style={p.active ? { borderColor: `${theme.accentHex}40` } : {}}
                    >
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${p.active ? theme.text : 'text-slate-500'}`}>{p.name}</span>
                        <span className={`font-mono text-lg font-bold ${p.active ? 'text-white' : 'text-slate-400'}`}>{p.time}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const SmartDeenCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="p-5 flex flex-col justify-between h-40"
        onClick={() => onNavigate(NavView.SMART_DEEN)}
        delay={0.2}
        bgImage="https://images.unsplash.com/photo-1537446556516-7d08bc345d3c?q=80&w=2669&auto=format&fit=crop" // Abstract Tech/Network
    >
        <div className="flex flex-col justify-between h-full">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 backdrop-blur flex items-center justify-center text-purple-300 mb-3 border border-purple-500/20">
                <i className="fa-solid fa-sparkles"></i>
            </div>
            <div>
                <h3 className="font-bold text-white text-lg leading-tight drops-shadow-md">Ustaz AI</h3>
                <p className="text-purple-200/80 text-xs mt-1 font-medium">Tanya Hukum & Fiqh</p>
            </div>
        </div>
    </BentoCard>
);

const IqraCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard 
        className="p-5 flex flex-col justify-between h-40 relative group border-amber-500/10 overflow-hidden"
        disabled={true}
        delay={0.3}
        bgImage="/iqra-poster-v1.png" // Generated AI Poster
    >
        {/* Banner Ribbon */}
        <div className="absolute top-4 -right-10 w-40 bg-amber-500 py-1 text-center rotate-45 z-20 shadow-lg border-y border-amber-300/50">
            <span className="text-[10px] font-black text-black tracking-widest uppercase">Coming Soon</span>
        </div>

        <div className="flex flex-col justify-between h-full opacity-50 blur-[0.5px]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 backdrop-blur flex items-center justify-center text-amber-300 mb-3 border border-amber-500/20">
                <i className="fa-solid fa-graduation-cap"></i>
            </div>
             <div>
                <h3 className="font-bold text-white text-lg leading-tight">Belajar Iqra</h3>
                <p className="text-amber-200/80 text-xs mt-1 font-medium">Mula dari Asas</p>
            </div>
        </div>
    </BentoCard>
);

const PillCard = ({ onNavigate, label, sub, icon, colorClass, iconColor }: any) => (
    <BentoCard 
        className="bg-slate-900/60 border-slate-700/50 p-4 flex items-center gap-4 hover:bg-slate-800/80"
        onClick={onNavigate}
        delay={0.4}
    >
        <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center ${iconColor} border border-white/10`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <h3 className="font-bold text-white">{label}</h3>
            <p className="text-xs text-slate-400">{sub}</p>
        </div>
    </BentoCard>
);

const DailyAyatCard = ({ theme }: { theme: any }) => (
    <BentoCard 
        className={`col-span-2 border-white/5 p-6 min-h-[140px]`}
        delay={0.5}
        bgImage="https://images.unsplash.com/photo-1543788927-440262174661?q=80&w=2669&auto=format&fit=crop" // Serene Nature
    >
        <div className="flex items-start gap-4 h-full relative z-10">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white backdrop-blur-sm border border-white/10">
                <i className="fa-solid fa-quote-right"></i>
            </div>
            <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.text} drop-shadow-sm`}>Inspirasi Hari Ini</p>
                <p className="font-arabic text-xl text-white mb-2 leading-loose drop-shadow-md" dir="rtl">...فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ</p>
                <p className="text-sm text-white/90 italic drop-shadow-sm">"Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?"</p>
                <p className="text-[10px] text-white/70 mt-2 font-mono">Surah Ar-Rahman : 13</p>
            </div>
        </div>
    </BentoCard>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    const { greetingText } = useGreeting(user.name);
    
    // Theme State: CYBER -> EMERALD -> ROYAL
    const [themeMode, setThemeMode] = useState<ThemeTypes>('CYBER');
    const theme = THEMES[themeMode];

    const cycleTheme = () => {
        if (themeMode === 'CYBER') setThemeMode('EMERALD');
        else if (themeMode === 'EMERALD') setThemeMode('ROYAL');
        else setThemeMode('CYBER');
    };

    return (
        <div className={`min-h-full pb-32 transition-colors duration-1000 ${theme.bg} relative`}>
            
            {/* Ambient Background - Dynamic based on Theme */}
            <div className="fixed inset-0 pointer-events-none transition-colors duration-1000">
                 {/* Top Gradient */}
                <div className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${theme.gradient} opacity-50 transition-colors duration-1000`}></div>
                
                {/* Colored Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-black/40 rounded-full blur-[100px]"></div>
                
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
            </div>

            <div className="relative z-10 max-w-xl mx-auto px-5 pt-8">
                
                {/* 1. Greeting Header */}
                <HeroHeader user={user} greeting={greetingText} theme={theme} onCycleTheme={cycleTheme} />

                {/* 2. Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* A. Hero: Continue Reading */}
                    <ContinueReadingCard onNavigate={onNavigate} theme={theme} />

                    {/* B. Prayer Times (Scrollable Strip) */}
                    <PrayerTimesStrip theme={theme} />

                    {/* C. Primary Features (Image Backgrounds) */}
                    <SmartDeenCard onNavigate={onNavigate} />
                    <IqraCard onNavigate={onNavigate} />

                    {/* D. Secondary Features (Pills) */}
                    <PillCard 
                        onNavigate={() => onNavigate(NavView.IBADAH)} 
                        label="Ibadah" sub="Qiblat & Doa" 
                        icon="fa-mosque" colorClass="bg-emerald-500/10" iconColor="text-emerald-400" 
                    />
                     <PillCard 
                        onNavigate={() => onNavigate(NavView.PROFILE)} 
                        label="Koleksi" sub="Ayat Disimpan" 
                        icon="fa-bookmark" colorClass="bg-red-500/10" iconColor="text-red-400" 
                    />
                    
                    {/* E. Daily Inspiration (Wide + Image) */}
                    <DailyAyatCard theme={theme} />

                </div>

            </div>
        </div>
    );
};

export default Dashboard;