import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse, QuranWord } from '../../../../types';
import VerseActionMenu from './VerseActionMenu';
import TajwidDisplay, { detectTajwidRules } from '../../components/TajwidDisplay';
import { formatTransliteration, transliteratePronunciation, syllabifyPronunciation, transliterate99, formatTransliterationJAKIM, getDualTransliteration } from '../../../../utils/transliterationConverter';
import { useRumiTTS } from '../../../../utils/rumiTTS';
import { getTajwidHints, TajwidHint } from '../../../../utils/tajwidRumiHints';
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
  highlightedWordIndex: number | null; // Karaoke highlighting
  isBookmarked?: boolean;
  hasNote?: boolean;
  isZenMode?: boolean; // New Prop
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
  const [practiceMode, setPracticeMode] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  // Default to JAKIM standard for Malaysia context
  const [translitMode, setTranslitMode] = useState<'academic' | 'jakim'>('jakim');
  const verseNumber = verse.verse_key.split(':')[1];
  const arabicVerseNumber = toArabicNumerals(verseNumber);

  // Rumi TTS Hook
  const { isPlaying: isTTSPlaying, currentWordIndex: ttsWordIndex, speak: speakRumi, stop: stopRumi, isSupported: isTTSSupported } = useRumiTTS();

  // Get words for TTS and Tajwid
  const arabicWords = verse.words?.filter(w => w.char_type_name !== 'end').map(w => w.text_uthmani) || [];

  // Generate BOTH transliteration formats for each word
  const academicWords = arabicWords.map((arabic, i) => {
    const result = formatTransliteration(arabic);
    return result;
  });
  const jakimWords = arabicWords.map(arabic => formatTransliterationJAKIM(arabic));

  // Current mode words for display
  const displayWords = translitMode === 'academic' ? academicWords : jakimWords;

  // Generate 99% ACCURACY mode with Tajwid markers (full verse)
  const fullVerseArabic = arabicWords.join(' ');
  const result99 = transliterate99(fullVerseArabic);
  // ... other unused derived vars ...

  // Generate DUAL transliteration for full verse
  const dualTranslit = getDualTransliteration(fullVerseArabic);

  // Get Tajwid hints for each word
  const tajwidHints = getTajwidHints(arabicWords);

  const handleRumiTTS = () => {
    if (isTTSPlaying) {
      stopRumi();
    } else {
      // Use current display mode for TTS
      speakRumi(displayWords.join(' '));
    }
  };

  // Practice Mode
  const startPractice = () => {
    setPracticeMode(true);
    setCurrentRepeat(1);
    onPlay();
  };

  const handlePracticeComplete = () => {
    if (currentRepeat < repeatCount) {
      setCurrentRepeat(prev => prev + 1);
      onPlay();
    } else {
      setPracticeMode(false);
      setCurrentRepeat(0);
    }
  };

  // Detect tajwid rules
  const detectedRules = showTajwid ? detectTajwidRules(verse.text_uthmani) : [];

  const handleCopy = async (v: QuranVerse) => {
    const text = `${v.text_uthmani}\n\n"${v.translations?.[0]?.text || ''}"\n\n— ${chapterName} : ${v.verse_key.split(':')[1]}`;
    await navigator.clipboard.writeText(text);
  };

  // Dynamic Styling Logic
  const getContainerClasses = () => {
    // Base classes
    let classes = "py-12 px-8 transition-all duration-1000 relative overflow-hidden group/card ";

    if (isPlaying) {
      // Premium Cyber Highlight (Match Mockup)
      classes += "scale-[1.02] z-10 rounded-[2.5rem] ";
    } else if (isZenMode) {
      // Zen Mode (Minimalist)
      classes += "border-transparent opacity-60 hover:opacity-100 translate-y-0 ";
    } else {
      // Standard Mode
      classes += "hover:bg-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl my-4 border border-white/10 hover:border-cyan-500/30 ";
    }
    return classes;
  };

  return (
    <motion.div
      ref={verseRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={getContainerClasses()}
    >
      {/* 🌟 PREMIUM GLOW EFFECT (MOCKUP STYLE) */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-x-0 inset-y-2 mx-2 bg-cyan-500/10 border border-cyan-400/30 rounded-[2rem] shadow-[0_0_40px_rgba(6,182,212,0.2)] pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-transparent"></div>
          {/* Animated Edge Light */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], x: [-20, 20, -20] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          ></motion.div>
        </motion.div>
      )}

      {/* Cinematic Glow Background (Subtle) */}
      {!isPlaying && !isZenMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-blue-500/0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-700 pointer-events-none" />
      )}
      {/* Verse Header */}
      <div className="flex justify-between items-start mb-6 relative">
        <div className="flex items-center gap-3">
          {/* Simple Verse Index */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-lg font-mono ${isPlaying ? 'text-cyan-400' : 'text-slate-500'}`}>
                {verseNumber}
              </span>
              {isBookmarked && (
                <span className="text-amber-400 text-xs animate-pulse">
                  <i className="fa-solid fa-bookmark"></i>
                </span>
              )}
              {hasNote && (
                <span className="text-yellow-400 text-xs">
                  <i className="fa-solid fa-note-sticky"></i>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions - Consolidated */}
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>

          {/* Play Button - Primary Action */}
          <button
            onClick={onPlay}
            disabled={isAudioLoading}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${isPlaying
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
              : 'text-slate-400 border-slate-700/50 bg-slate-800/50 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400/50'
              }`}
          >
            {isAudioLoading && isPlaying ? (
              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
            )}
          </button>

          {/* Bookmark Button - Quick Access */}
          <BookmarkButton
            surahNumber={parseInt(verse.verse_key.split(':')[0])}
            ayahNumber={parseInt(verse.verse_key.split(':')[1])}
            size="sm"
          />

          {/* AI Studio Button - Quick Access */}
          <button
            onClick={onOpenStudio}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 flex items-center justify-center transition-all"
            title="Ask AI about this verse"
          >
            <i className="fa-solid fa-sparkles text-xs"></i>
          </button>

          {/* Rumi TTS Button */}
          {showTransliteration && isTTSSupported && (
            <button
              onClick={handleRumiTTS}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isTTSPlaying
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
                }`}
              title={isTTSPlaying ? 'Stop Rumi TTS' : 'Baca Rumi'}
            >
              <i className={`fa-solid ${isTTSPlaying ? 'fa-stop' : 'fa-volume-high'} text-xs`}></i>
            </button>
          )}

          {/* More Actions Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showMenu ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
            </button>

            {/* The Dropdown Menu */}
            <VerseActionMenu
              verse={verse}
              isOpen={showMenu}
              onClose={() => setShowMenu(false)}
              onBookmark={onBookmark || (() => { })}
              onShare={onShare || (() => { })}
              onCopy={handleCopy}
              onHafazan={onHafazan || (() => { })}
              onTafsir={onTafsir}
              onNotes={onNotes}
              onAddToCollection={onAddToCollection}
              onAskUstaz={onOpenStudio} // Link to Ustaz AI Chat
              isBookmarked={isBookmarked}
              hasNote={hasNote}
            />
          </div>

        </div>
      </div>

      {/* Action Content Handlers */}
      <div
        className="text-center mb-6 px-1"
        dir="rtl"
        onClick={() => {
          // Clicking on the empty space can also play/pause or open menu? 
          // For now, let's keep it simple.
          // onPlay(); 
        }}
      >
        {showWordByWord && verse.words && verse.words.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-6 items-start leading-relaxed">
            {verse.words
              .filter(word => {
                return word.char_type_name !== 'end';
              })
              .map((word, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  /* @ts-ignore: location is valid */
                  data-word-location={word.location}
                  onClick={(e) => { e.stopPropagation(); onWordClick(word, e); }}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 cursor-pointer transition-all duration-200 group relative min-w-[70px] ${highlightedWordIndex === word.position
                    ? 'scale-105 bg-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'hover:bg-slate-800/50'
                    }`}
                >
                  {/* 1. Arabic Glyph - TOP */}
                  <span
                    className={`font-uthmani text-center leading-[1.9] transition-all duration-300 ${highlightedWordIndex === word.position
                      ? 'text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.9)] scale-110 z-10'
                      : activeWord?.id === word.id
                        ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                        : 'text-white font-bold drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                      }`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {word.text_uthmani}
                  </span>

                  {/* 2. Rumi Transliteration - MIDDLE (JAKIM Standard) */}
                  {showTransliteration && (
                    <p className={`font-serif text-[10px] text-center leading-tight ${highlightedWordIndex === word.position ? 'text-emerald-300' : 'text-emerald-400/70'
                      }`}>
                      {/* Use API transliteration if available, else our JAKIM converter */}
                      {word.transliteration?.text || formatTransliterationJAKIM(word.text_uthmani)}
                    </p>
                  )}

                  {/* 3. Translation - BOTTOM */}
                  {showTranslation && (
                    <p className={`font-sans text-[9px] text-center leading-tight max-w-[80px] ${highlightedWordIndex === word.position ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                      {word.translation?.text || '—'}
                    </p>
                  )}
                </div>
              ))}
            {/* End of Ayah Marker - Modern Pantone Design (Perkata View) */}
            <div className="flex flex-col items-center justify-start pt-2">
              <span
                className="relative flex items-center justify-center select-none"
                style={{ width: `${fontSize * 1.5}px`, height: `${fontSize * 1.5}px` }}
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                  <defs>
                    <linearGradient id="grad-pantone-perkata" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E0BFB8" />
                      <stop offset="30%" stopColor="#D4AF37" />
                      <stop offset="60%" stopColor="#B76E79" />
                      <stop offset="100%" stopColor="#8B5A2B" />
                    </linearGradient>
                    <linearGradient id="grad-inner-perkata" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e3a5f" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  <g transform="translate(50,50)">
                    <rect x="-30" y="-30" width="60" height="60" rx="3" fill="url(#grad-pantone-perkata)" />
                    <rect x="-30" y="-30" width="60" height="60" rx="3" fill="url(#grad-pantone-perkata)" transform="rotate(45)" />
                    <circle cx="0" cy="0" r="18" fill="url(#grad-inner-perkata)" />
                    <circle cx="0" cy="0" r="16" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                  </g>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-300" style={{ fontFamily: 'var(--font-uthmani)', fontSize: '0.38em', textShadow: '0 0 8px rgba(251,191,36,0.5)' }}>
                  {arabicVerseNumber}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-1.5 leading-[2.5] px-4" dir="rtl">
            {verse.words?.filter(w => w.char_type_name !== 'end').map((word, i) => (
              <span
                key={i}
                className={`font-uthmani transition-all duration-300 cursor-pointer rounded px-1
                   ${highlightedWordIndex === word.position
                    ? 'text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.9)] scale-110 font-bold'
                    : 'text-white font-semibold drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] hover:text-cyan-100 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                  }
                   ${activeWord?.id === word.id ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' : ''}
                 `}
                style={{ fontSize: `${fontSize}px` }}
                onClick={(e) => { e.stopPropagation(); onWordClick(word, e); }}
              >
                {word.text_uthmani}
              </span>
            ))}
            <span className="inline-flex relative items-center justify-center mx-1.5 select-none align-middle" style={{ width: `${fontSize * 1.5}px`, height: `${fontSize * 1.5}px` }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                <defs>
                  <linearGradient id="grad-cyber-perkata" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />  {/* Cyan */}
                    <stop offset="50%" stopColor="#3b82f6" />  {/* Blue */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
                  </linearGradient>
                  <filter id="glow-cyber">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g transform="translate(50,50)">
                  {/* Outer Glow Ring */}
                  <circle cx="0" cy="0" r="28" fill="none" stroke="url(#grad-cyber-perkata)" strokeWidth="1.5" opacity="0.8" filter="url(#glow-cyber)" />

                  {/* Rotating Hexagon (Static suggestion of motion) */}
                  <path d="M-22,-12 L0,-25 L22,-12 L22,12 L0,25 L-22,12 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* Inner Circle background */}
                  <circle cx="0" cy="0" r="18" fill="rgba(15, 23, 42, 0.9)" />
                </g>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-cyan-200" style={{ fontFamily: 'var(--font-uthmani)', fontSize: '0.4em', textShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}>
                {arabicVerseNumber}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Minimalist Rumi Subtitle - Clean & Simple */}
      {showTransliteration && !showWordByWord && (
        <div className="mb-4 px-2 text-right dir-ltr" dir="ltr">
          <p className={`font-serif text-base sm:text-lg italic tracking-wide leading-relaxed transition-all duration-500 ${isPlaying
            ? 'text-emerald-200 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] scale-[1.01]'
            : 'text-emerald-400/70'
            }`}>
            {translitMode === 'jakim' ? dualTranslit.jakim : dualTranslit.academic}
          </p>
        </div>
      )}

      {/* Translation - Contextual Meaning (Always visible if enabled) */}
      {showTranslation && verse.translations?.[0] && (
        <div className="text-center px-4 mx-2 mt-4 pt-4 border-t border-slate-800/50">
          <p className={`font-translation text-base leading-relaxed transition-colors duration-500 ${isPlaying ? 'text-white drop-shadow-sm font-medium' : 'text-slate-300'
            }`}>
            {verse.translations[0].text.replace(/<sup.*?<\/sup>/g, "").replace(/<[^>]*>/g, "")}
          </p>
        </div>
      )}

      {/* Tajwid Display - Disabled per user request (Cleaner View) */}
      {/* {showTajwid && detectedRules.length > 0 && (
        <TajwidDisplay detectedRules={detectedRules} />
      )} */}

    </motion.div>
  );
};

export default QuranVerseCard;
