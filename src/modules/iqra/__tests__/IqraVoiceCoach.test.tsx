import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import IqraVoiceCoach from '../IqraVoiceCoach';
import '@testing-library/jest-dom';

// 1. Mock the useAudioRecorder hook
jest.mock('../../../hooks/useAudioRecorder', () => ({
  useAudioRecorder: () => ({
    isRecording: false,
    audioBlob: null,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    visualizerData: new Uint8Array([10, 20, 30]), // Fake audio data
  }),
}));

// 2. Mock the Web Speech API (window.SpeechRecognition)
const mockStart = jest.fn();
const mockStop = jest.fn();

// Mock implementation of SpeechRecognition
class MockSpeechRecognition {
  continuous = false;
  lang = 'en-US';
  interimResults = false;
  maxAlternatives = 1;
  onresult: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onend: (() => void) | null = null;
  
  start() {
    mockStart();
    // Simulate a successful result after a short delay
    setTimeout(() => {
        if (this.onresult) {
            this.onresult({
                resultIndex: 0,
                results: [
                    [{ transcript: 'بسم الله الرحمن الرحيم', confidence: 0.95 }]
                ]
            });
        }
    }, 100);
  }

  stop() {
    mockStop();
  }
}

// Attach mock to window
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: MockSpeechRecognition,
});
Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: MockSpeechRecognition,
});

describe('IqraVoiceCoach Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders correctly', () => {
    render(<IqraVoiceCoach />);
    expect(screen.getByText('AI Voice Coach')).toBeInTheDocument();
  });

  test('starts listening when microphone button is clicked', async () => {
    render(<IqraVoiceCoach />);
    
    // Find microphone button
    const micButton = screen.getByRole('button');
    fireEvent.click(micButton);

    // Verify speech recognition started
    expect(mockStart).toHaveBeenCalledTimes(1);

    // Advance timer for MockSpeechRecognition (100ms) AND Component delay (1500ms)
    act(() => {
        jest.advanceTimersByTime(2000);
    });
    
    // Wait for the simulated result to appear
    await waitFor(() => {
        expect(screen.getByText('Keputusan Analisis')).toBeInTheDocument();
    });

    // Check if the detected Arabic text is displayed
    expect(screen.getByText('بسم الله الرحمن الرحيم')).toBeInTheDocument();
    
    // Check if score is high (since confidence was 0.95)
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/Skor Kelancaran/i)).toBeInTheDocument();
  });
});
