import React, { memo, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse, QuranWord } from '../../../../types';
import VerseActionMenu from './VerseActionMenu';
import TajwidDisplay from '../../components/TajwidDisplay';
import { getDualTransliteration } from '../../../../utils/transliterationConverter';
import { useRumiTTS } from '../../../../utils/rumiTTS';
import { BookmarkButton } from '../../../../components/BookmarkButton';

interface QuranVerseCardProps {
  verse: QuranVerse;
  chapterName: string;
  fontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  showTajwid?: boolean;
  isPlaying: boolean;
  isAudioLoading: boolean;
  activeWord: QuranWord | null;
  highlightedWordIndex: number | null;
  isBookmarked?: boolean;
  hasNote?: boolean;
  isZenMode?: boolean;
  onPlay: () => void;
  onWordClick: (word: QuranWord, event?: React.MouseEvent) => void;
  onOpenStudio: () => void;
  onTafsir?: () => void;
  onNotes?: () => void;
  onAddToCollection?: () => void;
  onBookmark?: (verse: QuranVerse) => void;
  onShare?: (verse: QuranVerse) => void;
  onHafazan?: (verse: QuranVerse) => void;
  verseRef: (el: HTMLDivElement | null) => void;
}

const toArabicNumerals = (n: string) => {
  return n.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

const QuranVerseCardComponent: React.FC<QuranVerseCardProps> = ({
  verse,
  chapterName,
  fontSize,
  showTranslation,
  showTransliteration,
  showWordByWord,
  showTajwid = false,
  isPlaying,
  isAudioLoading,
  activeWord,
  highlightedWordIndex,
  isBookmarked = false,
  hasNote = false,
  isZenMode = false,
  onPlay,
  onWordClick,
  onOpenStudio,
  onTafsir,
  onNotes,
  onAddToCollection,
  onBookmark,
  onShare,
  onHafazan,
  verseRef,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [translitMode] = useState<'academic' | 'jakim'>('jakim');
  const verseNumber = useMemo(() => verse.verse_key.split(':')[1], [verse.verse_key]);
  const arabicVerseNumber = useMemo(() => toArabicNumerals(verseNumber), [verseNumber]);

  const { isPlaying: isTTSPlaying, speak: speakRumi, stop: stopRumi, isSupported: isTTSSupported } = useRumiTTS();

  const fullVerseArabic = useMemo(() => {
    const arabicWords = verse.words?.filter(w => w.char_type_name !== 'end').map(w => w.text_uthmani) || [];
    return arabicWords.join(' ');
  }, [verse.words]);
  const dualTranslit = useMemo(() => getDualTransliteration(fullVerseArabic), [fullVerseArabic]);

  const handleRumiTTS = useCallback(() => {
    if (isTTSPlaying) stopRumi();
    else speakRumi(dualTranslit.jakim);
  }, [dualTranslit.jakim, isTTSPlaying, speakRumi, stopRumi]);

  const handleCopy = useCallback(async (v: QuranVerse) => {
    const text = `${v.text_uthmani}\n\n${v.translations?.[0]?.text || ''}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  }, []);

  return (
    <motion.div
      ref={verseRef}
      layout={false}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-2xl transition-all duration-300 ${activeWord
        ? 'bg-cyan-900/10 border-cyan-500/20 shadow-lg shadow-cyan-500/5'
        : 'hover:bg-slate-800/30 border-transparent hover:border-slate-700/50'
        } border`}
    >
      {/* Header: Verse Number & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center font-uthmanic text-xl text-cyan-400 border border-slate-700">
            {arabicVerseNumber}
          </div>
          <span className="text-xs font-medium text-slate-500">{chapterName} : {verseNumber}</span>
        </div>

        <VerseActionMenu
          verse={verse}
          isBookmarked={isBookmarked}
          onBookmark={() => onBookmark?.(verse)}
          onShare={() => onShare?.(verse)}
          onCopy={() => handleCopy(verse)}
          onTafsir={onTafsir}
          onPlay={onPlay}
          isPlaying={isPlaying}
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          onHafazan={() => onHafazan?.(verse)}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Arabic Text */}
        <div
          className="text-right leading-[2.5] font-uthmanic text-slate-100"
          style={{ fontSize: `${fontSize}px` }}
        >
          {showTajwid && verse.words ? (
            <TajwidDisplay words={verse.words} onWordClick={onWordClick} activeWord={activeWord} />
          ) : (
            <p>{verse.text_uthmani}</p>
          )}
        </div>

        {/* Transliteration */}
        {showTransliteration && (
          <div className="text-sm font-medium text-cyan-400/80 leading-relaxed font-inter flex items-center justify-between gap-4">
            <span>{translitMode === 'jakim' ? dualTranslit.jakim : dualTranslit.academic}</span>
            {isTTSSupported && (
              <button
                onClick={handleRumiTTS}
                className={`flex-shrink-0 inline-flex items-center justify-center p-1.5 rounded-full bg-slate-800 hover:bg-cyan-500/20 transition-colors ${isTTSPlaying ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`}
                title="Play Rumi Audio"
              >
                <span className="text-[10px]">🔊</span>
              </button>
            )}
          </div>
        )}

        {/* Translation */}
        {showTranslation && (
          <p className="text-base text-slate-300 leading-relaxed font-outfit">
            {verse.translations?.[0]?.text}
          </p>
        )}
      </div>

    </motion.div>
  );
};

const areEqual = (prev: QuranVerseCardProps, next: QuranVerseCardProps) => (
  prev.verse.verse_key === next.verse.verse_key &&
  prev.fontSize === next.fontSize &&
  prev.showTranslation === next.showTranslation &&
  prev.showTransliteration === next.showTransliteration &&
  prev.showWordByWord === next.showWordByWord &&
  prev.showTajwid === next.showTajwid &&
  prev.isPlaying === next.isPlaying &&
  prev.isAudioLoading === next.isAudioLoading &&
  prev.highlightedWordIndex === next.highlightedWordIndex &&
  prev.isBookmarked === next.isBookmarked &&
  prev.hasNote === next.hasNote &&
  prev.isZenMode === next.isZenMode &&
  prev.activeWord?.id === next.activeWord?.id
);

export default memo(QuranVerseCardComponent, areEqual);
