import { useState, useRef, useCallback } from 'react';

export interface AudioRecorderState {
    isRecording: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
    visualizerData: Uint8Array | null;
}

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    // For Visualizer
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const [visualizerData, setVisualizerData] = useState<Uint8Array | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Setup Visualizer
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            
            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;
            sourceRef.current = source;

            // Setup Recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                
                // Cleanup
                stream.getTracks().forEach(track => track.stop());
                if (audioContextRef.current) audioContextRef.current.close();
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start Timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
                
                // Update Visualizer Data
                if (analyserRef.current) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    setVisualizerData(dataArray);
                }
            }, 100);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Microphone access denied. Please enable permissions.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [isRecording]);

    return {
        isRecording,
        recordingTime: Math.floor(recordingTime / 10), // Convert to seconds
        audioBlob,
        visualizerData,
        startRecording,
        stopRecording
    };
};
