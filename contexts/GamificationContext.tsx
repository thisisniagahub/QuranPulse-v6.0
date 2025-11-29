import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  lastActivityDate: string | null; // ISO Date string
  achievements: Achievement[];
}

interface GamificationContextType {
  state: UserGamificationState;
  addXP: (amount: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  checkStreak: () => void;
  getLevelProgress: () => number; // 0-100
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

// --- Context ---
const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

// --- Provider ---
export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage or default
  const [state, setState] = useState<UserGamificationState>(() => {
    const saved = localStorage.getItem('quranpulse_gamification');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('quranpulse_gamification', JSON.stringify(state));
  }, [state]);

  // Calculate Level based on XP
  const calculateLevel = (xp: number) => {
    // Simple formula: Level = floor(sqrt(xp / 100)) + 1
    // Or iterative:
    let level = 1;
    let required = LEVEL_BASE_XP;
    while (xp >= required) {
      xp -= required;
      level++;
      required = Math.floor(required * LEVEL_MULTIPLIER);
    }
    return level;
  };

  const addXP = (amount: number, reason?: string) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      
      if (newLevel > prev.level) {
        // Level Up Event! (Could trigger a modal via UIStore)
        console.log(`🎉 Level Up! ${prev.level} -> ${newLevel}`);
        // playSound('levelup');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setState(prev => {
      if (prev.achievements.some(a => a.id === achievementId)) return prev; // Already unlocked

      // Mock Achievement Database (In real app, fetch from DB)
      const achievementDB: Record<string, Achievement> = {
        'first_khatam': { id: 'first_khatam', title: 'First Khatam', description: 'Completed the Quran once', icon: '🏆', xpReward: 500 },
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
  };

  const checkStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      if (prev.lastActivityDate === today) return prev; // Already counted today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastActivityDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset or Start
      }

      return {
        ...prev,
        streak: newStreak,
        lastActivityDate: today
      };
    });
  };

  const getLevelProgress = () => {
    // Calculate progress to next level
    let xp = state.xp;
    let level = 1;
    let required = LEVEL_BASE_XP;
    
    // Find current level base
    while (xp >= required) {
      xp -= required;
      level++;
      required = Math.floor(required * LEVEL_MULTIPLIER);
    }
    
    // xp is now the remainder (progress into current level)
    // required is the total needed for this level
    return Math.min(100, Math.floor((xp / required) * 100));
  };

  return (
    <GamificationContext.Provider value={{ state, addXP, unlockAchievement, checkStreak, getLevelProgress }}>
      {children}
    </GamificationContext.Provider>
  );
};
