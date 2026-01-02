/**
 * 📖 Al-Quran Module - Refactored with Context
 * 
 * FEATURES:
 * ✅ Modular component architecture
 * ✅ Centralized State Management (QuranContext)
 * ✅ Improved Perforamnce
 */

import React, { useEffect, useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';

// Context
import { QuranProvider, useQuran } from './contexts/QuranContext';

// Sub-components
import QuranList from './features/list/QuranList';
import QuranReader from './features/reader/QuranReader';
import VerseStudio from './features/studio/VerseStudio';
import QuranDisplaySettings from './features/settings/QuranDisplaySettings';
import ShareCard from './components/ShareCard';
import HafazanMode from './features/reader/HafazanMode';
import SurahInfoPanel from './components/SurahInfoPanel';
import WordTooltip from './components/WordTooltip';
import GoToVerseModal from './components/GoToVerseModal';
import TafsirPanel from './features/studio/TafsirPanel';
import RangeRepeatModal from './features/reader/RangeRepeatModal';
import VerseNotesModal from './features/studio/VerseNotesModal';
import ReadingGoalsModal from './features/settings/ReadingGoalsModal';
import BookmarkCollectionsModal from './features/settings/BookmarkCollectionsModal';
import ThemeSettingsModal from './features/settings/ThemeSettingsModal';
import QuranTutorial from './components/QuranTutorial';
import { chatWithVerseContext } from '../../services/aiService';

const QuranContent: React.FC = () => {
    const {
        // View State
        view, setView,
        selectedChapter, setSelectedChapter,

        // Data
        chapters, loadingChapters,
        verses,

        // Actions
        handleWordClick,

        // Feature States
        showSettings, setShowSettings,
        showSurahInfo, setShowSurahInfo,
        showGoToVerse, setShowGoToVerse,
        showRangeRepeat, setShowRangeRepeat,
        showReadingGoals, setShowReadingGoals,
        showBookmarkCollections, setShowBookmarkCollections,
        showThemeSettings, setShowThemeSettings,

        // Interactive States
        shareVerse, setShareVerse,
        hafazanVerse, setHafazanVerse,
        tafsirVerse, setTafsirVerse,
        notesVerse, setNotesVerse,
        bookmarkVerse, setBookmarkVerse,
        selectedWord, setSelectedWord,
        morphologyData,

        // Studio
        studioVerse,
        studioTab, setStudioTab,
        openVerseStudio, closeVerseStudio,

        // Search
        searchQuery, setSearchQuery,
        isSemanticMode, setIsSemanticMode,
        handleSemanticSearch,
        isSearchingSemantic,
        semanticResults,

        // Settings State (for passing to modals)
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
        showTutorial, markTutorialSeen

    } = useQuran();

    // Gamification
    const { addXP } = useGamification();
    const [xpToast, setXpToast] = useState({ show: false, amount: 0, message: '' });

    // Local state for Chat (Chat history is often transient)
    // Actually Context *could* hold chat, but typically chat resets on close.
    // The previous implementation had chatMessages in index.tsx
    // Let's keep it local here or move to Context if we want persistence.
    // For now, let's keep it here to avoid changing too much logic at once, 
    // BUT VerseStudio needs it.
    // If I keep it here, I pass it to VerseStudio.
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Reset chat when studio opens
    useEffect(() => {
        if (studioVerse) {
            setChatMessages([{
                id: 'welcome',
                role: 'assistant',
                content: `Assalamualaikum. Saya Ustaz AI. Tanyalah saya apa sahaja tentang Surah ${selectedChapter?.name_simple}, Ayat ${studioVerse.verse_key.split(':')[1]}. Saya boleh huraikan tafsir, hukum tajwid, atau pengajaran ayat ini.`,
                timestamp: Date.now()
            }]);
        }
    }, [studioVerse]);

    // Handle Chat Send (Studio)
    const handleStudioSend = async () => {
        if (!chatInput.trim() || !studioVerse) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput,
            timestamp: Date.now()
        };

        setChatMessages(prev => [...prev, userMsg]);
        const currentInput = chatInput;
        setChatInput('');
        setIsChatLoading(true);

        try {
            // Context: Verse text and translation should ideally be passed, 
            // but fetching verse text might require API if not fully loaded.
            // For now, passing verse key is enough as aiService handles lookup/context.
            const response = await chatWithVerseContext(
                studioVerse.verse_key,
                studioVerse.text_uthmani || "",
                currentInput
            );

            setChatMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            }]);
        } catch (error) {
            console.error(error);
            setChatMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Maaf, saya menghadapi masalah untuk menjawab soalan ini. Sila cuba lagi.",
                timestamp: Date.now(),
                isError: true
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#020617] overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1E42] via-[#020617] to-black pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00BFFF]/5 blur-3xl rounded-full pointer-events-none" />

            {/* === LIST VIEW === */}
            {view === 'LIST' && (
                <div className="flex-1 overflow-y-auto relative z-10 w-full">
                    {loadingChapters ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <QuranList
                            chapters={chapters}
                            loading={loadingChapters}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onChapterSelect={(c) => {
                                setSelectedChapter(c);
                                setView('READING');
                            }}
                            isSemanticMode={isSemanticMode}
                            setIsSemanticMode={setIsSemanticMode}
                            handleSemanticSearch={handleSemanticSearch}
                            isSearchingSemantic={isSearchingSemantic}
                            semanticResults={semanticResults}
                        />
                    )}
                </div>
            )}

            {/* === READING VIEW === */}
            {view === 'READING' && (
                <QuranReader />
            )}

            {/* === MODALS === */}

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

            {/* Verse Studio Modal */}
            {studioVerse && (
                <VerseStudio
                    verse={studioVerse}
                    chapter={selectedChapter}
                    onClose={closeVerseStudio}
                    tab={studioTab}
                    setTab={setStudioTab}
                    // Chat Props
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    handleSend={handleStudioSend} // Needs Impl
                    isChatLoading={isChatLoading}
                    // Data
                    tafsirData={null} // Context needs to handle tafsir fetch if needed, or keeping it local in component
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
                        setXpToast({ show: true, amount: 10, message: "Hafazan Selesai" });
                        setTimeout(() => setXpToast(prev => ({ ...prev, show: false })), 3000);
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
                    onGoToVerse={(verseKey) => {
                        // We need a way to scroll to verse in QuranReader
                        // QuranReader handles scrolling via ref logic.
                        // Ideally GoToVerse just plays the verse or we expose a method.
                        // For now we can play it?
                        // playVerse(verseKey);
                    }}
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

            {/* Tutorial Modal */}
            <QuranTutorial
                isOpen={showTutorial}
                onClose={markTutorialSeen}
            />

            {/* XP Toast */}
            <div className={`fixed top-24 left-1/2 -translate-x-1/2 bg-[#0A1E42]/90 backdrop-blur-md border border-amber-500/30 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 transition-all duration-500 ${xpToast.show ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-amber-500/20">
                    +{xpToast.amount}
                </div>
                <div>
                    <p className="font-bold text-sm text-amber-100">XP Diperoleh!</p>
                    <p className="text-[10px] text-amber-300/80">{xpToast.message}</p>
                </div>
            </div>

        </div>
    );
};

// Import QueryClient and QueryClientProvider directly for fallback
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a fallback QueryClient for the module
const moduleQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const Quran: React.FC = () => {
    return (
        <QueryClientProvider client={moduleQueryClient}>
            <QuranProvider>
                <QuranContent />
            </QuranProvider>
        </QueryClientProvider>
    );
};

export default Quran;


