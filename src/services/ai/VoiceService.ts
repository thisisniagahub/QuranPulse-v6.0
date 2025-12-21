import axios from 'axios';
import { getEnv } from '../../utils/env.ts';

export class VoiceService {
    private static readonly ELEVENLABS_API_KEY = getEnv('VITE_ELEVENLABS_API_KEY');
    private static readonly VOICE_ID = 'pNInz6obpg8ndOeDr7qn'; // Adam (Calm, mature) - Change as needed

    /**
     * Generate Audio from Text using ElevenLabs
     * Returns a Buffer of the MP3 data
     */
    static async generateVoice(text: string): Promise<Buffer | null> {
        if (!this.ELEVENLABS_API_KEY) {
            console.warn("⚠️ ElevenLabs Key missing. Skipping voice generation.");
            return null;
        }

        try {
            console.log(`🎙️ Generating voice for: ${text.substring(0, 30)}...`);
            
            const response = await axios.post(
                `https://api.elevenlabs.io/v1/text-to-speech/${this.VOICE_ID}`,
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
                    responseType: 'arraybuffer'
                }
            );

            return Buffer.from(response.data);

        } catch (error) {
            console.error("❌ ElevenLabs Error:", error);
            return null;
        }
    }
}
