/**
 * 📚 RAG Service — Retrieval-Augmented Generation for Islamic Knowledge
 * 
 * Combines pgvector semantic search with LLM to provide
 * cited, sourced answers from tafsir and hadith collections.
 */

import { supabase } from '../lib/supabase';
import { callGeminiDirect } from './ai/GeminiClient';
import type { ChatMessage } from '../types/app';

// =====================================
// TYPES
// =====================================

export interface RAGSource {
    type: 'tafsir' | 'hadith' | 'quran' | 'faq';
    title: string;
    content: string;
    reference: string;       // e.g. "Tafsir Ibn Kathir, Surah Al-Baqarah:255"
    similarity: number;      // 0-1 cosine similarity score
    surahNumber?: number;
    verseNumber?: number;
}

export interface RAGResponse {
    answer: string;
    sources: RAGSource[];
    confidence: 'high' | 'medium' | 'low';
    language: 'ms' | 'en';
}

// =====================================
// RETRIEVAL — pgvector search
// =====================================

async function retrieveFromTafsir(query: string, limit = 5): Promise<RAGSource[]> {
    try {
        const { data, error } = await supabase.rpc('search_tafsir_semantic', {
            query_text: query,
            match_count: limit,
        });

        if (error || !data) return [];

        return data.map((row: any) => ({
            type: 'tafsir' as const,
            title: row.source_name || 'Tafsir',
            content: row.content_text,
            reference: `${row.source_name}, Surah ${row.surah_number}:${row.verse_number}`,
            similarity: row.similarity || 0.8,
            surahNumber: row.surah_number,
            verseNumber: row.verse_number,
        }));
    } catch {
        console.warn('Tafsir retrieval failed, continuing without');
        return [];
    }
}

async function retrieveFromHadith(query: string, limit = 5): Promise<RAGSource[]> {
    try {
        const { data, error } = await supabase.rpc('search_hadith_semantic', {
            query_text: query,
            match_count: limit,
        });

        if (error || !data) return [];

        return data.map((row: any) => ({
            type: 'hadith' as const,
            title: row.collection || 'Hadith',
            content: row.content_text,
            reference: `${row.collection}, No. ${row.hadith_number}`,
            similarity: row.similarity || 0.8,
        }));
    } catch {
        console.warn('Hadith retrieval failed, continuing without');
        return [];
    }
}

async function retrieveFromQuran(query: string, limit = 5): Promise<RAGSource[]> {
    try {
        const { data, error } = await supabase.rpc('search_verses_semantic', {
            query_text: query,
            match_count: limit,
        });

        if (error || !data) return [];

        return data.map((row: any) => ({
            type: 'quran' as const,
            title: `Surah ${row.surah_name || row.surah_number}`,
            content: row.translation_text,
            reference: `QS ${row.surah_number}:${row.verse_number}`,
            similarity: row.similarity || 0.9,
            surahNumber: row.surah_number,
            verseNumber: row.verse_number,
        }));
    } catch {
        console.warn('Quran verse retrieval failed, continuing without');
        return [];
    }
}

// =====================================
// AUGMENTED GENERATION
// =====================================

function buildRAGPrompt(query: string, sources: RAGSource[], language: 'ms' | 'en'): string {
    const sourceBlock = sources
        .map((s, i) => `[${i + 1}] ${s.reference}\n${s.content.substring(0, 500)}`)
        .join('\n\n');

    if (language === 'ms') {
        return `Anda adalah Ustaz AI yang berilmu. Jawab soalan berdasarkan sumber-sumber berikut sahaja. 
Jangan menambah maklumat yang tidak ada dalam sumber. Nyatakan rujukan [nombor] bila memetik sumber.
Jika tiada sumber yang relevan, nyatakan "Saya tidak menemui maklumat yang tepat untuk soalan ini."

SUMBER:
${sourceBlock}

SOALAN: ${query}

JAWAPAN (dengan rujukan):`;
    }

    return `You are a knowledgeable Islamic scholar AI. Answer based ONLY on the provided sources.
Do not add information not found in sources. Cite source [numbers] when referencing.
If no relevant source found, state "I could not find precise information for this question."

SOURCES:
${sourceBlock}

QUESTION: ${query}

ANSWER (with citations):`;
}

// =====================================
// MAIN RAG FUNCTION
// =====================================

export async function ragQuery(
    query: string,
    language: 'ms' | 'en' = 'ms'
): Promise<RAGResponse> {
    // 1. RETRIEVE — fetch relevant documents from all sources in parallel
    const [quranSources, tafsirSources, hadithSources] = await Promise.all([
        retrieveFromQuran(query, 3),
        retrieveFromTafsir(query, 3),
        retrieveFromHadith(query, 3),
    ]);

    const allSources = [...quranSources, ...tafsirSources, ...hadithSources]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 8); // Top 8 most relevant

    // 2. Determine confidence based on source quality
    const avgSimilarity = allSources.length > 0
        ? allSources.reduce((sum, s) => sum + s.similarity, 0) / allSources.length
        : 0;

    const confidence: RAGResponse['confidence'] =
        avgSimilarity >= 0.8 ? 'high' :
            avgSimilarity >= 0.6 ? 'medium' : 'low';

    // 3. If no sources found, return graceful fallback
    if (allSources.length === 0) {
        return {
            answer: language === 'ms'
                ? 'Maaf, saya tidak menemui sumber yang berkaitan untuk soalan ini. Sila cuba kata kunci lain atau tanya Ustaz AI secara terus.'
                : 'Sorry, I could not find relevant sources for this question. Please try different keywords or ask Ustaz AI directly.',
            sources: [],
            confidence: 'low',
            language,
        };
    }

    // 4. GENERATE — augmented response with citations
    const prompt = buildRAGPrompt(query, allSources, language);

    try {
        const messages: ChatMessage[] = [{ role: 'user', content: prompt, id: `rag_${Date.now()}`, timestamp: Date.now() }];
        const answer = await callGeminiDirect(messages);
        return { answer, sources: allSources, confidence, language };
    } catch {
        // Fallback: just show sources without LLM synthesis
        const fallbackAnswer = allSources
            .map((s, i) => `**[${i + 1}] ${s.reference}**\n${s.content.substring(0, 200)}...`)
            .join('\n\n');

        return {
            answer: (language === 'ms' ? '📚 Sumber berkaitan:\n\n' : '📚 Related sources:\n\n') + fallbackAnswer,
            sources: allSources,
            confidence,
            language,
        };
    }
}

// =====================================
// CONVENIENCE EXPORTS
// =====================================

export async function getTafsirWithSources(surahNumber: number, verseNumber: number): Promise<RAGResponse> {
    return ragQuery(`Tafsir Surah ${surahNumber} ayat ${verseNumber}`, 'ms');
}

export async function getHadithAbout(topic: string): Promise<RAGResponse> {
    return ragQuery(`Hadith berkaitan ${topic}`, 'ms');
}

export async function getIslamicRuling(question: string): Promise<RAGResponse> {
    return ragQuery(question, 'ms');
}
