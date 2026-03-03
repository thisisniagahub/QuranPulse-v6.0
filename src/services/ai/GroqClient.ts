import type { ChatMessage } from '../../types';
import { openclawClient } from '../openclawClient';

/**
 * GROQ HIGH-SPEED CLIENT
 * Cip LPU (Language Processing Unit) untuk respon sepantas kilat.
 */
export const GroqClient = {
    async callGroq(messages: ChatMessage[]): Promise<string> {
        return openclawClient.chatCompletion(
            messages.map((message) => ({
                role: message.role === 'assistant' ? 'assistant' : message.role === 'system' ? 'system' : 'user',
                content: message.content,
            })),
            {
                temperature: 0.7,
                max_tokens: 1024
            }
        );
    }
};
