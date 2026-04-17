// src/services/openclawClient.ts — Central OpenClaw Gateway Client

import { blobToBase64, fetchFunction, invokeFunctionJson } from '@/lib/supabaseFunctions';

function normalizeSessionKey(sessionKey: string): string {
  const trimmed = sessionKey.trim();
  if (!trimmed) {
    return `web:guest:${Date.now()}`;
  }
  return trimmed.startsWith('web:') ? trimmed : `web:${trimmed}`;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface StreamChunk {
  id: string;
  object: string;
  choices: Array<{
    delta: { content?: string; role?: string };
    finish_reason: string | null;
  }>;
}

interface HooksResponse {
  ok: boolean;
  reply?: string;
  error?: string;
  sessionKey?: string;
}

interface ProxyHealthResponse {
  ok: boolean;
  status: number;
}

interface ProxyAudioResponse {
  audio_base64: string;
  content_type?: string;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * OpenClaw Gateway Client
 * Routes all AI requests through the server-side Edge Function proxy.
 */
export const openclawClient = {
  async chatCompletion(
    messages: ChatMessage[],
    options: {
      model?: string;
      stream?: boolean;
      temperature?: number;
      max_tokens?: number;
      onChunk?: (chunk: string) => void;
    } = {}
  ): Promise<string> {
    const {
      model = 'google-antigravity/gemini-3-flash',
      stream = false,
      temperature = 0.7,
      max_tokens = 2048,
      onChunk,
    } = options;

    if (stream && onChunk) {
      const response = await fetchFunction('openclaw-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'chat_completion',
          messages,
          model,
          stream: true,
          temperature,
          max_tokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`OpenClaw proxy error ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('OpenClaw proxy streaming response missing body.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop() || '';

        const lines = parts.filter((line) => line.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed: StreamChunk = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(content);
            }
          } catch {
            // Ignore malformed chunks.
          }
        }
      }

      return fullText;
    }

    const data = await invokeFunctionJson<ChatCompletionResponse>('openclaw-proxy', {
      intent: 'chat_completion',
      messages,
      model,
      stream: false,
      temperature,
      max_tokens,
    });

    return data.choices[0]?.message?.content || '';
  },

  async hookRequest(
    hookPath: string,
    payload: Record<string, unknown>,
    options: { sessionKey?: string } = {}
  ): Promise<HooksResponse> {
    return invokeFunctionJson<HooksResponse>('openclaw-proxy', {
      intent: 'hook_request',
      hookPath,
      payload,
      sessionKey: options.sessionKey,
    });
  },

  async askUstaz(
    message: string,
    _userId: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.chatCompletion(
      [
        {
          role: 'system',
          content:
            'Kau adalah Ustaz AI — pembantu ilmu Islam yang mesra, berilmu, dan tegas dalam Mazhab Shafi\'i. Gunakan Bahasa Melayu. Sertakan dalil Al-Quran dan Hadith bila tersedia. Jika tidak pasti, nyatakan "Wallahu a\'lam".',
        },
        { role: 'user', content: message },
      ],
      {
        stream: !!onChunk,
        onChunk,
      }
    );
  },

  async sessionChat(
    sessionKey: string,
    message: string,
    options: {
      agentId?: string;
      onChunk?: (chunk: string) => void;
    } = {}
  ): Promise<string> {
    const { agentId = 'ustaz', onChunk } = options;
    const normalizedSessionKey = normalizeSessionKey(sessionKey);
    const hookPath = agentId === 'ustaz' ? 'ai-query' : agentId;

    const response = await this.hookRequest(
      hookPath,
      {
        message,
        agentId,
      },
      {
        sessionKey: normalizedSessionKey,
      }
    );

    if (response.ok && response.reply) {
      return response.reply;
    }

    return this.askUstaz(message, normalizedSessionKey, onChunk);
  },

  createSessionKey(userId: string): string {
    return normalizeSessionKey(`${userId}:${Date.now()}`);
  },

  async queryContent(query: string, type: 'tafsir' | 'hadith' | 'general' = 'general'): Promise<string> {
    return this.chatCompletion(
      [
        {
          role: 'system',
          content: `Kau adalah Content Agent QuranPulse. Specialisasi: ${type}. Jawab dalam Bahasa Melayu dengan sumber yang tepat.`,
        },
        { role: 'user', content: query },
      ],
      { temperature: 0.3 }
    );
  },

  async generateDoa(topic: string): Promise<string> {
    return this.chatCompletion(
      [
        {
          role: 'system',
          content:
            'Generate a beautiful doa card in Bahasa Melayu with Arabic text, transliteration, and meaning. Include the source (Quran/Hadith reference).',
        },
        { role: 'user', content: `Generate doa for: ${topic}` },
      ],
      { temperature: 0.5 }
    );
  },

  async getHadithByTopic(topic: string): Promise<string> {
    return this.queryContent(`Cari hadith berkaitan: ${topic}. Sertakan teks Arab, terjemahan, dan sumber/perawi.`, 'hadith');
  },

  async getTafsirForVerse(verseKey: string): Promise<string> {
    return this.queryContent(
      `Berikan tafsir ringkas untuk ayat ${verseKey}. Sertakan konteks turunnya ayat (asbab al-nuzul) jika ada.`,
      'tafsir'
    );
  },

  async convertToJawi(text: string): Promise<string> {
    return this.chatCompletion(
      [
        {
          role: 'system',
          content: 'Convert the following Rumi text to Jawi script. Return ONLY the Jawi text, nothing else.',
        },
        { role: 'user', content: text },
      ],
      { temperature: 0, max_tokens: 500 }
    );
  },

  async generateSpeech(text: string, voice = 'nova'): Promise<ArrayBuffer> {
    const response = await invokeFunctionJson<ProxyAudioResponse>('openclaw-proxy', {
      intent: 'audio_speech',
      input: text,
      voice,
      response_format: 'mp3',
    });

    return base64ToArrayBuffer(response.audio_base64);
  },

  async transcribeAudio(audioBlob: Blob, expectedLanguage = 'ar'): Promise<{ text: string }> {
    return invokeFunctionJson<{ text: string }>('openclaw-proxy', {
      intent: 'audio_transcription',
      audio_base64: await blobToBase64(audioBlob),
      mime_type: audioBlob.type || 'audio/webm',
      model: 'gpt-4o-mini-transcribe',
      language: expectedLanguage,
    });
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await invokeFunctionJson<ProxyHealthResponse>('openclaw-proxy', {
        intent: 'health_check',
      });

      return response.ok;
    } catch {
      return false;
    }
  },
};

export type { ChatMessage, ChatCompletionResponse, HooksResponse };
