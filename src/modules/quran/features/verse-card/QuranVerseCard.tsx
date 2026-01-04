import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse, QuranWord } from '../../../../types';
import VerseActionMenu from './VerseActionMenu';
import TajwidDisplay, { detectTajwidRules } from '../../components/TajwidDisplay';
import { formatTransliteration, formatTransliterationJAKIM, getDualTransliteration } from '../../../../utils/transliterationConverter';
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

const QuranVerseCard: React.FC<QuranVerseCardProps> = ({
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

  const arabicWords = verse.words?.filter(w => w.char_type_name !== 'end').map(w => w.text_uthmani) || [];
  const fullVerseArabic = arabicWords.join(' ');
  const dualTranslit = getDualTransliteration(fullVerseArabic);

  const handleRumiTTS = () => {
    if (isTTSPlaying) stopRumi();
    else speakRumi(dualTranslit.jakim);
  };

  const handleCopy = async (v: QuranVerse) => {
    const text = `${v.text_uthmani}\n\n\