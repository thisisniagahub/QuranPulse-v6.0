/**
 * ASR Service - OpenClaw gateway bridge for Quran recitation analysis
 */

import { supabase } from '../lib/supabase';

// Types
export interface QWERResult {
    success: boolean;
    message: string;
    analysis: {
        qwer: number;
        level: string;
        error_breakdown: {
            makhraj: number;
            tajweed: number;
            harakat: number;
            rhythm: number;
        };
        total_errors: number;
        total_phonemes: number;
        dominant_error_types: string[];
        detailed_errors: Array<{
            type: string;
            position: number;
            expected: string;
            actual: string;
            severity: 'critical' | 'high' | 'medium' | 'low';
        }>;
    } | null;
    audio_info?: {
        duration: number;
        sample_rate: number;
    };
}

export interface RecitationFeedback {
    score: number;
    level: 'excellent' | 'good' | 'needs_practice' | 'beginner';
    summary: string;
    suggestions: string[];
    nextStep: 'continue' | 'repeat' | 'drill';
}

// Config
const ASR_SERVER_URL = import.meta.env.VITE_OPENCLAW_URL || 'https://operator.gangniaga.my';
const OPENCLAW_TOKEN = import.meta.env.VITE_OPENCLAW_TOKEN || '';
const FALLBACK_TO_EDGE = true;

function calculateSimilarity(transcribed: string, expected: string): number {
    if (!transcribed || !expected) return 0;

    const a = transcribed.trim().toLowerCase();
    const b = expected.trim().toLowerCase();
    if (!a || !b) return 0;
    if (a === b) return 1;

    const aChars = new Set(a.split(''));
    const bChars = new Set(b.split(''));
    let overlap = 0;
    for (const ch of aChars) {
        if (bChars.has(ch)) overlap++;
    }
    return Math.min(1, overlap / Math.max(aChars.size, bChars.size));
}

function hasExpectedText(expectedText?: string): expectedText is string {
    return typeof expectedText === 'string' && expectedText.trim().length > 0;
}

/**
 * ASR Service - Main interface for recitation analysis
 */
