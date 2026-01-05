import axios from 'axios';
import { getEnv } from '../../utils/env.ts';

/**
 * Voice generation response types
 */
export interface VoiceGenerationResult {
    type: 'buffer' | 'browser_tts';
    data?: Buffer;
    text?: string;
    voice?: string;
}

export class VoiceService {
    private static readonly ELEVENLABS_API_KEY = getEnv('VITE_ELEVENLABS_API_KEY');
    private static readonly DEFAULT_VOICE_ID = 'pNInz6obpg8ndOeDr7qn'; // Adam (Calm, mature)

    /**
     * Generate Audio from Text - Hybrid Approach
     * 1. Try ElevenLabs (Premium quality)
     * 2. Fallback to Browser Web Speech API
     */
    static async generateVoice(text: string, voiceId?: string): Promise<VoiceGenerationResult | null> {
        // 1. Try ElevenLabs if API key is available
        if (this.ELEVENLABS_API_KEY) {
            const buffer = await this.callElevenLabs(text, voiceId);
            if (buffer) {
                return { type: 'buffer', data: buffer };
            }
        }

        // 2. Fallback to Browser TTS
        console.log("🔊 Using Browser TTS Fallback...");
        return this.prepareBrowserTTS(text);
    }

    /**
     * Call ElevenLabs API for premium voice
     */
    private static async callElevenLabs(text: string, voiceId?: string): Promise<Buffer | null> {
        const targetVoiceId = voiceId || this.DEFAULT_VOICE_ID;

        try {
            console.log(`🎙️ Generating voice [${targetVoiceId}] for: ${text.substring(0, 30)}...`);

            const response = await axios.post(
                `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`,
                {
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                },
                {
                    headers: {
                        'xi-api-key': this.ELEVENLABS_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer',
                    timeout: 15000 // 15 seconds timeout
                }
            );

            return Buffer.from(response.data);

        } catch (error) {
            console.warn("⚠️ ElevenLabs failed, will use fallback:", error);
            return null;
        }
    }

    /**
     * Prepare Browser TTS payload
     * Frontend will handle actual speech synthesis
     */
    private static prepareBrowserTTS(text: string): VoiceGenerationResult {
        // Recommend Malay or Indonesian voice for better pronunciation
        const recommendedVoices = ['ms-MY', 'id-ID', 'en-GB', 'en-US'];

        return {
            type: 'browser_tts',
            text: text,
            voice: recommendedVoices[0] // Frontend will try these in order
        };
    }

    /**
     * Client-side helper: Speak using Web Speech API
     * Call this in frontend when VoiceGenerationResult.type === 'browser_tts'
     */
    static speakWithBrowser(text: string, lang: string = 'ms-MY'): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.speechSynthesis) {
                reject(new Error('Speech Synthesis not available'));
                return;
            }

            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);

            // Try to find the best voice for the language
            const voices = synth.getVoices();
            const preferredVoice = voices.find(v =>
                v.lang.startsWith('ms') || // Malay
                v.lang.startsWith('id') || // Indonesian (similar pronunciation)
                v.name.toLowerCase().includes('malay')
            ) || voices.find(v => v.lang.startsWith('en')); // Fallback to English

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.lang = lang;
            utterance.rate = 0.9; // Slightly slower for clarity
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
     * Check if ElevenLabs is configured
     */
    static isPremiumVoiceAvailable(): boolean {
        return !!this.ELEVENLABS_API_KEY;
    }
}
