import { supabase } from '../lib/supabase';
import { ISLAMIC_FAQ } from '../data/islamicFAQ';
import type { ChatMessage } from '../types';

import { PERSONAS, DEFAULT_PERSONA, Persona } from '../config/personas';
import { VoiceService } from './ai/VoiceService';
import { mcpService } from './mcpService';
import staticContentService, { TajweedRule, MakhrajPoint, Doa, FAQ, Hadith } from './staticContentService';
import { checkFatwaSafety, sanitizeIslamicResponse } from './fatwaGuard';
import { ragQuery } from './ragService';
import { aiOrchestrator } from './ai/AdkRunner';
import { openclawClient } from './openclawClient';

// --- TYPES ---
export type EmotionType = 'sad' | 'anxious' | 'happy' | 'confused' | 'angry' | 'neutral';

export interface HybridResponse {
  summary: string;
  steps?: string[];
  resources?: Array<{ type: 'video' | 'link' | 'article', title: string, url: string }>;
  related_topics?: string[];
  widget?: { id: string, props?: any }; // New Generative UI Field
}

// --- CACHE SERVICE ---

// --- HELPER: FORMAT STATIC CONTENT ---
function formatStaticContent(data: any): string {
  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    const first = data[0];

    // Tajweed
    if ('rule_id' in first) {
      return data.map((r: TajweedRule) =>
        `## ${r.name_ms} (${r.name_ar})\n\n${r.description_ms}\n\n**Contoh:**\n${r.examples.map(e => `- ${e.surah_ayah}: ${e.arabic} (${e.transliteration})`).join('\n')}`
      ).join('\n\n---\n\n');
    }

    // Makhraj
    if ('point_id' in first) {
      return data.map((m: MakhrajPoint) =>
        `## ${m.name_ms} (${m.name_ar})\n\n**Posisi:** ${m.position}\n${m.description_ms}\n\n**Cara Sebutan:** ${m.practice_tips_ms}`
      ).join('\n\n---\n\n');
    }

    // Doa
    if ('doa_id' in first) {
      return data.map((d: Doa) =>
        `## ${d.title_ms}\n\n${d.arabic}\n\n*${d.transliteration}*\n\n"${d.translation_ms}"\n\n**Kelebihan:** ${d.benefits}`
      ).join('\n\n---\n\n');
    }

    // Hadith
    if ('hadith_id' in first) {
      return data.map((h: Hadith) =>
        `## Hadith Riwayat ${h.source}\n\n${h.arabic}\n\n"${h.translation_ms}"\n\n**Pengajaran:** ${h.topics.join(', ')}`
      ).join('\n\n---\n\n');
    }

    // FAQ
    if ('faq_id' in first) {
      return data.map((f: FAQ) =>
        `💡 **${f.question_ms}**\n\n${f.answer_ms}`
      ).join('\n\n');
    }
  }
  return "";
}

// --- UNIFIED CACHE SERVICE ---

/**
 * Check Supabase Cache (via staticContentService)
 */
async function findCachedResponse(query: string): Promise<HybridResponse | null> {
  const cached = await staticContentService.getCachedResponse(query);
  if (cached) {
    return cached as HybridResponse;
  }
  return null;
}

/**
 * Save new AI knowledge to the database (via staticContentService).
 */
async function saveToCache(query: string, response: HybridResponse) {
  try {
    await staticContentService.cacheResponse(query, response, 'general');
  } catch (e) {
    console.error("Cache Save Error:", e);
  }
}

import { UstazahOrchestrator } from './UstazahOrchestrator';

// --- CIRCUIT BREAKER ---
const CIRCUIT_THRESHOLD = 3;
const CIRCUIT_COOLDOWN = 1000 * 60 * 5; // 5 minutes

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' = 'CLOSED';

  isOpen() {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > CIRCUIT_COOLDOWN) {
        this.reset();
        return false;
      }
      return true;
    }
    return false;
  }

  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= CIRCUIT_THRESHOLD) {
      this.state = 'OPEN';
      console.warn(`🚨 CIRCUIT BREAKER: Tripped! AI Provider disabled for ${CIRCUIT_COOLDOWN / 60000} mins.`);
    }
  }

  reset() {
    this.failures = 0;
    this.state = 'CLOSED';
    console.log("🟢 CIRCUIT BREAKER: Resetting AI Provider.");
  }
}

const groqCircuit = new CircuitBreaker();
const geminiCircuit = new CircuitBreaker();

// --- MAIN SERVICE ---

