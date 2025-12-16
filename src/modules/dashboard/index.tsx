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
        disabled={true}
        delay={0.3}
        bgImage="/iqra-poster-v1.png"
    >
        {/* Banner Ribbon */}
        <div className="absolute top-4 -right-10 w-40 bg-gold-500 py-1 text-center rotate-45 z-20 shadow-lg border-y border-gold-400/50">
            <span className="text-[10px] font-black text-black tracking-widest uppercase">Coming Soon</span>
        </div>

        <div className="flex flex-col justify-between h-full opacity-50 blur-[0.5px]">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 backdrop-blur flex items-center justify-center text-gold-400 mb-3 border border-white/20">
                <i className="fa-solid fa-graduation-cap"></i>
            </div>
             <div>
                <h3 className="font-bold text-white text-lg leading-tight">Belajar Iqra</h3>
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
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

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
        <div className="min-h-full pb-32 bg-background-dark relative">
            
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                 {/* Top Gradient */}
                <div className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${theme.gradient} opacity-60`}></div>
                
                {/* Colored Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] opacity-30"></div>
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-black/40 rounded-full blur-[100px]"></div>
                
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
            </div>

            <div className="relative z-10 max-w-xl mx-auto px-5 pt-8">
                
                {/* 1. Greeting Header */}
                <HeroHeader 
                    user={user} 
                    greeting={greetingText} 
                    theme={{...theme, hijriDate: prayerData?.hijriDate}} 
                    onCycleTheme={() => {}} 
                />

                {/* 2. Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* A. Hero: Continue Reading */}
                    <ContinueReadingCard onNavigate={onNavigate} theme={theme} />

                    {/* B. Prayer Times (Scrollable Strip) */}
                    <PrayerTimesStrip theme={theme} data={prayerData} loading={prayerLoading} />

                    {/* C. Primary Features (Image Backgrounds) */}
                    <SmartDeenCard onNavigate={onNavigate} />
                    <IqraCard onNavigate={onNavigate} />

                    {/* D. Secondary Features (Pills) */}
                    <PillCard 
                        onNavigate={() => onNavigate(NavView.IBADAH)} 
                        label="Ibadah" sub="Qiblat & Doa" 
                        icon="fa-mosque" colorClass="bg-primary/10" iconColor="text-primary" 
                    />
                     <PillCard 
                        onNavigate={() => onNavigate(NavView.PROFILE)} 
                        label="Koleksi" sub="Ayat Disimpan" 
                        icon="fa-bookmark" colorClass="bg-primary/10" iconColor="text-primary" 
                    />
                    
                    {/* E. Daily Inspiration (Wide + Image) */}
                    <DailyAyatCard />

                </div>

            </div>
        </div>
    );
};

export default Dashboard;