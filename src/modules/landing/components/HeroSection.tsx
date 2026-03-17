import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play, Users, BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import { Magnet } from '../../../components/ui/Magnet';
import { ProductFrame } from '@/components/landing/ProductFrame';
import SplitText from '@/components/ui/SplitText';
import ShinyText from '@/components/ui/ShinyText';
import { Aurora } from '@/components/ui/Aurora';
import { CountUp } from '@/components/ui/CountUp';

interface HeroSectionProps {
    onGetStarted: () => void;
    spotsLeft?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, spotsLeft = 42 }) => {
    const containerRef = useRef<HTMLElement>(null);

    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: `${(i * 5.26 + 7.3) % 100}%`,
            top: `${(i * 7.89 + 3.1) % 100}%`,
            duration: 4 + (i % 7),
            delay: (i * 0.7) % 5,
        })), []
    );

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden"
        >
            {/* Aurora Background */}
            <Aurora
                colorStops={['#1B6B5A', '#D4AF37', '#1B6B5A']}
                amplitude={1.2}
                blend={0.6}
                speed={0.5}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute w-1 h-1 rounded-full bg-raudhah-teal/20"
                        style={{ left: p.left, top: p.top }}
                        animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center">

                {/* === Availability Badge === */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center gap-2 mb-10"
                >
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-raudhah-teal/15 bg-white/60 backdrop-blur-xl shadow-lg shadow-raudhah-teal/5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <ShinyText
                            text="App Mengaji AI Pertama Malaysia"
                            speed={3}
                            color="rgba(27, 107, 90, 0.35)"
                            shineColor="rgba(196, 151, 42, 0.95)"
                            className="text-[11px] font-bold uppercase tracking-[0.3em] text-raudhah-ink/60"
                        />
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-raudhah-gold/15 text-raudhah-gold text-[9px] font-black tracking-widest uppercase">Beta</span>
                    </div>
                </motion.div>

                {/* === Main Heading === */}
                <SplitText
                    text="The Pulse of Digital Ummah"
                    className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold font-raudhah leading-[1.08] tracking-tight mb-6 text-raudhah-ink"
                    tag="h1"
                    splitType="words"
                    duration={1}
                    staggerChildren={0.08}
                    delay={0.3}
                    from={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    triggerOnView={false}
                />

                {/* === Subtext === */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-raudhah-ink/55 text-lg sm:text-xl max-w-2xl leading-relaxed mb-12 font-medium px-4"
                >
                    Bukan sekadar app. Ini adalah OS untuk kehidupan seorang Muslim —
                    <span className="text-raudhah-teal font-semibold"> dibimbing AI, dijaga iman</span>.
                </motion.p>

                {/* === CTA Row === */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-14"
                >
                    <Magnet strength={0.2}>
                        <Button
                            onClick={onGetStarted}
                            className="group relative px-10 py-4 rounded-2xl bg-raudhah-teal text-white font-bold text-base overflow-hidden shadow-[0_20px_40px_-12px_rgba(27,107,90,0.45)] transition-all hover:scale-[1.03] hover:shadow-[0_25px_50px_-12px_rgba(27,107,90,0.55)]"
                        >
                            <span className="relative z-10 flex items-center gap-2.5">
                                Mula Percuma
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </Magnet>

                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group flex items-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-raudhah-ink/50 bg-white/60 backdrop-blur-sm border border-raudhah-teal/10 hover:border-raudhah-teal/25 hover:text-raudhah-teal hover:bg-white/80 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-raudhah-teal/10 flex items-center justify-center group-hover:bg-raudhah-teal/15 transition-colors">
                            <Play className="w-3 h-3 fill-raudhah-teal text-raudhah-teal ml-0.5" />
                        </div>
                        Tonton Demo
                    </button>
                </motion.div>

                {/* === Stats Row === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="flex items-center gap-6 sm:gap-10 mb-20 px-6 py-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-raudhah-teal/8 shadow-sm"
                >
                    {[
                        { icon: Users, value: 2500, suffix: '+', label: 'Pengguna Aktif', color: 'text-raudhah-teal' },
                        { icon: BookOpen, value: 6236, suffix: '', label: 'Ayat Al-Quran', color: 'text-raudhah-gold' },
                        { icon: Sparkles, value: 5, suffix: ' AI', label: 'Agen Pintar', color: 'text-raudhah-teal' },
                    ].map(({ icon: Icon, value, suffix, label, color }, i) => (
                        <React.Fragment key={label}>
                            {i > 0 && <div className="w-px h-8 bg-raudhah-ink/8" />}
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="flex items-center gap-1.5">
                                    <Icon className={`w-3.5 h-3.5 ${color}/60`} />
                                    <span className={`text-xl sm:text-2xl font-bold ${color}`}>
                                        <CountUp end={value} suffix={suffix} duration={2.5} />
                                    </span>
                                </div>
                                <span className="text-[10px] text-raudhah-ink/35 font-medium tracking-wide hidden sm:block">{label}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* === Product Frame === */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <ProductFrame title="QuranPulse Dashboard" badge="LIVE">
                        <div className="p-5 sm:p-7 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Prayer Times Card */}
                                <div className="bg-white/[0.05] backdrop-blur rounded-2xl p-5 border border-white/[0.07] group hover:border-raudhah-teal/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                        </span>
                                        <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Solat Seterusnya</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1 font-raudhah">Asar</div>
                                    <div className="text-xs text-white/35 mb-4">15:45 · 2j 13m lagi</div>
                                    <div className="h-1 rounded-full bg-white/5">
                                        <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-raudhah-teal to-emerald-400" />
                                    </div>
                                </div>

                                {/* XP & Level Card */}
                                <div className="bg-white/[0.05] backdrop-blur rounded-2xl p-5 border border-white/[0.07] group hover:border-raudhah-gold/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-raudhah-gold" />
                                        <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Level Progress</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-3xl font-bold text-white font-raudhah">Lvl 7</span>
                                        <span className="text-sm text-raudhah-gold font-bold">Hafiz</span>
                                    </div>
                                    <div className="text-xs text-white/35 mb-4">2,450 / 3,000 XP</div>
                                    <div className="h-1 rounded-full bg-white/5">
                                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-raudhah-gold to-amber-400" />
                                    </div>
                                </div>

                                {/* Streak Card */}
                                <div className="bg-white/[0.05] backdrop-blur rounded-2xl p-5 border border-white/[0.07] group hover:border-orange-400/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                        <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Streak Aktif</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-bold text-white">🔥 14</span>
                                        <span className="text-xs text-white/35">hari berturut</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {Array.from({ length: 7 }, (_, i) => (
                                            <div key={i} className={`flex-1 h-6 rounded-lg ${i < 7 ? 'bg-gradient-to-t from-orange-500/60 to-red-400/30' : 'bg-white/5'}`} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[9px] text-white/25 mt-1.5">
                                        <span>Isn</span><span>Sel</span><span>Rab</span><span>Kha</span><span>Jum</span><span>Sab</span><span>Ahd</span>
                                    </div>
                                </div>
                            </div>

                            {/* Khatam Progress */}
                            <div className="bg-white/[0.03] backdrop-blur rounded-2xl p-5 border border-white/[0.06]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-raudhah-teal/15 flex items-center justify-center text-base">📖</div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Khatam Progress</div>
                                            <div className="text-xs text-white/35 mt-0.5">Juz 12 · Surah Yusuf · Ayat 42</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-raudhah-teal">40%</div>
                                        <div className="text-[10px] text-white/25">12 / 30 Juz</div>
                                    </div>
                                </div>
                                <div className="flex gap-[2px]">
                                    {Array.from({ length: 30 }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 h-2 rounded-sm ${i < 12
                                                ? 'bg-gradient-to-r from-raudhah-teal to-raudhah-gold'
                                                : i === 12
                                                    ? 'bg-raudhah-teal/30 animate-pulse'
                                                    : 'bg-white/[0.05]'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between text-[9px] text-white/20 mt-1.5">
                                    <span>Juz 1</span><span>Juz 15</span><span>Juz 30</span>
                                </div>
                            </div>
                        </div>
                    </ProductFrame>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                    className="mt-12 flex flex-col items-center gap-2 text-raudhah-ink/20"
                >
                    <span className="text-[10px] font-mono tracking-widest uppercase">Terokai</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
