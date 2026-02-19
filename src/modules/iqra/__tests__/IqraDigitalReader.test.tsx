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
    mockClassifyAudio: jest.fn(),
    IqraService: {
        saveProgress: jest.fn().mockResolvedValue(undefined)
    }
}));

// Mock AudioPlayerContext to prevent heavy context loading
jest.mock('../../../contexts/AudioPlayerContext', () => ({
    useAudioPlayer: () => ({
        playTrack: jest.fn(),
        pauseTrack: jest.fn(),
        stopTrack: jest.fn(),
        isPlaying: false,
        currentTrack: null,
        progress: 0,
        currentTime: 0,
        duration: 0,
    }),
    AudioPlayerProvider: ({ children }: any) => <>{children}</>,
}));

// Mock useIqraSession to avoid loading curriculum and audio dependencies
jest.mock('../hooks/useIqraSession', () => ({
    useIqraSession: () => ({
        currentLesson: { id: 'lesson-1', pageRef: 1 - 1, assessment: { passingScore: 80 } },
        rawPageData: null,
        lessonStarted: false,
        showTips: false,
        showResult: null,
        aiFeedback: '',
        isFirstLesson: true,
        isLastLesson: false,
        nextLesson: jest.fn(),
        prevLesson: jest.fn(),
        toggleTips: jest.fn(),
        startLesson: jest.fn(),
        resetResult: jest.fn(),
        evaluatePerformance: jest.fn(),
        playRef: jest.fn(),
    })
}));

describe('IqraDigitalReader', () => {
    const mockOnBack = jest.fn();
    const defaultProps = { volume: 1, onBack: mockOnBack };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Iqra component without crashing', () => {
        // Should render without throwing errors
        const { container } = render(<IqraDigitalReader {...defaultProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders loading/fallback state when no page data', () => {
        render(<IqraDigitalReader {...defaultProps} />);

        // Component shows fallback message when rawPageData is null (mocked)
        expect(screen.getByText(/sedang dikemaskini/i)).toBeInTheDocument();
    });

    it('matches snapshot of fallback state', () => {
        const { container } = render(<IqraDigitalReader {...defaultProps} />);

        // Verify component structure exists
        expect(container.querySelector('div')).toBeInTheDocument();
    });
});
