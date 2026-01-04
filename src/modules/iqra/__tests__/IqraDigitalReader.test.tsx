import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IqraDigitalReader from '../IqraDigitalReader';

// Mock dependencies
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('../hooks/useIqraTools', () => ({
    useIqraAudio: () => ({
        speak: jest.fn(),
        isSpeaking: false
    }),
    useVoiceRecorder: () => ({
        isRecording: false,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        audioUrl: null,
        playRecording: jest.fn()
    })
}));

// Mock iqraStore
jest.mock('../store/iqraStore', () => ({
    useIqraStore: () => ({
        completePage: jest.fn(),
        unlockNextPage: jest.fn(),
        getStars: () => 0,
        setLastRead: jest.fn(),
        isUnlocked: () => true,
    })
}));

// Mock iqraService  
jest.mock('../../../services/iqraService', () => ({
    classifyAudio: jest.fn(),
    mockClassifyAudio: jest.fn()
}));

describe('IqraDigitalReader', () => {
    it('renders Iqra content', () => {
        render(<IqraDigitalReader />);

        // Should render Iqra 1 cover screen by default (multiple elements contain IQRA)
        const iqraElements = screen.getAllByText(/IQRA/i);
        expect(iqraElements.length).toBeGreaterThan(0);
    });

    it('renders the MULA_BELAJAR button on cover screen', () => {
        render(<IqraDigitalReader />);

        // Cover screen should show the start button
        expect(screen.getByText('MULA_BELAJAR')).toBeInTheDocument();
    });

    it('renders level selector buttons', () => {
        render(<IqraDigitalReader />);

        // Level 1 button should be visible (active level)
        const level1Button = screen.getByText('1');
        expect(level1Button).toBeInTheDocument();
    });
});