export const asrService = {
    /**
     * Check if OpenClaw gateway is reachable
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${ASR_SERVER_URL}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000),
            });
            return response.ok;
        } catch {
            console.warn('⚠️ OpenClaw gateway not available');
            return false;
        }
    },

    /**
     * Analyze Quran recitation audio
     * @param audioBlob - Audio blob from recording
     * @param expectedText - Optional expected Arabic text for comparison
     */
    async analyzeRecitation(
        audioBlob: Blob,
        expectedText?: string
    ): Promise<QWERResult> {
        const normalizedExpectedText = hasExpectedText(expectedText) ? expectedText : undefined;

        // Try OpenClaw first
        const isServerAvailable = await this.checkHealth();
        if (isServerAvailable) {
            return this.analyzeWithGateway(audioBlob, normalizedExpectedText);
        }

        // Fallback to Supabase Edge Function
        if (FALLBACK_TO_EDGE) {
            console.log('📡 Falling back to mcp-asr Edge Function');
            const edgeResult = await this.analyzeWithEdgeFunction(audioBlob, normalizedExpectedText);
            return normalizedExpectedText ? edgeResult : this.withNeutralScore(edgeResult);
        }

        throw new Error('ASR service unavailable');
    },

    /**
     * Analyze using OpenClaw ASR endpoint
     */
    async analyzeWithGateway(
        audioBlob: Blob,
        expectedText?: string
    ): Promise<QWERResult> {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        formData.append('model', 'gpt-4o-mini-transcribe');
        formData.append('language', 'ar');

        console.log('🎤 Sending audio to OpenClaw ASR...');

        const response = await fetch(`${ASR_SERVER_URL}/v1/audio/transcriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENCLAW_TOKEN}`
            },
            body: formData,
            signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
            throw new Error(`ASR gateway error: ${response.statusText}`);
        }

        const result = await response.json();
        const transcription = (result.text || '') as string;
        const canScore = hasExpectedText(expectedText);
        const similarity = canScore ? calculateSimilarity(transcription, expectedText) : 0.5;
        const qwer = canScore ? Math.max(0, Math.round((1 - similarity) * 100)) : 50;
        const level = canScore
            ? qwer <= 5
                ? 'excellent'
                : qwer <= 15
                    ? 'good'
                    : qwer <= 30
                        ? 'needs_practice'
                        : 'beginner'
            : 'needs_practice';

        const payload: QWERResult = {
            success: true,
            message: canScore
                ? 'OpenClaw ASR analysis complete'
                : 'OpenClaw ASR transcription complete (expected text not provided, used neutral score)',
            analysis: {
                qwer,
                level,
                error_breakdown: {
                    makhraj: canScore ? qwer : 0,
                    tajweed: canScore ? qwer : 0,
                    harakat: canScore ? qwer : 0,
                    rhythm: canScore ? qwer : 0,
                },
                total_errors: canScore ? qwer : 0,
                total_phonemes: 100,
                dominant_error_types: canScore
                    ? qwer > 30
                        ? ['makhraj', 'tajweed']
                        : qwer > 10
                            ? ['tajweed']
                            : []
                    : [],
                detailed_errors: [],
            },
            audio_info: {
                duration: 0,
                sample_rate: 0,
            },
        };

        console.log('✅ ASR analysis complete:', payload);
        return payload;
    },

    /**
     * Analyze using Supabase Edge Function (mcp-asr)
     */
    async analyzeWithEdgeFunction(
        audioBlob: Blob,
        expectedText?: string
    ): Promise<QWERResult> {
        // Convert blob to base64 for Edge Function
        const base64Audio = await this.blobToBase64(audioBlob);

        const { data, error } = await supabase.functions.invoke('mcp-asr', {
            body: {
                intent: 'analyze',
                audio_base64: base64Audio,
                expected_text: expectedText,
            },
        });

        if (error) {
            console.error('❌ mcp-asr error:', error);
            throw error;
        }

        return data as QWERResult;
    },

    withNeutralScore(result: QWERResult): QWERResult {
        const neutralAnalysis = {
            qwer: 50,
            level: 'needs_practice',
            error_breakdown: {
                makhraj: 0,
                tajweed: 0,
                harakat: 0,
                rhythm: 0,
            },
            total_errors: 0,
            total_phonemes: 100,
            dominant_error_types: [],
            detailed_errors: [],
        };

        return {
            ...result,
            message: 'Expected text not provided, neutral QWER=50 applied',
            analysis: result.analysis ? { ...result.analysis, ...neutralAnalysis } : neutralAnalysis,
        };
    },

    /**
     * Generate human-readable feedback from Q-WER analysis
     */
    generateFeedback(result: QWERResult): RecitationFeedback {
        if (!result.analysis) {
            return {
                score: 0,
                level: 'beginner',
                summary: 'Tidak dapat menganalisis rakaman. Sila cuba lagi.',
                suggestions: ['Pastikan mikrofon berfungsi', 'Rakam di tempat yang senyap'],
                nextStep: 'repeat',
            };
        }

        const { qwer, dominant_error_types, detailed_errors } = result.analysis;

        // Determine level based on Q-WER score
        let level: RecitationFeedback['level'];
        if (qwer <= 5) level = 'excellent';
        else if (qwer <= 15) level = 'good';
        else if (qwer <= 30) level = 'needs_practice';
        else level = 'beginner';

        // Generate suggestions based on error types
        const suggestions: string[] = [];
        if (dominant_error_types.includes('makhraj')) {
            suggestions.push('Fokus pada titik artikulasi huruf (makhraj)');
        }
        if (dominant_error_types.includes('tajweed')) {
            suggestions.push('Perhatikan hukum tajwid seperti ghunnah dan idgham');
        }
        if (dominant_error_types.includes('harakat')) {
            suggestions.push('Panjangkan mad mengikut ketukan yang betul');
        }

        // Determine next step
        let nextStep: RecitationFeedback['nextStep'];
        if (level === 'excellent') nextStep = 'continue';
        else if (level === 'good') nextStep = 'continue';
        else if (detailed_errors.length > 3) nextStep = 'drill';
        else nextStep = 'repeat';

        return {
            score: Math.round(100 - qwer),
            level,
            summary: this.getSummaryMessage(level, qwer),
            suggestions,
            nextStep,
        };
    },

    /**
     * Get summary message based on level
     */
    getSummaryMessage(level: RecitationFeedback['level'], qwer: number): string {
        const messages = {
            excellent: `Masyaallah! Bacaan anda sangat baik dengan skor ${Math.round(100 - qwer)}%.`,
            good: `Alhamdulillah, bacaan yang baik dengan skor ${Math.round(100 - qwer)}%. Teruskan latihan!`,
            needs_practice: `Skor anda ${Math.round(100 - qwer)}%. Fokus pada kesalahan yang ditanda untuk penambahbaikan.`,
            beginner: `Skor ${Math.round(100 - qwer)}%. Jangan putus asa, teruskan latihan dengan sabar.`,
        };
        return messages[level];
    },

    /**
     * Convert Blob to Base64 string
     */
    async blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                resolve(base64.split(',')[1]); // Remove data:audio/... prefix
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },
};

export default asrService;
