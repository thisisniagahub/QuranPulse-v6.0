import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

// --- Types ---
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: number;
}

export interface UserGamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string | null;
  achievements: Achievement[];
}

interface GamificationActions {
  addXP: (amount: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  checkStreak: () => void;
  getLevelProgress: () => number;
}

// --- Constants ---
const LEVEL_BASE_XP = 100;
const LEVEL_MULTIPLIER = 1.5;

const LEVEL_TITLES: Record<number, string> = {
  1: 'Pencari', 2: 'Pencari', 3: 'Pencari',
  4: 'Penuntut', 5: 'Penuntut', 6: 'Penuntut',
  7: 'Hafiz', 8: 'Hafiz', 9: 'Hafiz',
  10: 'Alim', 11: 'Alim', 12: 'Alim',
  13: 'Mujahid', 14: 'Mujahid', 15: 'Mujahid',
  16: 'Muttaqin', 17: 'Muttaqin', 18: 'Muttaqin',
  19: 'Imam', 20: 'Imam',
};

export const getLevelTitle = (level: number): string => LEVEL_TITLES[Math.min(level, 20)] || 'Imam';

const INITIAL_STATE: UserGamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActivityDate: null,
  achievements: []
};

// --- Contexts ---
const GamificationStateContext = createContext<UserGamificationState | undefined>(undefined);
const GamificationActionsContext = createContext<GamificationActions | undefined>(undefined);

export const useGamification = () => {
  const state = useContext(GamificationStateContext);
  const actions = useContext(GamificationActionsContext);

  if (!state || !actions) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }

  // Consolidate for compatibility while maintaining split benefits
  return useMemo(() => ({ state, ...actions }), [state, actions]);
};

// Also export individual hooks for extreme optimization if needed
export const useGamificationState = () => {
  const state = useContext(GamificationStateContext);
  if (!state) throw new Error('useGamificationState must be used within a GamificationProvider');
  return state;
};

export const useGamificationActions = () => {
  const actions = useContext(GamificationActionsContext);
  if (!actions) throw new Error('useGamificationActions must be used within a GamificationProvider');
  return actions;
};

// --- Provider ---
export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserGamificationState>(() => {
    const saved = localStorage.getItem('quranpulse_gamification');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('quranpulse_gamification', JSON.stringify(state));
  }, [state]);

  const calculateLevel = useCallback((xp: number) => {
    let level = 1;
    let required = LEVEL_BASE_XP;
    while (xp >= required) {
      xp -= required;
      level++;
      required = Math.floor(required * LEVEL_MULTIPLIER);
    }
    return level;
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      if (newLevel > prev.level) console.log(`🎉 Level Up! ${prev.level} -> ${newLevel}`);
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, [calculateLevel]);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.achievements.some(a => a.id === achievementId)) return prev;

      const achievementDB: Record<string, Achievement> = {
        // Quran Reading
        'first_verse': { id: 'first_verse', title: 'Langkah Pertama', description: 'Baca ayat pertama', icon: '📖', xpReward: 10 },
        'verse_100': { id: 'verse_100', title: 'Pembaca Tekun', description: 'Baca 100 ayat', icon: '📚', xpReward: 100 },
        'verse_1000': { id: 'verse_1000', title: 'Murid Quran', description: 'Baca 1,000 ayat', icon: '🌟', xpReward: 300 },
        'first_khatam': { id: 'first_khatam', title: 'Khatam Pertama', description: 'Khatam Al-Quran sekali', icon: '🏆', xpReward: 500 },
        'all_surahs': { id: 'all_surahs', title: 'Penjelajah', description: 'Lawati kesemua 114 surah', icon: '🗺️', xpReward: 250 },
        // Streaks
        'streak_7': { id: 'streak_7', title: 'Istiqamah Seminggu', description: 'Streak 7 hari berturut', icon: '🔥', xpReward: 100 },
        'streak_30': { id: 'streak_30', title: 'Istiqamah Sebulan', description: 'Streak 30 hari berturut', icon: '💎', xpReward: 500 },
        'ramadan_streak': { id: 'ramadan_streak', title: 'Penghuni Ramadan', description: 'Aktif sepanjang Ramadan', icon: '🌙', xpReward: 1000 },
        // Ibadah
        'early_bird': { id: 'early_bird', title: 'Burung Awal', description: 'Baca selepas Subuh', icon: '🌅', xpReward: 50 },
        'night_owl': { id: 'night_owl', title: 'Pengamal Qiam', description: 'Baca selepas Isyak', icon: '🦉', xpReward: 50 },
        'prayer_5': { id: 'prayer_5', title: 'Solat Sempurna', description: 'Log 5 waktu solat', icon: '🕌', xpReward: 75 },
        // Iqra
        'iqra_jilid1': { id: 'iqra_jilid1', title: 'Iqra Graduate', description: 'Siapkan Jilid 1', icon: '🎓', xpReward: 150 },
        // Social  
        'first_share': { id: 'first_share', title: 'Pendakwah Digital', description: 'Kongsi ayat pertama', icon: '📤', xpReward: 30 },
        'bookmark_10': { id: 'bookmark_10', title: 'Pengumpul Mutiara', description: 'Bookmark 10 ayat', icon: '💝', xpReward: 50 },
        // Special
        'lailatul_qadr': { id: 'lailatul_qadr', title: 'Pencari Lailatul Qadr', description: 'Aktif pada malam ganjil terakhir Ramadan', icon: '✨', xpReward: 777 },
      };

      const achievement = achievementDB[achievementId];
      if (!achievement) return prev;

      return {
        ...prev,
        xp: prev.xp + achievement.xpReward,
        achievements: [...prev.achievements, { ...achievement, unlockedAt: Date.now() }]
      };
    });
  }, []);

  const checkStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      if (prev.lastActivityDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastActivityDate === yesterdayStr) newStreak += 1;
      else newStreak = 1;

      return { ...prev, streak: newStreak, lastActivityDate: today };
    });
  }, []);

  const getLevelProgress = useCallback(() => {
    let xp = state.xp;
    let required = LEVEL_BASE_XP;
    while (xp >= required) {
      xp -= required;
      required = Math.floor(required * LEVEL_MULTIPLIER);
    }
    return Math.min(100, Math.floor((xp / required) * 100));
  }, [state.xp]);

  const actions = useMemo(() => ({
    addXP,
    unlockAchievement,
    checkStreak,
    getLevelProgress
  }), [addXP, unlockAchievement, checkStreak, getLevelProgress]);

  return (
    <GamificationActionsContext.Provider value={actions}>
      <GamificationStateContext.Provider value={state}>
        {children}
      </GamificationStateContext.Provider>
    </GamificationActionsContext.Provider>
  );
};
