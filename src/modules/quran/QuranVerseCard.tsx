import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse, QuranWord } from '../../types';
import VerseActionMenu from './VerseActionMenu';
import TajwidDisplay, { detectTajwidRules } from './TajwidDisplay';
import { formatTransliteration, transliteratePronunciation, syllabifyPronunciation, transliterate99 } from '../../utils/transliterationConverter';
import { useRumiTTS } from '../../utils/rumiTTS';
import { getTajwidHints, TajwidHint } from '../../utils/tajwidRumiHints';

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
  const [rumiMode, setRumiMode] = useState<'malaysian' | '99'>('malaysian'); // Toggle between modes
  const verseNumber = verse.verse_key.split(':')[1];
  const arabicVerseNumber = toArabicNumerals(verseNumber);
  
  // Rumi TTS Hook
  const { isPlaying: isTTSPlaying, currentWordIndex: ttsWordIndex, speak: speakRumi, stop: stopRumi, isSupported: isTTSSupported } = useRumiTTS();
  
  // Get words for TTS and Tajwid - USE OUR JAKIM CONVERTER, not API data!
  const arabicWords = verse.words?.filter(w => w.char_type_name !== 'end').map(w => w.text_uthmani) || [];
  
  // Generate JAKIM-standard Rumi from Arabic (not from API transliteration!)
  const rumiWords = arabicWords.map(arabic => formatTransliteration(arabic));
  
  // Generate 99% ACCURACY mode for each word - PRECISION ARABIC!
  const words99 = arabicWords.map(arabic => transliterate99(arabic).text);
  
  // Generate 99% ACCURACY mode with Tajwid markers (full verse)
  const fullVerseArabic = arabicWords.join(' ');
  const result99 = transliterate99(fullVerseArabic);
  const pronunciation99 = result99.text;
  const tajwidMarkers = result99.tajwid;
  const pronunciationNotes = result99.notes;
  
  // Get Tajwid hints for each word
  const tajwidHints = getTajwidHints(arabicWords);
  
  const handleRumiTTS = () => {
    if (isTTSPlaying) {
      stopRumi();
    } else {
      speakRumi(rumiWords.join(' '));
    }
  };
  
  // Practice Mode: Play with Qari audio and repeat
  const startPractice = () => {
    setPracticeMode(true);
    setCurrentRepeat(1);
    onPlay(); // Play Qari audio
  };
  
  const handlePracticeComplete = () => {
    if (currentRepeat < repeatCount) {
      setCurrentRepeat(prev => prev + 1);
      onPlay(); // Repeat
    } else {
      setPracticeMode(false);
      setCurrentRepeat(0);
    }
  };
  
  // Detect tajwid rules in the verse
  const detectedRules = showTajwid ? detectTajwidRules(verse.text_uthmani) : [];

  const handleCopy = async (v: QuranVerse) => {
    const text = `${v.text_uthmani}\n\n"${v.translations?.[0]?.text || ''}"\n\n— ${chapterName} : ${v.verse_key.split(':')[1]}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      ref={verseRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`py-6 px-4 border-b border-slate-800/30 transition-all duration-500 ${
        isPlaying 
          ? 'bg-gradient-to-r from-cyan-900/10 via-cyan-900/5 to-transparent border-l-4 border-l-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)] scale-[1.01] z-10 rounded-r-xl' 
          : 'hover:bg-slate-900/30'
      }`}
    >
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
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400'
            }`}
          >
             {isAudioLoading && isPlaying ? (
               <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
             ) : (
               <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
             )}
          </button>

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
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isTTSPlaying
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
              onBookmark={onBookmark || (() => {})}
              onShare={onShare || (() => {})}
              onCopy={handleCopy}
              onHafazan={onHafazan || (() => {})}
              onTafsir={onTafsir}
              onNotes={onNotes}
              onAddToCollection={onAddToCollection}
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
                className={`flex flex-col items-center gap-2 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                  highlightedWordIndex === word.position
                    ? 'scale-105'
                    : ''
                }`}
              >
                {/* Arabic Glyph */}
                <span 
                  className={`font-uthmani text-center leading-[1.8] ${
                    highlightedWordIndex === word.position
                      ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                      : activeWord?.id === word.id 
                        ? 'text-amber-400' 
                        : 'text-white'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {word.text_uthmani}
                </span>
                
                {/* Word Tooltip/Translation Container */}
                <div className="flex flex-col items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    {/* Translation only - Rumi moved to 99% mode box below */}
                    {word.translation && (
                    <p className="font-translation text-[11px] text-slate-300 max-w-[80px] text-center leading-tight">
                        {typeof word.translation === 'string' 
                        ? word.translation 
                        : word.translation.text}
                    </p>
                    )}
                </div>
              </div>
            ))}
            {/* End of Ayah Marker - Modern Pantone Design (Perkata View) */}
            <div className="flex flex-col items-center justify-start pt-2">
              <span 
                className="relative flex items-center justify-center select-none" 
                style={{ width: `${fontSize * 1.5}px`, height: `${fontSize * 1.5}px` }}
              >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}}>
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
                 className={`font-uthmani transition-all duration-200 cursor-pointer rounded px-0.5
                   ${highlightedWordIndex === word.position 
                     ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] scale-110' 
                     : 'text-white/90 hover:text-white hover:bg-white/5'
                   }
                   ${activeWord?.id === word.id ? 'text-amber-400' : ''}
                 `}
                 style={{ fontSize: `${fontSize}px` }}
                 onClick={(e) => { e.stopPropagation(); onWordClick(word, e); }}
               >
                 {word.text_uthmani}
               </span>
            ))}
            <span className="inline-flex relative items-center justify-center mx-1.5 select-none align-middle" style={{ width: `${fontSize * 1.5}px`, height: `${fontSize * 1.5}px` }}>
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}}>
                    <defs>
                        <linearGradient id="grad-pantone-verse" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E0BFB8" />
                            <stop offset="30%" stopColor="#D4AF37" />
                            <stop offset="60%" stopColor="#B76E79" />
                            <stop offset="100%" stopColor="#8B5A2B" />
                        </linearGradient>
                        <linearGradient id="grad-inner-verse" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e3a5f" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>
                    <g transform="translate(50,50)">
                        <rect x="-30" y="-30" width="60" height="60" rx="3" fill="url(#grad-pantone-verse)" />
                        <rect x="-30" y="-30" width="60" height="60" rx="3" fill="url(#grad-pantone-verse)" transform="rotate(45)" />
                        <circle cx="0" cy="0" r="18" fill="url(#grad-inner-verse)" />
                        <circle cx="0" cy="0" r="16" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                    </g>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-300" style={{ fontFamily: 'var(--font-uthmani)', fontSize: '0.38em', textShadow: '0 0 8px rgba(251,191,36,0.5)' }}>
                    {arabicVerseNumber}
                </span>
            </span>
          </div>
        )}
      </div>

      {/* Transliteration (Rumi) - Interactive Premium Display with Tajwid */}
      {showTransliteration && (
        <div className="mb-4 px-4 bg-gradient-to-br from-slate-900/40 to-emerald-900/10 py-4 rounded-2xl border border-emerald-500/10 mx-2" dir="ltr">
            {/* Control Bar */}
            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                {/* TTS Button */}
                {isTTSSupported && (
                    <button
                        onClick={handleRumiTTS}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            isTTSPlaying
                                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                    >
                        <i className={`fa-solid ${isTTSPlaying ? 'fa-stop' : 'fa-volume-high'}`}></i>
                        {isTTSPlaying ? 'Stop' : 'Baca Rumi'}
                    </button>
                )}
                
                {/* Practice Mode Button */}
                <button
                    onClick={practiceMode ? () => { setPracticeMode(false); setCurrentRepeat(0); } : startPractice}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        practiceMode
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                            : 'bg-slate-800 text-amber-400 hover:bg-amber-500/20'
                    }`}
                >
                    <i className={`fa-solid ${practiceMode ? 'fa-times' : 'fa-repeat'}`}></i>
                    {practiceMode ? `${currentRepeat}/${repeatCount}` : 'Latihan'}
                </button>
                
                {/* Repeat selector (show when in practice mode) */}
                {practiceMode && (
                    <div className="flex items-center gap-1">
                        {[3, 5, 10].map(n => (
                            <button
                                key={n}
                                onClick={() => setRepeatCount(n)}
                                className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                                    repeatCount === n
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {n}x
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* 99% RUMI Header - Clean & Compact */}
            <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-xs text-amber-400/80 font-medium">🎯 99% Rumi</span>
                {tajwidMarkers.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px]">
                        {tajwidMarkers.length} Tajwid
                    </span>
                )}
            </div>
            
            {/* Rumi Words - Clickable with Tajwid Colors - USING 99% ACCURACY */}
            <div className="flex flex-wrap justify-center gap-2">
                {verse.words?.filter(w => w.char_type_name !== 'end').map((word, i) => {
                    // Use 99% ACCURACY mode - PRECISION ARABIC!
                    const rumiText = words99[i] || '';
                    const isActive = highlightedWordIndex === word.position || (isTTSPlaying && ttsWordIndex === i);
                    const hint = tajwidHints[i] || { color: '#10b981', bgColor: 'transparent', rule: 'normal', label: '', labelMs: '' };
                    
                    return (
                        <span 
                            key={i}
                            onClick={() => speakRumi(rumiText)}
                            title={`${word.text_uthmani}${hint.rule !== 'normal' ? ` (${hint.label})` : ''}`}
                            className={`relative cursor-pointer px-2 py-1 rounded-lg transition-all duration-200 group
                                ${isActive ? 'scale-110 font-bold' : 'hover:scale-105'}
                            `}
                            style={{ 
                                fontFamily: "'Lora', 'Amiri', serif", 
                                fontSize: `${fontSize * 0.55}px`, 
                                letterSpacing: '0.03em',
                                color: isActive ? '#fff' : hint.color,
                                backgroundColor: isActive ? hint.color + '40' : hint.bgColor,
                                boxShadow: isActive ? `0 0 15px ${hint.color}40` : 'none'
                            }}
                        >
                            {rumiText}
                            {/* Tooltip with Arabic + Tajwid rule */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 flex flex-col items-center gap-0.5">
                                <span className="font-uthmani text-amber-400">{word.text_uthmani}</span>
                                {hint.rule !== 'normal' && (
                                    <span style={{ color: hint.color }} className="text-[9px] font-bold">{hint.labelMs}</span>
                                )}
                            </span>
                        </span>
                    );
                })}
            </div>
            
            {/* Practice Mode Completion */}
            {practiceMode && currentRepeat >= repeatCount && (
                <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-xl text-center border border-amber-500/30">
                    <span className="text-2xl">🎉</span>
                    <p className="text-amber-400 font-bold text-sm mt-1">Tahniah! Anda telah selesai {repeatCount}x ulangan</p>
                    <button 
                        onClick={() => { setPracticeMode(false); setCurrentRepeat(0); }}
                        className="mt-2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full"
                    >
                        Selesai
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Translation */}
      {showTranslation && verse.translations?.[0] && (
        <div className="text-center px-4 mx-2">
          <p className="font-translation text-slate-300 text-base leading-relaxed">
            {verse.translations[0].text.replace(/<sup.*?<\/sup>/g, "").replace(/<[^>]*>/g, "")}
          </p>
        </div>
      )}

      {/* Tajwid Display */}
      {showTajwid && detectedRules.length > 0 && (
        <TajwidDisplay detectedRules={detectedRules} />
      )}

    </motion.div>
  );
};

export default QuranVerseCard;
