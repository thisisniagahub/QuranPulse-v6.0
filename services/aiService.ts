import { supabase } from '../src/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Sends a chat prompt to the Zhipu AI model via Supabase Edge Function.
 * @param messages Chat history
 * @param onChunk Callback for streaming response (optional)
 * @returns Full response string
 */
export const askUstazAI = async (
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    // Call Supabase Edge Function 'chat-ustaz'
    const { data, error } = await supabase.functions.invoke('chat-ustaz', {
      body: { messages, stream: !!onChunk },
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
export const getTafsirForVerse = async (verseKey: string): Promise<any> => {
  return { 
    tafsir: "Tafsir is currently being upgraded to use Zhipu AI.", 
    reflection: "Please check back later.",
    practical_steps: []
  };
};

export const analyzeText = async (text: string): Promise<any> => {
  return { analysis: "Analysis unavailable." };
};

export const getVerseConnections = async (verseKey: string, text?: string): Promise<any> => {
  return [];
};

export const generateIslamicImage = async (prompt: string): Promise<string> => {
  return "https://placehold.co/600x400?text=AI+Image+Generation+Coming+Soon";
};

export const getPersonalizedGreeting = async (name: string): Promise<string> => {
  return `Assalamu Alaikum, ${name}`;
};

export const analyzeQuranRecitation = async (base64Audio: string, mimeType: string, context: string): Promise<any> => {
  return { 
      score: 0, 
      feedback: "Recitation analysis coming soon.",
      identified_text: "Recitation",
      accuracy_score: 0,
      tajweed_errors: [],
      feedback_summary: "Keep practicing!"
  };
};

export const generateIslamicVideo = async (prompt: string): Promise<string> => {
  return "";
};

export const generateSpeech = async (text: string, voice?: string): Promise<string> => {
  return ""; // Return empty base64 string
};

export const analyzeTajweedPosture = async (base64Image: string, context?: string): Promise<any> => {
  return { feedback: "Posture analysis coming soon.", is_correct: false };
};

export const enhanceVideoPrompt = async (prompt: string): Promise<string> => {
  return prompt;
};

export const getVerseTafsirAI = async (verseKey: string, context?: any, extra?: any): Promise<any> => {
  return getTafsirForVerse(verseKey);
};

export const analyzeMorphology = async (verseKey: string, text?: string): Promise<any> => {
  return { analysis: "Morphology analysis coming soon." };
};

export const getSemanticQuranSearch = async (query: string): Promise<any> => {
  return { results: [] };
};

export const chatWithVerseContext = async (verseKey: string, message: string, history?: any): Promise<string> => {
  return "Chat with verse context coming soon.";
};

export const generateDoaCard = async (name: string): Promise<string> => {
  return "May Allah bless you.";
};

