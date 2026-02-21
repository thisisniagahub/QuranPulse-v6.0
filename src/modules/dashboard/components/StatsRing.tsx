import React from 'react';

interface StatsRingProps {
  recitationProgress: number;
  memorizationProgress: number;
}

const StatsRing: React.FC<StatsRingProps> = ({ recitationProgress, memorizationProgress }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const recitationOffset = circumference - (recitationProgress / 100) * circumference;
  const memorizationOffset = circumference - (memorizationProgress / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-raudhah-teal/10 blur-3xl rounded-full"></div>

      {/* SVG Rings */}
      <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
        {/* Background Ring */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#1e293b"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Recitation Ring (Orange/Gold) */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#f59e0b"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={recitationOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Memorization Ring (Inner, Cyan) */}
        <circle
          cx="50%"
          cy="50%"
          r={radius - 12}
          stroke="#06b6d4"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={2 * Math.PI * (radius - 12)}
          strokeDashoffset={2 * Math.PI * (radius - 12) - (memorizationProgress / 100) * (2 * Math.PI * (radius - 12))}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out opacity-80"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Daily Recitation</span>
          <span className="text-2xl font-bold text-white drop-shadow-md">{recitationProgress}%</span>
        </div>
        <div className="w-12 h-[1px] bg-slate-700 my-1 mx-auto"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Memorization</span>
          <span className="text-lg font-bold text-raudhah-teal drop-shadow-md">{memorizationProgress}%</span>
        </div>
      </div>
      
      {/* Decorative Particles */}
      <div className="absolute top-0 right-0 w-2 h-2 bg-raudhah-teal rounded-full animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-gold-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default StatsRing;
