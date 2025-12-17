import { supabase } from '@/lib/supabase';
import { ISLAMIC_FAQ } from '../data/islamicFAQ';
import { GEMINI_API_KEYS, callGeminiFlashWithFailover } from './ai/GeminiClient';
import { ChatMessage } from '../types';

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
    return {tafsir: "Tafsir unavailable in simulation mode.", reflection: "Please connect API.", keywords: [] };
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
export const chatWithVerseContext = async (key: string, text: string, msg: string) => askUstazAI([
    {
        id: 'ctx-' + Date.now(),
        role: 'user',
        content: msg,
        timestamp: Date.now()
    }
]);
export const analyzeQuranRecitation = async (b64: string, mime: string, ctx: string) => ({ score: 85, feedback: "Good recitation (Simulated).", accuracy_score: 85, tajweed_errors: [], feedback_summary: "Keep practicing." });
export const analyzeTajweedPosture = async () => ({ feedback: "Good posture (Simulated).", is_correct: true, issues: [] });
export const getVerseConnections = async () => ({ topics: ["Simulated Topic"], related_verses: [] });
export const getSemanticQuranSearch = async () => ({ results: [] });
export const generateLearningPlan = async () => ({ planName: "Simulated Plan", schedule: [] });

// Backward compatibility
export const getVerseTafsirAI = getTafsirForVerse;
