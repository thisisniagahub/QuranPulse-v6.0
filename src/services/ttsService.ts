/**
 * Native Text-to-Speech Service (Web Speech API)
 * Provides free, unlimited, offline-capable speech synthesis.
 */

export interface TTSConfig {
  lang?: string; // e.g., 'ar-SA', 'ms-MY', 'en-US'
  pitch?: number; // 0 to 2
  rate?: number; // 0.1 to 10
  voice?: SpeechSynthesisVoice;
}

let voices: SpeechSynthesisVoice[] = [];

// Initialize voices (async in some browsers)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const getVoices = (): SpeechSynthesisVoice[] => {
  if (voices.length === 0 && typeof window !== 'undefined') {
    voices = window.speechSynthesis.getVoices();
  }
  return voices;
};

export const getVoiceByLang = (langPrefix: string): SpeechSynthesisVoice | undefined => {
  return getVoices().find(v => v.lang.startsWith(langPrefix));
};

export const speak = (text: string, config: TTSConfig = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      console.error("Web Speech API not supported");
      reject("TTS not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Default Configuration
    utterance.lang = config.lang || 'ar-SA'; 
    utterance.pitch = config.pitch || 1.0;
    utterance.rate = config.rate || 0.9; // Slightly slower for clarity

    // Voice Selection Strategy
    if (config.voice) {
      utterance.voice = config.voice;
    } else {
      // Auto-select best voice for language
      const bestVoice = getVoiceByLang(utterance.lang);
      if (bestVoice) utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.error("TTS Error:", event);
      reject(event);
    };

    window.speechSynthesis.speak(utterance);
  });
};

export const stopTTS = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = (): boolean => {
  return typeof window !== 'undefined' && window.speechSynthesis.speaking;
};
