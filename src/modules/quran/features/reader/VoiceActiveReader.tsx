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
    SkipForward, Settings, Check, X, AlertCircle, Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

interface ASRAnalysisResult {
    qwer: number;
    level: string;
    error_breakdown: Record<string, number>;
    detailed_errors: Array<any>;
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
    const [analysisResult, setAnalysisResult] = useState<ASRAnalysisResult | null>(null);

    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
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

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
                resolve(base64data.split(',')[1]); 
            };
            reader.onerror = reject;
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
        } catch (err) {
            console.error("Error starting audio recording:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

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
            // Only finish if we have some confidence and transcript
            if ((finalTranscript || interimTranscript) && confidence > 0.4) {
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
                // Don't show error immediately for no speech, just keep listening
                // setErrorMessage('Tiada suara dikesan. Cuba lagi.');
                break;
            case 'audio-capture':
                setErrorMessage('Mikrofon tidak dapat diakses.');
                setStatus('error');
                setIsListening(false);
                break;
            case 'not-allowed':
                setErrorMessage('Sila benarkan akses mikrofon.');
                setStatus('error');
                setIsListening(false);
                break;
            default:
                // setErrorMessage('Ralat pengecaman suara.');
        }
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
            await startRecording(); // Start recording audio blobs

            setIsListening(true);
            setStatus('listening');
            setTranscript('');
            setConfidence(0);
            setHighlightedWordIndex(-1);
            setErrorMessage(null);
            setAnalysisResult(null);

            recognitionRef.current.start();
        } catch (err) {
            setErrorMessage('Sila benarkan akses mikrofon.');
            setStatus('error');
        }
    }, []);

    // Stop listening
    const stopListening = useCallback(() => {
        setIsListening(false);
        // setStatus('idle'); // Don't reset status here, handleVerseComplete needs it

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }

        try {
            recognitionRef.current?.stop();
            stopRecording();
        } catch (e) {
            // Ignore if already stopped
        }
    }, []);

    // Handle verse complete
    const handleVerseComplete = useCallback(async () => {
        setStatus('processing');
        stopListening();

        // 1. Process Audio for Q-WER Analysis
        try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            if (audioBlob.size > 0) {
                const base64Audio = await blobToBase64(audioBlob);
                
                // Call mcp-asr Edge Function
                const { data, error } = await supabase.functions.invoke('mcp-asr', {
                    body: {
                        intent: 'analyze',
                        audio_base64: base64Audio,
                        expected_text: arabicText
                    }
                });

                if (!error && data?.analysis) {
                    setAnalysisResult(data.analysis);
                    
                    if (data.analysis.qwer > 20) {
                        setErrorMessage("Bacaan perlu diperbaiki. Sila cuba lagi.");
                        // Don't auto-advance if error is high
                        setStatus('error');
                        return;
                    }
                }
            }
        } catch (err) {
            console.error("ASR Analysis failed:", err);
            // Fallback to browser confidence check
        }

        setStatus('success');

        // Notify parent and auto-advance after delay
        onVerseComplete?.();

        setTimeout(() => {
            if (status !== 'error') {
                setStatus('idle');
                onNextVerse?.();
            }
        }, 2500); // Slightly longer delay to see results
    }, [onVerseComplete, onNextVerse, stopListening, arabicText, status]);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
            setStatus('idle');
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
                        status === 'success' ? 'bg-teal-500' :
                            status === 'error' ? 'bg-red-500' :
                             status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                                'bg-slate-500'
                        }`} />
                    <span className="text-sm font-medium text-white">
                        {status === 'listening' ? 'Mendengar...' :
                            status === 'processing' ? 'Menganalisis Tajwid...' :
                                status === 'success' ? 'Tepat!' :
                                    status === 'error' ? 'Semak Semula' :
                                        'Sedia'}
                    </span>
                </div>
                <button
                    onClick={onToggle}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Tutup mod suara"
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
                                ? 'text-teal-400 bg-teal-500/20'
                                : 'text-white'
                                }`}
                        >
                            {word}
                        </span>
                    ))}
                </p>
            </div>

            {/* Analysis Result (Q-WER) */}
            <AnimatePresence>
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 p-3 bg-slate-900/80 rounded-lg border border-slate-700"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">Markah Q-WER</span>
                            <span className={`text-sm font-bold ${
                                analysisResult.level === 'excellent' ? 'text-green-400' :
                                analysisResult.level === 'good' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {analysisResult.level.toUpperCase().replace('_', ' ')} ({analysisResult.qwer})
                            </span>
                        </div>
                        {analysisResult.detailed_errors.length > 0 && (
                             <div className="text-xs text-slate-500 mt-2">
                                <p className="mb-1 text-red-400">Kesalahan Dikesan:</p>
                                <ul className="list-disc list-inside">
                                    {analysisResult.detailed_errors.slice(0, 2).map((err: any, i: number) => (
                                        <li key={i}>{err.type}: {err.actual} (Sepatutnya {err.expected})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transliteration (if available) */}
            {transliteration && !analysisResult && (
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
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 
                           rounded-full flex items-center justify-center mb-2">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-teal-400 font-medium">Bacaan Tepat!</p>
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
                            : status === 'processing' 
                                ? 'bg-yellow-500 animate-spin'
                                : 'bg-gradient-to-br from-teal-500 to-emerald-500 hover:shadow-lg hover:shadow-teal-500/25'
                        }`}
                    disabled={status === 'processing'}
                >
                    {isListening ? (
                        <MicOff className="w-6 h-6 text-white" />
                    ) : status === 'processing' ? (
                        <Activity className="w-6 h-6 text-white" />
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
