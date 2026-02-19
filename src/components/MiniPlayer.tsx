import React, { useRef, useEffect } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

const MiniPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    pauseTrack, 
    resumeTrack, 
    progress, 
    duration, 
    currentTime, 
    seekTo,
    sleepTimer
  } = useAudioPlayer();

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  if (!currentTrack) return null;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-slate-900/95 border border-gold-500/20 p-3 rounded-2xl shadow-2xl z-[100] backdrop-blur-md"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 rounded-t-2xl overflow-hidden group cursor-pointer">
           <div 
             ref={progressRef}
             className="h-full bg-gold-500 transition-all duration-100 ease-linear" 
           />
           <input 
             type="range" 
             min="0" 
             max={duration || 100} 
             value={currentTime} 
             onChange={(e) => seekTo(Number(e.target.value))}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             aria-label="Seek"
           />
        </div>

        <div className="flex items-center gap-3 mt-2">
          {/* Play/Pause Button */}
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
          </button>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
            <p className="text-xs text-slate-400 truncate">{currentTrack.subtitle || "QuranPulse Audio"}</p>
          </div>

          {/* Sleep Timer Indicator */}
          {sleepTimer && (
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full">
              <i className="fa-solid fa-moon text-gold-500 text-[10px]"></i>
              <span className="text-[10px] text-gold-500 font-bold">{sleepTimer}m</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;
