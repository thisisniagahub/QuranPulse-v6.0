import React, { useRef, useEffect } from 'react';
import { useQuran } from './contexts/QuranContext';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import QuranHeader from './QuranHeader';
import QuranVerseCard from './QuranVerseCard';
import QuranAudioPlayer from './QuranAudioPlayer';
import ReadingProgressBar from './ReadingProgressBar';
import AnimatedBismillah from './AnimatedBismillah';

const QuranReader: React.FC = () => {
    const {
        selectedChapter,
        verses,
        loadingVerses,
        isAudioLoading,
        
        // Settings
        fontSize,
        view, setView,
        readingMode, toggleReadingMode,
        showTranslation, setShowTranslation,
        showTransliteration, setShowTransliteration,
        showWordByWord,
        showTajwid,
        
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

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full h-full">
            {/* Header */}
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
            />

            {/* Reading Progress */}
            <ReadingProgressBar />

            {/* Verses Container */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide pb-32">
                 {/* Bismillah (except Surah 1 & 9) */}
                 {selectedChapter.id !== 1 && selectedChapter.id !== 9 && (
                    <AnimatedBismillah />
                 )}

                 {loadingVerses ? (
                    // Skeleton Loading
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-slate-800/30 rounded-2xl p-6 animate-pulse border border-slate-700/50">
                                <div className="h-8 bg-slate-700/50 rounded mb-4 w-3/4 ml-auto" />
                                <div className="h-4 bg-slate-700/30 rounded w-full mb-2" />
                                <div className="h-4 bg-slate-700/30 rounded w-2/3" />
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

             {/* Floating Audio Player */}
             <QuranAudioPlayer
                chapterName={selectedChapter.name_simple}
                onNext={playNextVerse}
                onPrevious={playPreviousVerse}
            />
        </div>
    );
};

export default QuranReader;
