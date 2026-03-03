import type { ChatMessage } from '../../types';
import { openclawClient } from '../openclawClient';

// Flag to indicate we are using the proxy for client-side.
export const GEMINI_API_KEYS: string[] = ['OPENCLAW_GATEWAY'];

/**
 * Compatibility wrapper for legacy Gemini call sites.
 * Now routes through OpenClaw Gateway.
 */
export async function callGeminiFlashWithFailover(messages: ChatMessage[], onChunk?: (chunk: string) => void): Promise<string> {
  try {
    return await openclawClient.chatCompletion(
      messages.map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : message.role === 'system' ? 'system' : 'user',
        content: message.content,
      })),
      {
        stream: !!onChunk,
        onChunk,
      }
    );
  } catch (err: any) {
    console.warn('⚠️ OpenClaw unavailable. Returning fallback message.', err);

    // Fallback response so the app doesn't crash
    const fallbackMessage = 'Maaf, perkhidmatan AI sedang mengalami gangguan sambungan. Sila cuba sebentar lagi.';

    if (onChunk) onChunk(fallbackMessage);
    return fallbackMessage;
  }
}

/**
 * Compatibility wrapper for legacy direct calls.
 * Now routes through OpenClaw Gateway.
 */
export async function callGeminiDirect(messages: ChatMessage[]): Promise<string> {
  return openclawClient.chatCompletion(
    messages.map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : message.role === 'system' ? 'system' : 'user',
      content: message.content,
    })),
    {
      temperature: 0.3,
      max_tokens: 2048,
    }
  );
}
