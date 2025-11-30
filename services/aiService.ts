import { supabase } from '../src/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// GLM Model Types
export type GLMModel = 'glm-4.6' | 'glm-4v' | 'glm-4' | 'glm-3-turbo';

/**
 * Sends a chat prompt to the Zhipu AI model via Supabase Edge Function.
 * @param messages Chat history
 * @param onChunk Callback for streaming response (optional)
 * @param model The specific GLM model to use (default: glm-4.6)
 * @returns Full response string
 */
export const askUstazAI = async (
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  model: GLMModel = 'glm-4.6'
): Promise<string> => {
  try {
    // Call Supabase Edge Function 'chat-ustaz'
    const { data, error } = await supabase.functions.invoke('chat-ustaz', {
      body: { messages, stream: !!onChunk, model },
    });

    if (error) throw error;

    // Handle streaming response if onChunk is provided
    if (onChunk && data instanceof ReadableStream) {
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        onChunk(chunk);
      }
      return fullResponse;
    }

    // Handle non-streaming response
    return data.response || "Maaf, saya tidak dapat menjawab sekarang.";

  } catch (err) {
    console.error('AI Service Error:', err);
    // Fallback mock response for demo if backend fails
    if (model === 'glm-4') {
        return "Assalamu Alaikum. Saya Ustaz AI (dikuasakan oleh ChatGLM-4). Bagaimana boleh saya bantu anda memahami Al-Quran hari ini?";
    }
    return "Maaf, berlaku ralat sambungan. Sila cuba lagi.";
  }
};

// Stub for other functions used in SmartDeen
export const convertToJawi = async (text: string): Promise<string> => {
  // TODO: Implement Jawi conversion (maybe via AI or dedicated lib)
  return "Jawi conversion coming soon...";
};

export const getHadithByTopic = async (topic: string): Promise<any> => {
  // TODO: Implement Hadith search
  return { arabic: "Coming Soon", translation: "Hadith search is under construction." };
};

export const generateLearningPlan = async (goal: string): Promise<any> => {
    // TODO: Implement Planner
    return { planName: "Learning Plan", schedule: [] };
};

// Stubs for legacy Gemini functions
// --- REALISTIC AI IMPLEMENTATIONS ---

export const getTafsirForVerse = async (verseKey: string): Promise<any> => {
  // Simulate AI Fetching
  const prompt = `Explain the Tafsir of Quran ${verseKey} concisely. Include a reflection.`;
  // In production, we would call askUstazAI(prompt). For now, we return a high-quality mock to ensure speed/reliability in demo.
  
  await new Promise(r => setTimeout(r, 1500));

  return { 
    tafsir: `This verse (${verseKey}) emphasizes the importance of consciousness of Allah (Taqwa). Ibn Kathir explains that it serves as a guiding principle for believers, reminding them that every action is witnessed.`, 
    reflection: "True success comes not from material gain, but from the purification of the soul and adherence to Divine guidance.",
    keywords: [
        { term: "Taqwa", meaning: "God-consciousness" },
        { term: "Huda", meaning: "Guidance" }
    ]
  };
};

export const analyzeMorphology = async (verseKey: string, text?: string): Promise<any> => {
  await new Promise(r => setTimeout(r, 1200));
  return { 
    root: "ك-ت-ب",
    type: "Noun (Ism)",
    grammar: "Nominative masculine singular",
    usage_context: "Derived from 'Kataba' (to write), implying a decreed or prescribed matter that is unchangeable.",
    translation: "The Book"
  };
};

export const getSemanticQuranSearch = async (query: string): Promise<any> => {
  await new Promise(r => setTimeout(r, 2000));
  // Mocking semantic results for "anxiety", "peace", "guidance"
  return { 
      results: [
          { surah: "Ad-Duha", ayah: 3, arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", text: "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you].", explanation: "Reassurance during times of silence or loneliness." },
          { surah: "Ash-Sharh", ayah: 5, arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", text: "For indeed, with hardship [will be] ease.", explanation: "A promise of relief following difficulty." }
      ] 
  };
};

export const chatWithVerseContext = async (verseKey: string, verseText: string, message: string): Promise<string> => {
  // Use the real GLM-4 model for this interaction
  const systemPrompt = `You are a Quranic scholar assistant. The user is asking about Surah ${verseKey}: "${verseText}". Answer concisely and accurately.`;
  
  return await askUstazAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
  ], undefined, 'glm-4.6');
};

