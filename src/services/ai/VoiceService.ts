import { openclawClient } from '../openclawClient';
import { getEnv } from '../../utils/env';

/**
 * Voice generation response types
 */
export interface VoiceGenerationResult {
    type: 'buffer' | 'browser_tts' | 'url';
    data?: ArrayBuffer;
    url?: string;
    text?: string;
    voice?: string;
}

type OpenAIVoice = 'nova' | 'echo' | 'alloy';

const LEGACY_VOICE_MAP: Record<string, OpenAIVoice> = {
    pNInz6obpg8ndOeDr7qn: 'alloy',
    EXAVITQu4vr4xnSDxMaL: 'nova',
    TxGEqnHWrfWFTfGW9XjX: 'echo',
};

const OPENAI_VOICE_SET = new Set<OpenAIVoice>(['nova', 'echo', 'alloy']);

export class VoiceService {
    /**
     * Generate Audio from Text - Hybrid Approach
     * 1. Try OpenClaw Gateway TTS (OpenAI gpt-4o-mini-tts via Codex OAuth)
     * 2. Fallback to Browser Web Speech API
     */
    static async generateVoice(text: string, voice?: string): Promise<VoiceGenerationResult | null> {
        const trimmedText = text.trim();
        if (!trimmedText) return null;

        // 1. Try OpenClaw TTS (routes to openai/gpt-4o-mini-tts on the server)
        try {
            const ttsResult = await this.callOpenClawTTS(trimmedText, voice);
            if (ttsResult) return ttsResult;
        } catch (err) {
            console.warn(' OpenClaw TTS failed, falling back to browser:', err);
        }

        // 2. Browser-only fallback when speech synthesis is available
        if (this.canUseBrowserTTS()) {
            console.log('🔊 Using Browser TTS Fallback...');
            return this.prepareBrowserTTS(trimmedText);
        }

        return null;
    }

    /**
     * Call OpenClaw Gateway for TTS
     * The gateway token now lives only in the server-side proxy.
     */
    private static async callOpenClawTTS(text: string, voice?: string): Promise<VoiceGenerationResult | null> {
        const selectedVoice = this.resolveVoice(voice);

        try {
            const audioBuffer = await openclawClient.generateSpeech(text, selectedVoice);
            return { type: 'buffer', data: audioBuffer };
        } catch (error) {
            console.warn(' OpenClaw TTS request failed:', error);
            return null;
        }
    }

    /**
     * Prepare Browser TTS payload
     * Frontend will handle actual speech synthesis
     */
    private static prepareBrowserTTS(text: string): VoiceGenerationResult {
        const recommendedVoices = ['ms-MY', 'id-ID', 'en-GB', 'en-US'];
        return {
            type: 'browser_tts',
            text: text,
            voice: recommendedVoices[0],
        };
    }

    private static canUseBrowserTTS(): boolean {
        return typeof window !== 'undefined' && !!window.speechSynthesis;
    }

    private static resolveVoice(voice?: string): OpenAIVoice {
        if (!voice) return 'nova';

        const normalized = voice.toLowerCase();
        if (OPENAI_VOICE_SET.has(normalized as OpenAIVoice)) {
            return normalized as OpenAIVoice;
        }

        return LEGACY_VOICE_MAP[voice] || 'nova';
    }

    /**
     * Client-side helper: Speak using Web Speech API
     */
    static speakWithBrowser(text: string, lang: string = 'ms-MY'): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.speechSynthesis) {
                reject(new Error('Speech Synthesis not available'));
                return;
            }

            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);

            const voices = synth.getVoices();
            const preferredVoice = voices.find(v =>
                v.lang.startsWith('ms') ||
                v.lang.startsWith('id') ||
                v.name.toLowerCase().includes('malay')
            ) || voices.find(v => v.lang.startsWith('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.lang = lang;
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => reject(e);

            synth.speak(utterance);
        });
    }

    /**
     * Get available browser voices
     */
    static getBrowserVoices(): SpeechSynthesisVoice[] {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            return [];
        }
        return window.speechSynthesis.getVoices();
    }

    /**
     * Check if premium TTS is available (OpenClaw gateway)
     */
    static isPremiumVoiceAvailable(): boolean {
        return !!getEnv('VITE_SUPABASE_URL');
    }
}
