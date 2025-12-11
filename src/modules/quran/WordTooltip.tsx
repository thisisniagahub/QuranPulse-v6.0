import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranWord } from '../../types';

interface WordTooltipProps {
  word: QuranWord;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const WordTooltip: React.FC<WordTooltipProps> = ({ word, isOpen, onClose, position }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playWordAudio = () => {
    if (word.audio_url) {
      setIsPlaying(true);
      const audio = new Audio(`https://audio.qurancdn.com/${word.audio_url}`);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80]"
            onClick={onClose}
          />
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-[81] w-72 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
            style={{
              left: position ? Math.min(position.x - 144, window.innerWidth - 300) : '50%',
              top: position ? Math.min(position.y + 20, window.innerHeight - 350) : '50%',
              transform: position ? undefined : 'translate(-50%, -50%)'
            }}
          >
            {/* Minimalist Quran.com Style Popover */}
            <div className="p-4 flex flex-col items-center gap-3">
              {/* Header: Play + Word */}
              <div className="w-full flex items-center justify-between">
                 {/* Play Audio Button (Small & Round) */}
                 {word.audio_url && (
                  <button
                    onClick={playWordAudio}
                    disabled={isPlaying}
                    className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/30 transition-colors"
                  >
                    {isPlaying ? (
                      <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                )}
                
                {/* Spacer */}
                <div className="flex-1" />
              </div>

              {/* Arabic Word */}
              <p className="font-uthmani text-4xl text-white my-2 leading-relaxed drop-shadow-lg">
                {word.text_uthmani}
              </p>

              {/* Transliteration */}
              {word.transliteration?.text && (
                 <p className="text-emerald-400 font-serif italic text-lg tracking-wide">
                   {word.transliteration.text}
                 </p>
              )}

              {/* Divider */}
              <div className="w-full h-px bg-slate-700/50 my-1" />

              {/* Translation */}
              <div className="text-center">
                <p className="text-slate-300 font-medium leading-relaxed">
                  {word.translation?.text || 'Translation not available'}
                </p>
                <div className="flex gap-2 justify-center mt-2 text-[10px] text-slate-500 uppercase tracking-widest">
                   <span>{word.char_type_name}</span>
                   <span>{word.location || (word.page_number ? `Page ${word.page_number}` : '')}</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WordTooltip;
