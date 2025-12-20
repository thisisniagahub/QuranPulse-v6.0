import axios from 'axios';
import { ChatMessage } from '../../types.ts';

/**
 * GROQ HIGH-SPEED CLIENT
 * Cip LPU (Language Processing Unit) untuk respon sepantas kilat.
 */
export const GroqClient = {
    apiKey: process.env.GROQ_API_KEY || (global as any).import?.meta?.env?.GROQ_API_KEY,

    async callGroq(messages: ChatMessage[]): Promise<string> {
        if (!this.apiKey) {
            throw new Error("GROQ_API_KEY missing");
        }

        try {
            console.log("⚡ Calling GROQ Engine (Speed Mode)...");
            
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: "llama-3.1-70b-versatile", // Model terbaru & power
                    messages: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    temperature: 0.7,
                    max_tokens: 1024
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;

        } catch (error: any) {
            console.error("❌ Groq Error:", error.response?.data || error.message);
            throw error;
        }
    }
};
