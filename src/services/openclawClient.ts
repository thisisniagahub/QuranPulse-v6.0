// src/services/openclawClient.ts — Central OpenClaw Gateway Client

function readEnv(key: string): string {
  try {
    const importMeta = new Function('return typeof import.meta !== "undefined" ? import.meta : undefined;')() as
      | { env?: Record<string, string | undefined> }
      | undefined;
    const viteValue = importMeta?.env?.[key];
    if (viteValue) return viteValue;
  } catch {
    // Ignore non-ESM environments (e.g. Jest CJS transform).
  }

  const nodeValue = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[key];
  return nodeValue || '';
}

const OPENCLAW_URL = readEnv('VITE_OPENCLAW_URL') || 'https://operator.gangniaga.my';
const OPENCLAW_TOKEN = readEnv('VITE_OPENCLAW_TOKEN');

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

/**
 * OpenClaw Gateway Client
 * Routes ALL AI requests through the self-hosted OpenClaw gateway.
 * Uses OpenAI-compatible `/v1/chat/completions` endpoint.
 * ZERO API keys in browser — only bearer token for gateway auth.
 */
export const openclawClient = {
  /**
   * Chat Completions (OpenAI-compatible endpoint)
   * Supports streaming and non-streaming modes.
   */
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

    const res = await fetch(`${OPENCLAW_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        temperature,
        max_tokens,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`OpenClaw error ${res.status}: ${errorText}`);
    }

    // Streaming mode
    if (stream && onChunk && res.body) {
      const reader = res.body.getReader();
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
            // Skip malformed chunks
          }
        }
      }

      return fullText;
    }

    // Non-streaming mode
    const data: ChatCompletionResponse = await res.json();
    return data.choices[0]?.message?.content || '';
  },

  /**
   * Hooks API — Agent-specific requests
   * Routes to a specific OpenClaw agent via hooks.
   */
  async hookRequest(
    hookPath: string,
    payload: Record<string, unknown>,
    options: { sessionKey?: string } = {}
  ): Promise<HooksResponse> {
    const body: Record<string, unknown> = { ...payload };
    if (options.sessionKey) {
      body.sessionKey = options.sessionKey;
    }

    const res = await fetch(`${OPENCLAW_URL}/hooks/${hookPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      return { ok: false, error: `${res.status}: ${errorText}` };
    }

    return res.json();
  },

  /**
   * Ask Ustaz AI — Convenience wrapper for the main AI agent
   */
  async askUstaz(
    message: string,
    _userId: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.chatCompletion(
      [
        {
          role: 'system',
          content: 'Kau adalah Ustaz AI — pembantu ilmu Islam yang mesra, berilmu, dan tegas dalam Mazhab Shafi\'i. Gunakan Bahasa Melayu. Sertakan dalil Al-Quran dan Hadith bila tersedia. Jika tidak pasti, nyatakan "Wallahu a\'lam".',
        },
        { role: 'user', content: message },
      ],
      {
        stream: !!onChunk,
        onChunk,
      }
    );
  },

  /**
   * Session-based chat — maintains conversation history on the server
   */
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

    const response = await this.hookRequest(hookPath, {
      message,
      agentId,
    }, {
      sessionKey: normalizedSessionKey,
    });

    if (response.ok && response.reply) {
      return response.reply;
    }

    // Fallback to stateless chat completions if hooks fail
    return this.askUstaz(message, normalizedSessionKey, onChunk);
  },

  /**
   * Create a new session key for a user
   */
  createSessionKey(userId: string): string {
    return normalizeSessionKey(`${userId}:${Date.now()}`);
  },

  /**
   * Content Query — Uses content agent for tafsir/hadith
   */
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

  /**
   * Generate Doa Card
   */
  async generateDoa(topic: string): Promise<string> {
    return this.chatCompletion(
      [
        {
          role: 'system',
          content: 'Generate a beautiful doa card in Bahasa Melayu with Arabic text, transliteration, and meaning. Include the source (Quran/Hadith reference).',
        },
        { role: 'user', content: `Generate doa for: ${topic}` },
      ],
      { temperature: 0.5 }
    );
  },

  /**
   * Hadith by Topic
   */
  async getHadithByTopic(topic: string): Promise<string> {
    return this.queryContent(`Cari hadith berkaitan: ${topic}. Sertakan teks Arab, terjemahan, dan sumber/perawi.`, 'hadith');
  },

  /**
   * Tafsir for Verse
   */
  async getTafsirForVerse(verseKey: string): Promise<string> {
    return this.queryContent(`Berikan tafsir ringkas untuk ayat ${verseKey}. Sertakan konteks turunnya ayat (asbab al-nuzul) jika ada.`, 'tafsir');
  },

  /**
   * Rumi to Jawi conversion
   */
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

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${OPENCLAW_URL}/health`, {
        headers: { 'Authorization': `Bearer ${OPENCLAW_TOKEN}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

export type { ChatMessage, ChatCompletionResponse, HooksResponse };
