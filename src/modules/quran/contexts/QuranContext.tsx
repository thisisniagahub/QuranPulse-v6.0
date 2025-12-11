import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { QuranChapter, QuranVerse, QuranWord, SemanticResult, ChatMessage, TafsirResult, MorphologyResult } from '../../../types';
import { analyzeMorphology } from '../../../services/aiService';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { getAllChapters, getVerses, getChapterAudio, getChapterAudioWithTimings } from '../../../services/quranService';
import { useQuery } from '@tanstack/react-query';

// --- Types ---
interface QuranState {
    // View
    view: 'LIST' | 'READING';
    selectedChapter: QuranChapter | null;
    
    // Settings
    fontSize: number;
    showTranslation: boolean;
    showTransliteration: boolean;
    showWordByWord: boolean;
    autoScroll: boolean;
    showTajwid: boolean;
    nightMode: boolean;
    repeatMode: 'none' | 'ayah' | 'surah';
    selectedReciterId: number;
    selectedTranslationId: number;
    
    // Feature Visibility States
    showSettings: boolean;
    showSurahInfo: boolean;
    showGoToVerse: boolean;
    showRangeRepeat: boolean;
    showReadingGoals: boolean;
    showBookmarkCollections: boolean;
    showThemeSettings: boolean;
    
    // Interactive States
    bookmarkedVerses: Set<string>;
    shareVerse: QuranVerse | null;
    hafazanVerse: QuranVerse | null;
    tafsirVerse: QuranVerse | null;
    notesVerse: QuranVerse | null;
    bookmarkVerse: QuranVerse | null; // For adding to collection
    selectedWord: { word: QuranWord; position: { x: number; y: number } } | null;
    readingMode: boolean; // Arabic Only Mode
    
    // Studio State
    studioVerse: QuranVerse | null;
    studioTab: 'CHAT' | 'TAFSIR' | 'ANALYSIS';
    
    // Search
    searchQuery: string;
    isSemanticMode: boolean;
    semanticResults: SemanticResult[];
    isSearchingSemantic: boolean;
    
    // Data (Read-only from queries usually, but exposed here for convenience if needed)
    chapters: QuranChapter[];
    verses: QuranVerse[];
    loadingChapters: boolean;
    loadingVerses: boolean;
    isAudioLoading: boolean;

    // Morphology
    morphologyData: MorphologyResult | null;
    loadingMorphology: boolean;

    // Actions
    setView: (view: 'LIST' | 'READING') => void;
    setSelectedChapter: (chapter: QuranChapter | null) => void;
    
    // Settings Actions
    setFontSize: (size: number) => void;
    setShowTranslation: (show: boolean) => void;
    setShowTransliteration: (show: boolean) => void;
    setShowWordByWord: (show: boolean) => void;
    setAutoScroll: (auto: boolean) => void;
    setShowTajwid: (show: boolean) => void;
    setNightMode: (mode: boolean) => void;
    setRepeatMode: (mode: 'none' | 'ayah' | 'surah') => void;
    setSelectedReciterId: (id: number) => void;
    setSelectedTranslationId: (id: number) => void;
    
    // Feature Toggles
    setShowSettings: (show: boolean) => void;
    setShowSurahInfo: (show: boolean) => void;
    setShowGoToVerse: (show: boolean) => void;
    setShowRangeRepeat: (show: boolean) => void;
    setShowReadingGoals: (show: boolean) => void;
    setShowBookmarkCollections: (show: boolean) => void;
    setShowThemeSettings: (show: boolean) => void;
    
    // Interactive Actions
    toggleBookmark: (verseKey: string) => void;
    setShareVerse: (verse: QuranVerse | null) => void;
    setHafazanVerse: (verse: QuranVerse | null) => void;
    setTafsirVerse: (verse: QuranVerse | null) => void;
    setNotesVerse: (verse: QuranVerse | null) => void;
    setBookmarkVerse: (verse: QuranVerse | null) => void;
    setSelectedWord: (data: { word: QuranWord; position: { x: number; y: number } } | null) => void;
    handleWordClick: (word: QuranWord) => void;
    toggleReadingMode: () => void;
    
    // Studio Actions
    openVerseStudio: (verse: QuranVerse) => void;
    closeVerseStudio: () => void;
    setStudioTab: (tab: 'CHAT' | 'TAFSIR' | 'ANALYSIS') => void;

