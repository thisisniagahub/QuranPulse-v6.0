import React from 'react';
import { QuranChapter } from '../../types';
import { IconBack, IconAudio, IconSettings, IconSpinner } from '../../components/Icons';

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
}) => {
  return (
    <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            aria-label="Kembali ke Senarai Surah" 
            className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-slate-700"
          >
            <IconBack className="w-5 h-5" />
          </button>
          {chapter && (
            <button 
              onClick={onOpenSurahInfo}
              className="text-left hover:bg-slate-800/50 rounded-lg px-2 py-1 -ml-2 transition-all"
            >
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                {chapter.name_simple}
                <span className="text-cyan-400 text-xs">ⓘ</span>
              </h2>
              <p className="text-xs text-slate-400">{chapter.verses_count} Ayat • {chapter.revelation_place}</p>
            </button>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex gap-2">
          {/* Audio Loading Indicator */}
          {isAudioLoading && (
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <IconSpinner className="w-5 h-5 text-amber-400" />
            </div>
          )}
          
          {/* Reading Mode Toggle */}
          {onToggleReadingMode && (
            <button 
              onClick={onToggleReadingMode} 
              aria-label={readingMode ? "Mod Terjemahan" : "Mod Bacaan"}
              title={readingMode ? "Mod Terjemahan" : "Mod Bacaan"}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border shadow-sm ${
                readingMode 
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </button>
          )}

          {/* Go to Verse */}
          {onGoToVerse && (
            <button 
              onClick={onGoToVerse} 
              aria-label="Pergi ke Ayat"
              title="Pergi ke Ayat"
              className="w-10 h-10 rounded-xl bg-slate-800/80 text-emerald-400 flex items-center justify-center hover:bg-slate-700 hover:text-emerald-300 transition-all border border-slate-700 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          )}
          
          {/* Audio Settings (Pilih Qari) */}
          <button 
            onClick={onOpenAudioSettings} 
            aria-label="Pilih Qari" 
            title="Pilih Qari"
            className="w-10 h-10 rounded-xl bg-slate-800/80 text-amber-400 flex items-center justify-center hover:bg-slate-700 hover:text-amber-300 transition-all border border-slate-700 shadow-sm"
          >
            <IconAudio className="w-5 h-5" />
          </button>
          
          {/* View Settings (Tetapan Paparan) */}
          <button 
            onClick={onOpenSettings} 
            aria-label="Tetapan Paparan" 
            title="Tetapan Paparan"
            className="w-10 h-10 rounded-xl bg-slate-800/80 text-cyan-400 flex items-center justify-center hover:bg-slate-700 hover:text-cyan-300 transition-all border border-slate-700 shadow-sm"
          >
            <IconSettings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Audio Loading Bar */}
      {isAudioLoading && (
        <div className="h-1 bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 animate-pulse w-full"></div>
        </div>
      )}
    </div>
  );
};

export default QuranHeader;

