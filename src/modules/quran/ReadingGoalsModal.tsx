import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadingGoal {
  dailyVerses: number;
  currentStreak: number;
  longestStreak: number;
  todayRead: number;
  lastReadDate: string;
  totalVersesRead: number;
  history: { date: string; count: number }[];
}

interface ReadingGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_GOAL: ReadingGoal = {
  dailyVerses: 10,
  currentStreak: 0,
  longestStreak: 0,
  todayRead: 0,
  lastReadDate: '',
  totalVersesRead: 0,
  history: []
};

const STORAGE_KEY = 'quranpulse_reading_goals';

// Helper to get stored goals
const getStoredGoals = (): ReadingGoal => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_GOAL, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading goals:', e);
  }
  return DEFAULT_GOAL;
};

// Helper to store goals
const storeGoals = (goals: ReadingGoal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

// Check if same day
const isSameDay = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] === date2.split('T')[0];
};

// Check if consecutive day
const isConsecutiveDay = (prevDate: string, currentDate: string): boolean => {
  const prev = new Date(prevDate);
  const curr = new Date(currentDate);
  const diffTime = curr.getTime() - prev.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const ReadingGoalsModal: React.FC<ReadingGoalsModalProps> = ({ isOpen, onClose }) => {
  const [goals, setGoals] = useState<ReadingGoal>(getStoredGoals());
  const [editingGoal, setEditingGoal] = useState(false);
  const [newDailyGoal, setNewDailyGoal] = useState(goals.dailyVerses);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredGoals();
      const today = new Date().toISOString();
      
      // Reset today count if it's a new day
      if (stored.lastReadDate && !isSameDay(stored.lastReadDate, today)) {
        // Check streak
        if (stored.todayRead >= stored.dailyVerses) {
          if (isConsecutiveDay(stored.lastReadDate, today)) {
            stored.currentStreak += 1;
            stored.longestStreak = Math.max(stored.longestStreak, stored.currentStreak);
          } else {
            stored.currentStreak = 0;
          }
        } else {
          stored.currentStreak = 0;
        }
        stored.todayRead = 0;
        storeGoals(stored);
      }
      
      setGoals(stored);
      setNewDailyGoal(stored.dailyVerses);
    }
  }, [isOpen]);

  const progress = Math.min((goals.todayRead / goals.dailyVerses) * 100, 100);
  const goalMet = goals.todayRead >= goals.dailyVerses;

  const handleSaveGoal = () => {
    const updated = { ...goals, dailyVerses: newDailyGoal };
    storeGoals(updated);
    setGoals(updated);
    setEditingGoal(false);
  };

  const goalOptions = [5, 10, 15, 20, 30, 50];

  // Get last 7 days history
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const entry = goals.history.find(h => h.date.startsWith(dateStr));
    return {
      day: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'][date.getDay()],
      count: entry?.count || 0,
      isToday: i === 6
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-full max-w-md mx-4"
          >
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📊</span>
                  Progres Bacaan
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {goalMet ? '🎉 Tahniah! Sasaran hari ini tercapai!' : 'Teruskan membaca untuk capai sasaran'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4">
                {/* Today Progress */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-slate-700"
                      />
                      <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${progress * 1.76} 176`}
                        className={goalMet ? 'text-emerald-400' : 'text-cyan-400'}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                      {goals.todayRead}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Hari Ini</p>
                </div>

                {/* Current Streak */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-3xl font-bold text-amber-400">
                    {goals.currentStreak}
                  </p>
                  <p className="text-xl">🔥</p>
                  <p className="text-[10px] text-slate-400">Streak</p>
                </div>

                {/* Total Read */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-2xl font-bold text-emerald-400">
                    {goals.totalVersesRead}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Jumlah Ayat</p>
                </div>
              </div>

              {/* Week Chart */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                  7 Hari Lepas
                </p>
                <div className="flex items-end justify-between gap-1 h-20 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                  {last7Days.map((day, i) => {
                    const height = Math.max((day.count / goals.dailyVerses) * 100, 5);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t transition-all ${
                            day.count >= goals.dailyVerses 
                              ? 'bg-emerald-500' 
                              : day.count > 0 
                                ? 'bg-cyan-500/50' 
                                : 'bg-slate-700'
                          } ${day.isToday ? 'ring-2 ring-cyan-400' : ''}`}
                          style={{ height: `${height}%` }}
                        />
                        <span className={`text-[8px] ${day.isToday ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                          {day.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Goal Setting */}
              <div className="px-4 pb-4">
                {editingGoal ? (
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Tetapkan Sasaran Harian
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {goalOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setNewDailyGoal(opt)}
                          className={`py-2 rounded-lg font-bold text-sm transition-all ${
                            newDailyGoal === opt
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {opt} ayat
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingGoal(false)}
                        className="flex-1 py-2 bg-slate-800 text-slate-400 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveGoal}
                        className="flex-1 py-2 bg-emerald-500 text-white font-bold rounded-lg"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingGoal(true)}
                    className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
                  >
                    <span>🎯</span>
                    <span>Sasaran: <strong className="text-emerald-400">{goals.dailyVerses} ayat/hari</strong></span>
                    <span className="text-slate-500">✏️</span>
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 text-slate-400 font-bold text-sm uppercase tracking-wider hover:bg-slate-700 transition-colors border-t border-slate-700"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Export helper function to track reading progress
export const trackVerseRead = (verseKey: string) => {
  const goals = getStoredGoals();
  const today = new Date().toISOString();
  
  // Check if new day
  if (goals.lastReadDate && !isSameDay(goals.lastReadDate, today)) {
    // Update streak if goal was met
    if (goals.todayRead >= goals.dailyVerses) {
      if (isConsecutiveDay(goals.lastReadDate, today)) {
        goals.currentStreak += 1;
        goals.longestStreak = Math.max(goals.longestStreak, goals.currentStreak);
      }
    } else {
      goals.currentStreak = 0;
    }
    goals.todayRead = 0;
  }
  
  goals.todayRead += 1;
  goals.totalVersesRead += 1;
  goals.lastReadDate = today;
  
  // Update history
  const todayStr = today.split('T')[0];
  const historyEntry = goals.history.find(h => h.date.startsWith(todayStr));
  if (historyEntry) {
    historyEntry.count += 1;
  } else {
    goals.history.push({ date: today, count: 1 });
    // Keep only last 30 days
    if (goals.history.length > 30) {
      goals.history = goals.history.slice(-30);
    }
  }
  
  storeGoals(goals);
  return goals;
};

export default ReadingGoalsModal;
