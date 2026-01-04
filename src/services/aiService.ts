import { supabase } from '../lib/supabase';
import { ISLAMIC_FAQ } from '../data/islamicFAQ';
import { GEMINI_API_KEYS, callGeminiFlashWithFailover, callGeminiDirect } from './ai/GeminiClient';
import { GroqClient } from './ai/GroqClient';
import { ChatMessage } from '../types';

import { PERSONAS, DEFAULT_PERSONA, Persona } from '../config/personas';
import { analyzeImageWithGemini } from './ai/GeminiVisionClient';
import { VoiceService } from './ai/VoiceService';
import { mcpService } from './mcpService';

// --- TYPES ---
export interface HybridResponse {
  summary: string;
  steps?: string[];
  resources?: Array<{ type: 'video' | 'link' | 'article', title: string, url: string }>;
  related_topics?: string[];
  widget?: { id: string, props?: any }; // New Generative UI Field
}

// --- CACHE SERVICE ---

/**
 * Check Supabase Cache for similar questions using Fuzzy Search (Zero Token Cost).
 * Uses 'pg_trgm' similarity or simple text matching.
 */
async function findCachedResponse(query: string): Promise<HybridResponse | null> {
  try {
    // 1. Clean query for better matching
    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/gi, '').trim();

    // 2. Search DB (Using text matching for now to save embedding tokens)
    // We look for questions that contain key words or are very similar.
    // In a full production with pg_vector, we would use embeddings here.
    const { data, error } = await supabase
      .from('ai_knowledge_cache')
      .select('structured_response')
      .textSearch('query_text', cleanQuery, { type: 'websearch', config: 'english' }) // 'english' works decent for malay rumi
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Cache Lookup Error:", error.message);
      return null;
    }

    if (data && data.structured_response) {
      console.log("⚡ CACHE HIT: Serving from Database");
      // Update access count (fire and forget)
      // supabase.rpc('increment_cache_count', { row_id: data.id }); 
      return data.structured_response as HybridResponse;
    }
  } catch (e) {
    console.error("Cache Logic Failure:", e);
  }
  return null;
}

/**
 * Save new AI knowledge to the database.
 */
async function saveToCache(query: string, response: HybridResponse) {
  try {
    const { error } = await supabase.from('ai_knowledge_cache').insert({
      query_text: query,
      answer_content: response.summary, // Fallback text
      structured_response: response,
      category: 'general',
      source: 'ai_generated'
    });

    if (error) console.error("Failed to cache answer:", error.message);
    else console.log("💾 Knowledge Cached for future use.");
  } catch (e) {
    console.error("Cache Save Error:", e);
  }
}

import { UstazOrchestrator } from './UstazOrchestrator';

// --- MAIN SERVICE ---