export const askUstazAI = async (
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  personaId: string = DEFAULT_PERSONA.id
): Promise<string> => {
  const lastUserMessage = messages[messages.length - 1].content;

  // 0. FATWA GUARD — Safety check before any AI processing
  const fatwaCheck = checkFatwaSafety(lastUserMessage);
  if (fatwaCheck.shouldBlock) {
    const blocked = `🛡️ **Fatwa Guard**\n\n${fatwaCheck.recommendation}\n\n${fatwaCheck.referralSuggestion || ''}${fatwaCheck.disclaimer || ''}`;
    if (onChunk) onChunk(blocked);
    return blocked;
  }

  // 1/2. RUN LOCAL FAQ + STATIC LOOKUP IN PARALLEL
  const [localFaqResult, smartLookupResult] = await Promise.allSettled([
    Promise.resolve(
      ISLAMIC_FAQ.find((item) =>
        item.keywords.some((k) => lastUserMessage.toLowerCase().includes(k.toLowerCase()))
      )
    ),
    staticContentService.smartLookup(lastUserMessage, 'ms')
  ]);

  // Priority: local hardcoded FAQ first
  if (localFaqResult.status === 'fulfilled' && localFaqResult.value) {
    const response = `💡 **${localFaqResult.value.question}**\n\n${localFaqResult.value.answer}`;
    if (onChunk) onChunk(response);
    return response;
  }

  if (smartLookupResult.status === 'fulfilled') {
    const smartResult = smartLookupResult.value;
    if (smartResult) {
      if (smartResult.source === 'cache') {
        console.log("⚡ SMART LOOKUP: Cache Hit");
        const cachedData = smartResult.data as HybridResponse;
        const formatted = formatHybridResponse(cachedData);
        if (onChunk) onChunk(formatted);
        return formatted;
      }

      console.log("⚡ SMART LOOKUP: Static Content found");
      const formatted = formatStaticContent(smartResult.data);
      if (formatted) {
        if (onChunk) onChunk(formatted);
        return formatted;
      }
    }
  } else {
    console.error("Smart Lookup Failed:", smartLookupResult.reason);
  }

  // 3. CHECK MCP (REAL-TIME DATA) - Pulse-MCP Integration
  try {
    const mcpResponse = await UstazahOrchestrator.detectAndCall(lastUserMessage, 'ms');
    if (mcpResponse) {
      const formatted = formatHybridResponse(mcpResponse);
      if (onChunk) onChunk(formatted);
      await saveToCache(lastUserMessage, mcpResponse);
      return formatted;
    }
  } catch (e) {
    console.error("MCP Routing Failed, falling back to LLM:", e);
  }

  // 4. FETCH FROM CLOUD AI (OpenClaw Gateway)

  const activePersona: Persona = PERSONAS[personaId] || DEFAULT_PERSONA;

  // EMOTIONAL INTELLIGENCE INJECTION
  const detectedEmotion = detectUserEmotion(lastUserMessage);
  const emotionalContext = getEmotionalContext(detectedEmotion);
  const emotionSystemPrompt = emotionalContext ? `\n\n${emotionalContext}` : "";
  const systemPrompt = activePersona.systemPrompt + emotionSystemPrompt;

  let rawResponse: string = "";

  // Single gateway circuit path while preserving existing breaker behavior.
  if (groqCircuit.isOpen() || geminiCircuit.isOpen()) {
    console.warn('⏩ Bypassing OpenClaw (Circuit is OPEN)');
  } else {
    try {
      // === CLOUD AI via OpenClaw Gateway ===
      rawResponse = await openclawClient.chatCompletion(
        [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({
            role: (m.role === 'assistant' || m.role === 'system' ? m.role : 'user') as 'assistant' | 'system' | 'user',
            content: m.content
          })),
        ],
        {
          stream: !!onChunk,
          onChunk,
          temperature: 0.7,
          max_tokens: 2048,
        }
      );
      groqCircuit.reset();
      geminiCircuit.reset();
    } catch (error) {
      console.error('[OpenClaw] Gateway error:', error);
      groqCircuit.recordFailure();
      geminiCircuit.recordFailure();

      // Fallback to local simulation if gateway is down
      const simResponse = getSmartSimulationResponse(lastUserMessage);
      if (simResponse) {
        if (onChunk) onChunk(simResponse);
        return simResponse;
      }

      const unavailable = '🕊️ Maaf, perkhidmatan AI sedang tidak tersedia. Sila cuba sebentar lagi. Wallahu a\'lam.';
      if (onChunk) onChunk(unavailable);
      return unavailable;
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
    let finalOutput = formatHybridResponse(hybridData);

    // Enrich with RAG sources for topic-heavy queries
    const ragKeywords = ['tafsir', 'hadith', 'hukum', 'dalil', 'rujukan', 'sumber', 'hadis'];
    if (ragKeywords.some(k => lastUserMessage.toLowerCase().includes(k))) {
      try {
        const ragResult = await ragQuery(lastUserMessage, 'ms');
        if (ragResult.sources.length > 0) {
          const citations = ragResult.sources
            .slice(0, 3)
            .map(s => `> 📖 *${s.reference}*`)
            .join('\n');
          finalOutput += `\n\n---\n📚 **Rujukan:**\n${citations}`;
        }
      } catch { /* RAG enrichment is optional */ }
    }

    // Fatwa Guard: sanitize all AI responses
    finalOutput = sanitizeIslamicResponse(finalOutput, fatwaCheck);

    if (onChunk) onChunk(finalOutput);
    return finalOutput;
  }

  // 5. FALLBACK SIMULATION
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

// --- EMOTIONAL INTELLIGENCE ---

const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  sad: ['sedih', 'duka', 'mati', 'kehilangan', 'menangis', 'meninggal', ' kecewa', 'patah hati'],
  anxious: ['risau', 'takut', 'gelisah', 'stress', 'bimbang', 'cemas', 'serabut', 'gementar'],
  happy: ['syukur', 'gembira', 'alhamdulillah', 'bahagia', 'bersyukur', 'seronok', 'tenang'],
  confused: ['keliru', 'tak faham', 'bingung', 'macam mana', 'pening', 'was-was'],
  angry: ['marah', 'kecewa', 'zalim', 'tak adil', 'bengkeng', 'geram', 'sakit hati'],
  neutral: []
};

