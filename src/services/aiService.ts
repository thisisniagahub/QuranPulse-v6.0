import { supabase } from '../lib/supabase';
import { ISLAMIC_FAQ } from '../data/islamicFAQ';
import { GEMINI_API_KEYS, callGeminiFlashWithFailover, callGeminiDirect } from './ai/GeminiClient';
import { GroqClient } from './ai/GroqClient';
import { ChatMessage } from '../types';

import { PERSONAS, DEFAULT_PERSONA, Persona } from '../config/personas';
import { analyzeImageWithGemini } from './ai/GeminiVisionClient';
import { VoiceService } from './ai/VoiceService';
import { mcpService } from './mcpService';
import staticContentService, { TajweedRule, MakhrajPoint, Doa, FAQ, Hadith } from './staticContentService';

// --- TYPES ---
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

import { UstazOrchestrator } from './UstazOrchestrator';

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

  // 1. CHECK LOCAL HARDCODED FAQ (Fastest)
  const localMatch = ISLAMIC_FAQ.find(item =>
    item.keywords.some(k => lastUserMessage.toLowerCase().includes(k.toLowerCase()))
  );
  if (localMatch) {
    const response = `💡 **${localMatch.question}**\n\n${localMatch.answer}`;
    if (onChunk) onChunk(response);
    return response;
  }

  // 2. CHECK STATIC CONTENT & CACHE (Unified Smart Lookup)
  try {
    const smartResult = await staticContentService.smartLookup(lastUserMessage, 'ms');
    if (smartResult) {
      if (smartResult.source === 'cache') {
        console.log("⚡ SMART LOOKUP: Cache Hit");
        const cachedData = smartResult.data as HybridResponse;
        const formatted = formatHybridResponse(cachedData);
        if (onChunk) onChunk(formatted);
        return formatted;
      } else {
        console.log("⚡ SMART LOOKUP: Static Content found");
        const formatted = formatStaticContent(smartResult.data);
        if (formatted) {
          if (onChunk) onChunk(formatted);
          return formatted;
        }
      }
    }
  } catch (e) {
    console.error("Smart Lookup Failed:", e);
  }

  // 3. CHECK MCP (REAL-TIME DATA) - Pulse-MCP Integration
  try {
    const mcpResponse = await UstazOrchestrator.detectAndCall(lastUserMessage, 'ms');
    if (mcpResponse) {
      const formatted = formatHybridResponse(mcpResponse);
      if (onChunk) onChunk(formatted);
      await saveToCache(lastUserMessage, mcpResponse);
      return formatted;
    }
  } catch (e) {
    console.error("MCP Routing Failed, falling back to LLM:", e);
  }

  // 4. FETCH FROM CLOUD AI (Groq First for Speed, then Gemini)

  const activePersona: Persona = PERSONAS[personaId] || DEFAULT_PERSONA;
  const messagesWithSystem = [
    { role: 'system', content: activePersona.systemPrompt, id: 'sys', timestamp: Date.now() },
    ...messages
  ];

  let rawResponse: string = "";

  // Attempt Groq (Ultra Fast)
  if (!groqCircuit.isOpen()) {
    try {
      rawResponse = await GroqClient.callGroq(messagesWithSystem as any);
      groqCircuit.reset(); // Success, reset failures
    } catch (e) {
      console.warn("Groq failed, recording failure...");
      groqCircuit.recordFailure();
    }
  } else {
    console.warn("⏩ Bypassing Groq (Circuit is OPEN)");
  }

  // Fallback to Gemini if Groq didn't answer
  if (!rawResponse && !geminiCircuit.isOpen()) {
    try {
      const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
      rawResponse = isNode
        ? await callGeminiDirect(messagesWithSystem as any)
        : await callGeminiFlashWithFailover(messagesWithSystem as any);

      if (rawResponse.includes("Proxy Error")) {
        throw new Error("Gemini Proxy Error");
      }
      geminiCircuit.reset();
    } catch (error) {
      console.error("Gemini failed, recording failure:", error);
      geminiCircuit.recordFailure();
    }
  } else if (geminiCircuit.isOpen()) {
    console.warn("⏩ Bypassing Gemini (Circuit is OPEN)");
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

export const convertToJawi = async (text: string): Promise<string> => {
  if (!text) return '';

  let result = text.toLowerCase();

  // Replace digraphs first (ny, ng, sy, etc.)
  const digraphs = ['ny', 'ng', 'sy', 'kh', 'gh', 'th', 'dz', 'ai', 'au'];
  for (const dg of digraphs) {
    result = result.replace(new RegExp(dg, 'g'), RUMI_TO_JAWI_MAP[dg] || dg);
  }

  // Replace single characters
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
      // Fallback to AI generation
      const prompt: ChatMessage[] = [{
        id: 'sys', role: 'system', timestamp: Date.now(),
        content: 'Berikan satu hadith sahih yang berkaitan dengan topik. Format: {"arabic": "...", "translation": "...", "source": "Riwayat ..."}'
      }, {
        id: 'usr', role: 'user', timestamp: Date.now(),
        content: `Topik: ${topic}`
      }];

      const response = await callGeminiFlashWithFailover(prompt);
      try {
        return JSON.parse(response.replace(/```json|```/g, '').trim());
      } catch {
        return { arabic: '', translation: response, source: 'AI Generated' };
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
      // Fallback to AI-generated tafsir
      const prompt: ChatMessage[] = [{
        id: 'sys', role: 'system', timestamp: Date.now(),
        content: 'Anda pakar tafsir Al-Quran. Berikan tafsir ringkas dan refleksi spiritual untuk ayat ini. Format JSON: {"tafsir": "...", "reflection": "..."}'
      }, {
        id: 'usr', role: 'user', timestamp: Date.now(),
        content: `Ayat: ${key}`
      }];

      const response = await callGeminiFlashWithFailover(prompt);
      try {
        return JSON.parse(response.replace(/```json|```/g, '').trim());
      } catch {
        return { tafsir: response, reflection: '' };
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
  const base64 = (audioBuffer as any).toString('base64');
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
// --- QURAN RECITATION ANALYSIS ---
export interface RecitationAnalysis {
  score: number; // 0-100
  feedback: string;
  issues: Array<{ position: string; issue: string; suggestion: string }>;
  overallAssessment: string;
}

export const analyzeQuranRecitation = async (
  audioBase64: string,
  verseKey: string,
  expectedArabic?: string
): Promise<RecitationAnalysis> => {
  try {
    // Use Gemini Vision/Audio for analysis
    const prompt = `Anda adalah pakar tajwid Al-Quran. Analisis bacaan ini untuk ayat ${verseKey}.
${expectedArabic ? `Teks yang sepatutnya: ${expectedArabic}` : ''}

Berikan analisis dalam format JSON:
{
  "score": 0-100,
  "feedback": "Maklum balas ringkas",
  "issues": [{"position": "perkataan ke-X", "issue": "jenis kesalahan", "suggestion": "cara betulkan"}],
  "overallAssessment": "Penilaian keseluruhan"
}`;

    const response = await analyzeImageWithGemini(audioBase64, prompt);
    try {
      return JSON.parse(response.replace(/```json|```/g, '').trim());
    } catch {
      return {
        score: 70,
        feedback: response,
        issues: [],
        overallAssessment: 'Sila cuba lagi untuk analisis lebih tepat.'
      };
    }
  } catch (e) {
    console.error('analyzeQuranRecitation error:', e);
    return {
      score: 0,
      feedback: 'Gagal menganalisis bacaan.',
      issues: [],
      overallAssessment: 'Perkhidmatan tidak tersedia.'
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
    const response = await analyzeImageWithGemini(imageBase64, prompt);
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
    const prompt: ChatMessage[] = [{
      id: 'sys', role: 'system', timestamp: Date.now(),
      content: 'Cari ayat-ayat lain yang berkaitan tema dengan ayat ini. JSON: {"related": [{"key": "surah:ayat", "reason": "..."}], "theme": "..."}'
    }, {
      id: 'usr', role: 'user', timestamp: Date.now(),
      content: `Ayat: ${verseKey}`
    }];

    const response = await callGeminiFlashWithFailover(prompt);
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
    const prompt: ChatMessage[] = [{
      id: 'sys', role: 'system', timestamp: Date.now(),
      content: `Buat pelan pembelajaran Iqra/tajwid. JSON format:
{"weeklyPlan": [{"day": "Isnin", "focus": "...", "exercises": ["..."]}], "milestones": ["..."], "estimatedCompletion": "X minggu"}`
    }, {
      id: 'usr', role: 'user', timestamp: Date.now(),
      content: `Profil pelajar: Tahap ${profile.currentLevel}, Kelemahan: ${profile.weakAreas.join(', ')}, Masa harian: ${profile.dailyTimeMinutes} minit`
    }];

    const response = await callGeminiFlashWithFailover(prompt);
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
    const prompt: ChatMessage[] = [{
      id: 'sys', role: 'system', timestamp: Date.now(),
      content: 'Analisis morfologi ayat Arab ini. JSON: {"morphology": [{"word": "...", "root": "...", "pattern": "...", "meaning": "..."}], "root": "...", "pattern": "..."}'
    }, {
      id: 'usr', role: 'user', timestamp: Date.now(),
      content: `Ayat: ${arabic}\nTerjemahan: ${translation}`
    }];

    const response = await callGeminiFlashWithFailover(prompt);
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return { morphology: [], root: '', pattern: '' };
  }
};

export const getVerseTafsirAI = getTafsirForVerse;