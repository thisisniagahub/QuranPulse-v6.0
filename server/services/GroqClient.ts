
import axios from 'axios';
import { groqRotator } from './MultiKeyRotator';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * GROQ HIGH-SPEED CLIENT (Server Side)
 */
export const GroqClient = {
    async callGroq(messages: ChatMessage[]): Promise<string> {
        return groqRotator.executeWithRetry(async (apiKey) => {
            console.log("⚡ Calling GROQ Engine (Llama 3.3 70B - Server Side)...");

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
