// MCP-ASR: Serverless ASR Agent for Quran Recitation Analysis
// Fallback when local Python ASR server is unavailable
// Uses Groq Whisper API for transcription

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ASRRequest {
    intent: 'analyze' | 'transcribe' | 'health';
    audio_base64?: string;
    expected_text?: string;
}

interface QWERResult {
    success: boolean;
    message: string;
    analysis: {
        qwer: number;
        level: string;
        error_breakdown: Record<string, number>;
        total_errors: number;
        total_phonemes: number;
        dominant_error_types: string[];
        detailed_errors: Array<{
            type: string;
            position: number;
            expected: string;
            actual: string;
            severity: string;
        }>;
    } | null;
    transcription?: string;
}

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const groqApiKey = Deno.env.get('GROQ_API_KEY');

        const supabase = createClient(supabaseUrl, supabaseKey);
        const body: ASRRequest = await req.json();

        console.log(`🎤 mcp-asr: Processing intent '${body.intent}'`);

        // Health check
        if (body.intent === 'health') {
            return new Response(
                JSON.stringify({ status: 'healthy', service: 'mcp-asr' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Analyze intent - Full Q-WER analysis
        if (body.intent === 'analyze' || body.intent === 'transcribe') {
            if (!body.audio_base64) {
                return new Response(
                    JSON.stringify({ error: 'audio_base64 is required' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Transcribe using Groq Whisper
            const transcription = await transcribeWithGroq(body.audio_base64, groqApiKey);

            if (body.intent === 'transcribe') {
                return new Response(
                    JSON.stringify({ success: true, transcription }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Calculate Q-WER if expected text provided
            const analysis = body.expected_text
                ? calculateQWER(transcription, body.expected_text)
                : null;

            const result: QWERResult = {
                success: true,
                message: 'Analysis complete via mcp-asr',
                analysis,
                transcription,
            };

            // Log to audit table
            await supabase.from('asr_audit_log').insert({
                audio_hash: hashString(body.audio_base64.substring(0, 100)),
                transcription_preview: transcription.substring(0, 100),
                qwer_score: analysis?.qwer || null,
                created_at: new Date().toISOString(),
            }).single();

            return new Response(JSON.stringify(result), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        return new Response(
            JSON.stringify({ error: 'Unknown intent' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('❌ mcp-asr error:', error);
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

/**
 * Transcribe audio using Groq Whisper API
 */
async function transcribeWithGroq(audioBase64: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
        console.warn('⚠️ GROQ_API_KEY not set, returning mock transcription');
        return 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    }

    // Convert base64 to blob
    const audioBlob = base64ToBlob(audioBase64, 'audio/wav');

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'ar');
    formData.append('temperature', '0'); // Deterministic output
    formData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.text;
}

/**
 * Calculate Q-WER (Quran Weighted Error Rate)
 */
function calculateQWER(transcription: string, expected: string) {
    // Normalize Arabic (remove simple tatweel, unify alifs) for fair comparison
    const norm = (text: string) => text.replace(/[ـ]/g, '').replace(/[أإآ]/g, 'ا');
    
    const transcriptionChars = norm(transcription).replace(/\s/g, '').split('');
    const expectedChars = norm(expected).replace(/\s/g, '').split('');

    let errors = 0;
    const errorBreakdown = { makhraj: 0, tajweed: 0, harakat: 0, rhythm: 0 };
    const detailedErrors: Array<{
        type: string;
        position: number;
        expected: string;
        actual: string;
        severity: string;
    }> = [];

    // Simple Levenshtein-based error detection
    const maxLen = Math.max(transcriptionChars.length, expectedChars.length);
    for (let i = 0; i < maxLen; i++) {
        const expected_char = expectedChars[i] || '';
        const actual_char = transcriptionChars[i] || '';

        if (expected_char !== actual_char) {
            errors++;
            const errorType = classifyError(expected_char, actual_char);
            errorBreakdown[errorType as keyof typeof errorBreakdown]++;
            detailedErrors.push({
                type: errorType,
                position: i,
                expected: expected_char,
                actual: actual_char,
                severity: errorType === 'makhraj' ? 'critical' : 'medium',
            });
        }
    }

    // Calculate weighted Q-WER
    const weightedErrors =
        errorBreakdown.makhraj * 3.0 +
        errorBreakdown.tajweed * 2.5 +
        errorBreakdown.harakat * 2.0 +
        errorBreakdown.rhythm * 1.0;

    const qwer = maxLen > 0 ? (weightedErrors / maxLen) * 100 : 0;

    // Determine level
    let level = 'beginner';
    if (qwer <= 5) level = 'excellent';
    else if (qwer <= 15) level = 'good';
    else if (qwer <= 30) level = 'needs_practice';

    // Find dominant error types
    const dominantTypes = Object.entries(errorBreakdown)
        .filter(([_, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([type]) => type);

    return {
        qwer: Math.round(qwer * 10) / 10,
        level,
        error_breakdown: errorBreakdown,
        total_errors: errors,
        total_phonemes: maxLen,
        dominant_error_types: dominantTypes.slice(0, 2),
        detailed_errors: detailedErrors.slice(0, 10),
    };
}

/**
 * Classify error type based on Arabic phoneme rules
 */
function classifyError(expected: string, actual: string): string {
    // Makhraj errors (articulation point)
    const makhrajGroups = [
        ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'], // Throat
        ['ق', 'ك'], // Back tongue
        ['ج', 'ش', 'ي'], // Mid tongue
        ['ض', 'ل', 'ن', 'ر'], // Edge tongue
        ['ط', 'د', 'ت'], // Tip tongue + palate
        ['ظ', 'ذ', 'ث'], // Tip tongue + teeth
        ['ص', 'س', 'ز'], // Whistle letters
        ['ف'], // Lip + teeth
        ['ب', 'م', 'و'], // Lips
    ];

    for (const group of makhrajGroups) {
        if (group.includes(expected) && !group.includes(actual)) {
            return 'makhraj';
        }
    }

    // Harakat errors (vowels)
    const harakatChars = ['َ', 'ُ', 'ِ', 'ً', 'ٌ', 'ٍ', 'ْ', 'ّ'];
    if (harakatChars.includes(expected) || harakatChars.includes(actual)) {
        return 'harakat';
    }

    // Default to rhythm
    return 'rhythm';
}

/**
 * Convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

/**
 * Simple hash function for audit logging
 */
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}
