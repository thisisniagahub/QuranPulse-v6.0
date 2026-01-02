import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    useEffect(() => {
        // Total duration of splash screen
        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // 3.5s total duration

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center overflow-hidden">
            {/* 🌌 Background Atmosphere */}
            <div className="absolute inset-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-gradient-radial from-blue-900/20 via-[#020617] to-[#020617]"
                />
                {/* Starfield Overlay */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* 🧬 Animated Rings/Orbits */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.5, 2], opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2.5, ease: "easeOut", times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 1 }}
                    className="w-[300px] h-[300px] border border-cyan-500/20 rounded-full"
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 1.8], opacity: [0, 0.2, 0] }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: 0.5, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 1 }}
                    className="w-[200px] h-[200px] border border-blue-500/30 rounded-full"
                />
            </div>

            {/* 🕌 Central Logo Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Logo Image */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        filter: ["drop-shadow(0 0 10px rgba(6,182,212,0.3))", "drop-shadow(0 0 25px rgba(6,182,212,0.6))", "drop-shadow(0 0 10px rgba(6,182,212,0.3))"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 mb-6 relative"
                >
                    <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
                    <img
                        src="/logo-primary.png"
                        alt="Quran Pulse Logo"
                        className="w-full h-full object-cover scale-150 relative z-10"
                    />
                </motion.div>

                {/* Text Reveal */}
                <div className="text-center overflow-hidden">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-3xl font-black text-white font-heading tracking-tight mb-2"
                    >
                        QURAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PULSE</span>
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                        className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mb-3"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="text-xs text-blue-200 uppercase tracking-[0.3em] font-medium"
                    >
                        Sistem Operasi Rohani
                    </motion.p>
                </div>
            </motion.div>

            {/* 🌊 SVG Wave Pulse (Code-based "Real Snake") */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-24 flex items-center justify-center">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    {/* Definition of the Heartbeat Path */}
                    {/* Move -> Flat -> Bump -> Flat -> Big Spike Up -> Big Spike Down -> Flat -> Move */}
                    <defs>
                        <linearGradient id="traceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(6,182,212,0)" />
                            <stop offset="50%" stopColor="rgba(6,182,212,1)" />
                            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                        </linearGradient>
                    </defs>

                    {/* The Path Data: M=Start, L=Line, C=Curve (optional but L is sharper for ECG) */}
                    {/* Path: 0,50 -> 40,50 (Flat) -> 55,40 (Bump Up) -> 70,60 (Bump Down) -> 85,50 (Flat) -> 120,50 (Flat) -> 135,10 (Spike Top) -> 150,90 (Spike Bottom) -> 165,50 (Flat) -> 300,50 (End) */}
                    {/* Optimized "Lub-Dub" Shape */}
                    <path
                        id="heartbeatPath"
                        d="M 0,50 L 50,50 L 60,40 L 70,60 L 80,50 L 130,50 L 140,10 L 155,90 L 170,50 L 300,50"
                        fill="none"
                        stroke="url(#traceGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-20"
                    />

                    {/* The "Snake Line" - Animate stroke-dashoffset to draw it */}
                    <motion.path
                        d="M 0,50 L 50,50 L 60,40 L 70,60 L 80,50 L 130,50 L 140,10 L 155,90 L 170,50 L 300,50"
                        fill="none"
                        stroke="#22d3ee" // Cyan-400
                        strokeWidth="6" // Bold line
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 5, // Slower speed
                            ease: "linear",
                            repeat: Infinity
                        }}
                        className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SplashScreen;
