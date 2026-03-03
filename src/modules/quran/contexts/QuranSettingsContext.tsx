import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ThemeType } from '../../../types';
import { storage } from '@/lib/storage';

interface QuranSettingsState {
    fontSize: number;
    setFontSize: (size: number) => void;
    showTranslation: boolean;
    setShowTranslation: (show: boolean) => void;
    showTransliteration: boolean;
    setShowTransliteration: (show: boolean) => void;
    showWordByWord: boolean;
    setShowWordByWord: (show: boolean) => void;
    autoScroll: boolean;
    setAutoScroll: (auto: boolean) => void;
    showTajwid: boolean;
    setShowTajwid: (show: boolean) => void;
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    repeatMode: 'none' | 'ayah' | 'surah';
    setRepeatMode: (mode: 'none' | 'ayah' | 'surah') => void;
    selectedReciterId: number;
    setSelectedReciterId: (id: number) => void;
    selectedTranslationId: number;
    setSelectedTranslationId: (id: number) => void;
    enableTranslationAudio: boolean;
    setEnableTranslationAudio: (enable: boolean) => void;
    showTutorial: boolean;
    setShowTutorial: (show: boolean) => void;
    markTutorialSeen: () => void;
}

const QuranSettingsContext = createContext<QuranSettingsState | undefined>(undefined);

const safeGetStorage = (key: string): string | null => {
    return storage.get<string>(key);
};

const safeSetStorage = (key: string, value: string): void => {
    storage.set(key, value);
};

export const QuranSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Settings State
    const [fontSize, setFontSize] = useState(36); // Standard: 36px
    const [showTranslation, setShowTranslation] = useState(true);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [showWordByWord, setShowWordByWord] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showTajwid, setShowTajwid] = useState(true);

    // Theme Persistence
    const [theme, setTheme] = useState<ThemeType>(() => {
        if (typeof window !== 'undefined') {
            const saved = safeGetStorage('quran_theme');
            return (saved as ThemeType) || 'raudhah';
        }
        return 'raudhah';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        safeSetStorage('quran_theme', theme);
    }, [theme]);

    const [repeatMode, setRepeatMode] = useState<'none' | 'ayah' | 'surah'>('none');
    const [selectedReciterId, setSelectedReciterId] = useState(7);
    const [selectedTranslationId, setSelectedTranslationId] = useState(39); // ID 39 is standard Malay
    const [enableTranslationAudio, setEnableTranslationAudio] = useState(true);

    // Tutorial State
    const [showTutorial, setShowTutorial] = useState(() => {
        if (typeof window !== 'undefined') {
            return !safeGetStorage('has_seen_tutorial_v6');
        }
        return false;
    });

    const markTutorialSeen = () => {
        setShowTutorial(false);
        safeSetStorage('has_seen_tutorial_v6', 'true');
    };

    return (
        <QuranSettingsContext.Provider value={{
            fontSize, setFontSize,
            showTranslation, setShowTranslation,
            showTransliteration, setShowTransliteration,
            showWordByWord, setShowWordByWord,
            autoScroll, setAutoScroll,
            showTajwid, setShowTajwid,
            theme, setTheme,
            repeatMode, setRepeatMode,
            selectedReciterId, setSelectedReciterId,
            selectedTranslationId, setSelectedTranslationId,
            enableTranslationAudio, setEnableTranslationAudio,
            showTutorial, setShowTutorial,
            markTutorialSeen
        }}>
            {children}
        </QuranSettingsContext.Provider>
    );
};

export const useQuranSettings = () => {
    const context = useContext(QuranSettingsContext);
    if (!context) throw new Error("useQuranSettings must be used within a QuranSettingsProvider");
    return context;
};
