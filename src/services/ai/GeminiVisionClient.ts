import axios from 'axios';
import { geminiRotator } from './MultiKeyRotator.ts';

export const analyzeImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
    return geminiRotator.executeWithRetry(async (apiKey) => {
        // Using Gemini 2.0 Flash for vision
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await axios.post(GEMINI_URL, {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1024,
            }
        });

        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, Ustazah tidak dapat mengecam gambar tersebut.";
    });
};
