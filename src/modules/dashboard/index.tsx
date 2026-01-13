import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavView } from '../../types';
import { useGreeting } from '../../hooks/useGreeting';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { useQibla } from '../../hooks/useQibla';
import BentoCard from './components/BentoCard';
import PulseHero from './components/PulseHero';
import UstazAiWidget from './components/UstazAiWidget';
import DailyHikmah from './components/DailyHikmah';
import ContinueReadingCard from './components/ContinueReadingCard';
import PrayerTimesStrip from './components/PrayerTimesStrip';
import RecommendedWidget from './components/RecommendedWidget';
import RecentActivity from './components/RecentActivity';
import CyberQuickActions from './components/CyberQuickActions';

// Import Widgets
import QiblaCompass from '../smart-deen/components/QiblaCompass';
import { TasbihWidget, TakwimWidget } from '../ibadah/components';

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: NavView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    const { greetingText } = useGreeting(user.name);
    const [activeModal, setActiveModal] = useState<'none' | 'qibla' | 'tasbih' | 'takwim'>('none');
    
    // Qibla Data
    const { qiblaAngle } = useQibla();

    // Geolocation Handling
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
                    // Default to Kuala Lumpur
                    setCoords({ lat: 3.1390, lng: 101.6869 });
                }
            );
        } else {
            setCoords({ lat: 3.1390, lng: 101.6869 });
        }
    }, []);

    const { data: prayerData, loading: prayerLoading } = usePrayerTimes(coords?.lat || 3.1390, coords?.lng || 101.6869);

    const handleQuickAction = (id: string) => {
        switch(id) {
            case 'qibla': setActiveModal('qibla'); break;
            case 'tasbih': setActiveModal('tasbih'); break;
            case 'takwim': setActiveModal('takwim'); break;
            case 'infaq': onNavigate(NavView.IBADAH); break; // Using IBADAH as fallback for Infaq
            default: console.log('Action not implemented:', id);
        }
    };

    // Theme helpers passed to children
    const theme = {
        primary: 'cyan',
        secondary: 'slate',
    };

    return (
        <div className={`min-h-full pb-32 bg-midnight-gradient relative font-sans selection:bg-cyan-500/30`}>

            {/* 🌌 Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Dynamic Glow Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow lg:opacity-60" style={{ animationDelay: '2s' }}></div>

                {/* Cyber Grid Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/patterns/cyber-islamic-grid.svg')] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* 📦 Main Scrollable Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-4 min-h-screen flex flex-col gap-5">

                {/* 1. PULSE HERO (Heartbeat) */}
                <PulseHero user={user} prayerData={prayerData} />

                {/* 2. QUICK ACTIONS (Horizontal Strip) */}
                <CyberQuickActions onAction={handleQuickAction} />

                {/* 3. CORE GRID */}
                <div className="grid grid-cols-2 gap-3 pb-4">
                    {/* Primary Actions - Taller Aspect Ratio */}
                    <div className="col-span-1 aspect-[4/5]">
                        <UstazAiWidget onNavigate={onNavigate} />
                    </div>
                    <div className="col-span-1 aspect-[4/5]">
                        <ContinueReadingCard onNavigate={onNavigate} theme={theme} />
                    </div>

                    {/* Secondary Info - Wide widgets */}
                    <div className="col-span-2 md:col-span-1 h-[140px] overflow-hidden rounded-2xl">
                        <DailyHikmah />
                    </div>
                    <div className="col-span-2 md:col-span-1 h-[140px] overflow-hidden rounded-2xl">
                        <RecentActivity />
                    </div>
                </div>

                {/* 4. FOOTER (Minimal) */}
                <div className="py-6 text-center opacity-30 pointer-events-none">
                    <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">v6.0 • Digital Ummah</p>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal === 'qibla' && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    >
                         <div className="relative w-full max-w-md">
                            <button onClick={() => setActiveModal('none')} className="absolute top-2 right-2 z-10 p-2 bg-slate-800 rounded-full text-white">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <QiblaCompass qiblaDirection={qiblaAngle || 0} />
                         </div>
                    </motion.div>
                )}
                {activeModal === 'tasbih' && <TasbihWidget onClose={() => setActiveModal('none')} />}
                {activeModal === 'takwim' && <TakwimWidget onClose={() => setActiveModal('none')} />}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;