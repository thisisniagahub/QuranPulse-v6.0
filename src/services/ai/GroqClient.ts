
import axios from 'axios';
import { ChatMessage } from '../../types.ts';
import { groqRotator } from './MultiKeyRotator.ts';

/**
 * GROQ HIGH-SPEED CLIENT
 * Cip LPU (Language Processing Unit) untuk respon sepantas kilat.
 */
export const GroqClient = {
    async callGroq(messages: ChatMessage[]): Promise<string> {
        return groqRotator.executeWithRetry(async (apiKey) => {
            console.log("⚡ Calling GROQ Engine (Llama 3.3 70B - Super Advanced)...");

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: "llama-3.3-70b-versatile",
                    messages: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    temperature: 0.7,
                    max_tokens: 1024
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        });
    }
};
