import React from 'react';
import { motion } from 'framer-motion';
import { QuranChapter, QuranVerse, QuranWord } from '../../types';
import { speak, stopTTS, isSpeaking } from '../../services/ttsService';
import styles from './QuranReader.module.css';

interface QuranReaderProps {
    chapter: QuranChapter;
    verses: QuranVerse[];
    loading: boolean;
    fontSize: number;
    showTranslation: boolean;
    showTransliteration: boolean;
    showWordByWord: boolean;
    activeWord: QuranWord | null;
    handleWordClick: (word: QuranWord) => void;
    playingVerseKey: string | null;
    playVerse: (verseKey: string) => void;
    handleVerseConnections: (verse: QuranVerse) => void;
    openVerseStudio: (verse: QuranVerse) => void;
    verseRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
    isZooming: boolean;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onBack: () => void;
    onOpenSettings: () => void;
    onOpenAudioSettings: () => void;
    onToggleTranslation: () => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({
    chapter,
    verses,
    loading,
    fontSize,
    showTranslation,
    showTransliteration,
    showWordByWord,
    activeWord,
    handleWordClick,
    playingVerseKey,
    playVerse,
    handleVerseConnections,
    openVerseStudio,
    verseRefs,
    isZooming,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onBack,
    onOpenSettings,
    onOpenAudioSettings,
    onToggleTranslation
}) => {
    return (
        <div className="bg-space-dark min-h-screen">
            <div className="sticky top-0 z-30 bg-space-dark/95 backdrop-blur-md border-b border-white/10 p-3 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} aria-label="Back" className="w-8 h-8 rounded-full bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 transition-colors"><i className="fa-solid fa-arrow-left"></i></button>
                    <div><h2 className="font-bold text-white text-sm">{chapter.name_simple}</h2></div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onOpenAudioSettings} aria-label="Audio Settings" className="w-8 h-8 rounded-full bg-white/5 text-secondary flex items-center justify-center hover:bg-white/10 transition-colors"><i className="fa-solid fa-music"></i></button>
                    {/* Translation Toggle */}
                    <button onClick={onToggleTranslation} aria-label="Toggle Translation" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${showTranslation ? 'bg-primary text-black' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                        <i className="fa-solid fa-language"></i>
                    </button>
                    <button onClick={onOpenSettings} aria-label="Text Settings" className="w-8 h-8 rounded-full bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 transition-colors"><i className="fa-solid fa-font"></i></button>
                </div>
            </div>

            <div
                className="pb-40 px-4 min-h-screen"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {loading ? <div className="text-center py-20 text-slate-500">Loading Verses...</div> : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {isZooming && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/70 text-white px-4 py-2 rounded-full font-bold text-xl backdrop-blur-md">
                                    {fontSize}px
                                </div>
                            </div>
                        )}
                        {verses.map((verse) => {
                            const isPlayingThis = playingVerseKey === verse.verse_key;
                            return (
                                <div key={verse.id} ref={el => { verseRefs.current[verse.verse_key] = el; }} className={`py-10 border-b border-white/5 ${isPlayingThis ? 'bg-primary/5 -mx-4 px-4 border-l-4 border-l-primary' : ''}`}>
                                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-cyan-400 font-bold text-lg">{chapter.name_simple}</span>
                                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white">{verse.verse_key}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openVerseStudio(verse)} aria-label="Verse Studio" className="w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-primary flex items-center justify-center hover:bg-white/10 transition-colors">
                                                <i className="fa-solid fa-microchip text-xs"></i>
                                            </button>
                                            <button onClick={() => playVerse(verse.verse_key)} aria-label={isPlayingThis ? "Pause" : "Play"} className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlayingThis ? 'bg-primary text-black' : 'bg-slate-800 text-slate-400'}`}>
                                                <i className={`fa-solid ${isPlayingThis ? 'fa-pause' : 'fa-play'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Arabic Text */}
                                    <div className="text-center w-full mb-6 px-4">
                                        {showWordByWord && verse.words && verse.words.length > 0 ? (
                                            <div className={`${styles.quranTextWordByWord} ${styles[`fontSize${fontSize}`] || styles.fontSize20} justify-center`}>
                                                {verse.words.map((word, i) => (
                                                    <span key={i} onClick={() => handleWordClick(word)} className={`font-uthmani cursor-pointer hover:text-primary-light ${activeWord?.id === word.id ? 'text-secondary' : 'text-white'}`}>{word.text_uthmani}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className={`${styles.quranTextVerse} ${styles[`fontSize${fontSize}`] || styles.fontSize20} text-white font-uthmani leading-[2.5] dir-rtl`}>{verse.text_uthmani}</p>
                                        )}
                                    </div>

                                    {/* Transliteration */}
                                    {showTransliteration && verse.transliteration && (
                                        <div className="mb-4 text-center px-6">
                                            <p className="text-secondary-light/80 italic text-lg font-serif">{verse.transliteration.text}</p>
                                        </div>
                                    )}

                                    {/* Translation */}
                                    {showTranslation && (
                                        <div className="text-center px-6">
                                            <p className="text-slate-300 text-base leading-relaxed">{verse.translations?.[0]?.text.replace(/<sup.*?<\/sup>/g, "")}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default QuranReader;