const COMFORT_VERSES: Record<EmotionType, Array<{ text: string, ref: string }>> = {
  sad: [
    { text: "Janganlah kamu bersikap lemah, dan janganlah kamu bersedih hati, padahal kamulah orang-orang yang paling tinggi (darjatnya), jika kamu orang-orang yang beriman.", ref: "Ali 'Imran: 139" },
    { text: "Sesungguhnya bersama kesulitan ada kemudahan.", ref: "Al-Insyirah: 6" }
  ],
  anxious: [
    { text: "Ingatlah, hanya dengan mengingati Allah-lah hati menjadi tenteram.", ref: "Ar-Ra'd: 28" },
    { text: "Dan barangsiapa yang bertawakkal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya.", ref: "At-Talaq: 3" }
  ],
  happy: [
    { text: "Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu.", ref: "Ibrahim: 7" }
  ],
  confused: [
    { text: "Maka bertanyalah kepada orang yang mempunyai pengetahuan jika kamu tidak mengetahui.", ref: "An-Nahl: 43" }
  ],
  angry: [
    { text: "Dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang. Allah menyukai orang-orang yang berbuat kebajikan.", ref: "Ali 'Imran: 134" }
  ],
  neutral: []
};

function detectUserEmotion(message: string): EmotionType {
  const lowerMsg = message.toLowerCase();
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (emotion === 'neutral') continue;
    if (keywords.some(k => lowerMsg.includes(k))) {
      return emotion as EmotionType;
    }
  }
  return 'neutral';
}

function getEmotionalContext(emotion: EmotionType): string {
  switch (emotion) {
    case 'sad': return "USER EMOTION: SAD. Respond with a comforting, gentle tone. Acknowledge their pain validation first. Suggest a short Dua for peace.";
    case 'anxious': return "USER EMOTION: ANXIOUS. Respond with a calming, reassuring tone. Emphasize Tawakkal (reliance on Allah). Remind them that Allah is in control.";
    case 'happy': return "USER EMOTION: HAPPY. Respond with shared joy and encouragement. Remind them to say Alhamdulillah and use this energy for good.";
    case 'confused': return "USER EMOTION: CONFUSED. Respond with extreme clarity and patience. Break down the answer step-by-step. Use simple analogies.";
    case 'angry': return "USER EMOTION: ANGRY. Respond with patience and de-escalation. Validate their frustration but gently guide towards patience (Sabar) and forgiveness.";
    default: return "";
  }
}

function getEmotionVerse(emotion: EmotionType): string {
  const verses = COMFORT_VERSES[emotion];
  if (!verses || verses.length === 0) return "";
  const v = verses[Math.floor(Math.random() * verses.length)];
  return `\n\n> 🌿 *"${v.text}"* (${v.ref})`;
}


function getSmartSimulationResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  // 1. Try EXACT FAQ match first
  const exactMatch = ISLAMIC_FAQ.find(item =>
    item.keywords.some(k => lowerQuery.includes(k.toLowerCase()))
  );
  if (exactMatch) {
    return `💡 **${exactMatch.question}**\n\n${exactMatch.answer}${exactMatch.source ? `\n\n📖 _Rujukan: ${exactMatch.source}_` : ''}`;
  }

  // 2. Topic-based fuzzy matching
  const topicKeywords: Record<string, string[]> = {
    'SOLAT': ['solat', 'sembahyang', 'rakaat', 'imam', 'makmum', 'jamak', 'qasar'],
    'PUASA': ['puasa', 'ramadan', 'sahur', 'iftar', 'berbuka', 'fidyah'],
    'WUDHU': ['wudhu', 'air sembahyang', 'basuh', 'muka', 'tangan'],
    'AL-QURAN': ['quran', 'ayat', 'surah', 'tilawah', 'hafal', 'tajwid'],
    'DOA': ['doa', 'munajat', 'zikir', 'selawat'],
    'UMUM': ['hukum', 'halal', 'haram', 'wajib', 'sunat', 'makruh']
  };

  // Find matching topics
  const matchedTopics: string[] = [];
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(k => lowerQuery.includes(k))) {
      matchedTopics.push(topic);
    }
  }

  // 3. Return related FAQ entries for matched topics
  if (matchedTopics.length > 0) {
    const relatedFAQs = ISLAMIC_FAQ.filter(item =>
      matchedTopics.includes(item.category)
    ).slice(0, 3);

    if (relatedFAQs.length > 0) {
      const suggestions = relatedFAQs.map(f => `• **${f.question}**`).join('\n');
      return `🔍 **Topik Berkaitan Ditemui:**\n\n${suggestions}\n\n_Sila tanya dengan lebih spesifik untuk jawapan lengkap, contoh: "${relatedFAQs[0].keywords[0]}"_`;
    }
  }

  // 4. Ultimate Fallback with helpful guidance
  return `🕌 **Assalamualaikum!**\n\nMaaf, perkhidmatan AI sedang tidak tersedia buat sementara waktu.\n\n**Sila cuba:**\n• Soalan asas: _"Niat puasa"_, _"Cara wudhu"_, _"Sujud sahwi"_\n• Waktu solat: _"Waktu zohor WLP01"_\n• Kira zakat: _"Kira zakat gaji 5000"_\n\n_InsyaAllah, sistem akan pulih sebentar lagi._`;
}

// --- UTILITIES (Kept for compatibility) ---
// (Copying existing utility stubs to ensure no breaking changes)
// --- RUMI TO JAWI CONVERSION ---
const RUMI_TO_JAWI_MAP: Record<string, string> = {
  'a': 'ا', 'b': 'ب', 'c': 'چ', 'd': 'د', 'e': 'ي', 'f': 'ف',
  'g': 'ݢ', 'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ک', 'l': 'ل',
  'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'ڤ', 'q': 'ق', 'r': 'ر',
  's': 'س', 't': 'ت', 'u': 'و', 'v': 'ۏ', 'w': 'و', 'x': 'کس',
  'y': 'ي', 'z': 'ز', 'ny': 'ڽ', 'ng': 'ڠ', 'sy': 'ش', 'kh': 'خ',
  'gh': 'غ', 'th': 'ث', 'dz': 'ذ', 'ai': 'اي', 'au': 'او'
};

const JAWI_DIGRAPHS = ['ny', 'ng', 'sy', 'kh', 'gh', 'th', 'dz', 'ai', 'au'] as const;
const JAWI_REGEX_MAP = new Map<string, RegExp>(
  JAWI_DIGRAPHS.map((digraph) => [digraph, new RegExp(digraph, 'g')])
);

export const convertToJawi = async (text: string): Promise<string> => {
  if (!text) return '';
  try {
    const response = await openclawClient.convertToJawi(text);
    if (response && response.trim()) return response.trim();
  } catch (error) {
    console.error('[OpenClaw] convertToJawi fallback:', error);
  }

  // Local fallback conversion if gateway is unavailable.
  let result = text.toLowerCase();
  for (const [dg, regex] of JAWI_REGEX_MAP) {
    result = result.replace(regex, RUMI_TO_JAWI_MAP[dg] || dg);
  }

  let jawi = '';
  for (const char of result) {
    jawi += RUMI_TO_JAWI_MAP[char] || char;
  }
  return jawi;
};

// --- HADITH BY TOPIC ---
export const getHadithByTopic = async (topic: string): Promise<{ arabic: string; translation: string; source?: string }> => {
  try {
    // 1. Static Check
    try {
      const staticHadith = await staticContentService.getHadithByTopic(topic);
      if (staticHadith.length > 0) {
        const h = staticHadith[0];
        return { arabic: h.arabic, translation: h.translation_ms, source: `${h.source} (Static)` };
      }
    } catch (e) {
      console.warn("Static Hadith Check Failed:", e);
    }

    const { data, error } = await supabase.functions.invoke('mcp-education', {
      body: { intent: 'hadith', query: topic }
    });

    if (error || !data.results || data.results.length === 0) {
      // Fallback to OpenClaw content generation
      const response = await openclawClient.getHadithByTopic(topic);
      try {
        return JSON.parse(response.replace(/```json|```/g, '').trim());
      } catch {
        const lines = response.split('\n').map((line) => line.trim()).filter(Boolean);
        const sourceLine = lines.find((line) => /^sumber|^source|riwayat/i.test(line));
        const body = lines.filter((line) => line !== sourceLine).join('\n');
        return {
          arabic: '',
          translation: body || response,
          source: sourceLine ? sourceLine.replace(/^(?:sumber|source)\s*[:\-]?\s*/i, '').trim() : 'OpenClaw'
        };
      }
    }

    const hadith = data.results[0];
    return {
      arabic: hadith.content_arabic || '',
      translation: hadith.content_translation || '',
      source: `${hadith.collection_name} #${hadith.hadith_number}`
    };
  } catch (e) {
    console.error('getHadithByTopic error:', e);
    return { arabic: '', translation: '' };
  }
};