    // Search Actions
    setSearchQuery: (query: string) => void;
    setIsSemanticMode: (isSemantic: boolean) => void;
    handleSemanticSearch: () => void;

    // Audio Helpers
    playVerse: (verseKey: string) => void;
    playNextVerse: () => void;
    playPreviousVerse: () => void;
}

const QuranContext = createContext<QuranState | undefined>(undefined);

// --- Provider ---
export const QuranProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. View State
    const [view, setView] = useState<'LIST' | 'READING'>('LIST');
    const [selectedChapter, setSelectedChapter] = useState<QuranChapter | null>(null);

    // 2. Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState(32);
    const [showTranslation, setShowTranslation] = useState(true);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [showWordByWord, setShowWordByWord] = useState(true);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showTajwid, setShowTajwid] = useState(false);
    const [nightMode, setNightMode] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'none' | 'ayah' | 'surah'>('none');
    const [selectedReciterId, setSelectedReciterId] = useState(7);
    const [selectedTranslationId, setSelectedTranslationId] = useState(131);

    // 3. Feature Visibility
    const [showSurahInfo, setShowSurahInfo] = useState(false);
    const [showGoToVerse, setShowGoToVerse] = useState(false);
    const [showRangeRepeat, setShowRangeRepeat] = useState(false);
    const [showReadingGoals, setShowReadingGoals] = useState(false);
    const [showBookmarkCollections, setShowBookmarkCollections] = useState(false);
    const [showThemeSettings, setShowThemeSettings] = useState(false);

    // 4. Interactive State
    const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(new Set());
    const [shareVerse, setShareVerse] = useState<QuranVerse | null>(null);
    const [hafazanVerse, setHafazanVerse] = useState<QuranVerse | null>(null);
    const [tafsirVerse, setTafsirVerse] = useState<QuranVerse | null>(null);
    const [notesVerse, setNotesVerse] = useState<QuranVerse | null>(null);
    const [bookmarkVerse, setBookmarkVerse] = useState<QuranVerse | null>(null);
    const [selectedWord, setSelectedWord] = useState<{ word: QuranWord; position: { x: number; y: number } } | null>(null);
    const [readingMode, setReadingMode] = useState(false);

    // 5. Studio
    const [studioVerse, setStudioVerse] = useState<QuranVerse | null>(null);
    const [studioTab, setStudioTab] = useState<'CHAT' | 'TAFSIR' | 'ANALYSIS'>('CHAT');
    const [morphologyData, setMorphologyData] = useState<MorphologyResult | null>(null);
    const [loadingMorphology, setLoadingMorphology] = useState(false);

    // 6. Search
    const [searchQuery, setSearchQuery] = useState('');
    const [isSemanticMode, setIsSemanticMode] = useState(false);
    const [semanticResults, setSemanticResults] = useState<SemanticResult[]>([]);
    const [isSearchingSemantic, setIsSearchingSemantic] = useState(false);

    // --- Data Fetching Hooks (Moved from index.tsx) ---
    const { data: chapters = [], isLoading: loadingChapters } = useQuery({
        queryKey: ['chapters'],
        queryFn: getAllChapters,
        staleTime: Infinity,
    });

    const { data: verses = [], isLoading: loadingVerses } = useQuery({
        queryKey: ['verses', selectedChapter?.id, selectedTranslationId],
        queryFn: () => getVerses(selectedChapter!.id, selectedTranslationId),
        enabled: !!selectedChapter,
        staleTime: 1000 * 60 * 60,
    });

    // Audio Hooks
    const { playTrack, stopTrack, currentTrack, setOnEnded, setWordSegments } = useAudioPlayer();
    
    const { data: audioMap = {}, isLoading: loadingAudio } = useQuery({
        queryKey: ['audio', selectedChapter?.id, selectedReciterId],
        queryFn: () => getChapterAudio(selectedChapter!.id, selectedReciterId),
        enabled: !!selectedChapter,
        staleTime: 1000 * 60 * 60,
    });

    const { data: timingMap } = useQuery({
        queryKey: ['audioTimings', selectedChapter?.id, selectedReciterId],
        queryFn: () => getChapterAudioWithTimings(selectedChapter!.id, selectedReciterId),
        enabled: !!selectedChapter,
        staleTime: 1000 * 60 * 60,
    });
    
    // Actions Implementation
    const toggleBookmark = (verseKey: string) => {
        setBookmarkedVerses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(verseKey)) newSet.delete(verseKey);
            else newSet.add(verseKey);
            return newSet;
        });
    };

    const toggleReadingMode = () => {
        setReadingMode(!readingMode);
    };

    const openVerseStudio = (verse: QuranVerse) => {
        setStudioVerse(verse);
        setStudioTab('CHAT');
    };

    const handleWordClick = async (word: QuranWord) => {
        setMorphologyData(null);
        setLoadingMorphology(true);
        try {
            const result = await analyzeMorphology(word.text_uthmani, word.translation?.text || "");
            setMorphologyData(result);
        } catch (e) {
            console.error('Morphology error:', e);
        } finally {
            setLoadingMorphology(false);
        }
    };

    const closeVerseStudio = () => {
        setStudioVerse(null);
    };

    const handleSemanticSearch = async () => {
        // Implementation placeholder - would need to import service
        // For now we keep the state here
        setIsSearchingSemantic(true);
        // ... call service ...
        setIsSearchingSemantic(false);
    };

    // Audio Logic
    const playVerse = async (verseKey: string) => {
        if (!audioMap[verseKey]) return;
        
        await playTrack({
            url: audioMap[verseKey],
            title: `Surah ${selectedChapter?.name_simple}`,
            subtitle: `Ayah ${verseKey.split(':')[1]}`,
            verseKey,
            reciterId: selectedReciterId
        });

        if (timingMap) {
            const verseTimings = timingMap.get(verseKey);
            setWordSegments(verseTimings ? verseTimings.segments : []);
        }
    };

    const playNextVerse = () => {
        if (currentTrack?.verseKey && verses.length) {
            const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);
            if (currentIndex !== -1 && currentIndex < verses.length - 1) {
                playVerse(verses[currentIndex + 1].verse_key);
            }
        }
    };

    const playPreviousVerse = () => {
        if (currentTrack?.verseKey && verses.length) {
            const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);
            if (currentIndex > 0) {
                playVerse(verses[currentIndex - 1].verse_key);
            }
        }
    };

    // Auto-play effect
    useEffect(() => {
        setOnEnded(() => {
            if (currentTrack?.verseKey) {
                const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);
                if (currentIndex !== -1 && currentIndex < verses.length - 1) {
                    playVerse(verses[currentIndex + 1].verse_key);
                }
            }
        });
    }, [verses, currentTrack, audioMap]);

    return (
        <QuranContext.Provider value={{
            view, setView,
            selectedChapter, setSelectedChapter: (c) => { setSelectedChapter(c); if(c) stopTrack(); },
            
            fontSize, setFontSize,
            showTranslation, setShowTranslation,
            showTransliteration, setShowTransliteration,
            showWordByWord, setShowWordByWord,
            autoScroll, setAutoScroll,
            showTajwid, setShowTajwid,
            nightMode, setNightMode,
            repeatMode, setRepeatMode,
            selectedReciterId, setSelectedReciterId,
            selectedTranslationId, setSelectedTranslationId,
            
            showSettings, setShowSettings,
            showSurahInfo, setShowSurahInfo,
            showGoToVerse, setShowGoToVerse,
            showRangeRepeat, setShowRangeRepeat,
            showReadingGoals, setShowReadingGoals,
            showBookmarkCollections, setShowBookmarkCollections,
            showThemeSettings, setShowThemeSettings,
            
            bookmarkedVerses, toggleBookmark,
            shareVerse, setShareVerse,
            hafazanVerse, setHafazanVerse,
            tafsirVerse, setTafsirVerse,
            notesVerse, setNotesVerse,
            bookmarkVerse, setBookmarkVerse,
            selectedWord, setSelectedWord,
            morphologyData, loadingMorphology, handleWordClick,
            readingMode, toggleReadingMode,
            
            studioVerse, openVerseStudio, closeVerseStudio,
            studioTab, setStudioTab,
            
            searchQuery, setSearchQuery,
            isSemanticMode, setIsSemanticMode,
            semanticResults, 
            isSearchingSemantic,
            handleSemanticSearch, // Logic to be passed or handled in components if complex
            
            chapters, loadingChapters,
            verses, loadingVerses,
            isAudioLoading: loadingAudio,
            
            playVerse, playNextVerse, playPreviousVerse
        }}>
            {children}
        </QuranContext.Provider>
    );
};

export const useQuran = () => {
    const context = useContext(QuranContext);
    if (!context) throw new Error("useQuran must be used within a QuranProvider");
    return context;
};
