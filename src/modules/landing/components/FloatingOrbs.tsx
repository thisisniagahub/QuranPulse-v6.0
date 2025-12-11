import React from 'react';
import { motion } from 'framer-motion';

export const FloatingOrbs = () => {
  const orbs = [
    { color: 'from-cyan-500/30 to-cyan-400/10', size: 'w-96 h-96', position: 'top-[-10%] left-[-5%]', duration: 20 },
    { color: 'from-purple-500/25 to-purple-400/5', size: 'w-80 h-80', position: 'top-[20%] right-[-10%]', duration: 25 },
    { color: 'from-amber-500/20 to-amber-400/5', size: 'w-72 h-72', position: 'bottom-[10%] left-[10%]', duration: 22 },
    { color: 'from-cyan-400/20 to-blue-500/10', size: 'w-64 h-64', position: 'bottom-[-5%] right-[20%]', duration: 18 },
    { color: 'from-pink-500/15 to-purple-500/5', size: 'w-56 h-56', position: 'top-[50%] left-[30%]', duration: 28 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} ${orb.position} rounded-full bg-gradient-radial ${orb.color} blur-3xl`}
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -40, 20, -30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Extra glow layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl animate-pulse-slow" />
    </div>
  );
};

export default FloatingOrbs;
