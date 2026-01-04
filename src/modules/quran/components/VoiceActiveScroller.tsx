import React, { useState, useEffect, useRef } from 'react';
import { useQuran } from '../contexts/QuranContext';
import { IqraService } from '../../../services/iqraService';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🎙️ VoiceActiveScroller
 * Listens to user recitation and auto-scrolls the Mushaf to the matching verse.
 */
const VoiceActiveScroller: React.FC = () => {
    const { 
        isVoiceSearchActive, 
        setIsVoiceSearchActive, 
        verses,
        setLastVoiceTranscription 
    } = useQuran();

    const [isRecording, setIsRecording] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (isVoiceSearchActive) {
            startRecording();
        } else {
            stopRecording();
        }
    }, [isVoiceSearchActive]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                await processAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setFeedback("Mendengar...");
        } catch (err) {
            console.error("Mic access denied:", err);
            setIsVoiceSearchActive(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    };

    const processAudio = async (blob: Blob) => {
        setFeedback("Menganalisis...");
        const result = await IqraService.analyzeRecitation(blob);
        
        if (result && result.audio_info.transcription) {
            const text = result.audio_info.transcription.toLowerCase();
            setLastVoiceTranscription(text);
            
            // Fuzzy Match with Verses
            findAndScrollToVerse(text);
        } else {
            setFeedback("Maaf, tidak jelas.");
            setTimeout(() => setIsVoiceSearchActive(false), 2000);
        }
    };

    const findAndScrollToVerse = (transcription: string) => {
        // Simple search: check if any verse transliteration contains the transcribed text
        // Or better: check if transcribed text contains words from verse
        const match = verses.find(v => {
            const verseText = v.transliteration?.text.toLowerCase() || "";
            return verseText.includes(transcription) || transcription.includes(verseText.split(' ')[0]);
        });

        if (match) {
            setFeedback(`Menemui: Ayat ${match.verse_key.split(':')[1]}`);
            const el = document.getElementById(`verse-${match.verse_key}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-4', 'ring-cyan-500', 'ring-opacity-50', 'transition-all');
                setTimeout(() => el.classList.remove('ring-4'), 3000);
            }
            setTimeout(() => setIsVoiceSearchActive(false), 1500);
        } else {
            setFeedback("Ayat tidak ditemui.");
            setTimeout(() => setIsVoiceSearchActive(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isVoiceSearchActive && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl"
                >
                    <div className="relative">
                        <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute inset-0"></div>
                        <div className="w-3 h-3 bg-rose-500 rounded-full relative"></div>
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide uppercase">{feedback}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceActiveScroller;