// --- TAFSIR FOR VERSE ---
export const getTafsirForVerse = async (key: string): Promise<{ tafsir: string; reflection: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('mcp-education', {
      body: { intent: 'tafsir', query: key }
    });

    if (error || !data.results || data.results.length === 0) {
      // Fallback to OpenClaw content generation
      const response = await openclawClient.getTafsirForVerse(key);
      try {
        return JSON.parse(response.replace(/```json|```/g, '').trim());
      } catch {
        const [tafsir, ...reflectionParts] = response.split('\n\n');
        return { tafsir: tafsir || response, reflection: reflectionParts.join('\n\n') };
      }
    }

    return {
      tafsir: data.results[0]?.tafsir || '',
      reflection: data.results[0]?.reflection || ''
    };
  } catch (e) {
    console.error('getTafsirForVerse error:', e);
    return { tafsir: '', reflection: '' };
  }
};
export const generateDoaCard = async (topic: string): Promise<string> => {
  const response = await openclawClient.generateDoa(topic);
  return response;
};

const analyzeVisionWithOpenClaw = async (base64Image: string, prompt: string): Promise<string> => {
  const imagePayload = `Analisis imej berikut (base64 JPEG): ${base64Image}`;
  const response = await openclawClient.chatCompletion(
    [
      {
        role: 'system',
        content: 'Anda pembantu vision QuranPulse. Analisis kandungan imej berdasarkan arahan pengguna dan beri jawapan padat dalam Bahasa Melayu.'
      },
      {
        role: 'user',
        content: `${prompt}\n\n${imagePayload}`
      }
    ],
    {
      temperature: 0.4,
      max_tokens: 1024
    }
  );

  return response || 'Maaf, Ustazah tidak dapat mengecam gambar tersebut.';
};


export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  return analyzeVisionWithOpenClaw(base64Image, prompt);
};

export const analyzeText = async () => ({});
export const generateIslamicImage = async () => "";
export const generateIslamicVideo = async (prompt: string) => "";
export const getPersonalizedGreeting = async (n: string) => "";

const PERSONA_OPENAI_VOICE_MAP: Record<string, 'nova' | 'echo' | 'alloy'> = {
  ustaz_ai: 'nova',
  tok_imam: 'alloy',
  default: 'alloy',
  content: 'alloy',
  hafazan: 'echo',
};

export const generateSpeech = async (text: string, personaId: string = DEFAULT_PERSONA.id): Promise<string> => {
  const activePersona: Persona = PERSONAS[personaId] || DEFAULT_PERSONA;
  const selectedVoice = PERSONA_OPENAI_VOICE_MAP[personaId] || activePersona.voiceId || 'alloy';
  const audioResult = await VoiceService.generateVoice(text, selectedVoice);

  if (!audioResult) return "";

  if (audioResult.type === 'buffer' && audioResult.data) {
    const bytes = new Uint8Array(audioResult.data);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    const base64 = btoa(binary);
    return `data:audio/mp3;base64,${base64}`;
  }

  if (audioResult.type === 'url' && audioResult.url) {
    return audioResult.url;
  }

  return '';
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
    // We use the ADK Runner to ensure high availability
    return await aiOrchestrator.ask(messages);
  } catch (error) {
    console.error("Verse Context Chat Failed:", error);
    return "Maaf, Ustaz AI sedang mengalami gangguan sambungan. Sila cuba sebentar lagi.";
  }
};
// --- QURAN RECITATION ANALYSIS ---
type RecitationAssessmentColor = 'RED' | 'YELLOW' | 'GREEN';

interface RecitationCategoryScores {
  makhraj: number;
  tajweedRules: number;
  rhythm: number;
  fluency: number;
}

interface TajweedCategoryFeedback {
  category: string;
  score: number;
  feedback: string;
  examples: string[];
}

export interface RecitationAnalysis {
  score: number; // 0-100
  feedback: string;
  issues: Array<{ position: string; issue: string; suggestion: string; exampleArabic?: string }>;
  overallAssessment: string;
  assessmentColor?: RecitationAssessmentColor;
  categoryScores?: RecitationCategoryScores;
  tajweedCategoryFeedback?: TajweedCategoryFeedback[];
  transcription?: string;
}

