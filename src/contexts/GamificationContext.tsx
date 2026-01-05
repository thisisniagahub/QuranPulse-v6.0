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
        'first_khatam': { id: 'first_khatam', title: 'First Khatam', description: 'Completed the Quran once', icon: '🏆',  xpReward: 500 },
        'streak_7': { id: 'streak_7', title: 'Week Warrior', description: '7 Day Streak', icon: '🔥', xpReward: 100 },    
        'early_bird': { id: 'early_bird', title: 'Early Bird', description: 'Read after Fajr', icon: '🌅', xpReward: 50 },
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
