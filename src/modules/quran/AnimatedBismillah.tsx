import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBismillah: React.FC = () => {
  const [start, setStart] = useState(false);

  useEffect(() => {
    // Small delay to ensure entrance animation is smooth
    const timer = setTimeout(() => setStart(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
       {/* Glow Effect */}
      <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full opacity-50"></div>
      
      <svg 
        viewBox="0 0 500 120" 
        className="w-full max-w-sm sm:max-w-md h-auto drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] z-10"
      >
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
            <stop offset="100%" stopColor="#facc15" /> {/* Amber */}
          </linearGradient>
        </defs>

        {/* Bismillah Calligraphy Path */}
        {/* Simplified path representation of Bismillah */}
        <motion.path
          d="M450,40 C440,30 430,30 420,40 C410,50 410,70 420,80 C430,90 440,90 450,80 L450,100 M380,60 C370,60 360,70 360,80 C360,90 370,100 380,100 L380,40 M320,60 C310,60 300,70 300,80 C300,90 310,100 320,100 L320,40 M250,50 C240,40 230,40 220,50 L220,100 M180,60 C170,60 160,70 160,80 C160,90 170,100 180,100 L180,40 M120,60 C110,60 100,70 100,80 C100,90 110,100 120,100 L120,40 M60,60 C50,60 40,70 40,80 C40,90 50,100 60,100 L60,40" 
          // Note: The above path is a placeholder abstract representation. For a real bismillah we need a complex path.
          // Since I cannot browse for a huge path string, I will use a high-quality font-like SVG representation or a simpler stylistic path.
          // I will use a very simplified "wave" text representation here that mimics the flow, as exact calligraphy paths are very long.
          // Better approach: Use a text element with a font and a clip-path for reveal, OR use a known simple svg.
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={start ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Actual Text Fallback (in case user prefers readable text over abstract squiggles) */}
        {/* But since user requested "dilukis" (drawn), we ideally want the path. */}
        {/* Let's try to simulate the "drawing" of the actual Arabic text using a mask on a standard text element if we can't get the path. */}
        {/* However, standard SVG text stroke animation works well for "drawing" effect too. */}
        
        <motion.text
            x="50%"
            y="65%"
            textAnchor="middle"
            fontSize="60"
            fontFamily="Amiri, serif"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="1.5"
            strokeDasharray="500"
            strokeDashoffset="500"
            animate={start ? { strokeDashoffset: 0 } : {}}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="font-arabic"
        >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </motion.text>
        
        {/* Fill animation comes after stroke */}
        <motion.text
             x="50%"
             y="65%"
             textAnchor="middle"
             fontSize="60"
             fontFamily="Amiri, serif"
             fill="url(#neonGradient)"
             opacity="0"
             animate={start ? { opacity: 0.8 } : {}}
             transition={{ delay: 2.5, duration: 1 }}
             className="font-arabic blur-[1px]"
        >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </motion.text>
      </svg>
    </div>
  );
};

export default AnimatedBismillah;
