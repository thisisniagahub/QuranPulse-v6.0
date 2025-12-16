import { useState, useEffect, useCallback } from 'react';

export interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
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

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        if (onResult) onResult(transcriptText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        
        let errorMessage = event.error;
        switch (event.error) {
            case 'not-allowed':
                errorMessage = 'Akses mikrofon disekat. Sila benarkan di browser (klik ikon mangga/mikrofon di address bar).';
                break;
            case 'no-speech':
                errorMessage = 'Tiada suara dikesan. Sila cuba lagi.';
                break;
            case 'network':
                errorMessage = 'Masalah rangkaian. Perlukan internet untuk pengecaman suara.';
                break;
            case 'aborted':
                errorMessage = 'Pengecaman dibatalkan.';
                break;
            default:
                errorMessage = `Ralat: ${event.error}`;
        }
        
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
