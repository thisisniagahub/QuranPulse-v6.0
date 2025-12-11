/**
 * Rumi Text-to-Speech (TTS) Utility
 * Uses Web Speech API to read Rumi transliteration for Quran learning
 */

import { transliterate } from './transliterationConverter';

export interface RumiTTSOptions {
  rate?: number;      // 0.1 to 10 (default: 0.8 for clear pronunciation)
  pitch?: number;     // 0 to 2 (default: 1)
  volume?: number;    // 0 to 1 (default: 1)
  voice?: SpeechSynthesisVoice | null;
  onWordStart?: (wordIndex: number) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

class RumiTTSEngine {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentWordIndex: number = 0;
  private words: string[] = [];
  private options: RumiTTSOptions = {};

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Check if TTS is supported
   */
  isSupported(): boolean {
    return this.synth !== null;
  }

  /**
   * Get available voices (prefer Malay/Indonesian for best Rumi pronunciation)
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Get recommended voice for Rumi (Malay/Indonesian preferred)
   */
  getRecommendedVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    
    // Priority: Malay > Indonesian > English (UK) > Any
    const priorities = ['ms', 'id', 'en-GB', 'en'];
    
    for (const lang of priorities) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }
    
    return voices[0] || null;
  }

  /**
   * Speak Rumi text word by word with highlighting callback
   */
  speak(text: string, options: RumiTTSOptions = {}): void {
    if (!this.synth) {
      options.onError?.('Text-to-Speech not supported in this browser');
      return;
    }

    // Stop any current speech
    this.stop();

    this.options = options;
    this.words = text.split(/\s+/).filter(w => w.length > 0);
    this.currentWordIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;

    // Create utterance with JAKIM TTS-optimized Rumi
    const ttsText = transliterate(text, { mode: 'tts' });
    this.utterance = new SpeechSynthesisUtterance(ttsText);
    this.utterance.rate = options.rate ?? 0.8;
    this.utterance.pitch = options.pitch ?? 1;
    this.utterance.volume = options.volume ?? 1;
    this.utterance.voice = options.voice ?? this.getRecommendedVoice();

    // Word boundary event for highlighting
    this.utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculate word index from character index
        const charIndex = event.charIndex;
        let wordIdx = 0;
        let charCount = 0;
        
        for (let i = 0; i < this.words.length; i++) {
          if (charCount >= charIndex) {
            wordIdx = i;
            break;
          }
          charCount += this.words[i].length + 1; // +1 for space
          wordIdx = i + 1;
        }
        
        this.currentWordIndex = Math.min(wordIdx, this.words.length - 1);
        options.onWordStart?.(this.currentWordIndex);
      }
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      options.onEnd?.();
    };

    this.utterance.onerror = (event) => {
      this.isPlaying = false;
      options.onError?.(event.error);
    };

    // Speak
    this.synth.speak(this.utterance);
  }

  /**
   * Speak a single verse's Rumi words with callbacks
   */
  speakWords(words: string[], options: RumiTTSOptions = {}): void {
    const text = words.join(' ');
    this.speak(text, options);
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  /**
   * Stop speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.currentWordIndex = 0;
    }
  }

  /**
   * Check if currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  /**
   * Check if paused
   */
  getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Get current word index
   */
  getCurrentWordIndex(): number {
    return this.currentWordIndex;
  }
}

// Singleton instance
export const rumiTTS = new RumiTTSEngine();

// React hook for using Rumi TTS
import { useState, useEffect, useCallback } from 'react';

export function useRumiTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.8);

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const availableVoices = rumiTTS.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice) {
        setSelectedVoice(rumiTTS.getRecommendedVoice());
      }
    };

    loadVoices();
    
    // Voices might load asynchronously
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentWordIndex(0);

    rumiTTS.speak(text, {
      rate,
      voice: selectedVoice,
      onWordStart: (idx) => setCurrentWordIndex(idx),
      onEnd: () => {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      },
      onError: (err) => {
        console.error('TTS Error:', err);
        setIsPlaying(false);
      }
    });
  }, [rate, selectedVoice]);

  const speakWords = useCallback((words: string[]) => {
    speak(words.join(' '));
  }, [speak]);

  const pause = useCallback(() => {
    rumiTTS.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    rumiTTS.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    rumiTTS.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  }, []);

  return {
    isSupported: rumiTTS.isSupported(),
    isPlaying,
    isPaused,
    currentWordIndex,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    speak,
    speakWords,
    pause,
    resume,
    stop
  };
}
