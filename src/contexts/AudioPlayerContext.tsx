import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

// Word segment for karaoke highlighting
export interface WordSegment {
  wordIndex: number;
  startMs: number;
  endMs: number;
}

interface AudioTrack {
  url: string;
  title: string;
  subtitle?: string;
  verseKey?: string; // e.g. "1:1"
  reciterId?: number;
}

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  progress: number; // 0-100
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  sleepTimer: number | null; // minutes
  // Karaoke highlighting
  highlightedWordIndex: number | null;
  wordSegments: WordSegment[];
  setWordSegments: (segments: WordSegment[]) => void;
  // Actions
  playTrack: (track: AudioTrack) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => Promise<void>;
  stopTrack: () => void;
  seekTo: (time: number) => void;
  setSpeed: (speed: number) => void;
  setTimer: (minutes: number | null) => void;
  onEnded?: () => void;
  setOnEnded: (callback: () => void) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  // Karaoke highlighting state
  const [wordSegments, setWordSegments] = useState<WordSegment[]>([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  // Use ref for callback to avoid re-running the effect when the callback changes
  const onEndedCallbackRef = useRef<(() => void) | undefined>(undefined);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Object
  useEffect(() => {
    audioRef.current = new Audio();
    // Enable CORS to avoid issues with some CDNs and allows analyzing audio if needed later
    audioRef.current.crossOrigin = "anonymous";
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleEnded = () => {
      console.log("Audio ended");
      setIsPlaying(false);
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };

    const handleError = (e: any) => {
      console.error("Audio Error Event:", audio.error);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []); // ✅ Dependency array is now empty, won't reset on callback change


  // Handle Playback Speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Handle Sleep Timer
  useEffect(() => {
    if (sleepTimer && isPlaying) {
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
      
      sleepTimeoutRef.current = setTimeout(() => {
        stopTrack();
        setSleepTimer(null);
        // Optional: Notify user via toast
        console.log("Sleep timer ended playback");
      }, sleepTimer * 60 * 1000);
    } else {
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    }
    return () => {
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    };
  }, [sleepTimer, isPlaying]);

  // Calculate highlighted word index based on current time and segments
  useEffect(() => {
    if (!isPlaying || wordSegments.length === 0) {
      setHighlightedWordIndex(null);
      return;
    }

    const currentMs = currentTime * 1000;
    let highlightIndex: number | null = null;

    for (const segment of wordSegments) {
      if (currentMs >= segment.startMs && currentMs < segment.endMs) {
        highlightIndex = segment.wordIndex;
        break;
      }
    }

    setHighlightedWordIndex(highlightIndex);
  }, [currentTime, wordSegments, isPlaying]);

  const playTrack = async (track: AudioTrack) => {
    if (!audioRef.current) return;

    // If same track, just resume
    if (currentTrack?.url === track.url) {
      resumeTrack();
      return;
    }

    console.log("Audio: Preparing to play:", track.url);

    // ✨ FIX: Pause first to prevent AbortError
    audioRef.current.pause();
    
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.load(); // Explicit load
    
    try {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log("Audio: Play started successfully");
      }
    } catch (error: any) {
      // Suppress AbortError (harmless - happens when play is interrupted)
      if (error.name !== 'AbortError') {
        console.error("Audio: Playback failed:", error);
      } else {
        console.log("Audio: Playback aborted (interrupted by new track)");
      }
      setIsPlaying(false);
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = async () => {
    if (audioRef.current && currentTrack) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error: any) {
        // Suppress AbortError
        if (error.name !== 'AbortError') {
          console.error("Resume failed:", error);
        }
      }
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setOnEnded = React.useCallback((callback: () => void) => {
    onEndedCallbackRef.current = callback;
  }, []);

  const contextValue = React.useMemo(() => ({
    isPlaying,
    currentTrack,
    progress,
    currentTime,
    duration,
    playbackSpeed,
    sleepTimer,
    // Karaoke highlighting
    highlightedWordIndex,
    wordSegments,
    setWordSegments,
    // Actions
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    seekTo,
    setSpeed: setPlaybackSpeed,
    setTimer: setSleepTimer,
    setOnEnded
  }), [
    isPlaying,
    currentTrack,
    progress,
    currentTime,
    duration,
    playbackSpeed,
    sleepTimer,
    highlightedWordIndex,
    wordSegments,
  ]);

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
