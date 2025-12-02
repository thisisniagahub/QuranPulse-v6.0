import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

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
  const [onEndedCallback, setOnEndedCallback] = useState<(() => void) | undefined>(undefined);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Object
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEndedCallback) {
        onEndedCallback();
      }
    };

    const handleError = (e: any) => {
      console.error("Audio Error:", e);
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
  }, [onEndedCallback]);

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

  const playTrack = async (track: AudioTrack) => {
    if (!audioRef.current) return;

    // If same track, just resume
    if (currentTrack?.url === track.url) {
      resumeTrack();
      return;
    }

    // ✨ FIX: Pause first to prevent AbortError
    audioRef.current.pause();
    
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error: any) {
      // Suppress AbortError (harmless - happens when play is interrupted)
      if (error.name !== 'AbortError') {
        console.error("Playback failed:", error);
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
    setOnEndedCallback(() => callback);
  }, []);

  const contextValue = React.useMemo(() => ({
    isPlaying,
    currentTrack,
    progress,
    currentTime,
    duration,
    playbackSpeed,
    sleepTimer,
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
    // playTrack, pauseTrack, etc are stable if defined outside or memoized, 
    // but here they are defined inside. Ideally they should be memoized too, 
    // but for now memoizing the value object helps.
  ]);

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
