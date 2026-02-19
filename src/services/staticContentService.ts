/**
 * Static Content Service - Query pre-generated content from database
 * Eliminates need for AI API calls for common queries
 */

import { supabase } from '../lib/supabase';
import { createHash } from 'crypto';

// Types
export interface TajweedRule {
    id: number;
    rule_id: string;
    name_ar: string;
    name_ms: string;
    name_en: string;
    category: string;
    description_ms: string;
    description_en: string;
    examples: Array<{ arabic: string; transliteration: string; surah_ayah: string }>;
    common_mistakes: string[];
    priority: number;
}

export interface MakhrajPoint {
    id: number;
    point_id: string;
    name_ar: string;
    name_ms: string;
    name_en: string;
    letters: string[];
    position: string;
    description_ms: string;
    description_en: string;
    practice_tips_ms: string;
    practice_tips_en: string;
    svg_path: string;
}

export interface Doa {
    id: number;
    doa_id: string;
    title_ms: string;
    title_en: string;
    arabic: string;
    transliteration: string;
    translation_ms: string;
    translation_en: string;
    when_to_recite: string;
    benefits: string;
    source: string;
    category: string;
}

export interface FAQ {
    id: number;
    faq_id: string;
    question_ms: string;
    question_en: string;
    answer_ms: string;
    answer_en: string;
    category: string;
    source: string;
    keywords: string[];
}

export interface Hadith {
    id: number;
    hadith_id: string;
    arabic: string;
    translation_ms: string;
    translation_en: string;
    narrator: string;
    source: string;
    grade: string;
    topics: string[];
}

export interface CachedResponse {
    query_hash: string;
    response: unknown;
    intent: string;
}

/**
 * Static Content Service
 */
