import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { storage } from '@/lib/storage';

// --- Types ---
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  xpReward: number;
  expiresAt: string; // ISO Date
}

export interface UserGamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string | null;
  achievements: Achievement[];
  weeklyChallenges: WeeklyChallenge[];
  currentMultiplier: number;
  multiplierReason: string;
  streakFreezes: number;
  lastStreakDate: string | null;
}

interface StreakStatus {
  isActive: boolean;
  daysCount: number;
  freezesAvailable: number;
  willExpireIn: string;
}

interface XPMultiplier {
  multiplier: number;
  reason: string;
}

interface GamificationActions {
  addXP: (amount: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  checkStreak: () => void;
  getLevelProgress: () => number;
  updateChallengeProgress: (challengeId: string, increment: number) => void;
  resetWeeklyChallenges: () => void;
  getXPMultiplier: () => XPMultiplier;
  purchaseStreakFreeze: () => void;
  useStreakFreeze: () => void;
  getStreakStatus: () => StreakStatus;
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

const DEFAULT_CHALLENGES: Omit<WeeklyChallenge, 'expiresAt'>[] = [
  { id: 'read_surahs', title: 'Pembaca Rajin', description: 'Baca 3 surah berbeza', target: 3, progress: 0, xpReward: 100 },
  { id: 'complete_quest', title: 'Pejuang Quest', description: 'Siapkan 1 SurahQuest', target: 1, progress: 0, xpReward: 75 },
  { id: 'ask_ustaz', title: 'Pencari Ilmu', description: 'Tanya Ustaz AI 5 soalan', target: 5, progress: 0, xpReward: 80 },
  { id: 'tadabbur_3', title: 'Ahli Tadabbur', description: 'Lengkapkan 3 tadabbur', target: 3, progress: 0, xpReward: 120 },
  { id: 'streak_7_weekly', title: 'Streak Master', description: 'Kekalkan streak 7 hari', target: 7, progress: 0, xpReward: 200 },
];

const getNextMonday = () => {
  const d = new Date();
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
  d.setHours(0, 0, 0, 0);
  if (d <= new Date()) d.setDate(d.getDate() + 7);
  return d.toISOString();
};

// Ramadan 2026: Feb 28 - Mar 30
const RAMADAN_START = new Date('2026-02-28T00:00:00');
const RAMADAN_END = new Date('2026-03-30T23:59:59');

export const getLevelTitle = (level: number): string => LEVEL_TITLES[Math.min(level, 20)] || 'Imam';

const INITIAL_STATE: UserGamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActivityDate: null,
  achievements: [],
  weeklyChallenges: [],
  currentMultiplier: 1,
  multiplierReason: '',
  streakFreezes: 1,
  lastStreakDate: null
};

let didInitGamification = false;
let cachedGamificationState: UserGamificationState | null = null;

const loadGamificationState = (): UserGamificationState => {
  const saved = storage.get<Partial<UserGamificationState>>('quranpulse_gamification');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    return {
      ...INITIAL_STATE,
      ...saved,
      achievements: Array.isArray(saved.achievements) ? saved.achievements : [],
      weeklyChallenges: Array.isArray(saved.weeklyChallenges) ? saved.weeklyChallenges : [],
    };
  }
  return INITIAL_STATE;
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

