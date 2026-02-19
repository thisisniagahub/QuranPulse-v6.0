import React, { ReactNode } from 'react';
import { QuranSettingsProvider, useQuranSettings } from './QuranSettingsContext';
import { QuranDataProvider, useQuranData } from './QuranDataContext';
import { QuranUIProvider, useQuranUI } from './QuranUIContext';
import { QuranAudioProvider, useQuranAudio } from './QuranAudioContext';

// --- Combined Provider ---
export const QuranProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <QuranSettingsProvider>
            <QuranUIProvider>
                <QuranDataProvider>
                    <QuranAudioProvider>
                        {children}
                    </QuranAudioProvider>
                </QuranDataProvider>
            </QuranUIProvider>
        </QuranSettingsProvider>
    );
};

// --- Unified Hook (Facade) ---
export const useQuran = () => {
    const settings = useQuranSettings();
    const data = useQuranData();
    const ui = useQuranUI();
    const audio = useQuranAudio();

    return {
        ...settings,
        ...data,
        ...ui,
        ...audio,

        // Aliases for compatibility if needed
        isAudioLoading: data.loadingAudio
    };
};
