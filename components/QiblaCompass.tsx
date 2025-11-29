import React from 'react';
import { Compass } from 'lucide-react';

interface QiblaCompassProps {
  qiblaDirection: number; // Angle from North (0) clockwise
}

const QiblaCompass: React.FC<QiblaCompassProps> = ({ qiblaDirection }) => {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      {/* Compass Outer Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-xl"></div>
      
      {/* Cardinal Directions */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">N</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">S</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">W</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">E</div>

      {/* Kaaba Icon / Qibla Indicator (Rotates) */}
      <div 
        className="absolute w-full h-full transition-transform duration-1000 ease-out flex items-center justify-center"
        // eslint-disable-next-line
        style={{ transform: `rotate(${qiblaDirection}deg)` }}
      >
        {/* The Needle */}
        <div className="relative w-1 h-full">
            {/* Arrow Head pointing to Qibla */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[16px] border-b-gold-500 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div>
            
            {/* Line */}
            <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-gold-500/50 to-transparent"></div>
        </div>
      </div>

      {/* Center Hub */}
      <div className="absolute w-12 h-12 bg-slate-900 rounded-full border-2 border-slate-600 flex items-center justify-center z-10 shadow-inner">
        <Compass className="w-6 h-6 text-slate-500" />
      </div>
      
      {/* Degree Display */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
        <span className="text-gold-400 font-mono font-bold">{Math.round(qiblaDirection)}°</span>
      </div>
    </div>
  );
};

export default QiblaCompass;
