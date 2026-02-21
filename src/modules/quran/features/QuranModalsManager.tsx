import React, { Suspense } from 'react';
import { useQuran } from '../contexts/QuranContext';
import { useGamification } from '../../../contexts/GamificationContext';

// Eager Imports (Lightweight)
import ShareCard from '../components/ShareCard';
import WordTooltip from '../components/WordTooltip';
import QuranTutorial from '../components/QuranTutorial';

// Lazy Imports (Heavy or Infrequently Used)
const QuranDisplaySettings = React.lazy(() => import('./settings/QuranDisplaySettings'));
const VerseStudio = React.lazy(() => import('./studio/VerseStudio'));
const HafazanMode = React.lazy(() => import('./reader/HafazanMode'));
const SurahInfoPanel = React.lazy(() => import('../components/SurahInfoPanel'));
const GoToVerseModal = React.lazy(() => import('../components/GoToVerseModal'));
const TafsirPanel = React.lazy(() => import('./studio/TafsirPanel'));
const RangeRepeatModal = React.lazy(() => import('./reader/RangeRepeatModal'));
const VerseNotesModal = React.lazy(() => import('./studio/VerseNotesModal'));
const ReadingGoalsModal = React.lazy(() => import('./settings/ReadingGoalsModal'));
const BookmarkCollectionsModal = React.lazy(() => import('./settings/BookmarkCollectionsModal'));
const ThemeSettingsModal = React.lazy(() => import('./settings/ThemeSettingsModal'));
const IqraGraduation = React.lazy(() => import('../components/IqraGraduation'));

