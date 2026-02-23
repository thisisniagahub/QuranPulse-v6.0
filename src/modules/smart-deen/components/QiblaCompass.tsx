import React from 'react';
import { Compass, Target } from 'lucide-react';

interface QiblaCompassProps {
  qiblaDirection: number; // Angle from North (0) clockwise
}

const QiblaCompass: React.FC<QiblaCompassProps> = ({ qiblaDirection }) => {
  return (
    <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
      {/* Compass Outer Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-raudhah-teal/10 bg-white/80 backdrop-blur-md shadow-xl glass-v7"></div>

      {/* Subtle Inner Ring */}
      <div className="absolute inset-4 rounded-full border border-raudhah-teal/5 bg-transparent"></div>

      {/* Cardinal Directions */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-raudhah-teal/30 uppercase tracking-widest">N</div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-raudhah-teal/30 uppercase tracking-widest">S</div>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-raudhah-teal/30 uppercase tracking-widest">W</div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-raudhah-teal/30 uppercase tracking-widest">E</div>

      {/* Kaaba Icon / Qibla Indicator (Rotates) */}
      <div
        className="absolute w-full h-full transition-transform duration-1000 ease-out flex items-center justify-center"
        style={{ transform: `rotate(${qiblaDirection}deg)` }}
      >
        {/* The Needle Container */}
        <div className="relative w-1.5 h-full flex flex-col items-center">
          {/* Arrow Head pointing to Qibla */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] border-b-raudhah-gold filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>

          {/* Glow Line */}
          <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-raudhah-gold via-raudhah-gold/20 to-transparent"></div>

          {/* Pointer circle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-raudhah-gold shadow-sm"></div>
        </div>
      </div>

      {/* Center Hub */}
      <div className="absolute w-14 h-14 bg-white rounded-2xl border-2 border-raudhah-gold flex items-center justify-center z-10 shadow-lg active:scale-95 transition-all">
        <Compass className="w-7 h-7 text-raudhah-gold animate-pulse" />
      </div>

      {/* Degree Display */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-5 py-2 rounded-2xl border-2 border-raudhah-teal/10 shadow-lg flex items-center gap-2 group hover:border-raudhah-gold transition-all">
        <Target size={14} className="text-raudhah-gold" />
        <span className="text-raudhah-ink font-black tracking-widest">{Math.round(qiblaDirection)}°</span>
      </div>
    </div>
  );
};

export default QiblaCompass;
