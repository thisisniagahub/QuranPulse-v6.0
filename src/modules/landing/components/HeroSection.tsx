import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play, Users, BookOpen, Sparkles } from 'lucide-react';
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

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
    const containerRef = useRef<HTMLElement>(null);


    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16 overflow-hidden"
        >
            {/* Aurora Background — WebGL animated light */}
            <Aurora
                colorStops={['#1B6B5A', '#D4AF37', '#1B6B5A']}
                amplitude={1.2}
                blend={0.6}
                speed={0.5}
            />

            {/* Subtle particle dots */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Floating particles */}
                {Array.from({ length: 40 }, (_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-raudhah-teal/20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 6,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center">
                {/* Badge — Shiny Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-raudhah-teal/10 bg-white/5 backdrop-blur-xl shadow-2xl mb-12"
                >
                    <div className="w-2 h-2 rounded-full bg-raudhah-gold animate-pulse" />
                    <ShinyText
                        text="Spiritual Life OS"
                        speed={3}
                        color="rgba(27, 107, 90, 0.4)"
                        shineColor="rgba(212, 175, 55, 0.9)"
                        className="text-[11px] font-bold uppercase tracking-[0.4em]"
                    />
                </motion.div>

                {/* Main Heading — SplitText Animation (Antigravity Style) */}
                <SplitText
                    text="The Pulse of Digital Ummah"
                    className="text-5xl sm:text-7xl md:text-[7rem] lg:text-[9rem] font-bold font-raudhah leading-[1.1] tracking-tighter mb-10 text-raudhah-ink break-words"
                    tag="h1"
                    splitType="words"
                    duration={1}
                    staggerChildren={0.08}
                    delay={0.3}
                    from={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    triggerOnView={false}
                />

                {/* Subtext — MADANI aligned */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-raudhah-ink/60 text-lg sm:text-xl md:text-2xl max-w-3xl leading-relaxed mb-14 font-medium px-4"
                >
                    Setiap Muslim layak ada teknologi yang menjaga imannya. <br className="hidden md:block" />
                    Bukan algoritma yang merosakkan — tapi <span className="text-raudhah-teal font-semibold">AI yang membimbing</span>.
                </motion.p>

                {/* CTA Row */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="flex flex-col sm:flex-row items-center gap-6 mb-12"
                >
                    <Magnet strength={0.2}>
                        <Button
                            onClick={onGetStarted}
                            className="group relative px-12 py-5 rounded-2xl bg-raudhah-teal text-white font-bold text-lg overflow-hidden shadow-[0_25px_50px_-12px_rgba(27,107,90,0.4)] transition-all hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Mula Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </Magnet>

                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-raudhah-ink/60 bg-white/50 border border-raudhah-teal/10 hover:border-raudhah-teal/30 hover:text-raudhah-teal transition-all"
                    >
                        <Play className="w-4 h-4 fill-raudhah-teal text-raudhah-teal" />
                        Lihat Demo
                    </button>
                </motion.div>

                {/* Stats Row — CountUp */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2 }}
                    className="flex items-center gap-8 sm:gap-12 mb-16"
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-raudhah-teal/60" />
                        <span className="text-2xl sm:text-3xl font-bold text-raudhah-ink">
                            <CountUp end={2500} suffix="+" duration={2.5} />
                        </span>
                        <span className="text-sm text-raudhah-ink/40 hidden sm:inline">Pengguna</span>
                    </div>
                    <div className="w-px h-6 bg-raudhah-ink/10" />
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-raudhah-gold/60" />
                        <span className="text-2xl sm:text-3xl font-bold text-raudhah-ink">
                            <CountUp end={6236} duration={2.5} />
                        </span>
                        <span className="text-sm text-raudhah-ink/40 hidden sm:inline">Ayat</span>
                    </div>
                    <div className="w-px h-6 bg-raudhah-ink/10" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-raudhah-teal/60" />
                        <span className="text-2xl sm:text-3xl font-bold text-raudhah-ink">
                            <CountUp end={5} suffix=" AI" duration={1.5} />
                        </span>
                        <span className="text-sm text-raudhah-ink/40 hidden sm:inline">Agents</span>
                    </div>
                </motion.div>

                {/* ======== THE PRODUCT EMBED — The "Show Don't Tell" Moment ======== */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <ProductFrame title="QuranPulse Dashboard" badge="LIVE">
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Simulated Dashboard UI */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Prayer Times Card */}
                                <div className="bg-white/[0.06] backdrop-blur rounded-xl p-5 border border-white/[0.06]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Solat Seterusnya</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">Asar</div>
                                    <div className="text-sm text-white/40">15:45 · 2j 13m lagi</div>
                                    <div className="mt-3 h-1 rounded-full bg-white/5">
                                        <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-raudhah-teal to-raudhah-gold" />
                                    </div>
                                </div>

                                {/* XP & Level Card */}
                                <div className="bg-white/[0.06] backdrop-blur rounded-xl p-5 border border-white/[0.06]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Level Progress</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-white">Lvl 7</span>
                                        <span className="text-sm text-raudhah-gold font-semibold">Hafiz</span>
                                    </div>
                                    <div className="text-sm text-white/40 mt-1">2,450 / 3,000 XP</div>
                                    <div className="mt-3 h-1 rounded-full bg-white/5">
                                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                    </div>
                                </div>

                                {/* Streak Card */}
                                <div className="bg-white/[0.06] backdrop-blur rounded-xl p-5 border border-white/[0.06]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Streak Aktif</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-white">🔥 14</span>
                                        <span className="text-sm text-white/40">hari</span>
                                    </div>
                                    <div className="flex gap-1 mt-3">
                                        {Array.from({ length: 7 }, (_, i) => (
                                            <div key={i} className={`flex-1 h-6 rounded-md ${i < 7 ? 'bg-gradient-to-t from-orange-500/60 to-red-400/40' : 'bg-white/5'}`} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-white/30 mt-1">
                                        <span>Isn</span><span>Sel</span><span>Rab</span><span>Kha</span><span>Jum</span><span>Sab</span><span>Ahd</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row — Quran Progress */}
                            <div className="bg-white/[0.04] backdrop-blur rounded-xl p-5 border border-white/[0.06]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">📖</span>
                                        <div>
                                            <div className="text-sm font-bold text-white">Khatam Progress</div>
                                            <div className="text-xs text-white/40">Juz 12 · Surah Yusuf · Ayat 42</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-raudhah-teal">40%</div>
                                        <div className="text-[10px] text-white/30">12 / 30 Juz</div>
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
                                                    : 'bg-white/[0.06]'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between text-[9px] text-white/20 mt-1">
                                    <span>Juz 1</span><span>Juz 15</span><span>Juz 30</span>
                                </div>
                            </div>
                        </div>
                    </ProductFrame>
                </motion.div>
            </div>
        </section>
    );
};
