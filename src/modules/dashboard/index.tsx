import React, { useState, useEffect } from 'react';
import { UserProfile, NavView } from '../../types';
import { useGreeting } from '../../hooks/useGreeting';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import BentoCard from './components/BentoCard';
import HeroHeader from './components/HeroHeader';
import PrayerTimesStrip from './components/PrayerTimesStrip';
import ContinueReadingCard from './components/ContinueReadingCard';

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: NavView) => void;
}

// --- VERSE STUDIO THEME (Single Unified Theme) ---
const theme = {
    bg: 'bg-background-dark',
    accent: 'primary',
    accentHex: '#5ab9ff',
    gradient: 'from-[#0e3359]/60 via-[#051324]/80 to-[#051324]',
    glow: 'bg-primary/20',
    border: 'border-white/20',
    text: 'text-primary',
    heroImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070&auto=format&fit=crop',
};

// --- Local Components ---

const SmartDeenCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard
        className="p-5 flex flex-col justify-between h-40 border-white"
        onClick={() => onNavigate(NavView.SMART_DEEN)}
        delay={0.2}
        bgImage="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2670&auto=format&fit=crop"
    >
        <div className="flex flex-col justify-between h-full">
            <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur flex items-center justify-center text-primary mb-3 border border-white/20">
                <i className="fa-solid fa-sparkles"></i>
            </div>
            <div>
                <h3 className="font-bold text-white text-lg leading-tight drops-shadow-md">Ustaz AI</h3>
                <p className="text-primary/80 text-xs mt-1 font-medium">Tanya Hukum & Fiqh</p>
            </div>
        </div>
    </BentoCard>
);

const IqraCard = ({ onNavigate }: { onNavigate: (view: NavView) => void }) => (
    <BentoCard
        className="p-5 flex flex-col justify-between h-40 relative group border-white overflow-hidden"
        onClick={() => onNavigate(NavView.IQRA)}
        delay={0.3}
        bgImage="/iqra-poster-v1.png"
    >
        <div className="flex flex-col justify-between h-full">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 backdrop-blur flex items-center justify-center text-gold-400 mb-3 border border-white/20">
                <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
                <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md">Iqra Digital</h3>
                <p className="text-gold-400/80 text-xs mt-1 font-medium">Mula dari Asas</p>
            </div>
        </div>
    </BentoCard>
);

