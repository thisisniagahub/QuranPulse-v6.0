import React from 'react';
import { motion } from 'framer-motion';

export const PulseWave = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
    <svg viewBox="0 0 1440 320" className="w-full h-full absolute top-1/4 scale-150 opacity-50">
      <motion.path
        fill="none"
        stroke="url(#pulse-gradient)"
        strokeWidth="2"
        d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,90.7C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1, pathOffset: [0, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <defs>
        <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const Starfield = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full opacity-0"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.5 + 0.1
                    }}
                    animate={{
                        y: [null, Math.random() * window.innerHeight],
                        opacity: [null, Math.random() * 0.5 + 0.1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px',
                    }}
                />
            ))}
        </div>
    );
};
