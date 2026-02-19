/**
 * PDF Content Service
 * Provides access to static content extracted from PDF documents
 * - Social Media Adab (Surah Al-Hujurat)
 * - Maqasid Syariah (5 Principles)
 * - Fatwa Guidelines (Malaysia)
 * - KAFA Curriculum (8 subjects)
 */

import { supabase } from '../lib/supabase';

// ===========================================
// Types
// ===========================================

export interface SocialMediaAdab {
    id: number;
    adab_id: string;
    title_ar: string;
    title_ms: string;
    title_en: string;
    surah_reference: string;
    ayat_number: number;
    description_ms: string;
    description_en: string;
    practical_tips: string[];
    priority: number;
}

export interface MaqasidSyariah {
    id: number;
    maqasid_id: string;
    name_ar: string;
    name_ms: string;
    name_en: string;
    level: number;  // 1=Dharuriyyat, 2=Hajiyyat, 3=Tahsiniyyat
    description_ms: string;
    description_en: string;
    examples: string[];
    digital_application: string;
}

export interface FatwaGuideline {
    id: number;
    guideline_id: string;
    category: 'source' | 'mazhab' | 'process';
    title_ms: string;
    title_en: string;
    description_ms: string;
    description_en: string;
    reference_books: string[];
    priority_order: number;
}

export interface KafaCurriculum {
    id: number;
    subject_id: string;
    name_ar: string;
    name_ms: string;
    name_en: string;
    description_ms: string;
    description_en: string;
    year_levels: string[];
    learning_outcomes: string[];
}

// ===========================================
// Social Media Adab Functions
// ===========================================

/**
 * Get all 9 social media adab from Surah Al-Hujurat
 */
export async function getSocialMediaAdab(language: 'ms' | 'en' = 'ms'): Promise<SocialMediaAdab[]> {
    const { data, error } = await supabase
        .from('static_social_media_adab')
        .select('*')
        .order('priority', { ascending: true });

    if (error) {
        console.error('Error fetching social media adab:', error);
        return [];
    }
    return data || [];
}

/**
 * Get specific adab by ID (e.g., 'adab_06' for Tabayyun)
 */
export async function getAdabById(adabId: string): Promise<SocialMediaAdab | null> {
    const { data, error } = await supabase
        .from('static_social_media_adab')
        .select('*')
        .eq('adab_id', adabId)
        .single();

    if (error) return null;
    return data;
}

/**
 * Get adab for a specific ayat number
 */
export async function getAdabByAyat(ayatNumber: number): Promise<SocialMediaAdab[]> {
    const { data, error } = await supabase
        .from('static_social_media_adab')
        .select('*')
        .eq('ayat_number', ayatNumber);

    if (error) return [];
    return data || [];
}

// ===========================================
// Maqasid Syariah Functions
// ===========================================

/**
 * Get all 5 Maqasid Syariah
 */
export async function getMaqasidSyariah(): Promise<MaqasidSyariah[]> {
    const { data, error } = await supabase
        .from('static_maqasid_syariah')
        .select('*')
        .order('priority', { ascending: true });

    if (error) {
        console.error('Error fetching maqasid:', error);
        return [];
    }
    return data || [];
}

/**
 * Get maqasid by ID (hifz_din, hifz_nafs, etc.)
 */
export async function getMaqasidById(maqasidId: string): Promise<MaqasidSyariah | null> {
    const { data, error } = await supabase
        .from('static_maqasid_syariah')
        .select('*')
        .eq('maqasid_id', maqasidId)
        .single();

    if (error) return null;
    return data;
}

/**
 * Get maqasid by level (1=Dharuriyyat, 2=Hajiyyat, 3=Tahsiniyyat)
 */
export async function getMaqasidByLevel(level: 1 | 2 | 3): Promise<MaqasidSyariah[]> {
    const { data, error } = await supabase
        .from('static_maqasid_syariah')
        .select('*')
        .eq('level', level);

    if (error) return [];
    return data || [];
}

// ===========================================
// Fatwa Guidelines Functions
// ===========================================

/**
 * Get all fatwa guidelines
 */
export async function getFatwaGuidelines(): Promise<FatwaGuideline[]> {
    const { data, error } = await supabase
        .from('static_fatwa_guidelines')
        .select('*')
        .order('priority_order', { ascending: true });

    if (error) {
        console.error('Error fetching fatwa guidelines:', error);
        return [];
    }
    return data || [];
}

/**
 * Get guidelines by category
 */
