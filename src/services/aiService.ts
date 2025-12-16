import { supabase } from '@/lib/supabase';
import { ISLAMIC_FAQ } from '../data/islamicFAQ';

// --- CONFIGURATION ---
// Parse keys from comma-separated string for rotation
const GEMINI_API_KEYS = (import.meta.env.VITE_GEMINI_API_KEY || '')
  .split(',')
  .map((k: string) => k.trim())
  .filter((k: string) => k.length > 0);

// Base URL for dynamic model selection
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 🛡️ THEOLOGICAL SAFETY LAYER (Strict System Prompt)
const THEOLOGICAL_SYSTEM_PROMPT = `
Anda adalah Ustaz AI, pembantu ilmiah Islam yang berpengetahuan luas dan sederhana, berpegang teguh kepada Mazhab Syafi'i secara default, sambil menghormati pandangan Jumhur Ahli Sunnah Wal Jamaah.

PERATURAN UTAMA:
1.  **KEUTAMAAN:** Jawab berpandukan Al-Quran dan Hadith Sahih (Bukhari/Muslim). Petik sumber ini dahulu.
2.  **DALIL:** Sentiasa sertakan teks Arab atau rujukan spesifik (Surah:Ayat atau Kitab Hadith:Nombor) untuk setiap hujahan utama.
3.  **KETIDAKPASTIAN:** Jika anda tidak menemui dalil khusus, nyatakan "Wallahu A'lam" atau "Saya tidak menjumpai dalil khusus". JANGAN reka hukum.
4.  **NADA:** Sopan, berhikmah, dan empati.
5.  **PENAFIAN:** Akhiri jawapan sensitif dengan: "\n\n_Penafian: Ini adalah panduan umum AI. Sila rujuk asatizah bertauliah untuk fatwa rasmi._"
6.  **BAHASA:** Jawab dalam Bahasa Melayu yang baik dan mudah difahami.
`;

// Helper: Smart Search in Local FAQ
function findLocalAnswer(query: string): string | null {
  const q = query.toLowerCase();
  
  // 1. Direct Keyword Match
  const match = ISLAMIC_FAQ.find(item => 
    item.keywords.some(k => q.includes(k.toLowerCase()))
  );

  if (match) {
    let response = `💡 **${match.question}**\n\n${match.answer}`;
    if (match.source) {
      response += `\n\n_Sumber: ${match.source}_`;
    }
    return response;
  }

  return null;
}

/**
 * The Master Function: Decides whether to use Cloud AI (if Key exists) or Smart Simulation (if No Key).
 */
export const askUstazAI = async (
  messages: ChatMessage[], 
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const lastUserMessage = messages[messages.length - 1].content;

  // STEP 0: Check Local Knowledge Base (Jimat Kuota & Laju)
  const localAnswer = findLocalAnswer(lastUserMessage);
  if (localAnswer) {
      console.log("⚡ Serving from Local Knowledge Base (No API Cost)");
      // Simulate natural typing for better UX
      if (onChunk) {
          const words = localAnswer.split(' ');
          for (let i = 0; i < words.length; i++) {
              await new Promise(r => setTimeout(r, 20)); // Super fast typing
              onChunk(words[i] + ' ');
          }
      }
      return localAnswer;
  }

  // DEBUG: Check if keys are loaded
  console.log("DEBUG: Raw Env Var:", import.meta.env.VITE_GEMINI_API_KEY ? "EXISTS" : "MISSING");
  console.log("DEBUG: Parsed Keys Count:", GEMINI_API_KEYS.length);

  // 1. Check for API Key -> Use Cloud AI (Gemini Free Tier)
  if (GEMINI_API_KEYS.length > 0) {
    try {
      // Use Smart Failover rotation
      return await callGeminiFlashWithFailover(messages, onChunk);
    } catch (error) {
      console.error("All Gemini Keys Failed (Falling back to Simulation):", error);
      // Fallthrough to simulation
    }
  } else {
    console.log("No API Key detected. Using Smart Simulation Mode.");
  }

  // 2. Fallback -> Smart Simulation (Offline/No-Key Mode)
  const simResponse = getSmartSimulationResponse(lastUserMessage);
  
  // Simulate streaming effect for realism
  if (onChunk) {
      const words = simResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
          await new Promise(r => setTimeout(r, 30)); // Typing delay
          onChunk(words[i] + ' ');
      }
  }

  return simResponse;
};

// --- USAGE TRACKER (Client-Side Rate Limiting) ---
class KeyUsageTracker {
  private usage: Record<string, number[]> = {};
  private readonly RPM_LIMIT = 15;
  private readonly SAFE_BUFFER = 3; // Stop using key when it hits 12 RPM

