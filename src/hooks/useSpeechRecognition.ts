import { useState, useEffect, useCallback } from 'react';

export interface SpeechResult {
  transcript: string;
  confidence: number;
}

export interface UseSpeechRecognitionProps {
  onResult?: (result: SpeechResult) => void;
  lang?: string; // 'ms-MY', 'en-US', 'ar-SA'
}

export const useSpeechRecognition = ({ onResult, lang = 'ms-MY' }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0];
        const transcriptText = result.transcript;
        const confidence = result.confidence;

        setTranscript(transcriptText);
        if (onResult) {
            onResult({
                transcript: transcriptText,
                confidence: confidence
            });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        
        const errorMessages: Record<string, string> = {
            'not-allowed': 'Akses mikrofon disekat. Sila benarkan di browser (klik ikon mangga/mikrofon di address bar).',
            'no-speech': 'Tiada suara dikesan. Sila cuba lagi.',
            'network': 'Masalah rangkaian. Perlukan internet untuk pengecaman suara.',
            'aborted': 'Pengecaman dibatalkan.',
        };

        const errorMessage = errorMessages[event.error] || `Ralat: ${event.error}`;
        
        setError(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setError('Failed to start recognition');
    }
  }, [isSupported, lang, onResult]);

  const stopListening = useCallback(() => {
    // Usually handled by onend or manual stop logic if continuous
    // For simple implementation, we rely on auto-stop
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening
  };
};