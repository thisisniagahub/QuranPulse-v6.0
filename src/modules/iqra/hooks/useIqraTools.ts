import { useState, useCallback } from 'react';

// Letter to Filename Map
const LETTER_MAP: Record<string, string> = {
    'ا': 'alif', 'أ': 'alif', 'إ': 'alif', 'آ': 'alif',
    'ب': 'ba',
    'ت': 'ta',
    'ث': 'tsa',
    'ج': 'jim',
    'ح': 'ha',
    'خ': 'kho',
    'د': 'dal',
    'ذ': 'dzal',
    'ر': 'ro',
    'ز': 'zai',
    'س': 'sin',
    'ش': 'syin',
    'ص': 'sod',
    'ض': 'dhod',
    'ط': 'tho',
    'ظ': 'zho',
    'ع': 'ain',
    'غ': 'ghain',
    'ف': 'fa',
    'ق': 'qof',
    'ك': 'kaf',
    'ل': 'lam',
    'م': 'mim',
    'ن': 'nun',
    'و': 'wau',
    'ه': 'haa', // Haa simpul
    'ة': 'ta', // Ta Marbutah sounds like Ta or Ha depending on stop, usually Ha in alphabet
    'ي': 'ya',
    'ى': 'ya',
    'ء': 'alif' // Hamzah often uses Alif sound in isolation
};

export const useIqraAudio = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string) => {
        // 1. Clean the text to get the base letter
        // Remove harakat (Fathah, Kasrah, Dammah, etc.)
        const cleanChar = text.replace(/[ًٌٍَُِّْ]/g, '').trim(); 
        
        // 2. Find the audio filename
        // If text is multiple letters (e.g. "ba ta"), we might need a sequencer.
        // For Iqra 1 (Single letters), this works perfectly.
        const audioKey = LETTER_MAP[cleanChar] || LETTER_MAP[cleanChar.charAt(0)];

        if (!audioKey) {
            console.warn("No local audio map for:", text);
            return;
        }

        // 3. Play Local MP3
        const audioUrl = `/audio/hijaiyah/${audioKey}.mp3`;
        const audio = new Audio(audioUrl);
        
        setIsSpeaking(true);
        
        audio.play()
            .then(() => console.log("Playing:", audioUrl))
            .catch(e => console.error("Audio Play Error:", e));
        
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = (e) => {
            console.error("Local Audio Error:", e);
            setIsSpeaking(false);
        };

    }, []);

    return { speak, isSpeaking, supported: true };
};

export const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            console.error("Mic access denied or error:", err);
            alert("Sila benarkan akses mikrofon untuk menggunakan ciri ini.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            mediaRecorder.stream.getTracks().forEach(track => track.stop()); 
        }
    };

    const playRecording = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    return { isRecording, startRecording, stopRecording, audioUrl, playRecording };
};