export const QuranModalsManager: React.FC = () => {
    const {
        // UI State
        showSettings, setShowSettings,
        showSurahInfo, setShowSurahInfo,
        showGoToVerse, setShowGoToVerse,
        showRangeRepeat, setShowRangeRepeat,
        showReadingGoals, setShowReadingGoals,
        showBookmarkCollections, setShowBookmarkCollections,
        showThemeSettings, setShowThemeSettings,
        showGraduation, setShowGraduation,
        showTutorial, markTutorialSeen,

        // Interactive State
        shareVerse, setShareVerse,
        hafazanVerse, setHafazanVerse,
        tafsirVerse, setTafsirVerse,
        notesVerse, setNotesVerse,
        bookmarkVerse, setBookmarkVerse,
        selectedWord, setSelectedWord,
        studioVerse, closeVerseStudio,
        studioTab, setStudioTab,

        // Data & Settings (Passed to modals)
        selectedChapter,
        verses,
        fontSize, setFontSize,
        showTranslation, setShowTranslation,
        showTransliteration, setShowTransliteration,
        selectedTranslationId, setSelectedTranslationId,
        selectedReciterId, setSelectedReciterId,
        showWordByWord, setShowWordByWord,
        autoScroll, setAutoScroll,
        enableTranslationAudio, setEnableTranslationAudio,
        showTajwid, setShowTajwid,
        repeatMode, setRepeatMode,
        theme, setTheme,
        
        // Morphology
        morphologyData,
        
    } = useQuran();

    const { addXP } = useGamification();

    // Loading Fallback
    const Fallback = () => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"><div className="w-8 h-8 border-2 border-raudhah-teal rounded-full animate-spin border-t-transparent"></div></div>;

    return (
        <Suspense fallback={<Fallback />}>
            {/* Settings Modal */}
            {showSettings && (
                <QuranDisplaySettings
                    onClose={() => setShowSettings(false)}
                    showTranslation={showTranslation}
                    setShowTranslation={setShowTranslation}
                    showTransliteration={showTransliteration}
                    setShowTransliteration={setShowTransliteration}
                    selectedTranslationId={selectedTranslationId}
                    setSelectedTranslationId={setSelectedTranslationId}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    selectedReciterId={selectedReciterId}
                    setSelectedReciterId={setSelectedReciterId}
                    showWordByWord={showWordByWord}
                    setShowWordByWord={setShowWordByWord}
                    autoScroll={autoScroll}
                    setAutoScroll={setAutoScroll}
                    enableTranslationAudio={enableTranslationAudio}
                    setEnableTranslationAudio={setEnableTranslationAudio}
                    showTajwid={showTajwid}
                    setShowTajwid={setShowTajwid}
                    repeatMode={repeatMode}
                    setRepeatMode={setRepeatMode}
                    theme={theme}
                    setTheme={setTheme}
                    onOpenReadingGoals={() => { setShowSettings(false); setShowReadingGoals(true); }}
                    onOpenTheme={() => { setShowSettings(false); setShowThemeSettings(true); }}
                    onOpenRangeRepeat={() => { setShowSettings(false); setShowRangeRepeat(true); }}
                />
            )}

            {/* Verse Studio Modal (Self-contained Chat State recommended) */}
            {studioVerse && selectedChapter && (
                <VerseStudio
                    verse={studioVerse}
                    chapter={selectedChapter}
                    onClose={closeVerseStudio}
                    tab={studioTab}
                    setTab={setStudioTab}
                    tafsirData={null}
                    loadingTafsir={false}
                    morphologyData={morphologyData}
                />
            )}

            {/* Share Card Modal */}
            {shareVerse && (
                <ShareCard
                    verse={shareVerse}
                    surahName={selectedChapter?.name_simple || ''}
                    onClose={() => setShareVerse(null)}
                />
            )}

            {/* Hafazan Mode Modal */}
            {hafazanVerse && (
                <HafazanMode
                    verse={hafazanVerse}
                    fontSize={fontSize}
                    onComplete={() => {
                        addXP(10, "Diselesaikan Hafazan");
                        setHafazanVerse(null);
                        // Toast logic handled in parent or context? 
                        // Ideally GamificationContext handles the toast.
                    }}
                />
            )}

            {/* Surah Info Panel */}
            {selectedChapter && (
                <SurahInfoPanel
                    chapter={selectedChapter}
                    isOpen={showSurahInfo}
                    onClose={() => setShowSurahInfo(false)}
                />
            )}

            {/* Go to Verse Modal */}
            {selectedChapter && (
                <GoToVerseModal
                    isOpen={showGoToVerse}
                    onClose={() => setShowGoToVerse(false)}
                    totalVerses={selectedChapter.verses_count}
                    currentChapter={selectedChapter.id}
                    onGoToVerse={() => {}} // Handled by QuranReader refs via Context in future
                />
            )}

            {/* Tafsir Panel */}
            {tafsirVerse && (
                <TafsirPanel
                    verse={tafsirVerse}
                    isOpen={!!tafsirVerse}
                    onClose={() => setTafsirVerse(null)}
                />
            )}

            {/* Word Tooltip */}
            {selectedWord && (
                <WordTooltip
                    word={selectedWord.word}
                    isOpen={!!selectedWord}
                    onClose={() => setSelectedWord(null)}
                    position={selectedWord.position}
                />
            )}

            {/* Range Repeat Modal */}
            {selectedChapter && (
                <RangeRepeatModal
                    isOpen={showRangeRepeat}
                    onClose={() => setShowRangeRepeat(false)}
                    verses={verses}
                    currentChapter={selectedChapter.id}
                    onStartRepeat={() => { }}
                />
            )}

            {/* Reading Goals */}
            <ReadingGoalsModal
                isOpen={showReadingGoals}
                onClose={() => setShowReadingGoals(false)}
            />

            {/* Bookmark Collections */}
            <BookmarkCollectionsModal
                isOpen={showBookmarkCollections}
                onClose={() => { setShowBookmarkCollections(false); setBookmarkVerse(null); }}
                currentVerse={bookmarkVerse}
                onAddToCollection={() => { }}
            />

            {/* Theme Settings */}
            <ThemeSettingsModal
                isOpen={showThemeSettings}
                onClose={() => setShowThemeSettings(false)}
                currentTheme={theme}
                currentFont={'uthmani'}
                onThemeChange={setTheme}
                onFontChange={() => { }}
            />

            {/* Graduation Ceremony */}
            <IqraGraduation
                isOpen={showGraduation}
                onClose={() => setShowGraduation(false)}
                userName="Sahabat Al-Quran"
                iqraLevel={6}
                completionDate={new Date().toISOString()}
                onStartQuran={() => {
                    setShowGraduation(false);
                    // navigate to quran? (Already in Quran module)
                }}
            />

            {/* Tutorial Modal */}
            <QuranTutorial
                isOpen={showTutorial}
                onClose={markTutorialSeen}
            />
        </Suspense>
    );
};
