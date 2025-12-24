
import { supabase } from '../../lib/supabase.ts';
import { ChatMessage } from '../../types.ts';
import { geminiRotator } from './MultiKeyRotator.ts';
import axios from 'axios';

// Flag to indicate we are using the proxy for client-side.
export const GEMINI_API_KEYS: string[] = ["SECURE_PROXY_ENABLED"];

/**
 * CLIENT-SIDE PROXY CLIENT
 * Routes requests to Supabase Edge Function 'chat-proxy'.
 */
export async function callGeminiFlashWithFailover(messages: ChatMessage[], onChunk?: (chunk: string) => void): Promise<string> {
  console.log("📡 Connecting to Secure AI Proxy (Supabase Edge Function)...");

  try {
    const { data, error } = await supabase.functions.invoke('chat-proxy', {
      body: { messages }
    });

    if (error) throw new Error("Gagal menyambung ke pelayan AI (Proxy Error).");
    if (data?.error) throw new Error(`Ralat AI: ${data.error}`);

    const answer = data?.answer || "Maaf, tiada jawapan diterima.";

    if (onChunk) onChunk(answer);
    return answer;

  } catch (err: any) {
    console.warn("⚠️ AI Service Bypass: Proxy unreachable. Returning fallback message.");

    // Fallback response so the app doesn't crash
    const fallbackMessage = "Maaf, perkhidmatan AI sedang mengalami gangguan sambungan. Sila cuba sebentar lagi. (Ralat: Proxy Error)";

    if (onChunk) onChunk(fallbackMessage);
    return fallbackMessage;
  }
}

/**
 * DIRECT Gemini Client (For Bot Server)
 * Bypasses proxy for faster node-to-node communication with rotation.
 */
export async function callGeminiDirect(messages: ChatMessage[]): Promise<string> {
  return geminiRotator.executeWithRetry(async (apiKey) => {
    console.log("📡 Calling Gemini 2.0 Flash (Advanced Free Tier)...");

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(GEMINI_URL, {
      contents: formattedContents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      }
    });

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tiada jawapan.";
  });
}