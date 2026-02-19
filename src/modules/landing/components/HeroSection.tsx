import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Magnet } from '../../../components/ui/Magnet';

interface HeroSectionProps {
    onGetStarted: () => void;
    spotsLeft?: number;
}

const FloatingOrb = ({ className }: { className?: string }) => (
    <motion.div
        animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1],
        }}
        transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className={`absolute rounded-full blur-[60px] pointer-events-none ${className}`}
    />
);

const RevealText = ({ text, className }: { text: string; className?: string }) => {
    const words = text.split(" ");
    return (
        <h1 className={className}>
            {words.map((word, i) => (
                <span key={i} className="reveal-word">
                    <motion.span
                        initial={{ y: "100%", filter: "blur(10px)" }}
                        animate={{ y: 0, filter: "blur(0px)" }}
                        transition={{
                            duration: 1.2,
                            delay: 0.2 + i * 0.1,
                            ease: [0.2, 0.65, 0.3, 0.9],
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                    {i < words.length - 1 && " "}
                </span>
            ))}
        </h1>
    );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();

    // --- WEIGHTLESS MOUSE PARALLAX ---
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
    const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        mouseX.set(clientX / width);
        mouseY.set(clientY / height);
    };

    const orbX = useTransform(springX, [0, 1], ["-10%", "10%"]);
    const orbY = useTransform(springY, [0, 1], ["-10%", "10%"]);

    // Memoize particles so they don't jump on re-render
    const particles = useMemo(() =>
        Array.from({ length: 20 }, () => ({
            size: Math.random() * 4 + 2,
            x: Math.random() * 100,
            y: Math.random() * 100,
        })), []
    );

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden"
        >
            {/* 1. ATMospheric Layer (Antigravity Environment) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Antigravity Mesh Background (Already in Parent, but adding specific Hero accents) */}
                <FloatingOrb className="w-[800px] h-[800px] bg-raudhah-teal/10 -top-[20%] -left-[10%]" />
                <FloatingOrb className="w-[600px] h-[600px] bg-raudhah-gold/5 -bottom-[10%] -right-[5%]" />

                {/* High-Fidelity Particles */}
                <motion.div
                    style={{ x: orbX, y: orbY }}
                    className="absolute inset-0 z-10 opacity-30"
                >
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3 + i % 5, repeat: Infinity, delay: i * 0.2 }}
                            className="absolute bg-raudhah-teal/20 rounded-full blur-[1px]"
                            style={{
                                width: p.size + "px",
                                height: p.size + "px",
                                left: p.x + "%",
                                top: p.y + "%",
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* 2. CONTENT LAYER */}
            <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center">
                {/* Staggered Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-raudhah-teal/10 bg-white/5 backdrop-blur-xl shadow-2xl mb-12"
                >
                    <div className="w-2 h-2 rounded-full bg-raudhah-gold animate-pulse"></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-raudhah-teal/60">
                        Spiritual Life OS
                    </span>
                </motion.div>

                {/* The "Antigravity" Heading */}
                <RevealText
                    text="The Pulse of Digital Ummah"
                    className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-bold font-raudhah leading-[0.82] tracking-lighter mb-12 text-raudhah-ink"
                />

                {/* Subtext Reveal */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-raudhah-ink/70 text-xl sm:text-2xl md:text-3xl max-w-4xl leading-relaxed mb-16 font-medium px-4"
                >
                    Masa hadapan spiritual Intelligence anda bermula di sini. <br className="hidden md:block" />
                    Bebas gangguan, tenang, dan sentiasa bersambung dengan <span className="text-raudhah-teal">Digital Nadi</span>.
                </motion.p>

                {/* Orbital CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="flex flex-col sm:flex-row items-center gap-8"
                >
                    <Magnet strength={0.2}>
                        <Button
                            onClick={onGetStarted}
                            className="group relative px-14 py-6 rounded-[2rem] bg-raudhah-teal text-white font-bold text-lg overflow-hidden shadow-[0_30px_60px_-15px_rgba(27,107,90,0.5)] transition-all hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Button>
                    </Magnet>

                    <div className="flex items-center gap-4 text-raudhah-ink/40 font-mono text-xs uppercase tracking-widest">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/100?img=${i + 20}`}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                    alt="User"
                                />
                            ))}
                        </div>
                        <span>Active Genesis Batch</span>
                    </div>
                </motion.div>
            </div>

            {/* 3. THE "NADI" VISUAL (Abstract Abstract Orb) */}
            <motion.div
                style={{
                    y: useTransform(springY, [0, 1], [50, -50]),
                    x: useTransform(springX, [0, 1], [50, -50])
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] -z-10 pointer-events-none flex items-center justify-center"
            >
                {/* Central Intelligence Nadi */}
                <div className="relative">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="w-[800px] h-[800px] bg-raudhah-teal/5 rounded-full blur-[150px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-raudhah-gold/5 rounded-full blur-[200px]"
                    />
                </div>
            </motion.div>
        </section>
    );
};