export async function getFatwaByCategory(category: 'source' | 'mazhab' | 'process'): Promise<FatwaGuideline[]> {
    const { data, error } = await supabase
        .from('static_fatwa_guidelines')
        .select('*')
        .eq('category', category)
        .order('priority_order', { ascending: true });

    if (error) return [];
    return data || [];
}

/**
 * Get mazhab priority order (Syafi'i first for Malaysia)
 */
export async function getMazhabPriority(): Promise<FatwaGuideline[]> {
    return getFatwaByCategory('mazhab');
}

/**
 * Get fatwa sources hierarchy (Quran > Sunnah > Ijmak > Qiyas)
 */
export async function getFatwaSources(): Promise<FatwaGuideline[]> {
    return getFatwaByCategory('source');
}

// ===========================================
// KAFA Curriculum Functions
// ===========================================

/**
 * Get all 8 KAFA subjects
 */
export async function getKafaCurriculum(): Promise<KafaCurriculum[]> {
    const { data, error } = await supabase
        .from('static_kafa_curriculum')
        .select('*')
        .order('priority', { ascending: true });

    if (error) {
        console.error('Error fetching KAFA curriculum:', error);
        return [];
    }
    return data || [];
}

/**
 * Get specific subject by ID
 */
export async function getKafaSubject(subjectId: string): Promise<KafaCurriculum | null> {
    const { data, error } = await supabase
        .from('static_kafa_curriculum')
        .select('*')
        .eq('subject_id', subjectId)
        .single();

    if (error) return null;
    return data;
}

// ===========================================
// Combined Search for Ustaz AI
// ===========================================

export interface PDFContentSearchResult {
    type: 'adab' | 'maqasid' | 'fatwa' | 'kafa';
    title: string;
    content: string;
    source: string;
}

/**
 * Search across all PDF content for Ustaz AI responses
 */
export async function searchPDFContent(query: string, language: 'ms' | 'en' = 'ms'): Promise<PDFContentSearchResult[]> {
    const results: PDFContentSearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search social media adab
    const adabs = await getSocialMediaAdab();
    adabs.forEach(adab => {
        const content = language === 'ms' ? adab.description_ms : adab.description_en;
        const title = language === 'ms' ? adab.title_ms : adab.title_en;
        if (content.toLowerCase().includes(lowerQuery) || title.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'adab',
                title,
                content,
                source: `Surah ${adab.surah_reference}: ${adab.ayat_number}`
            });
        }
    });

    // Search maqasid
    const maqasids = await getMaqasidSyariah();
    maqasids.forEach(maqasid => {
        const content = language === 'ms' ? maqasid.description_ms : maqasid.description_en;
        const title = language === 'ms' ? maqasid.name_ms : maqasid.name_en;
        if (content.toLowerCase().includes(lowerQuery) || title.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'maqasid',
                title,
                content,
                source: 'Maqasid Syariah'
            });
        }
    });

    // Search fatwa guidelines
    const guidelines = await getFatwaGuidelines();
    guidelines.forEach(guideline => {
        const content = language === 'ms' ? guideline.description_ms : guideline.description_en;
        const title = language === 'ms' ? guideline.title_ms : guideline.title_en;
        if (content.toLowerCase().includes(lowerQuery) || title.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'fatwa',
                title,
                content,
                source: 'Garis Panduan Fatwa JAKIM'
            });
        }
    });

    // Search KAFA curriculum
    const subjects = await getKafaCurriculum();
    subjects.forEach(subject => {
        const content = language === 'ms' ? subject.description_ms : subject.description_en;
        const title = language === 'ms' ? subject.name_ms : subject.name_en;
        if (content.toLowerCase().includes(lowerQuery) || title.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'kafa',
                title,
                content,
                source: 'Program KAFA JAKIM'
            });
        }
    });

    return results;
}

/**
 * Format Tabayyun (verification) reminder for sharing content
 */
export function getTabayyunReminder(language: 'ms' | 'en' = 'ms'): string {
    if (language === 'ms') {
        return `⚠️ TABAYYUN - Selidik dahulu!
    
Surah Al-Hujurat (49:6):
"Wahai orang yang beriman! Jika datang kepada kamu seorang fasik membawa sesuatu berita, maka selidikilah untuk menentukan kebenarannya..."

💡 Tips:
• Semak sumber asal
• Guna fact-checker
• Jangan forward tanpa baca
• Minta bukti`;
    }

    return `⚠️ TABAYYUN - Verify first!
  
Surah Al-Hujurat (49:6):
"O you who believe! If a wicked person comes to you with news, verify it..."

💡 Tips:
• Check original source
• Use fact-checker
• Don't forward without reading
• Ask for evidence`;
}
