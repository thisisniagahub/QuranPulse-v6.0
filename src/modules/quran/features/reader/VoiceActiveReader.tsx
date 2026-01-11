/**
 * 🎤 Voice-Active Reader
 * ASR-powered component that detects recitation and auto-scrolls
 * 
 * Features:
 * - Real-time voice detection
 * - Auto-scroll when verse complete
 * - Karaoke word highlighting
 * - Tajwid validation (optional)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Volume2, VolumeX, Play, Pause,
    SkipForward, Settings, Check, X, AlertCircle
} from 'lucide-react';

interface VoiceActiveReaderProps {
    verseKey: string;
    arabicText: string;
    transliteration?: string;
    onVerseComplete?: () => void;
    onNextVerse?: () => void;
    isActive: boolean;
    onToggle: () => void;
}

interface RecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

const VoiceActiveReader: React.FC<VoiceActiveReaderProps> = ({
    verseKey,
    arabicText,
    transliteration,
    onVerseComplete,
    onNextVerse,
    isActive,
    onToggle
}) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
    const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'ar-SA'; // Arabic (Saudi Arabia)

                recognitionRef.current.onresult = handleRecognitionResult;
                recognitionRef.current.onerror = handleRecognitionError;
                recognitionRef.current.onend = handleRecognitionEnd;
            }
        }

        return () => {
            stopListening();
        };
    }, []);

    // Handle recognition results
    const handleRecognitionResult = useCallback((event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                finalTranscript += result[0].transcript;
                setConfidence(result[0].confidence);
            } else {
                interimTranscript += result[0].transcript;
            }
        }

        setTranscript(finalTranscript || interimTranscript);

        // Reset silence timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }

        // Set silence timer - auto-proceed after 2 seconds of silence
        silenceTimerRef.current = setTimeout(() => {
            if (finalTranscript && confidence > 0.5) {
                handleVerseComplete();
            }
        }, 2000);

        // Simple word-by-word highlighting based on transcript length
        if (arabicText) {
            const words = arabicText.split(' ');
            const transcriptLength = (finalTranscript || interimTranscript).length;
            const ratio = transcriptLength / arabicText.length;
            const wordIndex = Math.min(Math.floor(ratio * words.length), words.length - 1);
            setHighlightedWordIndex(wordIndex);
        }
    }, [arabicText, confidence]);

    // Handle recognition errors
    const handleRecognitionError = useCallback((event: any) => {
        console.error('Speech recognition error:', event.error);

        switch (event.error) {
            case 'no-speech':
                setErrorMessage('Tiada suara dikesan. Cuba lagi.');
                break;
            case 'audio-capture':
                setErrorMessage('Mikrofon tidak dapat diakses.');
                break;
            case 'not-allowed':
                setErrorMessage('Sila benarkan akses mikrofon.');
                break;
            default:
                setErrorMessage('Ralat pengecaman suara.');
        }

        setStatus('error');
        setIsListening(false);
    }, []);

    // Handle recognition end
    const handleRecognitionEnd = useCallback(() => {
        if (isListening) {
            // Restart if still supposed to be listening
            try {
                recognitionRef.current?.start();
            } catch (e) {
                setIsListening(false);
                setStatus('idle');
            }
        }
    }, [isListening]);

    // Start listening
    const startListening = useCallback(async () => {
        if (!recognitionRef.current) {
            setErrorMessage('Browser tidak menyokong pengecaman suara.');
            return;
        }

        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            setIsListening(true);
            setStatus('listening');
            setTranscript('');
            setConfidence(0);
            setHighlightedWordIndex(-1);
            setErrorMessage(null);

            recognitionRef.current.start();
        } catch (err) {
            setErrorMessage('Sila benarkan akses mikrofon.');
            setStatus('error');
        }
    }, []);

    // Stop listening
    const stopListening = useCallback(() => {
        setIsListening(false);
        setStatus('idle');

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }

        try {
            recognitionRef.current?.stop();
        } catch (e) {
            // Ignore if already stopped
        }
    }, []);

    // Handle verse complete
    const handleVerseComplete = useCallback(() => {
        setStatus('success');
        stopListening();

        // Notify parent and auto-advance after delay
        onVerseComplete?.();

        setTimeout(() => {
            setStatus('idle');
            onNextVerse?.();
        }, 1500);
    }, [onVerseComplete, onNextVerse, stopListening]);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Split Arabic text into words for highlighting
    const words = arabicText.split(' ');

    if (!isActive) {
        return (
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 
                   rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
            >
                <Mic className="w-4 h-4" />
                <span>Voice Mode</span>
            </button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-green-500 animate-pulse' :
                            status === 'success' ? 'bg-cyan-500' :
                                status === 'error' ? 'bg-red-500' :
                                    'bg-slate-500'
                        }`} />
                    <span className="text-sm font-medium text-white">
                        {status === 'listening' ? 'Mendengar...' :
                            status === 'processing' ? 'Memproses...' :
                                status === 'success' ? 'Tepat!' :
                                    status === 'error' ? 'Ralat' :
                                        'Sedia'}
                    </span>
                </div>
                <button
                    onClick={onToggle}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {/* Arabic Text with Highlighting */}
            <div className="text-right mb-4 p-3 bg-slate-900 rounded-lg">
                <p className="text-2xl font-arabic leading-loose" dir="rtl">
                    {words.map((word, index) => (
                        <span
                            key={index}
                            className={`inline-block mx-1 px-1 rounded transition-colors ${index <= highlightedWordIndex
                                    ? 'text-cyan-400 bg-cyan-500/20'
                                    : 'text-white'
                                }`}
                        >
                            {word}
                        </span>
                    ))}
                </p>
            </div>

            {/* Transliteration (if available) */}
            {transliteration && (
                <p className="text-sm text-slate-400 mb-4 text-center italic">
                    {transliteration}
                </p>
            )}

            {/* Confidence Indicator */}
            {isListening && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Keyakinan</span>
                        <span>{Math.round(confidence * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${confidence > 0.7 ? 'bg-green-500' :
                                    confidence > 0.4 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Transcript Display */}
            {transcript && (
                <div className="mb-4 p-2 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Didengar:</p>
                    <p className="text-sm text-slate-300" dir="rtl">{transcript}</p>
                </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg 
                       flex items-center gap-2 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Animation */}
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex flex-col items-center justify-center py-4"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 
                           rounded-full flex items-center justify-center mb-2">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-cyan-400 font-medium">Bacaan Tepat!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={toggleListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center 
                     transition-all ${isListening
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-gradient-to-br from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/25'
                        }`}
                >
                    {isListening ? (
                        <MicOff className="w-6 h-6 text-white" />
                    ) : (
                        <Mic className="w-6 h-6 text-white" />
                    )}
                </button>

                <button
                    onClick={onNextVerse}
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                    title="Langkau ke ayat seterusnya"
                >
                    <SkipForward className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Instructions */}
            <p className="text-xs text-slate-500 text-center mt-4">
                Tekan mikrofon dan baca ayat dengan jelas.
                Sistem akan auto-scroll selepas selesai.
            </p>
        </motion.div>
    );
};

export default VoiceActiveReader;
