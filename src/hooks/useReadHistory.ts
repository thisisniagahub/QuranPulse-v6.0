import { useState, useEffect } from 'react';

export interface ReadHistory {
  surahId: number;
  ayahId: number;
  surahName: string;
  totalVerses?: number;
  timestamp: number;
}

const STORAGE_KEY = 'quran_last_read';

export const useReadHistory = () => {
  const [lastRead, setLastRead] = useState<ReadHistory | null>(null);

  useEffect(() => {
    // Load initial history
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLastRead(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse read history', e);
      }
    }
  }, []);

  const saveHistory = (history: Omit<ReadHistory, 'timestamp'>) => {
    const newHistory = { ...history, timestamp: Date.now() };
    setLastRead(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  return { lastRead, saveHistory };
};
