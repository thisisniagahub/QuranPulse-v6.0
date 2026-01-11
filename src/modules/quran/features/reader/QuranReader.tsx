import React, { useRef, useEffect } from 'react';
import { useQuran } from '../../contexts/QuranContext';
import { useAudioPlayer } from '../../../../contexts/AudioPlayerContext';
import QuranHeader from '../../components/QuranHeader';
import QuranVerseCard from '../verse-card/QuranVerseCard';
import QuranPageView from './QuranPageView';
import QuranAudioPlayer from '../audio/QuranAudioPlayer';
import ReadingProgressBar from '../../components/ReadingProgressBar';
import ImmersiveControls from '../../components/ImmersiveControls';
// Tier 2 & 3 Upgrades
import VoiceActiveReader from './VoiceActiveReader';
import MushafView from './MushafView';


const QuranReader: React.FC = () => {
    const {
        selectedChapter,
        verses,
        loadingVerses,
        isAudioLoading,

        // Settings
        fontSize,
        view, setView,
        layoutMode, setLayoutMode,
        readingMode, toggleReadingMode,
        showTranslation, setShowTranslation,
        showTransliteration, setShowTransliteration,
        showWordByWord,
        showTajwid,
        theme,

        // Actions
        playVerse, // Context playVerse doesn't scroll
        playNextVerse,
        playPreviousVerse,
        toggleBookmark,
        bookmarkedVerses,
        setShareVerse,
        setHafazanVerse,

        // Studio/Interactive
        openVerseStudio,
        setTafsirVerse,
        setNotesVerse,
        setBookmarkVerse,
        setShowBookmarkCollections,
        setSelectedWord,

        // UI Toggles
        setShowSettings,
        setShowSurahInfo,
        setShowGoToVerse,


    } = useQuran();

    const {
        currentTrack,
        highlightedWordIndex,
        isPlaying,
        stopTrack
    } = useAudioPlayer();

    // Context might stick with specific names, let's Map them correctly if needed
    // In QuranContext: setShowTranslation, setShowTransliteration are setters.
    // We need toggles for the Header. 
    // Actually QuranHeader takes "onToggle..."

    // Scroll Handling
    const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Auto-scroll when track changes
    useEffect(() => {
        if (currentTrack?.verseKey) {
            // Logic to scroll
            verseRefs.current[currentTrack.verseKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentTrack]);

    // State for Zen Mode (Immersive Reading)
    const [isZenMode, setIsZenMode] = React.useState(false);
    const [isVoiceMode, setIsVoiceMode] = React.useState(false);

    // Active Verse Calculation for Voice Reader
    const activeVerse = verses.find(v => v.verse_key === (currentTrack?.verseKey || verses[0]?.verse_key));

    // Also scroll nicely when entering reading view?
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedChapter]);

    if (!selectedChapter) return null;

    // Helper Wrappers for Header
    // Context has setShowTranslation(bool). Header expects onToggleTranslation().
    // We can pass wrapper functions.

    // We need to access the setters from context for the Header
    const context = useQuran();

    // Handlers for Immersive Controls
    const handleToggleZen = () => setIsZenMode(!isZenMode);
    const handlePlayPause = () => {
        if (isPlaying) stopTrack();
        else if (currentTrack?.verseKey) playVerse(currentTrack.verseKey);
        else if (verses.length > 0) playVerse(verses[0].verse_key);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full h-full">
            {/* Header (Minimalist in Zen Mode) */}
            <div className={`transition-all duration-700`}>
                <QuranHeader
                    chapter={selectedChapter}
                    onBack={() => {
                        setView('LIST');
                    }}
                    onOpenAudioSettings={() => setShowSettings(true)}
                    onOpenSettings={() => setShowSettings(true)}
                    onOpenSurahInfo={() => setShowSurahInfo(true)}
                    onGoToVerse={() => setShowGoToVerse(true)}
                    readingMode={readingMode}
                    onToggleReadingMode={toggleReadingMode}
                    showTranslation={showTranslation}
                    onToggleTranslation={() => setShowTranslation(!showTranslation)}
                    showTransliteration={showTransliteration}
                    onToggleTransliteration={() => setShowTransliteration(!showTransliteration)}
                    selectedTranslationId={context.selectedTranslationId}
                    onTranslationChange={context.setSelectedTranslationId}
                    isAudioLoading={isAudioLoading}
                    layoutMode={layoutMode}
                    isZenMode={isZenMode} // Pass Zen Mode here
                    onToggleLayoutMode={() => setLayoutMode(layoutMode === 'SCROLL' ? 'PAGE' : 'SCROLL')}
                />
            </div>

            {/* Reading Progress (Minimal in Zen Mode needed? Maybe hide for now) */}
            {!isZenMode && <ReadingProgressBar />}

            {/* === PAGE VIEW (MUSHAF MODE) === */}
            {layoutMode === 'PAGE' && (
                <div className="flex-1 overflow-y-auto w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0f] to-black">
                    <MushafView />
                </div>
            )}

            {/* === SCROLL VIEW (LIST MODE) === */}
            {layoutMode === 'SCROLL' && (
                <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide pb-32 transition-colors duration-1000 relative min-h-full ${isZenMode
                    ? 'bg-[#020617]'
                    : theme === 'noor' || theme === 'light'
                        ? 'bg-[var(--bg-main)]'
                        : 'bg-transparent' // Allow parent bg-midnight-gradient to show
                    }`}>

                    {/* 🌠 Starlight Background (Reading Mode only) */}
                    {isZenMode && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150"></div>
                            {/* Simple Star Particles (CSS-only for performance) */}
                            <div className="absolute top-20 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                            <div className="absolute top-40 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute bottom-60 left-10 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
                        </div>
                    )}

                    <div className="relative z-10">
                        {/* SURAH HEADER - Premium & Nature Integration */}
                        <div className={`relative rounded-[3rem] overflow-hidden min-h-[220px] flex flex-col items-center justify-center text-center p-8 mb-8 shadow-2xl ring-1 ring-white/10 group transition-all duration-700 ${isZenMode ? 'bg-transparent shadow-none ring-0' : ''}`}>
                            {/* Nature Background */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2670&auto=format&fit=crop"
                                    alt="Nature Background"
                                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'noor' || theme === 'light' ? 'from-[var(--bg-main)] via-[var(--bg-main)]/40 to-transparent' : 'from-slate-900 via-slate-900/40 to-slate-900/80'}`} />
                                <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] ${theme === 'noor' ? 'opacity-10' : 'opacity-20 mix-blend-overlay'}`}></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                    <i className="fa-solid fa-kaaba text-amber-400 text-xs shadow-glow"></i>
                                    <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                                        {selectedChapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} Revelation
                                    </span>
                                </div>

                                <div>
                                    <h1 className="font-arabic text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-sm mb-2">
                                        {selectedChapter.name_arabic}
                                    </h1>
                                    <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${theme === 'noor' || theme === 'light' ? 'text-[var(--text-primary)]' : 'text-white'}`}>
                                        {selectedChapter.name_simple}
                                    </h2>
                                    <p className="text-cyan-400/80 text-sm font-medium tracking-wide">
                                        {selectedChapter.translated_name.name}
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-mono pt-2">
                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-list-ol"></i> {selectedChapter.verses_count} Verses
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-arrow-down-9-1"></i> Order #{selectedChapter.revelation_order}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bismillah (except Surah 1 & 9) */}
                        {selectedChapter.id !== 1 && selectedChapter.id !== 9 && (
                            <div className="py-8 text-center">
                                <p className="font-arabic text-3xl text-slate-400 opacity-80">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                            </div>
                        )}

                        {loadingVerses ? (
                            // Skeleton Loading
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`backdrop-blur-md border border-white/5 rounded-2xl p-6 animate-pulse ${theme === 'noor' || theme === 'light' ? 'bg-slate-200/50' : 'bg-slate-800/20'}`}>
                                        <div className={`h-8 rounded mb-4 w-3/4 ml-auto ${theme === 'noor' || theme === 'light' ? 'bg-slate-300' : 'bg-slate-700/50'}`} />
                                        <div className={`h-4 rounded w-full mb-2 ${theme === 'noor' || theme === 'light' ? 'bg-slate-300' : 'bg-slate-700/30'}`} />
                                        <div className={`h-4 rounded w-2/3 ${theme === 'noor' || theme === 'light' ? 'bg-slate-300' : 'bg-slate-700/30'}`} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto space-y-4">
                                {verses.map((verse) => (
                                    <QuranVerseCard
                                        key={verse.verse_key}
                                        verse={verse}
                                        chapterName={selectedChapter.name_simple}
                                        fontSize={fontSize}
                                        showTranslation={readingMode ? false : showTranslation}
                                        showTransliteration={readingMode ? false : showTransliteration}
                                        showWordByWord={readingMode ? false : showWordByWord}
                                        showTajwid={showTajwid}
                                        isPlaying={currentTrack?.verseKey === verse.verse_key}
                                        isAudioLoading={isAudioLoading && currentTrack?.verseKey === verse.verse_key}
                                        activeWord={context.selectedWord?.word || null}
                                        highlightedWordIndex={currentTrack?.verseKey === verse.verse_key ? highlightedWordIndex : null}
                                        isBookmarked={bookmarkedVerses.has(verse.verse_key)}
                                        hasNote={!!context.notesVerse && context.notesVerse.verse_key === verse.verse_key} // Only checking if active note, ideally check a map
                                        isZenMode={isZenMode} // Pass Zen Mode
                                        onPlay={() => playVerse(verse.verse_key)}
                                        onWordClick={(word, event) => {
                                            if (event) {
                                                setSelectedWord({ word, position: { x: event.clientX, y: event.clientY } });
                                            }
                                        }}
                                        onOpenStudio={() => openVerseStudio(verse)}
                                        onTafsir={() => setTafsirVerse(verse)}
                                        onNotes={() => setNotesVerse(verse)}
                                        onAddToCollection={() => {
                                            setBookmarkVerse(verse);
                                            setShowBookmarkCollections(true);
                                        }}
                                        onBookmark={() => toggleBookmark(verse.verse_key)}
                                        onShare={() => setShareVerse(verse)}
                                        onHafazan={() => setHafazanVerse(verse)}
                                        verseRef={(el) => { verseRefs.current[verse.verse_key] = el; }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New Immersive Controls Overlay */}
            <ImmersiveControls
                isZenMode={isZenMode}
                toggleZenMode={handleToggleZen}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                currentVerseKey={currentTrack?.verseKey || null}
                onNext={playNextVerse}
                onPrev={playPreviousVerse}
                showSettings={false} // Connect this if needed or keep using top header for detailed settings
                toggleSettings={() => setShowSettings(true)}
            />

            {/* Standard Floating Audio Player - Hide in Zen Mode to prevent clutter, as ImmersiveControls handles it */}
            {!isZenMode && (
                <QuranAudioPlayer
                    chapterName={selectedChapter.name_simple}
                    onNext={playNextVerse}
                    onPrevious={playPreviousVerse}
                />
            )}

            {/* AI Voice Navigation Engine */}
            {activeVerse && (
                <div className="fixed bottom-24 right-4 z-50">
                    <VoiceActiveReader
                        verseKey={activeVerse.verse_key}
                        arabicText={activeVerse.text_uthmani || ''}
                        isActive={isVoiceMode}
                        onToggle={() => setIsVoiceMode(!isVoiceMode)}
                        onNextVerse={playNextVerse}
                        onVerseComplete={() => {}}
                    />
                </div>
            )}
        </div>
    );
};

export default QuranReader;
