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
  const verseNumber = verse.verse_key.split(':')[1];
  const arabicVerseNumber = toArabicNumerals(verseNumber);

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
      className={`verse-card relative p-6 rounded-2xl transition-all duration-300 ${activeWord
        ? 'bg-raudhah-teal/5 border-raudhah-teal/20 shadow-warm'
        : 'hover:bg-raudhah-teal/5 border-transparent hover:border-raudhah-teal/10'
        } border`}
    >
      {/* Header: Verse Number & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-raudhah-teal/5 flex items-center justify-center font-uthmanic text-xl text-raudhah-teal border border-raudhah-teal/10">
            {arabicVerseNumber}
          </div>
          <span className="text-[10px] font-bold text-raudhah-teal/40 uppercase tracking-widest">{chapterName} : {verseNumber}</span>
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
          className="text-right leading-[2.5] font-uthmanic text-raudhah-ink"
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
          <div className="text-sm font-medium text-raudhah-teal/80 leading-relaxed font-inter flex items-center justify-between gap-4">
            <span>{translitMode === 'jakim' ? dualTranslit.jakim : dualTranslit.academic}</span>
            {isTTSSupported && (
              <button
                onClick={handleRumiTTS}
                className={`flex-shrink-0 inline-flex items-center justify-center p-1.5 rounded-full bg-raudhah-teal/10 hover:bg-raudhah-teal/20 transition-colors ${isTTSPlaying ? 'text-raudhah-teal animate-pulse' : 'text-raudhah-teal/40'}`}
                title="Play Rumi Audio"
              >
                <span className="text-[10px]">🔊</span>
              </button>
            )}
          </div>
        )}

        {/* Translation */}
        {showTranslation && (
          <p className="text-base text-raudhah-ink/70 leading-relaxed font-outfit">
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
