import { supabase } from '../lib/supabase';
import { callGeminiDirect } from './GeminiClient';
import { GroqClient, ChatMessage } from './GroqClient';

// --- TYPES ---
export interface HybridResponse {
  summary: string;
  steps?: string[];
  resources?: Array<{ type: 'video' | 'link' | 'article', title: string, url: string }>;
  widget?: { id: string, props?: any };
}

// --- SYSTEM PROMPT ---
const SYSTEM_INSTRUCTION = `
ROLE: Anda adalah "Tok Imam AI".
GOAL: Berikan jawapan JSON yang berstruktur untuk aplikasi QuranPulse.

FORMAT JSON:
{
  "summary": "Jawapan padat (Max 3 ayat).",
  "steps": ["Langkah 1", "Langkah 2"], // Optional
  "resources": [{ "type": "link", "title": "...", "url": "..." }], // Optional
  "widget": { "id": "ZAKAT_CALC" } // Optional. Pilihan: ZAKAT_CALC, INFAQ_CARD, PRAYER_TIMES, IQRA_LESSON
}

CONTOH:
User: "Nak bayar zakat"
Output: { "summary": "Boleh, mari kita kira.", "widget": { "id": "ZAKAT_CALC" } }
`;

// --- MAIN SERVICE ---

export const askUstazAI = async (
  messages: ChatMessage[]
): Promise<string> => {
  const lastUserMessage = messages[messages.length - 1].content;

  // 1. (Skipped: Local FAQ for now to reduce complexity in node refactor)

  // 2. (Skipped: Cache for now, direct AI first)

  // 3. FETCH FROM CLOUD AI (Groq First for Speed, then Gemini)

  // Inject System Prompt for JSON Structure
  const messagesWithSystem = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    ...messages
  ] as ChatMessage[];

  let rawResponse: string = "";

  // Attempt Groq (Ultra Fast)
  try {
    rawResponse = await GroqClient.callGroq(messagesWithSystem);
  } catch (e) {
    console.warn("Groq failed, falling back to Gemini...");
  }

  // Fallback to Gemini if Groq didn't answer
  if (!rawResponse) {
    try {
      rawResponse = await callGeminiDirect(messagesWithSystem);
    } catch (error) {
      console.error("AI Generation Failed:", error);
    }
  }

  if (rawResponse) {
    // Parse JSON
    let hybridData: HybridResponse;
    try {
      // Clean markdown code blocks if present
      const jsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      hybridData = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback if AI didn't return valid JSON
      console.warn("AI returned non-JSON. Wrapping as simple summary.");
      hybridData = { summary: rawResponse, steps: [], resources: [] };
    }

    // (Skipped: Save to Cache)

    // Format for UI
    return formatHybridResponse(hybridData);
  }

  return "Maaf, perkhidmatan Ustaz AI sedang sibuk. (Server Error)";
};

// --- HELPERS ---

function formatHybridResponse(data: HybridResponse): string {
  let output = data.summary;

  if (data.steps && data.steps.length > 0) {
    output += "\n\n**Panduan Langkah:**\n" + data.steps.map(s => `• ${s}`).join('\n');
  }

  if (data.resources && data.resources.length > 0) {
    output += "\n\n**Rujukan Tambahan:**\n" + data.resources.map(r => `[${r.type.toUpperCase()}] ${r.title}: ${r.url}`).join('\n');
  }

  // Generative UI Magic Hook
  if (data.widget) {
    output += `\n\n<<<WIDGET:${JSON.stringify(data.widget)}>>>`;
  }

  return output;
}

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
    // Basic mock for now, or implement Gemini Vision logic later
    return "Vision analysis not yet implemented on server side.";
};
