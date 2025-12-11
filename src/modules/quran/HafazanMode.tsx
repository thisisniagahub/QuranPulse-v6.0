import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse } from '../../types';

interface HafazanModeProps {
  verse: QuranVerse;
  fontSize: number;
  onComplete?: () => void;
}

const HafazanMode: React.FC<HafazanModeProps> = ({ verse, fontSize, onComplete }) => {
  const [revealLevel, setRevealLevel] = useState(0); // 0 = hidden, 1 = first word, 2 = half, 3 = full
  const [attempts, setAttempts] = useState(0);
  
  const words = verse.text_uthmani.split(' ');
  const totalWords = words.length;
  
  // Calculate how many words to show based on reveal level
  const getVisibleWords = () => {
    switch (revealLevel) {
      case 0: return 0;
      case 1: return Math.ceil(totalWords * 0.25); // 25%
      case 2: return Math.ceil(totalWords * 0.5);  // 50%
      case 3: return Math.ceil(totalWords * 0.75); // 75%
      case 4: return totalWords; // 100%
      default: return 0;
    }
  };
  
  const visibleCount = getVisibleWords();
  
  const handleReveal = () => {
    if (revealLevel < 4) {
      setRevealLevel(prev => prev + 1);
      setAttempts(prev => prev + 1);
    }
  };
  
  const handleReset = () => {
    setRevealLevel(0);
    setAttempts(0);
  };
  
  const handleComplete = () => {
    if (onComplete) onComplete();
    handleReset();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/98 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Mod Hafazan</p>
          <h3 className="text-white font-bold">Surah {verse.verse_key}</h3>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-sm font-bold hover:bg-slate-700 transition-all"
        >
          Tutup
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          {/* Arabic Text with Reveal Effect */}
          <div 
            className="font-uthmani text-white leading-[2.5] mb-8"
            style={{ fontSize: `${fontSize + 8}px` }}
            dir="rtl"
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: index < visibleCount ? 1 : 0.1,
                  filter: index < visibleCount ? 'blur(0px)' : 'blur(8px)'
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="mx-1"
              >
                {word}
              </motion.span>
            ))}
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full transition-all ${
                  revealLevel >= level ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{visibleCount}</p>
              <p className="text-slate-500 text-xs">/ {totalWords} perkataan</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{attempts}</p>
              <p className="text-slate-500 text-xs">Cubaan</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            {revealLevel < 4 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReveal}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30"
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Dedahkan Sedikit
                </span>
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/30"
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Selesai! +10 XP
                </span>
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-400 font-bold hover:bg-slate-700 transition-all"
            >
              Ulang
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="p-4 text-center border-t border-slate-800">
        <p className="text-slate-500 text-xs">
          💡 Cuba hafal tanpa melihat, kemudian tekan "Dedahkan" untuk semak
        </p>
      </div>
    </div>
  );
};

export default HafazanMode;
