import React from 'react';
import { motion } from 'framer-motion';

const PulseCore: React.FC = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* 1. Base Glow (Breathing) */}
      <motion.div 
        className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. Orbital Rings (Rotating) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer Ring - Cyan */}
        <motion.div 
          className="absolute w-56 h-56 border border-cyan-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
        </motion.div>

        {/* Inner Ring - Amber (Counter-rotating) */}
        <motion.div 
          className="absolute w-40 h-40 border border-amber-500/30 rounded-full border-dashed"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 3. The Core Geometry (Cube) */}
      <div className="relative z-10 w-24 h-24 preserve-3d animate-[float_6s_ease-in-out_infinite]">
         {/* We can use a stylized SVG or CSS Cube. Let's use a nice hexagonal shield look for "Faith Shield" */}
         <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
             <defs>
                 <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#22d3ee" />
                     <stop offset="100%" stopColor="#3b82f6" />
                 </linearGradient>
             </defs>
             {/* Hexagon */}
             <motion.path 
                d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" 
                fill="none" 
                stroke="url(#coreGrad)" 
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
             />
             
             {/* Inner Pulse Icon (Heart/Faith) */}
             <motion.path
                d="M50 30 C 50 30 30 30 30 50 C 30 70 50 85 50 85 C 50 85 70 70 70 50 C 70 30 50 30 50 30"
                fill="url(#coreGrad)"
                opacity="0.5"
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
             />
         </svg>
         
         {/* Particles */}
         <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{ y: [-20, -40], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
             />
             <motion.div 
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                animate={{ y: [-20, -35], x: [10, 20], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
             />
              <motion.div 
                className="absolute w-1 h-1 bg-amber-400 rounded-full"
                animate={{ y: [-20, -35], x: [-10, -20], opacity: [1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }}
             />
         </div>
      </div>
      
      {/* 4. Stats Labels (Floating) */}
      <div className="absolute top-0 w-full flex justify-between px-2 text-[10px] uppercase font-bold tracking-widest text-cyan-500/50">
          <span>Faith</span>
          <span>Shield</span>
      </div>
    </div>
  );
};

export default PulseCore;
