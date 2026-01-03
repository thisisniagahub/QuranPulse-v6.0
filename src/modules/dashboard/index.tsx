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
import AnnouncementBanner from './components/AnnouncementBanner';

interface DashboardProps {
    user: UserProfile;
    onNavigate: (view: NavView) => void;
}

const theme = {
    gradient: 'from-[#0A1E42] via-[#020617] to-[#010409]',
    glow: 'bg-cyan-500/20',
    border: 'border-white/10',
    text: 'text-cyan-400',
    secondary: 'text-slate-400',
};

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

    return (
        <div className="min-h-full pb-32 bg-[#020617] relative font-sans selection:bg-cyan-500/30">

            {/* 🌌 Ambient Cosmic Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-[#0A1E42] via-[#020617] to-black opacity-90"></div>

                {/* Dynamic Glow Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow lg:opacity-60" style={{ animationDelay: '2s' }}></div>

                {/* Cyber Grid Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* 📦 Main Scrollable Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-5 pt-8 md:pt-12">

                {/* 1. TOP ANNOUNCEMENT / LOGO */}
                <div className="flex justify-between items-center mb-10 group mt-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="relative group/logo">
                            <div className="absolute -inset-2 bg-cyan-500/40 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full"></div>
                            <img
                                src="/logo-icon.png"
                                alt="QuranPulse"
                                className="relative z-10 h-14 w-auto drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div>
                            <span className="text-xl font-black text-white tracking-tight">Quran<span className="text-cyan-400">Pulse</span></span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">System Online</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-3 text-right">
                        <div className="hidden sm:block">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{greetingText.split(',')[0]}!</p>
                            <p className="text-sm font-black text-white">{user.name.split(' ')[0]}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-800/40 border border-white/10 flex items-center justify-center p-1 backdrop-blur-md group-hover:border-cyan-500/40 transition-colors">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white overflow-hidden">
                                {user.avatar ? <img src={user.avatar} className="object-cover w-full h-full" /> : <i className="fa-solid fa-user text-lg"></i>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. OVERALL BENTO GRID */}
                <div className="grid grid-cols-2 gap-4 md:gap-5">

                    {/* A. PULSE HERO (Spiritual Heartbeat) - FULL WIDTH */}
                    <div className="col-span-2">
                        <PulseHero user={user} prayerData={prayerData} />
                    </div>

                    {/* B. PRAYER TIMES HORIZONTAL BAR - FULL WIDTH */}
                    <div className="col-span-2">
                        <PrayerTimesStrip theme={theme} data={prayerData} loading={prayerLoading} />
                    </div>

                    {/* C. CORE FEATURES (Split Row - High Density) */}
                    <UstazAiWidget onNavigate={onNavigate} />
                    <ContinueReadingCard onNavigate={onNavigate} theme={theme} />

                    {/* D. INSIGHTS (Split Row - High Density) */}
                    <DailyHikmah />
                    <RecentActivity />

                    {/* E. RECOMMENDED CONTENT (Discovery) - FULL WIDTH */}
                    <div className="col-span-2">
                        <RecommendedWidget />
                    </div>

                </div>

                {/* 3. FOOTER SPACE / LOGO REPETITION */}
                <div className="mt-20 flex flex-col items-center justify-center opacity-20 hover:opacity-100 transition-opacity duration-700">
                    <img src="/logo-icon.png" alt="" className="h-10 w-auto grayscale mb-4" />
                    <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Built for the Digital Ummah • v6.0</p>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;