  constructor() {
    // Load from localStorage if needed, but in-memory is usually enough for RPM
    // We strictly track RPM here. Daily limit is harder to track client-side reliably without auth.
  }

  recordUsage(key: string) {
    const now = Date.now();
    if (!this.usage[key]) this.usage[key] = [];
    this.usage[key].push(now);
    
    // Cleanup old logs (> 1 minute ago)
    this.usage[key] = this.usage[key].filter(timestamp => now - timestamp < 60000);
  }

  isKeyHealthy(key: string): boolean {
    const now = Date.now();
    if (!this.usage[key]) return true;
    
    // Filter strictly for last 60s check
    const recentRequests = this.usage[key].filter(timestamp => now - timestamp < 60000).length;
    
    // If usage > 12, consider it "Unhealthy" / "Hot"
    return recentRequests < (this.RPM_LIMIT - this.SAFE_BUFFER);
  }

  getUsageStats(key: string) {
    const now = Date.now();
    const count = this.usage[key]?.filter(t => now - t < 60000).length || 0;
    return { count, healthy: count < (this.RPM_LIMIT - this.SAFE_BUFFER) };
  }
}

const usageTracker = new KeyUsageTracker();

/**
 * SMART FAILOVER STRATEGY:
 * Tries keys one by one. Skips keys that are locally tracked as "Busy".
 */
async function callGeminiFlashWithFailover(messages: ChatMessage[], onChunk?: (chunk: string) => void): Promise<string> {
  // Shuffle keys initially to distribute load
  let shuffledKeys = [...GEMINI_API_KEYS].sort(() => Math.random() - 0.5);
  
  // Sort keys: Healthy keys first!
  shuffledKeys.sort((a, b) => {
      const aHealthy = usageTracker.isKeyHealthy(a);
      const bHealthy = usageTracker.isKeyHealthy(b);
      if (aHealthy && !bHealthy) return -1;
      if (!aHealthy && bHealthy) return 1;
      return 0;
  });

  let lastError = null;

  for (const apiKey of shuffledKeys) {
    // Double check health (redundant but safe)
    // If ALL keys are busy, we might still have to try one, so don't strict-block unless necessary.
    // Logic: If key is healthy, use it. If unhealthy, only use if it's the last resort? 
    // For now, we try regardless but priority is already sorted.
    
    const stats = usageTracker.getUsageStats(apiKey);
    console.log(`🔍 Checking Key ending ...${apiKey.slice(-4)} | RPM: ${stats.count}/15`);

    try {
      const response = await callGeminiFlash(messages, apiKey, onChunk);
      
      // If successful, record usage
      usageTracker.recordUsage(apiKey);
      
      return response;

    } catch (error: any) {
      console.warn(`Key ...${apiKey.slice(-4)} failed: ${error.message}. Switching to next key...`);
      lastError = error;
      // Continue loop to next key
    }
  }

  // If we reach here, ALL keys failed
  throw lastError || new Error("All API keys exhausted.");
}

/**
 * CLOUD LAYER: Google Gemini API (Direct Fetch)
 * This is Free Tier compatible (15 RPM).
 * NOW WITH MODEL FALLBACK (2.5 -> 1.5 -> Pro)
 */
