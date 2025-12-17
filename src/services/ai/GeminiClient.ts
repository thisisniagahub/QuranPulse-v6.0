import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Flag to indicate we are using the proxy. 
// This satisfies the check in aiService.ts: if (GEMINI_API_KEYS.length > 0)
export const GEMINI_API_KEYS: string[] = ["SECURE_PROXY_ENABLED"]; 

/**
 * CLIENT-SIDE PROXY CLIENT
 * Routes requests to Supabase Edge Function 'chat-proxy'.
 * This hides the API Keys and Logic from the browser.
 */
export async function callGeminiFlashWithFailover(messages: ChatMessage[], onChunk?: (chunk: string) => void): Promise<string> {
  console.log("📡 Connecting to Secure AI Proxy (Supabase Edge Function)...");

  try {
    const { data, error } = await supabase.functions.invoke('chat-proxy', {
      body: { messages }
    });

    if (error) {
        console.error("Supabase Invocation Error:", error);
        throw new Error("Gagal menyambung ke pelayan AI (Proxy Error).");
    }

    if (data?.error) {
        console.error("Proxy Logic Error:", data.error);
        throw new Error(`Ralat AI: ${data.error}`);
    }

    const answer = data?.answer || "Maaf, tiada jawapan diterima.";

    // Simulate chunking since Edge Functions (non-streaming) return full text
    if (onChunk) {
        // Simple "fast type" effect for UX
        const words = answer.split(' ');
        for (let i = 0; i < words.length; i++) {
             // We can't actually await here easily without making this loop slow, 
             // but strictly speaking, onChunk expects instant delivery.
             // For now, just deliver the whole thing or chunks.
             onChunk(words[i] + ' ');
        }
    }

    return answer;

  } catch (err: any) {
    console.error("Critical AI Service Failure:", err);
    throw err;
  }
}