const RECITATION_RUBRIC_WEIGHTS: RecitationCategoryScores = {
  makhraj: 30,
  tajweedRules: 40,
  rhythm: 20,
  fluency: 10
};

const TAJWEED_CATEGORIES = [
  'Idgham',
  'Ikhfa',
  'Iqlab',
  'Izhar',
  'Ghunnah',
  "Madd Asli (Tabi'i)",
  'Madd Wajib Muttasil',
  'Madd Jaiz Munfasil',
  'Madd Lazim',
  "Madd 'Arid Lissukun",
  'Madd Lin',
  'Qalqalah'
];

const TAJWEED_ARABIC_EXAMPLES: Record<string, string[]> = {
  Idgham: ['مِنْ رَبِّهِمْ', 'مَن يَعْمَلْ'],
  Ikhfa: ['مِنْ شَرِّ', 'أَنْصَارًا'],
  Iqlab: ['سَمِيعٌ بَصِيرٌ', 'أَنْبِئْهُمْ'],
  Izhar: ['مِنْهُ', 'أَنْعَمْتَ'],
  Ghunnah: ['إِنَّا', 'ثُمَّ'],
  "Madd Asli (Tabi'i)": ['قَالَ', 'فِيهِ'],
  'Madd Wajib Muttasil': ['السَّمَاءِ', 'جَاءَ'],
  'Madd Jaiz Munfasil': ['فِي أَنْفُسِكُمْ', 'بِمَا أُنْزِلَ'],
  'Madd Lazim': ['الضَّالِّينَ', 'الْحَاقَّةُ'],
  "Madd 'Arid Lissukun": ['الْعَالَمِينَ', 'نَسْتَعِينُ'],
  'Madd Lin': ['خَوْفٍ', 'قُرَيْشٍ'],
  Qalqalah: ['أَحَدٌ', 'يَجْعَلْ']
};

type RecitationModelResponse = Partial<RecitationAnalysis> & {
  categoryScores?: Partial<RecitationCategoryScores>;
  tajweedCategoryFeedback?: Array<Partial<TajweedCategoryFeedback>>;
};

const clampScore = (value: unknown, fallback = 0): number => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const resolveAssessmentColor = (score: number): RecitationAssessmentColor => {
  if (score < 50) return 'RED';
  if (score <= 80) return 'YELLOW';
  return 'GREEN';
};

const extractJsonPayload = (response: string): RecitationModelResponse | null => {
  const cleaned = response.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
};

const normalizeCategoryScores = (raw: Partial<RecitationCategoryScores> | undefined, fallbackScore = 0): RecitationCategoryScores => ({
  makhraj: clampScore(raw?.makhraj, fallbackScore),
  tajweedRules: clampScore(raw?.tajweedRules, fallbackScore),
  rhythm: clampScore(raw?.rhythm, fallbackScore),
  fluency: clampScore(raw?.fluency, fallbackScore)
});

const calculateWeightedScore = (scores: RecitationCategoryScores): number => {
  const weighted =
    (scores.makhraj * RECITATION_RUBRIC_WEIGHTS.makhraj) +
    (scores.tajweedRules * RECITATION_RUBRIC_WEIGHTS.tajweedRules) +
    (scores.rhythm * RECITATION_RUBRIC_WEIGHTS.rhythm) +
    (scores.fluency * RECITATION_RUBRIC_WEIGHTS.fluency);

  return Math.round(weighted / 100);
};

const normalizeTajweedFeedback = (
  rawFeedback: Array<Partial<TajweedCategoryFeedback>> | undefined,
  fallbackScore: number
): TajweedCategoryFeedback[] => {
  if (!Array.isArray(rawFeedback) || rawFeedback.length === 0) {
    return TAJWEED_CATEGORIES.map((category) => ({
      category,
      score: fallbackScore,
      feedback: `Perlu latihan konsisten untuk ${category}.`,
      examples: TAJWEED_ARABIC_EXAMPLES[category] || ['الرَّحْمَٰنِ']
    }));
  }

  return rawFeedback.map((item) => {
    const category = typeof item.category === 'string' && item.category.trim()
      ? item.category.trim()
      : 'Tajweed';

    const examples = Array.isArray(item.examples)
      ? item.examples.filter((e): e is string => typeof e === 'string' && e.trim().length > 0)
      : [];

    return {
      category,
      score: clampScore(item.score, fallbackScore),
      feedback: typeof item.feedback === 'string' && item.feedback.trim()
        ? item.feedback.trim()
        : `Perbaiki penerapan ${category}.`,
      examples: examples.length > 0 ? examples : (TAJWEED_ARABIC_EXAMPLES[category] || ['الرَّحْمَٰنِ'])
    };
  });
};

