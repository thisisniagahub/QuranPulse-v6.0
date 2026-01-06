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
        <div className="fixed inset-0 z-[9999] bg-midnight-gradient flex items-center justify-center overflow-hidden">
            {/* 🌌 Background Atmosphere */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                {/* Starfield Overlay - Subtle sparkle */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-110 contrast-125 mix-blend-multiply"></div>
            </div>

            {/* 🧬 Animated Orbits (Premium Liquid Feel) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[300, 450, 600].map((size, i) => (
                    <motion.div
                        key={size}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: [0.5, 1, 1.2],
                            opacity: [0, 0.4 - (i * 0.1), 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 4 + i,
                            ease: "easeInOut",
                            repeat: Infinity,
                            delay: i * 0.4
                        }}
                        style={{ width: size, height: size }}
                        className="absolute border border-cyan-400/10 rounded-full"
                    />
                ))}
            </div>

            {/* 🕌 Central Logo Container */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Logo Image with Liquid Glow */}
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-40 h-40 mb-8 relative flex items-center justify-center"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cyan-400/20 blur-[40px] rounded-full"
                    />
                    <img
                        src="/logo-primary.png"
                        alt="Quran Pulse Logo"
                        className="w-full h-full object-cover scale-150 relative z-10 drop-shadow-[0_10px_30px_rgba(6,182,212,0.4)]"
                    />
                </motion.div>

                {/* Main Brand with Elegant Reveal */}
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-4xl font-[Poppins] font-[900] text-white tracking-tight"
                    >
                        QURAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PULSE</span>
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 1, ease: "circOut" }}
                        className="h-1.5 w-48 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-4 rounded-full"
                    />
                </div>
            </motion.div>

            {/* 🌊 SVG Wave Pulse (Refined Snake) */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-32 opacity-60">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <motion.path
                        d="M 0,50 L 50,50 L 60,40 L 70,60 L 80,50 L 130,50 L 140,10 L 155,90 L 170,50 L 300,50"
                        fill="none"
                        stroke="#0891b2"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity
                        }}
                        className="filter drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SplashScreen;
