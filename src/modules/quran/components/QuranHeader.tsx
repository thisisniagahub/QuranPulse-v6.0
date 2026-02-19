import React from 'react';
import { QuranChapter } from '../../../types';
import { IconBack, IconAudio, IconSettings, IconSpinner } from '../../../components/Icons';
import { motion } from 'framer-motion';

interface QuranHeaderProps {
  chapter?: QuranChapter;
  onBack: () => void;
  onOpenAudioSettings: () => void;
  onOpenSettings: () => void;
  onOpenSurahInfo?: () => void;
  onGoToVerse?: () => void;
  readingMode?: boolean;
  onToggleReadingMode?: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  showTransliteration: boolean;
  onToggleTransliteration: () => void;
  selectedTranslationId: number;
  onTranslationChange: (id: number) => void;
  isAudioLoading?: boolean;
  layoutMode?: 'SCROLL' | 'PAGE';
  onToggleLayoutMode?: () => void;
  isZenMode?: boolean; // New Prop
}

const QuranHeader: React.FC<QuranHeaderProps> = ({
  chapter,
  onBack,
  onOpenAudioSettings,
  onOpenSettings,
  onOpenSurahInfo,
  onGoToVerse,
  readingMode = false,
  onToggleReadingMode,
  showTranslation,
  onToggleTranslation,
  showTransliteration,
  onToggleTransliteration,
  selectedTranslationId,
  onTranslationChange,
  isAudioLoading = false,
  layoutMode = 'SCROLL',
  onToggleLayoutMode,
  isZenMode = false
}) => {
  return (
    <div className={`sticky top-0 z-[60] transition-all duration-700 ${isZenMode
      ? 'bg-transparent border-none'
      : 'bg-slate-950/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5'
      }`}>
      <div className={`px-4 py-4 flex justify-between items-center ${isZenMode ? 'max-w-4xl mx-auto' : ''}`}>
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Kembali"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isZenMode
              ? 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              : 'bg-slate-800/80 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700'
              }`}
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
        </div>

        {/* Center: Title (Only in Zen) */}
        {isZenMode && chapter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >
            <h2 className="text-white font-black text-xl tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Surah {chapter.name_simple}
            </h2>
            <div className="flex items-center justify-center gap-2 -mt-1 opacity-40">
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Fokus Bacaan</span>
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
            </div>
          </motion.div>
        )}

        {/* Right: Controls (Simplified in Zen) */}
        {!isZenMode ? (
          <div className="flex items-center gap-1">
            {/* 1. Go to Verse */}
            {onGoToVerse && (
              <button onClick={onGoToVerse} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </button>
            )}
            {/* 2. Reading Mode */}
            {onToggleReadingMode && (
              <button onClick={onToggleReadingMode} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${readingMode ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <i className={`fa-solid ${readingMode ? 'fa-book-open' : 'fa-language'} text-sm`}></i>
              </button>
            )}
            {/* 3. Layout Mode */}
            {onToggleLayoutMode && (
              <button onClick={onToggleLayoutMode} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${layoutMode === 'PAGE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <i className={`fa-solid ${layoutMode === 'PAGE' ? 'fa-scroll' : 'fa-book-quran'} text-sm`}></i>
              </button>
            )}
            {/* 4. Audio Settings */}
            <button onClick={onOpenAudioSettings} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
              <i className="fa-solid fa-microphone-lines text-sm"></i>
            </button>
            {/* 5. Main Settings */}
            <button onClick={onOpenSettings} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="font-serif font-bold text-lg">Aa</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 tracking-tighter">[cipt: {chapter?.id}]</span>
          </div>
        )}
      </div>

      {/* Audio Loading Bar */}
      {isAudioLoading && (
        <div className="h-0.5 bg-slate-800 overflow-hidden">
          <div className="h-full bg-cyan-500 animate-pulse w-full shadow-[0_0_10px_#22d3ee]"></div>
        </div>
      )}
    </div>
  );
};

export default QuranHeader;