export const staticContentService = {
    // ============ TAJWEED ============

    async getAllTajweedRules(): Promise<TajweedRule[]> {
        const { data, error } = await supabase
            .from('static_tajweed_rules')
            .select('*')
            .order('priority', { ascending: true });

        if (error) throw error;
        return data as TajweedRule[];
    },

    async getTajweedByCategory(category: string): Promise<TajweedRule[]> {
        const { data, error } = await supabase
            .from('static_tajweed_rules')
            .select('*')
            .eq('category', category);

        if (error) throw error;
        return data as TajweedRule[];
    },

    async getTajweedRule(ruleId: string): Promise<TajweedRule | null> {
        const { data, error } = await supabase
            .from('static_tajweed_rules')
            .select('*')
            .eq('rule_id', ruleId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as TajweedRule | null;
    },

    // ============ MAKHRAJ ============

    async getAllMakhrajPoints(): Promise<MakhrajPoint[]> {
        const { data, error } = await supabase
            .from('static_makhraj_points')
            .select('*');

        if (error) throw error;
        return data as MakhrajPoint[];
    },

    async getMakhrajByPosition(position: string): Promise<MakhrajPoint[]> {
        const { data, error } = await supabase
            .from('static_makhraj_points')
            .select('*')
            .eq('position', position);

        if (error) throw error;
        return data as MakhrajPoint[];
    },

    async getMakhrajByLetter(letter: string): Promise<MakhrajPoint | null> {
        const { data, error } = await supabase
            .from('static_makhraj_points')
            .select('*')
            .contains('letters', [letter])
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as MakhrajPoint | null;
    },

    // ============ DOA ============

    async getAllDoa(): Promise<Doa[]> {
        const { data, error } = await supabase
            .from('static_doa')
            .select('*');

        if (error) throw error;
        return data as Doa[];
    },

    async getDoaByCategory(category: string): Promise<Doa[]> {
        const { data, error } = await supabase
            .from('static_doa')
            .select('*')
            .eq('category', category);

        if (error) throw error;
        return data as Doa[];
    },

    async searchDoa(query: string): Promise<Doa[]> {
        const { data, error } = await supabase
            .from('static_doa')
            .select('*')
            .or(`title_ms.ilike.%${query}%,title_en.ilike.%${query}%,when_to_recite.ilike.%${query}%`);

        if (error) throw error;
        return data as Doa[];
    },

    // ============ FAQ ============

    async getAllFAQ(): Promise<FAQ[]> {
        const { data, error } = await supabase
            .from('static_islamic_faq')
            .select('*');

        if (error) throw error;
        return data as FAQ[];
    },

    async getFAQByCategory(category: string): Promise<FAQ[]> {
        const { data, error } = await supabase
            .from('static_islamic_faq')
            .select('*')
            .eq('category', category);

        if (error) throw error;
        return data as FAQ[];
    },

    async searchFAQ(query: string, lang: 'ms' | 'en' = 'ms'): Promise<FAQ[]> {
        const questionCol = lang === 'ms' ? 'question_ms' : 'question_en';
        const answerCol = lang === 'ms' ? 'answer_ms' : 'answer_en';

        const { data, error } = await supabase
            .from('static_islamic_faq')
            .select('*')
            .or(`${questionCol}.ilike.%${query}%,${answerCol}.ilike.%${query}%`);

        if (error) throw error;
        return data as FAQ[];
    },

    // ============ HADITH ============

    async getAllHadith(): Promise<Hadith[]> {
        const { data, error } = await supabase
            .from('static_hadith')
            .select('*');

        if (error) throw error;
        return data as Hadith[];
    },

    async getHadithBySource(source: string): Promise<Hadith[]> {
        const { data, error } = await supabase
            .from('static_hadith')
            .select('*')
            .eq('source', source);

        if (error) throw error;
        return data as Hadith[];
    },

    async getHadithByTopic(topic: string): Promise<Hadith[]> {
        const { data, error } = await supabase
            .from('static_hadith')
            .select('*')
            .contains('topics', [topic]);

        if (error) throw error;
        return data as Hadith[];
    },

    async searchHadith(query: string, lang: 'ms' | 'en' = 'ms'): Promise<Hadith[]> {
        const transCol = lang === 'ms' ? 'translation_ms' : 'translation_en';

        const { data, error } = await supabase
            .from('static_hadith')
            .select('*')
            .or(`${transCol}.ilike.%${query}%,arabic.ilike.%${query}%`);

        if (error) throw error;
        return data as Hadith[];
    },

    // ============ CACHE ============

    /**
     * Check if query has cached response
     */
    async getCachedResponse(query: string, intent?: string): Promise<unknown | null> {
        const hash = this.hashQuery(query);

        let queryBuilder = supabase
            .from('ai_response_cache')
            .select('response')
            .eq('query_hash', hash);

        if (intent) {
            queryBuilder = queryBuilder.eq('intent', intent);
        }

        const { data, error } = await queryBuilder.single();

        if (error && error.code !== 'PGRST116') {
            console.error('Cache lookup error:', error);
            return null;
        }

        // Update hit count
        if (data) {
            await supabase
                .from('ai_response_cache')
                .update({ hit_count: supabase.rpc('increment_hit_count'), last_accessed: new Date().toISOString() })
                .eq('query_hash', hash);
        }

        return data?.response || null;
    },

    /**
     * Cache an AI response
     */
    async cacheResponse(
        query: string,
        response: unknown,
        intent: string,
        lang: 'ms' | 'en' = 'ms',
        expiresInDays?: number
    ): Promise<void> {
        const hash = this.hashQuery(query);
        const expiresAt = expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
            : null;

        const { error } = await supabase
            .from('ai_response_cache')
            .upsert({
                query_hash: hash,
                query_original: query,
                response,
                intent,
                language: lang,
                expires_at: expiresAt,
                created_at: new Date().toISOString(),
                last_accessed: new Date().toISOString(),
            }, { onConflict: 'query_hash' });

        if (error) {
            console.error('Cache write error:', error);
        }
    },

    /**
     * Hash query for cache lookup (using simple hash for browser)
     */
    hashQuery(query: string): string {
        const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');

        // Simple hash for browser environment
        let hash = 0;
        for (let i = 0; i < normalized.length; i++) {
            const char = normalized.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(16, '0');
    },

    // ============ SMART LOOKUP ============

    /**
     * Intelligent lookup - checks static content before calling AI
     * Returns null if no static content matches
     */
    async smartLookup(
        query: string,
        lang: 'ms' | 'en' = 'ms'
    ): Promise<{ source: 'static' | 'cache'; data: unknown } | null> {
        const lowerQuery = query.toLowerCase();

        // 1. Check for tajweed keywords
        const tajweedKeywords = ['tajwid', 'tajweed', 'ikhfa', 'idgham', 'iqlab', 'izhar', 'madd', 'mad', 'ghunnah', 'qalqalah'];
        if (tajweedKeywords.some(k => lowerQuery.includes(k))) {
            const rules = await this.getAllTajweedRules();
            if (rules.length > 0) {
                return { source: 'static', data: rules };
            }
        }

        // 2. Check for makhraj keywords
        const makhrajKeywords = ['makhraj', 'sebutan', 'articulation', 'lidah', 'tongue', 'huruf'];
        if (makhrajKeywords.some(k => lowerQuery.includes(k))) {
            const points = await this.getAllMakhrajPoints();
            if (points.length > 0) {
                return { source: 'static', data: points };
            }
        }

        // 3. Check for doa keywords
        const doaKeywords = ['doa', 'dua', 'supplication', 'prayer'];
        if (doaKeywords.some(k => lowerQuery.includes(k))) {
            const doas = await this.searchDoa(query);
            if (doas.length > 0) {
                return { source: 'static', data: doas };
            }
        }

        // 4. Check for hadith keywords
        const hadithKeywords = ['hadith', 'hadis', 'nabi', 'rasul', 'prophet'];
        if (hadithKeywords.some(k => lowerQuery.includes(k))) {
            const hadiths = await this.searchHadith(query, lang);
            if (hadiths.length > 0) {
                return { source: 'static', data: hadiths };
            }
        }

        // 5. Search FAQ
        const faqs = await this.searchFAQ(query, lang);
        if (faqs.length > 0) {
            return { source: 'static', data: faqs };
        }

        // 6. Check cache
        const cached = await this.getCachedResponse(query);
        if (cached) {
            return { source: 'cache', data: cached };
        }

        return null;
    },
};

export default staticContentService;