const normalizeIssues = (
  rawIssues: Array<{ position?: unknown; issue?: unknown; suggestion?: unknown; exampleArabic?: unknown }> | undefined
): Array<{ position: string; issue: string; suggestion: string; exampleArabic?: string }> => {
  if (!Array.isArray(rawIssues)) return [];

  return rawIssues
    .filter(Boolean)
    .map((issue, index) => {
      const position = typeof issue.position === 'string' && issue.position.trim()
        ? issue.position.trim()
        : `Segmen ${index + 1}`;
      const issueText = typeof issue.issue === 'string' && issue.issue.trim()
        ? issue.issue.trim()
        : 'Perlu semakan tajweed';
      const suggestion = typeof issue.suggestion === 'string' && issue.suggestion.trim()
        ? issue.suggestion.trim()
        : 'Ulang bacaan perlahan sambil semak makhraj dan hukum tajwid.';
      const exampleArabic = typeof issue.exampleArabic === 'string' && issue.exampleArabic.trim()
        ? issue.exampleArabic.trim()
        : undefined;

      return { position, issue: issueText, suggestion, exampleArabic };
    });
};

export const analyzeQuranRecitation = async (
  audioBase64: string,
  verseKey: string,
  expectedArabic?: string
): Promise<RecitationAnalysis> => {
  try {
    const prompt = `Anda ialah pakar talaqqi dan tajwid Al-Quran. Tugas anda ialah menganalisis audio bacaan pengguna untuk ayat ${verseKey}.

EXPECTED ARABIC:
${expectedArabic ? expectedArabic : '[Tidak diberikan oleh sistem]'}

ANALYSIS REQUIREMENTS:
1) Lakukan audio transcription ringkas berdasarkan bacaan pengguna.
2) Bandingkan transkripsi tersebut dengan EXPECTED ARABIC untuk kesalahan huruf, harakat, waqaf/ibtida', dan panjang pendek.
3) Nilai kategori tajwid berikut:
   - Idgham
   - Ikhfa
   - Iqlab
   - Izhar
   - Ghunnah
   - Madd Asli (Tabi'i)
   - Madd Wajib Muttasil
   - Madd Jaiz Munfasil
   - Madd Lazim
   - Madd 'Arid Lissukun
   - Madd Lin
   - Qalqalah
4) Gunakan rubric skor:
   - makhraj: 30%
   - tajweedRules: 40%
   - rhythm: 20%
   - fluency: 10%
5) Beri maklum balas yang spesifik, termasuk contoh Arab pada bahagian yang perlu dibetulkan.
6) Jika audio tidak jelas, nyatakan secara jujur tetapi tetap beri cadangan pembaikan.

RESPOND WITH STRICT JSON ONLY (no markdown, no prose):
{
  "transcription": "string",
  "categoryScores": {
    "makhraj": 0,
    "tajweedRules": 0,
    "rhythm": 0,
    "fluency": 0
  },
  "tajweedCategoryFeedback": [
    {
      "category": "Idgham",
      "score": 0,
      "feedback": "string",
      "examples": ["مِنْ رَبِّهِمْ"]
    }
  ],
  "issues": [
    {
      "position": "perkataan/frasa",
      "issue": "jenis kesalahan",
      "suggestion": "cara pembetulan",
      "exampleArabic": "Arabic snippet"
    }
  ],
  "feedback": "ringkasan maklum balas",
  "overallAssessment": "ringkasan penilaian keseluruhan"
}`;

    const response = await analyzeVisionWithOpenClaw(audioBase64, prompt);
    const parsed = extractJsonPayload(response);

    if (!parsed) {
      return {
        score: 65,
        feedback: response || 'Analisis diterima tetapi format respons tidak standard.',
        issues: [],
        overallAssessment: 'Sila ulang bacaan pada tempo perlahan untuk analisis yang lebih tepat.',
        assessmentColor: resolveAssessmentColor(65),
        categoryScores: {
          makhraj: 65,
          tajweedRules: 65,
          rhythm: 65,
          fluency: 65
        },
        tajweedCategoryFeedback: normalizeTajweedFeedback(undefined, 65)
      };
    }

    const fallbackScore = clampScore(parsed.score, 70);
    const categoryScores = normalizeCategoryScores(parsed.categoryScores, fallbackScore);
    const weightedScore = calculateWeightedScore(categoryScores);
    const score = clampScore(weightedScore, fallbackScore);
    const assessmentColor = resolveAssessmentColor(score);
    const issues = normalizeIssues(
      parsed.issues as Array<{ position?: unknown; issue?: unknown; suggestion?: unknown; exampleArabic?: unknown }> | undefined
    );
    const tajweedCategoryFeedback = normalizeTajweedFeedback(parsed.tajweedCategoryFeedback, categoryScores.tajweedRules);

    return {
      score,
      feedback: typeof parsed.feedback === 'string' && parsed.feedback.trim()
        ? parsed.feedback.trim()
        : `Skor bacaan ${score}/100. Fokus pada makhraj dan pematuhan hukum tajwid.`,
      issues,
      overallAssessment: typeof parsed.overallAssessment === 'string' && parsed.overallAssessment.trim()
        ? parsed.overallAssessment.trim()
        : `Penilaian warna: ${assessmentColor}. Ulang latihan dengan fokus pada contoh-contoh Arab yang diberi.`,
      assessmentColor,
      categoryScores,
      tajweedCategoryFeedback,
      transcription: typeof parsed.transcription === 'string' ? parsed.transcription.trim() : undefined
    };
  } catch (error) {
    console.error('analyzeQuranRecitation error:', error);
    return {
      score: 0,
      feedback: 'Gagal menganalisis bacaan.',
      issues: [],
      overallAssessment: 'Perkhidmatan tidak tersedia.',
      assessmentColor: 'RED',
      categoryScores: {
        makhraj: 0,
        tajweedRules: 0,
        rhythm: 0,
        fluency: 0
      },
      tajweedCategoryFeedback: normalizeTajweedFeedback(undefined, 0)
    };
  }
};

