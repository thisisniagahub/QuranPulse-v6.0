import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

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
    const stored = storage.get<ReadHistory>(STORAGE_KEY);
    if (stored) {
      setLastRead(stored);
    }
  }, []);

  const saveHistory = (history: Omit<ReadHistory, 'timestamp'>) => {
    const newHistory = { ...history, timestamp: Date.now() };
    setLastRead(newHistory);
    storage.set(STORAGE_KEY, newHistory);
  };

  return { lastRead, saveHistory };
};
