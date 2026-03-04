import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useQuranData } from './QuranDataContext';
import { useQuranSettings } from './QuranSettingsContext';
import { audioCache } from '../../../services/audioCacheService';
import { VoiceService } from '../../../services/ai/VoiceService';

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
            const cacheKey = `${lang}-${text.substring(0, 20)}`;

            // 1. Try Cache First
            if (ttsCache.current[cacheKey]) {
                console.log("🔊 Playing from TTS Cache");
                const audio = new Audio(ttsCache.current[cacheKey]);
                audio.onended = () => resolve();
                audio.onerror = () => { delete ttsCache.current[cacheKey]; resolve(); };
                await audio.play();
                return;
            }

            // 2. Try OpenClaw TTS via shared VoiceService
            try {
                const ttsResult = await VoiceService.generateVoice(text);
                if (ttsResult?.type === 'buffer' && ttsResult.data) {
                    const blob = new Blob([ttsResult.data], { type: 'audio/mpeg' });
                    const url = URL.createObjectURL(blob);
                    ttsCache.current[cacheKey] = url;
                    const audio = new Audio(url);
                    audio.onended = () => resolve();
                    audio.onerror = () => resolve();
                    await audio.play();
                    return;
                }
            } catch (err) {
                console.warn("⚠️ OpenClaw TTS Failed, switching to Google TTS:", err);
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

        // Start playback
        await playTrack({
            url: audioMap[verseKey],
            title: `Surah ${selectedChapter?.name_simple}`,
            subtitle: `Ayah ${verseKey.split(':')[1]}`,
            verseKey,
            reciterId: selectedReciterId
        });

        // ⚡ AUTO-PREFETCH: Load next 2 verses in background
        const currentIndex = verses.findIndex(v => v.verse_key === verseKey);
        if (currentIndex !== -1) {
            const nextVerses = verses.slice(currentIndex + 1, currentIndex + 3);
            const urlsToPrefetch = nextVerses
                .map(v => audioMap[v.verse_key])
                .filter(url => !!url);
            
            if (urlsToPrefetch.length > 0) {
                // Background task
                audioCache.prefetch(urlsToPrefetch);
            }
        }

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
