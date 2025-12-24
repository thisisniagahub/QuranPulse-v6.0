import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useQuranData } from './QuranDataContext';
import { useQuranSettings } from './QuranSettingsContext';

interface QuranAudioState {
    playVerse: (verseKey: string) => void;
    playNextVerse: () => void;
    playPreviousVerse: () => void;
}

const QuranAudioContext = createContext<QuranAudioState | undefined>(undefined);

export const QuranAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        verses, selectedChapter,
        audioMap, timingMap
    } = useQuranData();

    const {
        selectedReciterId, selectedTranslationId,
        enableTranslationAudio
    } = useQuranSettings();

    const { playTrack, stopTrack, currentTrack, setOnEnded, setWordSegments } = useAudioPlayer();

    // Audio Cache for TTS
    const ttsCache = useRef<Record<string, string>>({});

    // Helper: Speak Translation
    const speakTranslation = async (text: string, lang: string = 'ms-MY') => {
        return new Promise<void>(async (resolve) => {
            let elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
            const cacheKey = `${lang}-${text.substring(0, 20)}`;

            // ⛔ BLOCK KNOWN INVALID KEY to prevent 401 Console Errors
            if (elevenLabsKey === 'sk_d949e8ddf89abc32fa0f722027ba5d43d9aecb48abcc0e31') {
                elevenLabsKey = null; // Silently disable ElevenLabs
            }

            // 1. Try Cache First
            if (ttsCache.current[cacheKey]) {
                console.log("🔊 Playing from TTS Cache");
                const audio = new Audio(ttsCache.current[cacheKey]);
                audio.onended = () => resolve();
                audio.onerror = () => { delete ttsCache.current[cacheKey]; resolve(); };
                await audio.play();
                return;
            }

            // 2. Try ElevenLabs (Only if VALID key exists)
            if (elevenLabsKey) {
                try {
                    // Use 'Josh' Voice ID (Deep, Natural, Reliable)
                    const VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX';
                    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'xi-api-key': elevenLabsKey,
                        },
                        body: JSON.stringify({
                            text: text,
                            model_id: "eleven_multilingual_v2",
                            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("❌ ElevenLabs API Error:", errorData);
                        // Fallthrough to next strategy
                    } else {
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        ttsCache.current[cacheKey] = url;
                        const audio = new Audio(url);
                        audio.onended = () => resolve();
                        audio.onerror = () => resolve();
                        await audio.play();
                        return;
                    }

                } catch (err) {
                    console.warn("⚠️ Neural TTS Failed, switching to Google TTS:", err);
                }
            }

            // 3. Try Google Translate TTS (High Quality Free Fallback)
            try {
                // 'client=gtx' is more reliable than 'tw-ob'
                const googleLang = lang.split('-')[0];
                const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=${googleLang}&q=${encodeURIComponent(text)}`;

                const audio = new Audio(googleUrl);
                await new Promise<void>((googleResolve, googleReject) => {
                    audio.onended = () => { googleResolve(); resolve(); };
                    // If Google fails (e.g. 404 or block), reject to trigger next fallback
                    audio.onerror = () => googleReject("Google TTS Failed");
                    audio.play().catch(googleReject);
                });
                return;
            } catch (googleErr) {
                console.warn("⚠️ Google TTS Failed, switching to System Voice");
            }

            // 4. Web Speech Fallback (Last Resort)
            if (!('speechSynthesis' in window)) { resolve(); return; }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;

            // Wait for voices
            let voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) {
                await new Promise<void>(r => {
                    window.speechSynthesis.onvoiceschanged = () => {
                        voices = window.speechSynthesis.getVoices();
                        r();
                    };
                    setTimeout(r, 500);
                });
            }

            // Smart Voice Selection
            const preferredVoice = voices.find(v =>
                v.lang === lang && (v.name.includes("Google") || v.name.includes("Natural"))
            );
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            console.log(`🗣️ Using System Voice: ${utterance.voice?.name || 'Default'}`);

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();
            window.speechSynthesis.speak(utterance);
        });
    };

    // Play Verse Function
    const playVerse = async (verseKey: string) => {
        if (!audioMap[verseKey]) return;

        await playTrack({
            url: audioMap[verseKey],
            title: `Surah ${selectedChapter?.name_simple}`,
            subtitle: `Ayah ${verseKey.split(':')[1]}`,
            verseKey,
            reciterId: selectedReciterId
        });

        if (timingMap) {
            const verseTimings = timingMap.get(verseKey);
            setWordSegments(verseTimings ? verseTimings.segments : []);
        }
    };

    const playNextVerse = () => {
        if (currentTrack?.verseKey && verses.length) {
            const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);
            if (currentIndex !== -1 && currentIndex < verses.length - 1) {
                playVerse(verses[currentIndex + 1].verse_key);
            }
        }
    };

    const playPreviousVerse = () => {
        if (currentTrack?.verseKey && verses.length) {
            const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);
            if (currentIndex > 0) {
                playVerse(verses[currentIndex - 1].verse_key);
            }
        }
    };

    // Auto-Advance Logic
    useEffect(() => {
        setOnEnded(async () => {
            if (currentTrack?.verseKey) {
                const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);

                // 1. Play Translation
                if (enableTranslationAudio && verses[currentIndex]) {
                    const verse = verses[currentIndex];
                    const translationText = verse.translations?.[0]?.text?.replace(/<[^>]*>/g, "") || "";
                    if (translationText) {
                        const lang = selectedTranslationId === 39 ? 'ms-MY' : 'en-US';
                        try { await speakTranslation(translationText, lang); } catch (e) { console.warn("TTS skipped"); }
                    }
                }

                // 2. Play Next
                if (currentIndex !== -1 && currentIndex < verses.length - 1) {
                    playVerse(verses[currentIndex + 1].verse_key);
                }
            }
        });
    }, [verses, currentTrack, audioMap, enableTranslationAudio, selectedTranslationId]);

    // Stop track when chapter changes
    useEffect(() => {
        if (selectedChapter) stopTrack();
    }, [selectedChapter]);

    return (
        <QuranAudioContext.Provider value={{ playVerse, playNextVerse, playPreviousVerse }}>
            {children}
        </QuranAudioContext.Provider>
    );
};

export const useQuranAudio = () => {
    const context = useContext(QuranAudioContext);
    if (!context) throw new Error("useQuranAudio must be used within a QuranAudioProvider");
    return context;
};
