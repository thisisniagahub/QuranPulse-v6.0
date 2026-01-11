import React from 'react';
import { render, screen } from '@testing-library/react';
import QuranReader from '../features/reader/QuranReader';
import '@testing-library/jest-dom';

// --- MOCKS ---

// Mock Contexts
jest.mock('../contexts/QuranContext', () => ({
    useQuran: () => ({
        selectedChapter: {
            id: 1,
            name_simple: 'Al-Fatiha',
            name_arabic: 'الفاتحة',
            verses_count: 7,
            translated_name: { name: 'The Opener' }
        },
        verses: [
            {
                id: 1,
                verse_key: '1:1',
                text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
                words: []
            },
            {
                id: 2,
                verse_key: '1:2',
                text_uthmani: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
                words: []
            }
        ],
        loadingVerses: false,
        isAudioLoading: false,
        fontSize: 24,
        view: 'READING',
        layoutMode: 'SCROLL',
        bookmarkedVerses: new Set(),
        // Add other necessary props as no-ops
        setView: jest.fn(),
        setLayoutMode: jest.fn(),
        toggleBookmark: jest.fn(),
        setSelectedTranslationId: jest.fn(),
        selectedTranslationId: 131,
        showTranslation: true,
        showTransliteration: true,
    })
}));

jest.mock('../../../contexts/AudioPlayerContext', () => ({
    useAudioPlayer: () => ({
        currentTrack: null,
        isPlaying: false,
        highlightedWordIndex: null,
        stopTrack: jest.fn()
    })
}));

// Mock Child Components to isolate Reader logic
jest.mock('../components/ImmersiveControls', () => () => <div data-testid="immersive-controls">Controls</div>);
jest.mock('../features/reader/VoiceActiveReader', () => () => <div data-testid="voice-active-reader">VoiceReader</div>);
jest.mock('../features/audio/QuranAudioPlayer', () => () => <div data-testid="audio-player">AudioPlayer</div>);

describe('QuranReader', () => {
    it('renders the selected chapter name', () => {
        render(<QuranReader />);
        expect(screen.getByText('Al-Fatiha')).toBeInTheDocument();
        expect(screen.getByText('The Opener')).toBeInTheDocument();
    });

    it('renders verses', () => {
        render(<QuranReader />);
        // Check for verse text (partial match is enough)
        expect(screen.getByText(/بِسْمِ/)).toBeInTheDocument();
        expect(screen.getByText(/ٱلْحَمْدُ/)).toBeInTheDocument();
    });

    it('renders navigation controls', () => {
        render(<QuranReader />);
        expect(screen.getByTestId('immersive-controls')).toBeInTheDocument();
        expect(screen.getByTestId('voice-active-reader')).toBeInTheDocument();
    });
});
