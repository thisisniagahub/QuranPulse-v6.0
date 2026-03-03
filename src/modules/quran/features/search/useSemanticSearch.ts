/**
 * 🔍 useSemanticSearch Hook
 * Handles semantic search logic using Supabase pgvector
 */

import { startTransition, useState, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';

export interface SemanticSearchResult {
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    arabicText: string;
    translation: string;
    similarity: number;
}

interface UseSemanticSearchReturn {
    search: (query: string) => Promise<void>;
    results: SemanticSearchResult[];
    isSearching: boolean;
    error: string | null;
    clearResults: () => void;
}

// Simple keyword-based fallback search (until embeddings are set up)
const KEYWORD_MAPPINGS: Record<string, string[]> = {
    'sabar': ['patience', 'patient', 'perseverance', 'steadfast'],
    'taqwa': ['piety', 'fear allah', 'god-conscious', 'righteous'],
    'solat': ['prayer', 'salat', 'worship', 'prostrate'],
    'doa': ['supplication', 'call upon', 'invoke', 'prayer'],
    'syukur': ['grateful', 'thankful', 'gratitude', 'thanks'],
    'taubat': ['repent', 'repentance', 'forgiveness', 'turn back'],
    'rezeki': ['provision', 'sustenance', 'rizq', 'wealth'],
    'keluarga': ['family', 'parents', 'children', 'spouse'],
    'akhirat': ['hereafter', 'afterlife', 'day of judgment', 'resurrection'],
    'syurga': ['paradise', 'heaven', 'garden', 'jannah'],
    'neraka': ['hell', 'fire', 'punishment', 'jahannam'],
};

export function useSemanticSearch(): UseSemanticSearchReturn {
    const [results, setResults] = useState<SemanticSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (query: string) => {
        if (!query || query.trim().length < 3) {
            setError('Sila masukkan sekurang-kurangnya 3 aksara');
            return;
        }

        setIsSearching(true);
        setError(null);
        startTransition(() => setResults([]));

        try {
            // Try pgvector semantic search first
            const { data: vectorResults, error: vectorError } = await supabase.rpc(
                'search_verses_semantic',
                { query_text: query.toLowerCase(), match_count: 10 }
            );

            if (!vectorError && vectorResults && vectorResults.length > 0) {
                // Vector search succeeded
                const mappedResults = vectorResults.map((r: any) => ({
                    surahNumber: r.surah_number,
                    surahName: r.surah_name || `Surah ${r.surah_number}`,
                    verseNumber: r.verse_number,
                    arabicText: r.arabic_text,
                    translation: r.translation_text,
                    similarity: r.similarity || 0.9,
                }));
                startTransition(() => setResults(mappedResults));
                return;
            }

            // Fallback: Enhanced keyword search
            console.log('Falling back to keyword search');

            // Expand query with synonyms
            const lowerQuery = query.toLowerCase();
            let searchTerms = [lowerQuery];

            for (const [key, synonyms] of Object.entries(KEYWORD_MAPPINGS)) {
                if (lowerQuery.includes(key)) {
                    searchTerms = [...searchTerms, ...synonyms];
                }
            }

            // Search in static_islamic_faq first for quick results
            const { data: faqResults } = await supabase
                .from('static_islamic_faq')
                .select('*')
                .or(searchTerms.map(t => `answer_ms.ilike.%${t}%,answer_en.ilike.%${t}%`).join(','))
                .limit(5);

            // Search in translations table if exists
            const { data: verseResults } = await supabase
                .from('translations')
                .select('surah_number, verse_number, text')
                .or(searchTerms.map(t => `text.ilike.%${t}%`).join(','))
                .limit(10);

            if (verseResults && verseResults.length > 0) {
                // Get surah names
                const { data: surahs } = await supabase
                    .from('surahs')
                    .select('number, name_simple');

                const surahMap = new Map(surahs?.map(s => [s.number, s.name_simple]) || []);

                const mappedResults = verseResults.map((v: any, index: number) => ({
                    surahNumber: v.surah_number,
                    surahName: surahMap.get(v.surah_number) || `Surah ${v.surah_number}`,
                    verseNumber: v.verse_number,
                    arabicText: '', // Would need separate query
                    translation: v.text,
                    similarity: 0.7 - (index * 0.05), // Decreasing similarity for display
                }));
                startTransition(() => setResults(mappedResults));
            } else if (faqResults && faqResults.length > 0) {
                // Show FAQ results as alternative
                setError('Tiada ayat ditemui. Cuba carian lain atau tanya Ustaz AI.');
            } else {
                setError('Tiada hasil ditemui. Cuba gunakan kata kunci berbeza.');
            }

        } catch (err) {
            console.error('Search error:', err);
            setError('Ralat semasa mencari. Sila cuba lagi.');
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        startTransition(() => setResults([]));
        setError(null);
    }, []);

    return {
        search,
        results,
        isSearching,
        error,
        clearResults,
    };
}

export default useSemanticSearch;
