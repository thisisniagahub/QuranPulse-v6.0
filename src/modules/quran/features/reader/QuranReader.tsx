import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import { useQuran } from '../../contexts/QuranContext';
import { useAudioPlayer } from '../../../../contexts/AudioPlayerContext';
import QuranHeader from '../../components/QuranHeader';
import QuranVerseCard from '../verse-card/QuranVerseCard';
import QuranAudioPlayer from '../audio/QuranAudioPlayer';
import ReadingProgressBar from '../../components/ReadingProgressBar';
import ImmersiveControls from '../../components/ImmersiveControls';
// Tier 2 & 3 Upgrades
const VoiceActiveReader = lazy(() => import('./VoiceActiveReader'));
const MushafView = lazy(() => import('./MushafView'));


const QuranReader: React.FC = () => {
    const context = useQuran();
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
        selectedTranslationId,
        setSelectedTranslationId,

        // UI Toggles
        setShowSettings,
        setShowSurahInfo,
        setShowGoToVerse,

    } = context;

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
    const [isZenMode, setIsZenMode] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    // Virtual list state for long surahs
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const verseListRef = useRef<HTMLDivElement | null>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [listOffsetTop, setListOffsetTop] = useState(0);
    const shouldVirtualize = layoutMode === 'SCROLL' && !loadingVerses && verses.length >= 100;
    const estimatedVerseHeight = 360;
    const overscan = 4;

    // Active Verse Calculation for Voice Reader
    const activeVerse = useMemo(() => {
        if (verses.length === 0) return null;
        return verses.find(v => v.verse_key === (currentTrack?.verseKey || verses[0]?.verse_key)) ?? null;
    }, [currentTrack?.verseKey, verses]);

    // Also scroll nicely when entering reading view?
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedChapter]);

    useEffect(() => {
        if (layoutMode !== 'SCROLL') return;

        const updateMetrics = () => {
            const container = scrollContainerRef.current;
            const verseList = verseListRef.current;
            if (!container || !verseList) return;

            const containerRect = container.getBoundingClientRect();
            const listRect = verseList.getBoundingClientRect();
            const offset = container.scrollTop + (listRect.top - containerRect.top);
            startTransition(() => {
                setViewportHeight(container.clientHeight);
                setListOffsetTop(offset);
            });
        };

        updateMetrics();
        window.addEventListener('resize', updateMetrics);
        return () => {
            window.removeEventListener('resize', updateMetrics);
        };
    }, [layoutMode, verses.length, isZenMode, fontSize, showTranslation, showTransliteration, showWordByWord, loadingVerses]);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        if (!shouldVirtualize) return;
        startTransition(() => {
            setScrollTop(event.currentTarget.scrollTop);
        });
    }, [shouldVirtualize]);

    const virtualWindow = useMemo(() => {
        if (!shouldVirtualize) {
            return {
                startIndex: 0,
                endIndex: verses.length,
                topSpacer: 0,
                bottomSpacer: 0
            };
        }

        const relativeScrollTop = Math.max(0, scrollTop - listOffsetTop);
        const startIndex = Math.max(0, Math.floor(relativeScrollTop / estimatedVerseHeight) - overscan);
        const endIndex = Math.min(
            verses.length,
            Math.ceil((relativeScrollTop + viewportHeight) / estimatedVerseHeight) + overscan
        );

        return {
            startIndex,
            endIndex,
            topSpacer: startIndex * estimatedVerseHeight,
            bottomSpacer: Math.max(0, (verses.length - endIndex) * estimatedVerseHeight)
        };
    }, [shouldVirtualize, verses.length, scrollTop, listOffsetTop, viewportHeight]);

    const visibleVerses = useMemo(() => {
        if (!shouldVirtualize) return verses;
        return verses.slice(virtualWindow.startIndex, virtualWindow.endIndex);
    }, [shouldVirtualize, verses, virtualWindow.endIndex, virtualWindow.startIndex]);

    if (!selectedChapter) return null;

    // Helper Wrappers for Header
    // Context has setShowTranslation(bool). Header expects onToggleTranslation().

    // Handlers for Immersive Controls
    const handleToggleZen = useCallback(() => setIsZenMode(prev => !prev), []);
    const handlePlayPause = useCallback(() => {
        if (isPlaying) stopTrack();
        else if (currentTrack?.verseKey) playVerse(currentTrack.verseKey);
        else if (verses.length > 0) playVerse(verses[0].verse_key);
    }, [currentTrack?.verseKey, isPlaying, playVerse, stopTrack, verses]);
    const handleToggleVoiceMode = useCallback(() => setIsVoiceMode(prev => !prev), []);

    const handleGoBackToList = useCallback(() => setView('LIST'), [setView]);
    const handleToggleTranslation = useCallback(() => setShowTranslation(!showTranslation), [setShowTranslation, showTranslation]);
    const handleToggleTransliteration = useCallback(() => setShowTransliteration(!showTransliteration), [setShowTransliteration, showTransliteration]);
    const handleToggleLayoutMode = useCallback(
        () => setLayoutMode(layoutMode === 'SCROLL' ? 'PAGE' : 'SCROLL'),
        [layoutMode, setLayoutMode]
    );

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full h-full">
            {/* Header (Minimalist in Zen Mode) */}
            <div className={`transition-all duration-700`}>
                <QuranHeader
                    chapter={selectedChapter}
                    onBack={handleGoBackToList}
                    onOpenAudioSettings={() => setShowSettings(true)}
                    onOpenSettings={() => setShowSettings(true)}
                    onOpenSurahInfo={() => setShowSurahInfo(true)}
                    onGoToVerse={() => setShowGoToVerse(true)}
                    readingMode={readingMode}
                    onToggleReadingMode={toggleReadingMode}
                    showTranslation={showTranslation}
                    onToggleTranslation={handleToggleTranslation}
                    showTransliteration={showTransliteration}
                    onToggleTransliteration={handleToggleTransliteration}
                    selectedTranslationId={selectedTranslationId}
                    onTranslationChange={setSelectedTranslationId}
                    isAudioLoading={isAudioLoading}
                    layoutMode={layoutMode}
                    isZenMode={isZenMode} // Pass Zen Mode here
                    onToggleLayoutMode={handleToggleLayoutMode}
                />
            </div>

            {/* Reading Progress (Minimal in Zen Mode needed? Maybe hide for now) */}
            {!isZenMode && <ReadingProgressBar />}

            {/* === PAGE VIEW (MUSHAF MODE) === */}
            {layoutMode === 'PAGE' && (
                <div className="flex-1 overflow-y-auto w-full h-full bg-raudhah-ivory">
                    <Suspense
                        fallback={
                            <div className="h-full min-h-[50vh] flex items-center justify-center">
                                <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
                            </div>
                        }
                    >
                        <MushafView />
                    </Suspense>
                </div>
            )}

            {/* === SCROLL VIEW (LIST MODE) === */}
            {layoutMode === 'SCROLL' && (
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className={`flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide pb-32 transition-colors duration-1000 relative min-h-full ${isZenMode
                        ? 'bg-[#020617]'
                        : theme === 'raudhah' || theme === 'light'
                            ? 'bg-[var(--bg-main)]'
                            : 'bg-transparent' // Allow parent bg-midnight-gradient to show
                        }`}
                >

                    {/* 🌠 Starlight Background (Reading Mode only) */}
                    {isZenMode && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-teal-900/5 opacity-[0.03]"></div>
                            {/* Simple Star Particles (CSS-only for performance) */}
                            <div className="absolute top-20 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                            <div className="absolute top-40 right-1/3 w-1 h-1 bg-teal-400 rounded-full animate-pulse opacity-40 delay-[1000ms]"></div>
                            <div className="absolute bottom-60 left-10 w-0.5 h-0.5 bg-emerald-400 rounded-full animate-pulse opacity-30 delay-[2000ms]"></div>
                        </div>
                    )}

                    <div className="relative z-10">
                        {/* SURAH HEADER - Premium & Nature Integration */}
                        <div className={`relative rounded-[3rem] overflow-hidden min-h-[220px] flex flex-col items-center justify-center text-center p-8 mb-8 shadow-2xl ring-1 ring-white/10 group transition-all duration-700 ${isZenMode ? 'bg-transparent shadow-none ring-0' : ''}`}>
                            {/* Nature Background */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/assets/backgrounds/nature-surah.webp"
                                    alt="Nature Background"
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'raudhah' || theme === 'light' ? 'from-raudhah-ivory via-raudhah-ivory/40 to-transparent' : 'from-slate-900 via-slate-900/40 to-slate-900/80'}`} />
                                <div className={`absolute inset-0 bg-gradient-to-br from-raudhah-teal/10 via-transparent to-raudhah-teal/5 ${theme === 'raudhah' ? 'opacity-30' : 'opacity-20 mix-blend-overlay'}`}></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/10 backdrop-blur-md">
                                    <i className="fa-solid fa-kaaba text-raudhah-gold text-xs shadow-glow"></i>
                                    <span className="text-[10px] font-bold tracking-widest text-raudhah-teal/60 uppercase">
                                        {selectedChapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} Revelation
                                    </span>
                                </div>

                                <div>
                                    <h1 className="font-arabic text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-raudhah-teal to-raudhah-ink drop-shadow-sm mb-2">
                                        {selectedChapter.name_arabic}
                                    </h1>
                                    <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'raudhah' || theme === 'light' ? 'text-raudhah-ink' : 'text-white'}`}>
                                        {selectedChapter.name_simple}
                                    </h2>
                                    <p className="text-raudhah-teal/80 text-sm font-bold tracking-wide">
                                        {selectedChapter.translated_name.name}
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-4 text-[10px] text-raudhah-teal/40 font-bold uppercase tracking-widest pt-2">
                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-list-ol text-raudhah-gold"></i> {selectedChapter.verses_count} Verses
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-raudhah-teal/20"></span>
                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-arrow-down-9-1 text-raudhah-gold"></i> Order #{selectedChapter.revelation_order}
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
                                    <div key={i} className={`backdrop-blur-md border border-raudhah-teal/5 rounded-2xl p-6 animate-pulse ${theme === 'raudhah' || theme === 'light' ? 'bg-raudhah-teal/5' : 'bg-slate-800/20'}`}>
                                        <div className={`h-8 rounded mb-4 w-3/4 ml-auto ${theme === 'raudhah' || theme === 'light' ? 'bg-raudhah-teal/10' : 'bg-slate-700/50'}`} />
                                        <div className={`h-4 rounded w-full mb-2 ${theme === 'raudhah' || theme === 'light' ? 'bg-raudhah-teal/5' : 'bg-slate-700/30'}`} />
                                        <div className={`h-4 rounded w-2/3 ${theme === 'raudhah' || theme === 'light' ? 'bg-raudhah-teal/5' : 'bg-slate-700/30'}`} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div ref={verseListRef} className="max-w-4xl mx-auto">
                                {shouldVirtualize && (
                                    <div
                                        aria-hidden="true"
                                        style={{ height: `${virtualWindow.topSpacer}px` }}
                                    />
                                )}
                                <div className="space-y-4">
                                    {visibleVerses.map((verse) => (
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
                                {shouldVirtualize && (
                                    <div
                                        aria-hidden="true"
                                        style={{ height: `${virtualWindow.bottomSpacer}px` }}
                                    />
                                )}
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
                    <Suspense fallback={null}>
                        <VoiceActiveReader
                            verseKey={activeVerse.verse_key}
                            arabicText={activeVerse.text_uthmani || ''}
                            isActive={isVoiceMode}
                            onToggle={handleToggleVoiceMode}
                            onNextVerse={playNextVerse}
                            onVerseComplete={() => { }}
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
};

export default QuranReader;
