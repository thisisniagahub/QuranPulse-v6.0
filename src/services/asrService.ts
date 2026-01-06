/**
 * ASR Service - Bridge to Python Quran ASR Server
 * Connects QuranPulse to quran-agent for acoustic analysis
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
const ASR_SERVER_URL = 'http://localhost:8000';
const FALLBACK_TO_EDGE = true;

/**
 * ASR Service - Main interface for recitation analysis
 */
export const asrService = {
    /**
     * Check if Python ASR server is running
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${ASR_SERVER_URL}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000),
            });
            return response.ok;
        } catch {
            console.warn('⚠️ ASR Server not available');
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
        // Try local Python server first
        const isServerAvailable = await this.checkHealth();

        if (isServerAvailable) {
            return this.analyzeWithLocalServer(audioBlob, expectedText);
        }

        // Fallback to Supabase Edge Function
        if (FALLBACK_TO_EDGE) {
            console.log('📡 Falling back to mcp-asr Edge Function');
            return this.analyzeWithEdgeFunction(audioBlob, expectedText);
        }

        throw new Error('ASR service unavailable');
    },

    /**
     * Analyze using local Python server (quran-agent)
     */
    async analyzeWithLocalServer(
        audioBlob: Blob,
        expectedText?: string
    ): Promise<QWERResult> {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        if (expectedText) {
            formData.append('expected_text', expectedText);
        }

        console.log('🎤 Sending audio to local ASR server...');

        const response = await fetch(`${ASR_SERVER_URL}/analyze/audio`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`ASR server error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ ASR analysis complete:', result);
        return result;
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
