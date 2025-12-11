import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

interface QuranAudioPlayerProps {
  chapterName?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

const QuranAudioPlayer: React.FC<QuranAudioPlayerProps> = ({ 
  chapterName,
  onNext,
  onPrevious 
}) => {
  const {
    isPlaying,
    currentTrack,
    progress,
    currentTime,
    duration,
    playbackSpeed,
    pauseTrack,
    resumeTrack,
    stopTrack,
    seekTo,
    setSpeed,
  } = useAudioPlayer();

  // Auto-hide logic - collapse when paused for a while
  const [isExpanded, setIsExpanded] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-collapse after 5 seconds of pause
  useEffect(() => {
    if (hideTimeout) clearTimeout(hideTimeout);
    
    if (!isPlaying && currentTrack) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      setHideTimeout(timeout);
    } else if (isPlaying) {
      setIsExpanded(true);
    }

    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seekTo(percentage * duration);
  };

  return (
    <AnimatePresence>
      {/* Collapsed Mini Player - Click to Expand */}
      {!isExpanded ? (
        <motion.div
          key="mini"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 right-4 z-40"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg shadow-cyan-500/40 border-2 border-cyan-400 relative"
          >
            {/* Pulse ring when paused */}
            <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-30" />
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative z-10">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            
            {/* Progress indicator ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      ) : (
        /* Full Player - Expanded */
        <motion.div
          key="full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-40 max-w-[460px] mx-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden">
            {/* Close/Minimize Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all z-10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>

            {/* Progress Bar */}
            <div 
              className="h-1.5 bg-slate-800 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Glow effect on progress head */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50" />
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {currentTrack.title}
                </p>
                <p className="text-cyan-400 text-xs">
                  {currentTrack.subtitle} • {formatTime(currentTime)} / {formatTime(duration || 0)}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                {/* Speed */}
                <button
                  onClick={() => setSpeed(playbackSpeed === 1 ? 0.75 : playbackSpeed === 0.75 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
                  className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                  title="Kelajuan"
                >
                  {playbackSpeed}x
                </button>

                {/* Previous */}
                {onPrevious && (
                  <button
                    onClick={onPrevious}
                    aria-label="Ayat Sebelum"
                    className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <polygon points="19,20 9,12 19,4"/>
                      <rect x="5" y="4" width="2" height="16"/>
                    </svg>
                  </button>
                )}

                {/* Play/Pause */}
                <button
                  onClick={isPlaying ? pauseTrack : resumeTrack}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-12 h-12 rounded-xl bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/30 border border-cyan-400"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    {isPlaying ? (
                      <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>
                    ) : (
                      <polygon points="5,3 19,12 5,21"/>
                    )}
                  </svg>
                </button>

                {/* Next */}
                {onNext && (
                  <button
                    onClick={onNext}
                    aria-label="Ayat Seterusnya"
                    className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <polygon points="5,4 15,12 5,20"/>
                      <rect x="17" y="4" width="2" height="16"/>
                    </svg>
                  </button>
                )}

                {/* Stop */}
                <button
                  onClick={stopTrack}
                  aria-label="Berhenti"
                  className="w-9 h-9 rounded-lg bg-slate-800 text-red-400 flex items-center justify-center hover:bg-red-500/20 hover:text-red-300 transition-colors border border-slate-700"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <rect x="6" y="6" width="12" height="12" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuranAudioPlayer;
