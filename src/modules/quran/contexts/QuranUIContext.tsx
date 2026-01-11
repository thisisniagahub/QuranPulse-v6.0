import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuranVerse, QuranWord, SemanticResult } from '../../../types';
import { useSemanticSearch } from '../features/search/useSemanticSearch';

interface QuranUIState {
    view: 'LIST' | 'READING';
    setView: (view: 'LIST' | 'READING') => void;
    layoutMode: 'PAGE' | 'SCROLL';
    setLayoutMode: (mode: 'PAGE' | 'SCROLL') => void;

    // Visibility
    showSettings: boolean; setShowSettings: (show: boolean) => void;
    showSurahInfo: boolean; setShowSurahInfo: (show: boolean) => void;
    showGoToVerse: boolean; setShowGoToVerse: (show: boolean) => void;
    showRangeRepeat: boolean; setShowRangeRepeat: (show: boolean) => void;
    showReadingGoals: boolean; setShowReadingGoals: (show: boolean) => void;
    showBookmarkCollections: boolean; setShowBookmarkCollections: (show: boolean) => void;
    showThemeSettings: boolean; setShowThemeSettings: (show: boolean) => void;
    showGraduation: boolean; setShowGraduation: (show: boolean) => void;

    // Interactive
    bookmarkedVerses: Set<string>;
    toggleBookmark: (verseKey: string) => void;
    shareVerse: QuranVerse | null;
    setShareVerse: (verse: QuranVerse | null) => void;
    hafazanVerse: QuranVerse | null;
    setHafazanVerse: (verse: QuranVerse | null) => void;
    tafsirVerse: QuranVerse | null;
    setTafsirVerse: (verse: QuranVerse | null) => void;
    notesVerse: QuranVerse | null;
    setNotesVerse: (verse: QuranVerse | null) => void;
    bookmarkVerse: QuranVerse | null;
    setBookmarkVerse: (verse: QuranVerse | null) => void;
    selectedWord: { word: QuranWord; position: { x: number; y: number } } | null;
    setSelectedWord: (data: { word: QuranWord; position: { x: number; y: number } } | null) => void;
    readingMode: boolean; // Arabic Only
    toggleReadingMode: () => void;

    // Studio
    studioVerse: QuranVerse | null;
    openVerseStudio: (verse: QuranVerse) => void;
    closeVerseStudio: () => void;
    studioTab: 'CHAT' | 'TAFSIR' | 'ANALYSIS' | 'TADABBUR';
    setStudioTab: (tab: 'CHAT' | 'TAFSIR' | 'ANALYSIS' | 'TADABBUR') => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSemanticMode: boolean;
    setIsSemanticMode: (is: boolean) => void;
    semanticResults: SemanticResult[];
    // setSemanticResults removed - managed by hook
    isSearchingSemantic: boolean;
    // setIsSearchingSemantic removed - managed by hook
    handleSemanticSearch: () => void;

    // Voice & ASR
    isVoiceSearchActive: boolean;
    setIsVoiceSearchActive: (is: boolean) => void;
    lastVoiceTranscription: string;
    setLastVoiceTranscription: (t: string) => void;
}

const QuranUIContext = createContext<QuranUIState | undefined>(undefined);

export const QuranUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. View State
    const [view, setView] = useState<'LIST' | 'READING'>('LIST');
    const [layoutMode, setLayoutMode] = useState<'SCROLL' | 'PAGE'>('SCROLL');

    // 2. Modals
    const [showSettings, setShowSettings] = useState(false);
    const [showSurahInfo, setShowSurahInfo] = useState(false);
    const [showGoToVerse, setShowGoToVerse] = useState(false);
    const [showRangeRepeat, setShowRangeRepeat] = useState(false);
    const [showReadingGoals, setShowReadingGoals] = useState(false);
    const [showBookmarkCollections, setShowBookmarkCollections] = useState(false);
    const [showThemeSettings, setShowThemeSettings] = useState(false);
    const [showGraduation, setShowGraduation] = useState(false);

    // 3. Interactive
    const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(new Set());
    const [shareVerse, setShareVerse] = useState<QuranVerse | null>(null);
    const [hafazanVerse, setHafazanVerse] = useState<QuranVerse | null>(null);
    const [tafsirVerse, setTafsirVerse] = useState<QuranVerse | null>(null);
    const [notesVerse, setNotesVerse] = useState<QuranVerse | null>(null);
    const [bookmarkVerse, setBookmarkVerse] = useState<QuranVerse | null>(null);
    const [selectedWord, setSelectedWord] = useState<{ word: QuranWord; position: { x: number; y: number } } | null>(null);
    const [readingMode, setReadingMode] = useState(false);

    // 4. Studio
    const [studioVerse, setStudioVerse] = useState<QuranVerse | null>(null);
    const [studioTab, setStudioTab] = useState<'CHAT' | 'TAFSIR' | 'ANALYSIS' | 'TADABBUR'>('CHAT');

    // 5. Search
    const [searchQuery, setSearchQuery] = useState('');
    const [isSemanticMode, setIsSemanticMode] = useState(false);
    
    // Use Real Semantic Search Hook
    const semanticSearch = useSemanticSearch();

    // 6. Voice
    const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
    const [lastVoiceTranscription, setLastVoiceTranscription] = useState('');

    // Actions
    const toggleBookmark = (verseKey: string) => {
        setBookmarkedVerses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(verseKey)) newSet.delete(verseKey);
            else newSet.add(verseKey);
            return newSet;
        });
    };

    const toggleReadingMode = () => setReadingMode(!readingMode);

    const openVerseStudio = (verse: QuranVerse) => {
        setStudioVerse(verse);
        setStudioTab('CHAT');
    };

    const closeVerseStudio = () => setStudioVerse(null);

    const handleSemanticSearch = () => {
        semanticSearch.search(searchQuery);
    };

    return (
        <QuranUIContext.Provider value={{
            view, setView,
            layoutMode, setLayoutMode,
            showSettings, setShowSettings,
            showSurahInfo, setShowSurahInfo,
            showGoToVerse, setShowGoToVerse,
            showRangeRepeat, setShowRangeRepeat,
            showReadingGoals, setShowReadingGoals,
            showBookmarkCollections, setShowBookmarkCollections,
            showThemeSettings, setShowThemeSettings,
            showGraduation, setShowGraduation,
            bookmarkedVerses, toggleBookmark,
            shareVerse, setShareVerse,
            hafazanVerse, setHafazanVerse,
            tafsirVerse, setTafsirVerse,
            notesVerse, setNotesVerse,
            bookmarkVerse, setBookmarkVerse,
            selectedWord, setSelectedWord,
            readingMode, toggleReadingMode,
            studioVerse, openVerseStudio, closeVerseStudio,
            studioTab, setStudioTab,
            searchQuery, setSearchQuery,
            isSemanticMode, setIsSemanticMode,
            semanticResults: semanticSearch.results as SemanticResult[],
            isSearchingSemantic: semanticSearch.isSearching,
            handleSemanticSearch,
            isVoiceSearchActive, setIsVoiceSearchActive,
            lastVoiceTranscription, setLastVoiceTranscription
        }}>
            {children}
        </QuranUIContext.Provider>
    );
};

export const useQuranUI = () => {
    const context = useContext(QuranUIContext);
    if (!context) throw new Error("useQuranUI must be used within a QuranUIProvider");
    return context;
};
