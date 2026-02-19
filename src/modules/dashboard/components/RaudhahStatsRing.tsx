import React from 'react';

interface RaudhahStatsRingProps {
  recitationProgress: number;
  memorizationProgress: number;
}

const RaudhahStatsRing: React.FC<RaudhahStatsRingProps> = ({ recitationProgress, memorizationProgress }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const recitationOffset = circumference - (recitationProgress / 100) * circumference;
  const memorizationOffset = circumference - (memorizationProgress / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-raudhah-teal/5 blur-3xl rounded-full"></div>

      {/* SVG Rings */}
      <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(27,107,90,0.2)]">
        {/* Background Ring */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="var(--surface-raudhah)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Recitation Ring (Raudhah Gold) */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="var(--accent-raudhah)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={recitationOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Memorization Ring (Inner, Raudhah Teal) */}
        <circle
          cx="50%"
          cy="50%"
          r={radius - 12}
          stroke="var(--primary-raudhah)"
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
          <span className="text-[10px] text-raudhah-ink/40 uppercase tracking-wider font-bold">Lesehan Harian</span>
          <span className="text-2xl font-bold text-raudhah-teal drop-shadow-sm">{recitationProgress}%</span>
        </div>
        <div className="w-12 h-[1px] bg-raudhah-teal/10 my-1 mx-auto"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-raudhah-ink/40 uppercase tracking-wider font-bold">Hafazan</span>
          <span className="text-lg font-bold text-raudhah-gold drop-shadow-sm">{memorizationProgress}%</span>
        </div>
      </div>

      {/* Decorative Particles */}
      <div className="absolute top-0 right-0 w-2 h-2 bg-raudhah-teal/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-raudhah-gold/40 rounded-full animate-pulse"></div>
    </div>
  );
};

export default RaudhahStatsRing;