// --- TAJWEED POSTURE ANALYSIS ---
export const analyzeTajweedPosture = async (imageBase64: string): Promise<{
  makhraj: string;
  sifat: string[];
  feedback: string;
}> => {
  try {
    const prompt = `Analisis posisi mulut/lidah untuk sebutan huruf Arab. Berikan JSON: {"makhraj": "...", "sifat": ["..."], "feedback": "..."}`;
    const response = await analyzeVisionWithOpenClaw(imageBase64, prompt);
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return { makhraj: '', sifat: [], feedback: 'Analisis tidak tersedia.' };
  }
};

// --- VERSE CONNECTIONS ---
export const getVerseConnections = async (verseKey: string): Promise<{
  related: Array<{ key: string; reason: string }>;
  theme: string;
}> => {
  try {
    const response = await openclawClient.chatCompletion([
      {
        role: 'system',
        content: 'Cari ayat-ayat lain yang berkaitan tema dengan ayat ini. JSON: {"related": [{"key": "surah:ayat", "reason": "..."}], "theme": "..."}'
      },
      {
        role: 'user',
        content: `Ayat: ${verseKey}`
      }
    ]);
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return { related: [], theme: '' };
  }
};

// --- SEMANTIC QURAN SEARCH ---
export const getSemanticQuranSearch = async (query: string): Promise<Array<{
  key: string;
  text: string;
  translation: string;
  relevance: number;
}>> => {
  try {
    const { data, error } = await supabase.functions.invoke('mcp-quran', {
      body: { intent: 'search', query, lang: 'ms' }
    });

    if (error || !data.results) return [];

    return data.results.map((r: any, idx: number) => ({
      key: r.ref,
      text: r.arabic || '',
      translation: r.text || '',
      relevance: 100 - (idx * 10)
    }));
  } catch {
    return [];
  }
};

// --- PERSONALIZED LEARNING PLAN ---
export const generateLearningPlan = async (profile: {
  currentLevel: number; // 1-6
  weakAreas: string[];
  dailyTimeMinutes: number;
}): Promise<{
  weeklyPlan: Array<{ day: string; focus: string; exercises: string[] }>;
  milestones: string[];
  estimatedCompletion: string;
}> => {
  try {
    const response = await openclawClient.chatCompletion([
      {
        role: 'system',
        content: `Buat pelan pembelajaran Iqra/tajwid. JSON format:
{"weeklyPlan": [{"day": "Isnin", "focus": "...", "exercises": ["..."]}], "milestones": ["..."], "estimatedCompletion": "X minggu"}`
      },
      {
        role: 'user',
        content: `Profil pelajar: Tahap ${profile.currentLevel}, Kelemahan: ${profile.weakAreas.join(', ')}, Masa harian: ${profile.dailyTimeMinutes} minit`
      }
    ]);
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return {
      weeklyPlan: [],
      milestones: [],
      estimatedCompletion: 'Tidak dapat dijana'
    };
  }
};

// --- MORPHOLOGY ANALYSIS ---
export const analyzeMorphology = async (arabic: string, translation: string): Promise<{
  morphology: Array<{ word: string; root: string; pattern: string; meaning: string }>;
  root: string;
  pattern: string;
}> => {
  try {
    const response = await openclawClient.chatCompletion([
      {
        role: 'system',
        content: 'Analisis morfologi ayat Arab ini. JSON: {"morphology": [{"word": "...", "root": "...", "pattern": "...", "meaning": "..."}], "root": "...", "pattern": "..."}'
      },
      {
        role: 'user',
        content: `Ayat: ${arabic}\nTerjemahan: ${translation}`
      }
    ]);
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return { morphology: [], root: '', pattern: '' };
  }
};

export const getVerseTafsirAI = getTafsirForVerse;
