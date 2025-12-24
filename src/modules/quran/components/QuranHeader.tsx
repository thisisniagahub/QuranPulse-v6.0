import React from 'react';
import { QuranChapter } from '../../../types';
import { IconBack, IconAudio, IconSettings, IconSpinner } from '../../../components/Icons';

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
  onToggleLayoutMode
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

        {/* Right: Controls (Uniform Glass Style) */}
        <div className="flex items-center gap-1">
          {/* 1. Go to Verse */}
          {onGoToVerse && (
            <button
              onClick={onGoToVerse}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Cari Ayat"
            >
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </button>
          )}

          {/* 2. Reading Mode (Translation/Reading Toggle) */}
          {onToggleReadingMode && (
            <button
              onClick={onToggleReadingMode}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${readingMode ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              title={readingMode ? "Mod Terjemahan" : "Mod Bacaan"}
            >
              <i className={`fa-solid ${readingMode ? 'fa-book-open' : 'fa-language'} text-sm`}></i>
            </button>
          )}

          {/* 3. Layout Mode (Mushaf/Scroll) */}
          {onToggleLayoutMode && (
            <button
              onClick={onToggleLayoutMode}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${layoutMode === 'PAGE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              title={layoutMode === 'SCROLL' ? "Tukar ke Mushaf" : "Tukar ke Skrol"}
            >
              <i className={`fa-solid ${layoutMode === 'PAGE' ? 'fa-scroll' : 'fa-book-quran'} text-sm`}></i>
            </button>
          )}

          {/* 4. Audio Settings */}
          <button
            onClick={onOpenAudioSettings}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
            title="Pilih Qari"
          >
            <i className="fa-solid fa-microphone-lines text-sm"></i>
          </button>

          {/* 5. Main Settings (Aa) */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Tetapan Paparan"
          >
            <span className="font-serif font-bold text-lg">Aa</span>
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