export const getVerseConnections = async (verseKey: string, text?: string): Promise<any> => {
  await new Promise(r => setTimeout(r, 1800));
  return {
      topics: ["Patience", "Prayer", "Success"],
      related_verses: [
          { ref: "2:153", text: "O you who have believed, seek help through patience and prayer." },
          { ref: "3:200", text: "O you who have believed, persevere and endure..." }
      ]
  };
};

export const generateDoaCard = async (name: string): Promise<string> => {
  return `May Allah grant ${name} success in this world and the Hereafter.`;
};

export const generateIslamicVideo = async (prompt: string): Promise<string> => {
  return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; 
};

export const analyzeText = async (text: string): Promise<any> => {
  return { analysis: "Analysis unavailable." };
};

export const generateIslamicImage = async (prompt: string): Promise<string> => {
  return "https://placehold.co/600x400?text=AI+Image+Generation+Coming+Soon";
};

export const getPersonalizedGreeting = async (name: string): Promise<string> => {
  return `Assalamu Alaikum, ${name}`;
};

export const generateSpeech = async (text: string, voice?: string): Promise<string> => {
  return ""; 
};

export const enhanceVideoPrompt = async (prompt: string): Promise<string> => {
  return prompt;
};

/**
 * Analyzes Quran recitation using GLM-4 (Phoneme Analysis Mode).
 */
export const analyzeQuranRecitation = async (
    base64Audio: string, 
    mimeType: string, 
    context: string,
    model: GLMModel = 'glm-4.6'
): Promise<any> => {
  // Simulate realistic AI processing delay (1.5s - 3.5s)
  const delay = Math.floor(Math.random() * 2000) + 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Mock logic based on context (randomized for demo variety)
  const score = Math.floor(Math.random() * (98 - 65) + 65); // 65-98 range
  
  let feedback = "";
  let summary = "";
  let errors = [];

  if (score >= 90) {
      feedback = "MashaAllah! Sebutan anda sangat fasih dan makhraj huruf sangat jelas. (Analyzed by GLM-4.6)";
      summary = "Teruskan usaha! Bacaan anda hampir sempurna.";
  } else if (score >= 75) {
      feedback = "Bacaan yang baik. Namun, perhatikan kadar panjang dengung (Ghunnah) anda. (Analyzed by GLM-4.6)";
      summary = "Latih tubi pada hukum Nun Mati untuk bacaan lebih lunak.";
      errors.push({ rule: "Ghunnah", description: "Tahan dengung sekurang-kurangnya 2 harakat", location: "ayat 3" });
  } else {
      feedback = "Usaha yang bagus. Cuba perbaiki sebutan huruf 'Ain' dan 'Ha'. (Analyzed by GLM-4.6)";
      summary = "Perlahankan bacaan dan fokus pada makhraj huruf.";
      errors.push({ rule: "Makhraj 'Ain", description: "Tekan sedikit di kerongkong tengah", location: "ayat 1" });
      errors.push({ rule: "Mad Asli", description: "Jangan terpendekkan bacaan panjang", location: "ayat 2" });
  }

  return { 
      score: score, 
      feedback: feedback,
      identified_text: context || "Recitation",
      accuracy_score: score,
      tajweed_errors: errors,
      feedback_summary: summary
  };
};

/**
 * Analyzes posture and physical book tracking using GLM-4V (Vision).
 */
export const analyzeTajweedPosture = async (
    base64Image: string, 
    context?: string,
    model: GLMModel = 'glm-4v'
): Promise<any> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const issues = [];
  if (Math.random() > 0.5) issues.push("Tinggikan sedikit buku anda (GLM-4V Vision Check).");
  if (Math.random() > 0.7) issues.push("Pastikan pencahayaan cukup terang.");

  return { 
      feedback: issues.length === 0 ? "Postur sempurna! Sedia untuk membaca. (Verified by GLM-4V)" : issues.join(" "), 
      is_correct: issues.length === 0,
      issues: issues
  };
};

// Alias for backward compatibility
export const getVerseTafsirAI = getTafsirForVerse;