  return useMemo(() => ({ state, ...actions }), [state, actions]);
};

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
  const [state, setState] = useState<UserGamificationState>(() => cachedGamificationState || INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(() => didInitGamification);

  useEffect(() => {
    if (didInitGamification) {
      if (cachedGamificationState) {
        setState(cachedGamificationState);
      }
      setIsHydrated(true);
      return;
    }

    didInitGamification = true;
    const restored = loadGamificationState();
    cachedGamificationState = restored;
    setState(restored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    storage.set('quranpulse_gamification', state);
    cachedGamificationState = state;
  }, [isHydrated, state]);

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

  const getXPMultiplier = useCallback((): XPMultiplier => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const timeInMins = hour * 60 + minutes;

    // 1. Lailatul Qadr (Odd nights of last 10 Ramadan)
    if (now >= new Date('2026-03-21T00:00:00') && now <= RAMADAN_END) {
      const daysSinceStart = Math.floor((now.getTime() - RAMADAN_START.getTime()) / (1000 * 60 * 60 * 24));
      const ramadanDay = daysSinceStart + 1;
      if (ramadanDay >= 21 && ramadanDay % 2 !== 0) {
        return { multiplier: 3, reason: '✨ Lailatul Qadr 3x!' };
      }
    }

    // 2. Ramadan
    if (now >= RAMADAN_START && now <= RAMADAN_END) {
      return { multiplier: 2, reason: '🌙 Ramadan 2x!' };
    }

    // 3. Jumuah (Friday)
    if (day === 5) {
      return { multiplier: 1.5, reason: '🕌 Jumuah Bonus' };
    }

    // 4. Barakah Subuh (5:30 - 6:30 AM)
    if (timeInMins >= 330 && timeInMins <= 390) {
      return { multiplier: 1.5, reason: '🌅 Barakah Subuh' };
    }

    return { multiplier: 1, reason: '' };
  }, []);

  // Update multiplier in state periodically
  useEffect(() => {
    const updateMultiplier = () => {
      const { multiplier, reason } = getXPMultiplier();
      setState(prev => ({
        ...prev,
        currentMultiplier: multiplier,
        multiplierReason: reason
      }));
    };

    updateMultiplier(); // Initial check
    const interval = setInterval(updateMultiplier, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [getXPMultiplier]);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const { multiplier } = getXPMultiplier();
      const finalAmount = Math.round(amount * multiplier);
      const newXP = prev.xp + finalAmount;
      const newLevel = calculateLevel(newXP);
      if (newLevel > prev.level) console.log(`🎉 Level Up! ${prev.level} -> ${newLevel}`);
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, [calculateLevel, getXPMultiplier]);

  const purchaseStreakFreeze = useCallback(() => {
    setState(prev => {
      if (prev.xp < 50) {
        console.warn('Insufficient XP to purchase Streak Freeze');
        return prev;
      }
      if (prev.streakFreezes >= 3) {
        console.warn('Max streak freezes reached');
        return prev;
      }
      return {
        ...prev,
        xp: prev.xp - 50,
        streakFreezes: prev.streakFreezes + 1
      };
    });
  }, []);

  const useStreakFreeze = useCallback(() => {
    setState(prev => {
      if (prev.streakFreezes <= 0) return prev;
      return { ...prev, streakFreezes: prev.streakFreezes - 1 };
    });
  }, []);

  const getStreakStatus = useCallback((): StreakStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = state.lastStreakDate ? new Date(state.lastStreakDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const isActive = !!lastDate && (today.getTime() - lastDate.getTime()) <= (1000 * 60 * 60 * 24);

    // Calculate expiration info
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diffMs = tomorrow.getTime() - new Date().getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      isActive,
      daysCount: state.streak,
      freezesAvailable: state.streakFreezes,
      willExpireIn: `${hours}j ${mins}m`
    };
  }, [state.streak, state.streakFreezes, state.lastStreakDate]);

  const resetWeeklyChallenges = useCallback(() => {
    const expiresAt = getNextMonday();
    const newChallenges = DEFAULT_CHALLENGES.map(c => ({ ...c, expiresAt }));
    setState(prev => ({ ...prev, weeklyChallenges: newChallenges }));
  }, []);

  const updateChallengeProgress = useCallback((challengeId: string, increment: number) => {
    setState(prev => {
      const challenges = prev.weeklyChallenges.map(c => {
        if (c.id === challengeId) {
          const newProgress = Math.min(c.target, c.progress + increment);
          if (newProgress === c.target && c.progress < c.target) {
            console.log(`🏆 Challenge Completed: ${c.title}! +${c.xpReward} XP`);
          }
          return { ...c, progress: newProgress };
        }
        return c;
      });

      // Calculate earned XP from just-completed challenges
      const earnedXP = challenges.reduce((acc, c, idx) => {
        const prevC = prev.weeklyChallenges[idx];
        if (c.id === challengeId && c.progress === c.target && prevC.progress < c.target) {
          return acc + c.xpReward;
        }
        return acc;
      }, 0);

      const newXP = prev.xp + earnedXP;
      const newLevel = calculateLevel(newXP);

      return { ...prev, xp: newXP, level: newLevel, weeklyChallenges: challenges };
    });
  }, [calculateLevel]);

  // Check for expired challenges on load
  useEffect(() => {
    const now = new Date();
    if (state.weeklyChallenges.length === 0 || new Date(state.weeklyChallenges[0].expiresAt) <= now) {
      resetWeeklyChallenges();
    }
  }, [resetWeeklyChallenges, state.weeklyChallenges]);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.achievements.some(a => a.id === achievementId)) return prev;

      const achievementDB: Record<string, Achievement> = {
        'first_verse': { id: 'first_verse', title: 'Langkah Pertama', description: 'Baca ayat pertama', icon: '📖', xpReward: 10 },
        'verse_100': { id: 'verse_100', title: 'Pembaca Tekun', description: 'Baca 100 ayat', icon: '📚', xpReward: 100 },
        'verse_1000': { id: 'verse_1000', title: 'Murid Quran', description: 'Baca 1,000 ayat', icon: '🌟', xpReward: 300 },
        'first_khatam': { id: 'first_khatam', title: 'Khatam Pertama', description: 'Khatam Al-Quran sekali', icon: '🏆', xpReward: 500 },
        'all_surahs': { id: 'all_surahs', title: 'Penjelajah', description: 'Lawati kesemua 114 surah', icon: '🗺️', xpReward: 250 },
        'streak_7': { id: 'streak_7', title: 'Istiqamah Seminggu', description: 'Streak 7 hari berturut', icon: '🔥', xpReward: 100 },
        'streak_30': { id: 'streak_30', title: 'Istiqamah Sebulan', description: 'Streak 30 hari berturut', icon: '💎', xpReward: 500 },
        'ramadan_streak': { id: 'ramadan_streak', title: 'Penghuni Ramadan', description: 'Aktif sepanjang Ramadan', icon: '🌙', xpReward: 1000 },
        'early_bird': { id: 'early_bird', title: 'Burung Awal', description: 'Baca selepas Subuh', icon: '🌅', xpReward: 50 },
        'night_owl': { id: 'night_owl', title: 'Pengamal Qiam', description: 'Baca selepas Isyak', icon: '🦉', xpReward: 50 },
        'prayer_5': { id: 'prayer_5', title: 'Solat Sempurna', description: 'Log 5 waktu solat', icon: '🕌', xpReward: 75 },
        'iqra_jilid1': { id: 'iqra_jilid1', title: 'Iqra Graduate', description: 'Siapkan Jilid 1', icon: '🎓', xpReward: 150 },
        'first_share': { id: 'first_share', title: 'Pendakwah Digital', description: 'Kongsi ayat pertama', icon: '📤', xpReward: 30 },
        'bookmark_10': { id: 'bookmark_10', title: 'Pengumpul Mutiara', description: 'Bookmark 10 ayat', icon: '💝', xpReward: 50 },
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
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    setState(prev => {
      if (prev.lastStreakDate === todayStr) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastStreakDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // Start new streak
      }

      return {
        ...prev,
        streak: newStreak,
        lastStreakDate: todayStr,
        lastActivityDate: todayStr // Syncing with old field for safety
      };
    });
  }, []);

  // Streak verification on load
  useEffect(() => {
    const verifyStreak = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const todayStr = now.toISOString().split('T')[0];

      setState(prev => {
        if (!prev.lastStreakDate || prev.lastStreakDate === todayStr) return prev;

        const lastDate = new Date(prev.lastStreakDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Last active yesterday, streak is currently valid (waiting for today's action)
          return prev;
        } else if (diffDays === 2 && prev.streakFreezes > 0) {
          // Missed yesterday, but have a freeze!
          console.log('❄️ Streak Freeze auto-used!');
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return {
            ...prev,
            streakFreezes: prev.streakFreezes - 1,
            lastStreakDate: yesterday.toISOString().split('T')[0]
          };
        } else if (diffDays >= 2) {
          // Streak broken
          console.log('💔 Streak broken.');
          return { ...prev, streak: 0 };
        }

        return prev;
      });
    };

    verifyStreak();
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
    getLevelProgress,
    updateChallengeProgress,
    resetWeeklyChallenges,
    getXPMultiplier,
    purchaseStreakFreeze,
    useStreakFreeze,
    getStreakStatus
  }), [addXP, unlockAchievement, checkStreak, getLevelProgress, updateChallengeProgress, resetWeeklyChallenges, getXPMultiplier, purchaseStreakFreeze, useStreakFreeze, getStreakStatus]);

  return (
    <GamificationActionsContext.Provider value={actions}>
      <GamificationStateContext.Provider value={state}>
        {children}
      </GamificationStateContext.Provider>
    </GamificationActionsContext.Provider>
  );
};
