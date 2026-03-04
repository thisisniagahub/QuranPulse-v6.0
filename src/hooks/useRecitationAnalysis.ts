/**
 * useRecitationAnalysis - React hook for Quran recitation analysis
 * Handles recording, preprocessing, ASR, and feedback generation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { asrService, QWERResult, RecitationFeedback } from '../services/asrService';
import { audioPreprocessor } from '../utils/audioPreprocessor';

export interface RecitationState {
    status: 'idle' | 'recording' | 'processing' | 'analyzing' | 'complete' | 'error';
    error?: string;
    recordingDuration: number;
    result?: QWERResult;
    feedback?: RecitationFeedback;
}

export interface UseRecitationAnalysisOptions {
    expectedText?: string;
    autoPreprocess?: boolean;
    maxDuration?: number; // seconds
}

export interface UseRecitationAnalysisReturn {
    state: RecitationState;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    analyzeAudio: (audioBlob: Blob) => Promise<void>;
    reset: () => void;
    isRecording: boolean;
    isAnalyzing: boolean;
}

const DEFAULT_OPTIONS: UseRecitationAnalysisOptions = {
    autoPreprocess: true,
    maxDuration: 30,
};

export function useRecitationAnalysis(
    options: UseRecitationAnalysisOptions = {}
): UseRecitationAnalysisReturn {
    const config = { ...DEFAULT_OPTIONS, ...options };

    const [state, setState] = useState<RecitationState>({
        status: 'idle',
        recordingDuration: 0,
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    /**
     * Start recording audio
     */
    const startRecording = useCallback(async () => {
        try {
            setState((prev) => ({ ...prev, status: 'recording', recordingDuration: 0, error: undefined }));
            audioChunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000,
                },
            });
            streamRef.current = stream;

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });
            mediaRecorderRef.current = mediaRecorder;

            // Collect audio chunks
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms

            // Start duration timer
            timerRef.current = window.setInterval(() => {
                setState((prev) => {
                    const newDuration = prev.recordingDuration + 0.1;

                    // Auto-stop if max duration reached
                    if (config.maxDuration && newDuration >= config.maxDuration) {
                        stopRecording();
                    }

                    return { ...prev, recordingDuration: newDuration };
                });
            }, 100);

        } catch (error) {
            console.error('Failed to start recording:', error);
            setState((prev) => ({
                ...prev,
                status: 'error',
                error: 'Tidak dapat mengakses mikrofon. Sila berikan kebenaran.',
            }));
        }
    }, [config.maxDuration]);

    /**
     * Stop recording and analyze
     */
    const stopRecording = useCallback(async () => {
        if (!mediaRecorderRef.current || state.status !== 'recording') return;

        // Stop timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setState((prev) => ({ ...prev, status: 'processing' }));

        return new Promise<void>((resolve) => {
            const mediaRecorder = mediaRecorderRef.current!;

            mediaRecorder.onstop = async () => {
                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    streamRef.current = null;
                }

                // Create audio blob
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                // Analyze the audio
                await analyzeAudio(audioBlob);
                resolve();
            };

            mediaRecorder.stop();
        });
    }, [state.status]);

    /**
     * Analyze audio blob
     */
    const analyzeAudio = useCallback(async (audioBlob: Blob) => {
        try {
            setState((prev) => ({ ...prev, status: 'analyzing' }));

            let processedBlob = audioBlob;

            // Preprocess if enabled
            if (config.autoPreprocess) {
                console.log('🔧 Preprocessing audio...');
                const processed = await audioPreprocessor.process(audioBlob);
                processedBlob = processed.cleanedBlob;
                console.log('✅ Preprocessing complete:', processed.metadata);
            }

            // Send to ASR service
            console.log('🎤 Analyzing recitation...');
            const normalizedExpectedText = config.expectedText?.trim();
            const result = await asrService.analyzeRecitation(
                processedBlob,
                normalizedExpectedText ? normalizedExpectedText : undefined
            );

            // Generate feedback
            const feedback = asrService.generateFeedback(result);

            setState({
                status: 'complete',
                recordingDuration: state.recordingDuration,
                result,
                feedback,
            });

        } catch (error) {
            console.error('Analysis failed:', error);
            setState((prev) => ({
                ...prev,
                status: 'error',
                error: error instanceof Error ? error.message : 'Analisis gagal. Sila cuba lagi.',
            }));
        }
    }, [config.autoPreprocess, config.expectedText, state.recordingDuration]);

    /**
     * Reset to initial state
     */
    const reset = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        setState({
            status: 'idle',
            recordingDuration: 0,
        });
    }, []);

    return {
        state,
        startRecording,
        stopRecording,
        analyzeAudio,
        reset,
        isRecording: state.status === 'recording',
        isAnalyzing: state.status === 'processing' || state.status === 'analyzing',
    };
}

export default useRecitationAnalysis;
