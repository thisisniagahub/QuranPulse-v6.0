import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { storage } from '@/lib/storage';

type TasbihMode = 'subhanallah' | 'alhamdulillah' | 'allahuakbar';

interface TasbihPreset {
  id: TasbihMode;
  label: string;
  target: number;
}

interface TasbihHistoryEntry {
  date: string;
  mode: TasbihMode;
  completedSets: number;
}

const STORAGE_KEY = 'quranpulse_tasbih_history';

const PRESETS: TasbihPreset[] = [
  { id: 'subhanallah', label: 'SubhanAllah', target: 33 },
  { id: 'alhamdulillah', label: 'Alhamdulillah', target: 33 },
  { id: 'allahuakbar', label: 'AllahuAkbar', target: 34 },
];

const safeReadHistory = (): TasbihHistoryEntry[] => {
  return storage.get<TasbihHistoryEntry[]>(STORAGE_KEY) || [];
};

const safeWriteHistory = (history: TasbihHistoryEntry[]): void => {
  storage.set(STORAGE_KEY, history);
};

const DigitalTasbih: React.FC = () => {
  const { addXP } = useGamification();
  const [presetIndex, setPresetIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [history, setHistory] = useState<TasbihHistoryEntry[]>(safeReadHistory);

  const activePreset = PRESETS[presetIndex];
  const progress = Math.min(100, Math.round((count / activePreset.target) * 100));

  const totalTodaySets = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return history
      .filter((entry) => entry.date === today)
      .reduce((sum, entry) => sum + entry.completedSets, 0);
  }, [history]);

  const rotatePreset = () => {
    setPresetIndex((prev) => (prev + 1) % PRESETS.length);
    setCount(0);
  };

  const saveCompletion = (mode: TasbihMode) => {
    const today = new Date().toISOString().slice(0, 10);

    const updated = (() => {
      const idx = history.findIndex((entry) => entry.date === today && entry.mode === mode);
      if (idx === -1) {
        return [{ date: today, mode, completedSets: 1 }, ...history].slice(0, 40);
      }

      return history.map((entry, i) =>
        i === idx ? { ...entry, completedSets: entry.completedSets + 1 } : entry
      );
    })();

    setHistory(updated);
    safeWriteHistory(updated);
  };

  const handleTap = () => {
    const nextCount = count + 1;

    if (nextCount >= activePreset.target) {
      setCompletedSets((prev) => prev + 1);
      addXP(25, `Tasbih completed: ${activePreset.label}`);
      saveCompletion(activePreset.id);
      rotatePreset();
      return;
    }

    setCount(nextCount);
  };

  const resetCurrent = () => setCount(0);

  return (
    <div className="mx-auto w-full max-w-md p-6 text-white">
      <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Digital Tasbih</p>
            <h2 className="mt-1 text-xl font-bold">{activePreset.label}</h2>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-300">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleTap}
          aria-label="Ketik Tasbih"
          className="relative mb-6 flex h-56 w-full items-center justify-center overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-900/40 to-slate-900 shadow-warm"
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        >
          <div
            className="absolute inset-x-0 bottom-0 bg-emerald-500/20 transition-all duration-200 h-[var(--progress)]"
          />
          <div className="relative z-10 text-center">
            <p className="text-5xl font-black">{count}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-300">
              Target {activePreset.target}
            </p>
          </div>
        </motion.button>

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-slate-300">Progress</span>
          <span className="font-bold text-emerald-300">{progress}%</span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-emerald-500 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={resetCurrent}
            aria-label="Reset hitungan tasbih saat ini"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={rotatePreset}
            aria-label="Tukar zikir ke preset berikutnya"
            className="rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-4 py-3 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-600/30"
          >
            Tukar Zikir
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
          <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
            <p className="text-slate-400">Set Selesai</p>
            <p className="mt-1 text-lg font-black text-raudhah-teal">{completedSets}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
            <p className="text-slate-400">Set Hari Ini</p>
            <p className="mt-1 text-lg font-black text-emerald-300">{totalTodaySets}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTasbih;