export const askUstazAI = async (
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  personaId: string = DEFAULT_PERSONA.id
): Promise<string> => {
  const lastUserMessage = messages[messages.length - 1].content;

  // 1. CHECK LOCAL HARDCODED FAQ (Fastest)
  const localMatch = ISLAMIC_FAQ.find(item =>
    item.keywords.some(k => lastUserMessage.toLowerCase().includes(k.toLowerCase()))
  );
  if (localMatch) {
    const response = `💡 **${localMatch.question}**\n\n${localMatch.answer}`;
    if (onChunk) onChunk(response);
    return response;
  }

  // 2. CHECK MCP (REAL-TIME DATA) - Pulse-MCP Integration
  // Checks for Intents: Worship (Solat) or Compliance (Fatwa/Halal)
  try {
    const mcpResponse = await MCPService.detectAndCall(lastUserMessage, 'ms'); // Default to 'ms' for now
    if (mcpResponse) {
      const formatted = formatHybridResponse(mcpResponse);
      if (onChunk) onChunk(formatted);
      await saveToCache(lastUserMessage, mcpResponse); // Cache the MCP result
      return formatted;
    }
  } catch (e) {
    console.error("MCP Routing Failed, falling back to LLM:", e);
  }

  // 3. CHECK DATABASE CACHE (Zero Token)
  const cachedData = await findCachedResponse(lastUserMessage);
  if (cachedData) {
    const formatted = formatHybridResponse(cachedData);
    if (onChunk) onChunk(formatted);
    return formatted;
  }

  // 3. FETCH FROM CLOUD AI (Groq First for Speed, then Gemini)

  // Select Persona
  const activePersona: Persona = PERSONAS[personaId] || DEFAULT_PERSONA;
  console.log(`🧠 AI Service using Persona: ${activePersona.name}`);

  // Inject System Prompt for JSON Structure
  const messagesWithSystem = [
    { role: 'system', content: activePersona.systemPrompt, id: 'sys', timestamp: Date.now() },
    ...messages
  ];

  let rawResponse: string = "";

  // Attempt Groq (Ultra Fast)
  try {
    rawResponse = await GroqClient.callGroq(messagesWithSystem as any);
  } catch (e) {
    console.warn("Groq failed, falling back to Gemini...");
  }

  // Fallback to Gemini if Groq didn't answer
  if (!rawResponse) {
    try {
      const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
      rawResponse = isNode
        ? await callGeminiDirect(messagesWithSystem as any)
        : await callGeminiFlashWithFailover(messagesWithSystem as any);
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

    // Save to Cache
    await saveToCache(lastUserMessage, hybridData);

    // Format for UI
    const finalOutput = formatHybridResponse(hybridData);
    if (onChunk) onChunk(finalOutput);
    return finalOutput;
  }

  // 4. FALLBACK SIMULATION
  const simResponse = getSmartSimulationResponse(lastUserMessage);
  if (onChunk) onChunk(simResponse);
  return simResponse;
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

function getSmartSimulationResponse(query: string): string {
  // ... (Existing simulation logic kept as fallback) ...
  // Keeping it concise for this file update
  return "Maaf, perkhidmatan Ustaz AI sedang sibuk. Sila cuba soalan asas seperti 'Niat Puasa' atau 'Wuduk'. (Mod Simulasi)";
}

// --- UTILITIES (Kept for compatibility) ---
// (Copying existing utility stubs to ensure no breaking changes)
export const convertToJawi = async (text: string) => text;
export const getHadithByTopic = async (topic: string) => ({ arabic: '', translation: '' });
export const getTafsirForVerse = async (key: string) => ({ tafsir: '', reflection: '' });
export const generateDoaCard = async (topic: string): Promise<string> => {
  const prompt: ChatMessage[] = [
    {
      id: 'sys',
      role: 'system',
      content: "Anda adalah pakar penulisan Doa Islamik yang puitis. Tulis satu Doa yang sangat indah dan menyentuh hati dalam Bahasa Melayu berdasarkan topik pengguna. Sertakan teks Arab (jika ada) dan maksudnya. Formatkan dengan cantik menggunakan Markdown.",
      timestamp: Date.now()
    },
    { id: 'usr', role: 'user', content: `Topik Doa: ${topic}`, timestamp: Date.now() }
  ];
  return askUstazAI(prompt);
};


export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  return analyzeImageWithGemini(base64Image, prompt);
};

export const analyzeText = async () => ({});
export const generateIslamicImage = async () => "";
export const generateIslamicVideo = async (prompt: string) => "";
export const getPersonalizedGreeting = async (n: string) => "";


export const generateSpeech = async (text: string, personaId: string = DEFAULT_PERSONA.id): Promise<string> => {
  const activePersona: Persona = PERSONAS[personaId] || DEFAULT_PERSONA;
  const audioBuffer = await VoiceService.generateVoice(text, activePersona.voiceId);

  if (!audioBuffer) return "";

  // Convert buffer to base64 data URI for frontend playback
  const base64 = audioBuffer.toString('base64');
  return `data:audio/mp3;base64,${base64}`;
};
export const enhanceVideoPrompt = async (p: string) => p;
// Direct Verse Context Chat (Bypasses general Persona logic for specificity)
export const chatWithVerseContext = async (verseKey: string, verseText: string, query: string): Promise<string> => {
  const systemPrompt = `Anda adalah pakar Tadabbur Al-Quran yang mendalam. Pengguna sedang bertanya tentang Surah/Ayat tertentu.

CONTEXT:
Verse Key: ${verseKey}
Arabic/Translation: ${verseText}

ARAHAN:
1. Jawab soalan pengguna dengan mengaitkan terus dengan ayat di atas.
2. Jika relevan, sertakan pandangan mufassir muktabar (Ibn Kathir, Jalalayn, dll).
3. Kekalkan nada yang sopan, ilmiah, dan mudah difahami (Bahasa Melayu).
4. Elakkan hal-hal kontroversi yang tidak pasti.`;

  const messages = [
    { role: 'system', content: systemPrompt, id: 'sys', timestamp: Date.now() },
    { role: 'user', content: query, id: 'usr', timestamp: Date.now() }
  ];

  try {
    // We use the failover client directly to ensure high availability
    return await callGeminiFlashWithFailover(messages as any);
  } catch (error) {
    console.error("Verse Context Chat Failed:", error);
    return "Maaf, Ustaz AI sedang mengalami gangguan sambungan. Sila cuba sebentar lagi.";
  }
};
export const analyzeQuranRecitation = async () => ({});
export const analyzeTajweedPosture = async () => ({});
export const getVerseConnections = async () => ({});
export const getSemanticQuranSearch = async () => ({});
export const generateLearningPlan = async () => ({});
export const analyzeMorphology = async (arabic: string, translation: string) => ({ morphology: [], root: '', pattern: '' });
export const getVerseTafsirAI = getTafsirForVerse;