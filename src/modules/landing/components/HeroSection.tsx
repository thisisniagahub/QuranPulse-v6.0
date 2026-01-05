import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { AppStoreBadge, PlayStoreBadge } from './StoreBadges';
import SmartDeen from '../../smart-deen/SmartDeen';
import BottomNav from '../../../components/BottomNav';
import { NavView } from '../../../types';
import { Button } from '@/components/ui/Button';
import { Icon } from '@iconify/react';

interface HeroSectionProps {
    onGetStarted: () => void;
    spotsLeft: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, spotsLeft }) => {
    // --- MOCKUP STATE ---
    const [activeScreen, setActiveScreen] = useState<'home' | 'quran' | 'smart-deen'>('smart-deen');
    const [mockTheme, setMockTheme] = useState<'dark' | 'anmaat'>('dark');
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeAyah, setActiveAyah] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // --- 3D TILT LOGIC ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [isTouch, setIsTouch] = useState(false);

    // Detect Touch Device
    useEffect(() => {
        if (window.matchMedia('(hover: none)').matches) {
            setIsTouch(true);
        }
    }, []);

    // Smooth spring physics (Softer & Slower)
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    // Map mouse position to rotation degrees (Subtle Tilt)
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]); // Reduced from 15 to 5
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]); // Reduced from 15 to 5

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (isTouch) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = (e.clientX - rect.left) / width - 0.5;
        const mouseYVal = (e.clientY - rect.top) / height - 0.5;
        x.set(mouseXVal);
        y.set(mouseYVal);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Helper to map screen string to NavView enum
    const getNavViewForScreen = (screen: string): NavView => {
        switch (screen) {
            case 'home': return NavView.DASHBOARD;
            case 'quran': return NavView.QURAN;
            case 'smart-deen': return NavView.SMART_DEEN;
            default: return NavView.DASHBOARD;
        }
    };

    // Mock Navigate Handler
    const handleMockNavigate = (view: NavView) => {
        switch (view) {
            case NavView.DASHBOARD: setActiveScreen('home'); break;
            case NavView.QURAN: setActiveScreen('quran'); break;
            case NavView.SMART_DEEN: setActiveScreen('smart-deen'); break;
            case NavView.IBADAH: setActiveScreen('home'); break; // Fallback
            case NavView.IQRA: setActiveScreen('home'); break; // Fallback
            default: setActiveScreen('home');
        }
    };

    // Audio Control
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        if (!activeAyah) setActiveAyah(1);
    };

    const handleAyahClick = (ayah: number) => {
        setActiveAyah(ayah);
        setIsPlaying(true);
    };

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section
            className="relative z-10 min-h-[90vh] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto w-full gap-12 lg:gap-24 overflow-visible perspective-2000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >

                        {/* VIDEO BACKGROUND */}
                        <div className="absolute inset-0 w-screen h-full left-[50%] -translate-x-[50%] -z-20 overflow-hidden bg-[#0A1E42] pointer-events-none">
                            <video autoPlay loop muted playsInline poster="/hero-mockup.png" className="w-full h-full object-cover opacity-30 scale-105 saturate-50 contrast-125">
                                <source src="/videos/hero-bg.mp4" type="video/mp4" />
                            </video>
            
                            {/* ... existing pattern code ... */}
                        </div>
            
                        <audio ref={audioRef} src="https://verses.quran.com/Alafasy/mp3/067001.mp3" onEnded={() => setIsPlaying(false)} />
            
                        {/* LEFT: COPY */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="flex-1 text-center lg:text-left z-20 w-full"
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-6 sm:mb-8 mx-auto lg:mx-0">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">       
                                    Public Beta • Genesis Edition
                                </span>
                            </motion.div>
            
                            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-heading leading-[1.1] tracking-tighter mb-4 sm:mb-6">
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500">Masa Depan</span> <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-500 to-purple-500 animate-pulse-glow inline-block pb-2">
                                    Kecerdasan Islamik
                                </span>
                            </motion.h1>
            
                            <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 font-light leading-relaxed px-2 sm:px-0">
                                Alami pendamping Al-Quran berkuasa AI <span className="text-white border-b border-cyan-500/50 pb-0.5">pertama di dunia</span>.
                                Direka khas untuk mereka yang mencari kedalaman rohani dan kualiti premium.
                            </motion.p>
            
                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10 sm:mb-12 w-full sm:w-auto">
                                <Button
                                    onClick={onGetStarted}
                                    variant="glow"
                                    size="lg"
                                    className="w-full sm:w-auto text-lg font-bold py-4 rounded-xl"
                                    rightIcon={<i className="fa-solid fa-arrow-right text-sm"></i>}
                                >
                                    Mula Secara Percuma
                                </Button>
            
                                {/* NEW: RECITATION PULSE BUTTON */}                    <button
                        onClick={togglePlay}
                        className={`group flex gap-3 px-6 py-4 rounded-xl border transition-all items-center text-sm font-bold ${isPlaying ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}
                    >
                        <div className="relative flex items-center justify-center w-5 h-5">
                            {isPlaying ? (
                                <div className="flex gap-0.5 items-end h-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, 12, 6, 10, 4] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-0.5 bg-cyan-400 rounded-full"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <i className="fa-solid fa-play text-xs"></i>
                            )}
                        </div>
                        <span>{isPlaying ? 'Now Reciting...' : 'Hear the Pulse'}</span>
                    </button>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-white font-bold text-[10px]">+2M</div>
                        </div>
                        <p>Trusted by Ummah</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                    <p className="animate-pulse"><span className="text-cyan-400 font-bold">{spotsLeft}</span> spots remaining for this batch</p>
                </motion.div>
            </motion.div>

            {/* RIGHT: INTERACTIVE PHONE MOCKUP (3D TILT ENABLED) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex-1 relative z-10 w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] perspective-1000 group mx-auto"
                style={!isTouch ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-[60px] sm:blur-[80px] rounded-full animate-pulse-slow -z-10"></div>

                <motion.div
                    className="relative w-full aspect-[9/19] bg-black rounded-[2.5rem] sm:rounded-[3.5rem] border-[8px] sm:border-[12px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/20"
                    style={{ y: useSpring(useTransform(y, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 20 }) }}
                >
                    <div className={`absolute inset-0 rounded-[2rem] sm:rounded-[2.8rem] overflow-hidden flex flex-col relative transition-colors duration-700 ${mockTheme === 'anmaat' ? 'bg-[#050b18]' : 'bg-slate-950'}`}>

                        {/* ANMAAT ORNATE PATTERN IN MOCKUP */}
                        {mockTheme === 'anmaat' && (
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-pattern-anmaat"></div>
                        )}

                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 sm:h-7 w-28 sm:w-32 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                            <div className="w-14 sm:w-16 h-3 sm:h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1">
                                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="h-8 sm:h-10 w-full flex justify-between items-center px-5 sm:px-6 pt-2 sm:pt-3 z-40">
                            <span className="text-[9px] sm:text-[10px] font-bold">9:41</span>
                            <div className="flex gap-1">
                                <i className="fa-solid fa-signal text-[9px] sm:text-[10px]"></i>
                                <i className="fa-solid fa-wifi text-[9px] sm:text-[10px]"></i>
                                <i className="fa-solid fa-battery-full text-[9px] sm:text-[10px]"></i>
                            </div>
                        </div>

                        {/* --- SCREEN: HOME --- */}
                        {activeScreen === 'home' && (
                            <div className="flex-1 p-4 flex flex-col animate-fade-in">
                                <div className="flex justify-between items-center mb-6 mt-2">
                                    <div>
                                        <p className="text-xs text-slate-400">Assalamu Alaikum,</p>
                                        <h3 className="text-lg font-bold text-white">Megat Shazree Zainal</h3>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border border-white/20"></div>
                                </div>

                                <div className="bg-gradient-to-br from-cyan-900/50 to-slate-900 rounded-2xl p-4 border border-white/5 mb-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Next Prayer</span>
                                        <Icon icon="meteocons:partly-cloudy-day-fill" className="text-slate-400 text-lg" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-1">Asr</h2>
                                    <p className="text-sm text-slate-300">4:23 PM <span className="text-[10px] text-slate-500 ml-2">(-0:45)</span></p>
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {['Quran', 'Prayer', 'Qibla', 'AI Chat'].map((item, i) => (
                                        <div key={i} onClick={() => {
                                            if (i === 0) setActiveScreen('quran');
                                            if (i === 3) setActiveScreen('smart-deen');
                                        }} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                                            <div className={`w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center ${i === 0 ? 'bg-cyan-500/20 text-cyan-400' : i === 3 ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-400'}`}>
                                                {i === 0 ? <i className="fa-solid fa-book-quran"></i> :
                                                    i === 1 ? <Icon icon="meteocons:clear-day-fill" className="text-lg" /> :
                                                        i === 2 ? <i className="fa-solid fa-compass"></i> :
                                                            <i className="fa-solid fa-robot"></i>}
                                            </div>
                                            <span className="text-[9px] text-slate-400">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- SCREEN: QURAN --- */}
                        {activeScreen === 'quran' && (
                            <>
                                <div className="px-5 sm:px-6 pt-2 pb-3 sm:pb-4 flex justify-between items-center z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveScreen('home')}>
                                        <i className="fa-solid fa-chevron-left text-slate-400 text-xs"></i>
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold text-white">Surah Al-Mulk</h3>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400">Ayah 1-5 • Meccan</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {/* Mock Theme Toggle */}
                                        <button
                                            title="Toggle Theme"
                                            aria-label="Toggle Theme"
                                            onClick={(e) => { e.stopPropagation(); setMockTheme(mockTheme === 'dark' ? 'anmaat' : 'dark'); }}
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${mockTheme === 'anmaat' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-400'}`}
                                        >
                                            <i className={`fa-solid ${mockTheme === 'anmaat' ? 'fa-wand-magic-sparkles' : 'fa-palette'} text-[10px]`}></i>
                                        </button>
                                        <i className="fa-solid fa-ellipsis-vertical text-slate-400 text-xs ml-1"></i>
                                    </div>
                                </div>

                                <div className="flex-1 p-3 sm:p-4 overflow-y-auto relative z-10 scrollbar-hide animate-fade-in">
                                    <div className="text-center mb-4 sm:mb-6 mt-2">
                                        <p className="font-amiri text-lg sm:text-xl text-white">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
                                    </div>

                                    {/* Ayah 1 */}
                                    <div onClick={() => handleAyahClick(1)} className={`mb-4 sm:mb-6 relative group/ayah cursor-pointer transition-all duration-300 ${activeAyah === 1 ? 'scale-[1.02]' : ''}`}>
                                        {activeAyah === 1 && <div className="absolute inset-0 bg-cyan-500/10 -mx-4 py-2 rounded-lg opacity-100 blur-sm transition-all"></div>}
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-colors ${activeAyah === 1 ? 'border-cyan-500 bg-cyan-500 text-black' : 'border-cyan-500/30 text-cyan-400'}`}>1</div>
                                                <div className="flex gap-2 text-slate-500 text-[10px]">
                                                    <i className={`fa-solid ${activeAyah === 1 && isPlaying ? 'fa-pause' : 'fa-play'} hover:text-cyan-400`}></i>
                                                    <i className="fa-solid fa-bookmark hover:text-cyan-400"></i>
                                                </div>
                                            </div>
                                            <p className="font-amiri text-right text-xl sm:text-2xl mb-2 sm:mb-3 leading-[2.2] text-white">تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ</p>
                                            <p className="text-[10px] sm:text-xs text-cyan-100/80 mb-1">Blessed is He in whose hand is dominion, and He is over all things competent</p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-500 italic">Tabaraka allathee biyadihi almulku wahuwa AAala kulli shayin qadeer</p>
                                        </div>
                                    </div>

                                    {/* Ayah 2 */}
                                    <div onClick={() => handleAyahClick(2)} className={`mb-4 sm:mb-6 relative group/ayah cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 ${activeAyah === 2 ? 'scale-[1.02] opacity-100' : ''}`}>
                                        {activeAyah === 2 && <div className="absolute inset-0 bg-cyan-500/10 -mx-4 py-2 rounded-lg opacity-100 blur-sm transition-all"></div>}
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-colors ${activeAyah === 2 ? 'border-cyan-500 bg-cyan-500 text-black' : 'border-slate-700 text-slate-500'}`}>2</div>
                                            </div>
                                            <p className="font-amiri text-right text-xl sm:text-2xl mb-2 sm:mb-3 leading-[2.2] text-white">ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ</p>
                                            <p className="text-[10px] sm:text-xs text-slate-400 mb-1">[He] who created death and life to test you [as to] which of you is best in deed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-16 sm:h-20 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-4 flex flex-col justify-center z-20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] sm:text-[10px] text-cyan-400">Mishary Rashid Alafasy</span>
                                        <span className="text-[9px] sm:text-[10px] text-slate-400">{isPlaying ? '0:12' : '0:00'} / 3:42</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full mb-3">
                                        <div className={`h-full bg-cyan-500 rounded-full relative transition-all duration-1000 ${isPlaying ? 'w-[15%]' : 'w-0'}`}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-4 text-white">
                                        <i className="fa-solid fa-backward-step text-xs text-slate-400 cursor-pointer hover:text-white"></i>
                                        <div onClick={togglePlay} className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                                        </div>
                                        <i className="fa-solid fa-forward-step text-xs text-slate-400 cursor-pointer hover:text-white"></i>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* --- SCREEN: SMART DEEN AI (ACTUAL APP) --- */}
                        {activeScreen === 'smart-deen' && (
                            <div className="flex-1 h-full w-full overflow-hidden bg-[#020617] relative flex flex-col">
                                {/* Actual SmartDeen Component Integration */}
                                <SmartDeen userName="Megat Shazree Zainal" hasBottomNav={true} />
                            </div>
                        )}

                        {/* --- Static Bottom Navigation (Mockup) --- */}
                        <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-auto">
                            {/* We use the real BottomNav but pass props to override active state */}
                            <BottomNav
                                activeViewOverride={getNavViewForScreen(activeScreen)}
                                onNavigate={handleMockNavigate}
                            />
                        </div>

                        {/* Bottom Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-1 bg-white/30 rounded-full z-50"></div>
                    </div>

                    {/* Reflection/Gloss */}
                    <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[2.8rem] bg-gradient-to-tr from-white/20 to-transparent opacity-30 pointer-events-none z-50"></div>
                </motion.div>

                {/* Floating Badges */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-4 sm:-right-12 top-24 sm:top-32 bg-black/60 backdrop-blur-xl p-2 sm:p-3 rounded-xl border border-white/10 shadow-xl transform rotate-6 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                        <span className="text-[9px] sm:text-[10px] font-bold">Tajweed Verified</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};
