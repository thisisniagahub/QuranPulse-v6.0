import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavView } from '../../types';
import { useGreeting } from '../../hooks/useGreeting';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import BentoCard from './components/BentoCard';
import PulseHero from './components/PulseHero';
import UstazAiWidget from './components/UstazAiWidget';
import DailyHikmah from './components/DailyHikmah';
import ContinueReadingCard from './components/ContinueReadingCard';
import PrayerTimesStrip from './components/PrayerTimesStrip';
import RecommendedWidget from './components/RecommendedWidget';
import RecentActivity from './components/RecentActivity';

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: NavView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    const { greetingText } = useGreeting(user.name);

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
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-10 md:pt-14 h-[100dvh] flex flex-col">

                {/* 2. OVERALL BENTO GRID - ZERO SCROLL */}
                <div className="grid grid-cols-2 gap-3 flex-1 pb-4">

                    {/* A. PULSE HERO (Heartbeat) */}
                    <div className="col-span-2">
                        <PulseHero user={user} prayerData={prayerData} />
                    </div>

                    {/* C. CORE FEATURES (Split Row - High Density) */}
                    <UstazAiWidget onNavigate={onNavigate} />
                    <ContinueReadingCard onNavigate={onNavigate} theme={theme} />

                    {/* D. INSIGHTS (Split Row - High Density) */}
                    <div className="col-span-1 h-[140px] overflow-hidden rounded-2xl">
                        <DailyHikmah />
                    </div>
                    <div className="col-span-1 h-[140px] overflow-hidden rounded-2xl">
                        <RecentActivity />
                    </div>
                </div>

                {/* 3. FOOTER (Minimal) */}
                <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-30 pointer-events-none">
                    <p className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">v6.0 • Digital Ummah</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;