async function callGeminiFlash(messages: ChatMessage[], apiKey: string, onChunk?: (chunk: string) => void): Promise<string> {
  const formattedContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // Prepend System Prompt as the first user message (Gemini API quirk)
  if (messages.length > 0 && messages[0].role !== 'system') {
     formattedContents.unshift({ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION:\n${THEOLOGICAL_SYSTEM_PROMPT}` }] });
  } else if (messages.length > 0 && messages[0].role === 'system') {
      formattedContents[0] = { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION:\n${messages[0].content}` }] };
  }

  // LIST OF MODELS TO TRY (In order of preference - UPDATED)
  const modelsToTry = [
      'gemini-2.5-flash-lite',  // <--- PALING RINGAN (Priority 1)
      'gemini-2.5-flash',       // THE NEW KING
      'gemini-2.5-flash-latest',
      'gemini-2.5-pro',
      'gemini-1.5-flash',       // STABLE FALLBACK
      'gemini-1.5-pro',
      'gemini-pro'              // LEGACY SAFEGUARD
  ];
  
  let lastError = null;

  for (const model of modelsToTry) {
    try {
        const url = `${GEMINI_BASE_URL}${model}:generateContent?key=${apiKey}`;
        // console.log(`Trying model: ${model}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            contents: formattedContents,
            generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            
            // If 404 (Model not found), allow loop to continue to next model
            if (response.status === 404) {
                // console.warn(`Model ${model} not found/supported. Trying next...`);
                continue; 
            }
            
            // If 429 (Rate Limit), throw immediately so the Key Rotator can switch keys!
            if (response.status === 429) {
                 throw new Error("RATE_LIMIT_EXCEEDED");
            }
            
            throw new Error(err.error?.message || `Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat memproses jawapan buat masa ini.";
        
        if (onChunk) onChunk(text);
        return text; // Success!

    } catch (e: any) {
        lastError = e;
        // If it's a rate limit, don't try other models on the SAME key.
        // Break loop to let the Key Rotator switch to the NEXT key.
        if (e.message === "RATE_LIMIT_EXCEEDED") throw e;
        
        // For other errors (like 404 that fell through fetch error), continue to next model
        if (e.message.includes("404") || e.message.includes("not found")) continue;
    }
  }

  // If all models fail on this key (but not rate limit), throw last error
  throw lastError || new Error("All models failed.");
}

/**
 * SIMULATION LAYER: "Regex-Based" Knowledge Base
 * Answers common questions instantly without any API.
 */
function getSmartSimulationResponse(query: string): string {
  const q = query.toLowerCase();

  // 1. GREETINGS & BASICS
  if (q.match(/\b(salam|assalam|hai|hello|morning)\b/)) {
    return "Wa'alaikumussalam w.b.t. Saya Ustaz AI. Ada apa-apa kemusykilan agama yang boleh saya bantu anda rungkaikan hari ini? (Mod Simulasi)";
  }
  
  if (q.match(/\b(siapa|what is|nama)\b/)) {
    return "Saya adalah Ustaz AI, pembantu maya yang direka untuk membantu anda memahami asas-asas agama Islam berpandukan Al-Quran dan Sunnah. Buat masa ini saya beroperasi dalam mod 'Luar Talian' (Tanpa Internet) untuk menjimatkan data anda.";
  }

  // 2. SOLAT (PRAYER)
  if (q.match(/\b(jamak|qasar|musafir)\b/)) {
    return "💡 **Panduan Solat Jamak & Qasar (Mazhab Syafi'i)**\n\nUntuk membolehkan solat Jamak & Qasar, syarat-syarat berikut perlu dipenuhi:\n1. Perjalanan melebihi 2 marhalah (~81km).\n2. Tujuan perjalanan yang diharuskan syarak (bukan maksiat).\n3. Berniat jamak/qasar pada permulaan solat.\n\n_Dalil:_ \"Dan apabila kamu musafir di muka bumi, maka tidaklah berdosa kamu mengqasarkan (memendekkan) sembahyang...\" (Surah An-Nisa: 101).";
  }

  if (q.match(/\b(lupa|rakaat|sujud sahwi)\b/)) {
    return "💡 **Terlupa Bilangan Rakaat**\n\nJika anda ragu-ragu tentang bilangan rakaat (contoh: 3 atau 4?), ambillah bilangan yang **yakin** (iaitu yang sedikit: 3). Kemudian, tambah satu rakaat lagi dan lakukan **Sujud Sahwi** sebelum memberi salam.\n\n_Hadith:_ Nabi SAW bersabda: \"Apabila salah seorang kamu ragu-ragu dalam solatnya... hendaklah dia membuang keraguan dan berpegang pada apa yang dia yakin (bilangan sedikit)...\" (Riwayat Muslim).";
  }

  if (q.match(/\b(batal|wudhu|kentut)\b/)) {
    return "Perkara yang membatalkan wudhu termasuk:\n1. Keluar sesuatu dari kubul atau dubur (kencing, tahi, angin).\n2. Tidur yang tidak tetap punggung.\n3. Hilang akal (mabuk, pitam, gila).\n4. Bersentuhan kulit lelaki dan wanita ajnabi tanpa lapik (Mazhab Syafi'i).\n5. Menyentuh kemaluan dengan tapak tangan.";
  }

  // 3. PUASA (FASTING)
  if (q.match(/\b(niat|puasa|ramadan|ganti)\b/)) {
    return "🌙 **Niat Puasa Ramadan**\n\nLafaz: _Nawaitu sauma ghadin 'an ada'i fardhi syahri Ramadhana hazihis sanati lillahi ta'ala._\nMaksud: Sahaja aku berpuasa esok hari untuk menunaikan fardu bulan Ramadan tahun ini kerana Allah Ta'ala.\n\nDisunatkan berniat pada setiap malam bulan Ramadan.";
  }

  // 4. GENERAL ADVICE
  if (q.match(/\b(stress|sedih|kecewa|putus asa)\b/)) {
    return "Ujian adalah tanda kasih sayang Allah. \n\n\"Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar.\" (Al-Baqarah: 155)\n\nBanyakkan beristighfar dan 'La hawla wala quwwata illa billah'.";
  }

  if (q.match(/\b(rezeki|kaya|duit)\b/)) {
    return "Rezeki adalah jaminan Allah, tetapi kita perlu berusaha.\n\nAmalan pembuka rezeki:\n1. Solat Dhuha.\n2. Bersedekah (tidak akan mengurangkan harta).\n3. Menyambung silaturrahim.\n4. Sentiasa bersyukur.\n\n\"Dan (ingatlah) ketika Tuhan kamu memberitahu: Demi sesungguhnya! Jika kamu bersyukur nescaya Aku akan tambahi nikmatKu kepada kamu...\" (Ibrahim: 7).";
  }

  // DEFAULT FALLBACK
  return "Terima kasih atas soalan tersebut. Memandangkan saya sedang dalam **Mod Simulasi (Tanpa API Key)**, pengetahuan saya terhad kepada topik asas (Solat, Puasa, Wudhu).\n\nUntuk jawapan AI yang lengkap, sila dapatkan **API Key Percuma** dari Google AI Studio dan masukkan ke dalam tetapan aplikasi.";
}

// --- UTILITIES (Restored from Stub) ---

export const convertToJawi = async (text: string): Promise<string> => {
  const rumiToJawi: Record<string, string> = { 
    'a': 'ا', 'b': 'ب', 'c': 'چ', 'd': 'د', 'e': 'ي', 'f': 'ف', 'g': 'ڬ', 'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ک', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'ڤ', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 'u': 'و', 'v': 'ۏ', 'w': 'و', 'x': 'کس', 'y': 'ي', 'z': 'ز', 'ng': 'ڠ', 'ny': 'ڽ', 'sy': 'ش', 'kh': 'خ', 'gh': 'غ', ' ': ' ', '.': '.', ',': '،', '?': '؟' 
  };
  let result = text.toLowerCase();
  ['ng', 'ny', 'sy', 'kh', 'gh'].forEach(dg => result = result.replace(new RegExp(dg, 'g'), rumiToJawi[dg] || dg));
  return result.split('').map(char => rumiToJawi[char] || char).join('');
};

export const getHadithByTopic = async (topic: string): Promise<any> => {
  const db: Record<string, any[]> = {
    'patience': [{arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', translation: 'Seek help through patience and prayer.', source: 'Sahih Muslim', narrator: 'Abu Hurairah' }],
    'prayer': [{arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ', translation: 'Prayer is the pillar of religion.', source: 'Sunan An-Nasai', narrator: 'Umar' }]
  };
  const res = db[topic.toLowerCase()]?.[0];
  return res ? { ...res, topic } : { arabic: '...', translation: 'No hadith found. Try: patience, prayer.', source: 'N/A' };
};

export const getTafsirForVerse = async (verseKey: string): Promise<any> => {
    return { tafsir: "Tafsir unavailable in simulation mode.", reflection: "Please connect API.", keywords: [] };
};

export const analyzeMorphology = async (word: string, trans?: string): Promise<any> => {
    return { root: '—', type: 'Word', usage_context: trans || 'Meaning unavailable', translation: trans || '' };
};

export const generateDoaCard = async (name: string) => `May Allah bless ${name}.`;
export const generateIslamicVideo = async () => "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
export const analyzeText = async () => ({ analysis: "Analysis unavailable." });
export const generateIslamicImage = async () => "https://placehold.co/600x400?text=AI+Gen+Coming+Soon";
export const getPersonalizedGreeting = async (name: string) => `Assalamu Alaikum, ${name}`;
export const generateSpeech = async () => "";
export const enhanceVideoPrompt = async (p: string) => p;
export const chatWithVerseContext = async (key: string, text: string, msg: string) => askUstazAI([{role:'user',content:msg}]);
export const analyzeQuranRecitation = async (b64: string, mime: string, ctx: string) => ({ score: 85, feedback: "Good recitation (Simulated).", accuracy_score: 85, tajweed_errors: [], feedback_summary: "Keep practicing." });
export const analyzeTajweedPosture = async () => ({ feedback: "Good posture (Simulated).", is_correct: true, issues: [] });
export const getVerseConnections = async () => ({ topics: ["Simulated Topic"], related_verses: [] });
export const getSemanticQuranSearch = async () => ({ results: [] });
export const generateLearningPlan = async () => ({ planName: "Simulated Plan", schedule: [] });

// Backward compatibility
export const getVerseTafsirAI = getTafsirForVerse;