const PillCard = ({ onNavigate, label, sub, icon, colorClass, iconColor }: any) => (
    <BentoCard
        className="bg-sheet/60 border-white p-4 flex items-center gap-4 hover:bg-surface-dark/80"
        onClick={onNavigate}
        delay={0.4}
    >
        <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center ${iconColor} border border-white/20`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <h3 className="font-bold text-white">{label}</h3>
            <p className="text-xs text-white/60">{sub}</p>
        </div>
    </BentoCard>
);

const DailyAyatCard = () => (
    <BentoCard
        className="col-span-2 border-white p-6 min-h-[140px]"
        delay={0.5}
        bgImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop"
    >
        <div className="flex items-start gap-4 h-full relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white backdrop-blur-sm border border-white/20">
                <i className="fa-solid fa-quote-right"></i>
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-primary drop-shadow-sm">Inspirasi Hari Ini</p>
                <p className="font-arabic text-xl text-white mb-2 leading-loose drop-shadow-md" dir="rtl">...فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ</p>
                <p className="text-sm text-white/90 italic drop-shadow-sm">"Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?"</p>
                <p className="text-[10px] text-white/70 mt-2 font-mono">Surah Ar-Rahman : 13</p>
            </div>
        </div>
    </BentoCard>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    const { greetingText } = useGreeting(user.name);

    // Data Hooks
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    // Default to KL
                    setCoords({ lat: 3.1390, lng: 101.6869 });
                }
            );
        } else {
            setCoords({ lat: 3.1390, lng: 101.6869 });
        }
    }, []);

    const { data: prayerData, loading: prayerLoading } = usePrayerTimes(coords?.lat || 3.1390, coords?.lng || 101.6869);

    return (
        <div className="min-h-full pb-32 bg-[#020617] relative font-sans">

            {/* Ambient Background (Deep Navy) */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Top Gradient */}
                <div className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#0A1E42] to-transparent opacity-80`}></div>
                {/* Glow */}
                <div className="absolute top-0 right-[-20%] w-[80%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] opacity-40"></div>
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
            </div>

            <div className="relative z-10 max-w-xl mx-auto px-6 pt-10">

                {/* 1. Header with Logo (Centered/Top) */}
                <div className="flex justify-between items-center mb-8">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/10">
                        <i className="fa-solid fa-user text-cyan-400"></i>
                    </div>
                    {/* Logo */}
                    <img src="/logo-icon.png" alt="Nabdh" className="h-16 w-auto drop-shadow-[0_0_15px_rgba(0,191,255,0.4)]" />
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Salam,</p>
                        <p className="text-sm font-bold text-white">{user.name || "Abdullah"}</p>
                    </div>
                </div>

                {/* 2. DAILY VERSE CARD (Pulse Line Effect) */}
                <div className="relative mb-10 group">
                    {/* Pulse Line Left */}
                    <div className="absolute top-1/2 left-[-20px] w-[30px] h-[20px] -translate-y-1/2 hidden sm:block">
                        <svg viewBox="0 0 100 50" className="w-full h-full stroke-cyan-500 fill-none stroke-2 drop-shadow-[0_0_5px_#06b6d4]">
                            <path d="M0,25 L20,25 L30,5 L50,45 L70,25 L100,25" />
                        </svg>
                    </div>
                    {/* Pulse Line Right */}
                    <div className="absolute top-1/2 right-[-20px] w-[30px] h-[20px] -translate-y-1/2 hidden sm:block">
                        <svg viewBox="0 0 100 50" className="w-full h-full stroke-cyan-500 fill-none stroke-2 drop-shadow-[0_0_5px_#06b6d4]">
                            <path d="M0,25 L20,25 L30,5 L50,45 L70,25 L100,25" />
                        </svg>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900/90 border-2 border-cyan-500/50 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>

                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                            <h3 className="text-cyan-300 font-bold text-sm uppercase tracking-wider">Daily Verse</h3>
                            <span className="text-[10px] text-slate-400 font-mono">[cite: 19]</span>
                        </div>

                        <div className="text-center space-y-3 relative z-10">
                            <p className="font-amiri text-2xl text-white leading-relaxed drop-shadow-md">وَإِنَّ رَبَّكَ لَذُو مَغْفِرَةٍۢ لِّلنَّاسِ</p>
                            <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto"></div>
                            <p className="text-xs text-slate-300 italic leading-relaxed">"And indeed, your Lord is full of forgiveness for the people..."</p>
                        </div>
                    </div>
                </div>

                {/* 3. QUICK ACCESS GRID (New Icons) */}
                <div className="mb-8">
                    <h3 className="text-white font-bold mb-4 text-sm">Quick Access</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Read Quran", icon: "/assets/icons/nabdh/icon-quran.png", action: () => onNavigate(NavView.QURAN) },
                            { label: "Listen Audio", icon: "/assets/icons/nabdh/icon-audio.png", action: () => onNavigate(NavView.MEDIA_STUDIO) },
                            { label: "Digital Tasbih", icon: "/assets/icons/nabdh/icon-tasbih.png", action: () => onNavigate(NavView.IBADAH) },
                            { label: "Prayer Times", icon: "/assets/icons/nabdh/icon-prayer.png", action: () => onNavigate(NavView.IBADAH) }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={item.action}
                                className="bg-[#0f1e38] rounded-3xl p-4 flex flex-col items-center justify-center gap-3 border border-white/5 shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer group active:scale-95"
                            >
                                <div className="w-16 h-16 drop-shadow-[0_0_15px_rgba(0,191,255,0.3)] group-hover:scale-110 transition-transform duration-500">
                                    <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-white">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. RECENT ACTIVITY (Mock List) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold text-sm">Recent Activity</h3>
                        <span className="text-[10px] text-cyan-400 font-mono">[cite: 15]</span>
                    </div>

                    <div className="bg-[#0f1e38]/50 rounded-2xl border border-white/5 p-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-900/30 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                <i className="fa-solid fa-book-open"></i>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-bold">Surah Al-Mulk</h4>
                                <p className="text-[10px] text-slate-400">Ayah 12 • Last read 2h ago</p>
                            </div>
                        </div>
                        <div className="h-px w-full bg-white/5"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-900/30 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                <i className="fa-solid fa-robot"></i>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-bold">Ustaz AI Session</h4>
                                <p className="text-[10px] text-slate-400">Fiqh Solat • Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;