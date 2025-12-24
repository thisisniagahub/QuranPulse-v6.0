import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QuranChapter, QuranVerse, QuranWord, MorphologyResult } from '../../../types';
import { getAllChapters, getVerses, getChapterAudio, getChapterAudioWithTimings } from '../../../services/quranService';
import { analyzeMorphology } from '../../../services/aiService';
import { useQuranSettings } from './QuranSettingsContext';

interface QuranDataState {
    chapters: QuranChapter[];
    loadingChapters: boolean;

    selectedChapter: QuranChapter | null;
    setSelectedChapter: (chapter: QuranChapter | null) => void;

    verses: QuranVerse[];
    loadingVerses: boolean;

    audioMap: Record<string, string>;
    loadingAudio: boolean;
    timingMap: Map<string, any> | undefined;

    morphologyData: MorphologyResult | null;
    loadingMorphology: boolean;
    handleWordClick: (word: QuranWord) => void;
}

const QuranDataContext = createContext<QuranDataState | undefined>(undefined);

export const QuranDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { selectedTranslationId, selectedReciterId } = useQuranSettings();
    const [selectedChapter, setSelectedChapter] = useState<QuranChapter | null>(null);

    // Fetch Chapters
    const { data: chapters = [], isLoading: loadingChapters } = useQuery({
        queryKey: ['chapters'],
        queryFn: getAllChapters,
        staleTime: Infinity,
    });

    // Fetch Verses
    const { data: verses = [], isLoading: loadingVerses } = useQuery({
        queryKey: ['verses', selectedChapter?.id, selectedTranslationId],
        queryFn: () => getVerses(selectedChapter!.id, selectedTranslationId),
        enabled: !!selectedChapter,
        staleTime: 1000 * 60 * 60,
    });

    // Fetch Audio
    const { data: audioMap = {}, isLoading: loadingAudio } = useQuery({
        queryKey: ['audio', selectedChapter?.id, selectedReciterId],
        queryFn: () => getChapterAudio(selectedChapter!.id, selectedReciterId),
        enabled: !!selectedChapter,
        staleTime: 1000 * 60 * 60,
    });

    // Fetch Timings
    const { data: timingMap } = useQuery({
        queryKey: ['audioTimings', selectedChapter?.id, selectedReciterId],
        queryFn: () => getChapterAudioWithTimings(selectedChapter!.id, selectedReciterId),
        enabled: !!selectedChapter,
        staleTime: 1000 * 60 * 60,
    });

    // Morphology Analysis
    const [morphologyData, setMorphologyData] = useState<MorphologyResult | null>(null);
    const [loadingMorphology, setLoadingMorphology] = useState(false);

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

    return (
        <QuranDataContext.Provider value={{
            chapters, loadingChapters,
            selectedChapter, setSelectedChapter,
            verses, loadingVerses,
            audioMap, loadingAudio, timingMap,
            morphologyData, loadingMorphology, handleWordClick
        }}>
            {children}
        </QuranDataContext.Provider>
    );
};

export const useQuranData = () => {
    const context = useContext(QuranDataContext);
    if (!context) throw new Error("useQuranData must be used within a QuranDataProvider");
    return context;
};
