/**
 * 📖 Khatam Planner
 * Personal Quran completion scheduler in Raudhah theme
 * 
 * Features:
 * - Raudhah Ivory/Gold interface
 * - Dynamic progress calculations
 * - Daily task management
 * - Persistent local storage
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flag, Calendar, Book, ChevronRight, Check,
  RotateCcw, Target, TrendingUp, Info
} from 'lucide-react';
import { storage } from '@/lib/storage';

interface KhatamPlan {
  targetDate: string; // YYYY-MM-DD
  startPage: number;
  currentPage: number;
  totalPages: number; // 604 for Madinah Mushaf
  dailyPages: number;
  daysRemaining: number;
  isOnTrack: boolean;
}

const safeLoadPlan = (): KhatamPlan | null => {
  return storage.get<KhatamPlan>('khatam_plan');
};

const safeSetPlan = (plan: KhatamPlan): void => {
  storage.set('khatam_plan', plan);
};

const safeRemovePlan = (): void => {
  storage.remove('khatam_plan');
};

const KhatamPlanner: React.FC = () => {
  const [hasPlan, setHasPlan] = useState(false);
  const [plan, setPlan] = useState<KhatamPlan | null>(null);

  // Input States
  const [targetDate, setTargetDate] = useState('');
  const [startPage, setStartPage] = useState(1);

  // Load plan from local storage on mount
  useEffect(() => {
    const savedPlan = safeLoadPlan();
    if (savedPlan) {
      setPlan(savedPlan);
      setHasPlan(true);
    }
  }, []);

  const calculatePlan = () => {
    if (!targetDate) return;

    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const pagesLeft = 604 - startPage + 1;
    const daily = Math.ceil(pagesLeft / diffDays);

    const newPlan: KhatamPlan = {
      targetDate,
      startPage,
      currentPage: startPage,
      totalPages: 604,
      dailyPages: daily,
      daysRemaining: diffDays,
      isOnTrack: true
    };

    setPlan(newPlan);
    setHasPlan(true);
    safeSetPlan(newPlan);
  };

  const updateProgress = (pagesRead: number) => {
    if (!plan) return;
    const newCurrent = plan.currentPage + pagesRead;

    // Recalculate status
    const newPlan = { ...plan, currentPage: newCurrent };
    setPlan(newPlan);
    safeSetPlan(newPlan);
  };

  const resetPlan = () => {
    setHasPlan(false);
    setPlan(null);
    safeRemovePlan();
  };

  // --- UI RENDER ---

  if (!hasPlan) {
    return (
      <div className="p-8 bg-white/40 rounded-[2.5rem] border-2 border-raudhah-teal/10 text-center space-y-8 glass-v7 shadow-sm">
        <div className="w-20 h-20 bg-gradient-to-br from-raudhah-gold to-raudhah-gold/60 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-raudhah-gold/20 active:scale-95 transition-all">
          <Flag className="text-3xl text-white" size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-raudhah-ink mb-3 uppercase tracking-tight">Misi Khatam Quran</h3>
          <p className="text-base text-raudhah-teal/40 font-bold italic">Bina jadual bacaan peribadi anda. Kami akan bantu anda istiqamah mencapai sasaran syurga.</p>
        </div>

        <div className="space-y-6 text-left max-w-sm mx-auto">
          <div className="group">
            <label className="text-[10px] font-black text-raudhah-teal/30 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-2">
              <Calendar size={12} /> Tarikh Sasaran
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-white border-2 border-raudhah-teal/10 rounded-2xl p-4 text-raudhah-ink mt-1 outline-none focus:border-raudhah-gold transition-all shadow-sm font-bold"
            />
          </div>
          <div className="group">
            <label className="text-[10px] font-black text-raudhah-teal/30 uppercase ml-1 tracking-widest flex items-center gap-1.5 mb-2">
              <Book size={12} /> Mula Dari Muka Surat
            </label>
            <input
              type="number"
              min="1" max="604"
              value={startPage}
              onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
              className="w-full bg-white border-2 border-raudhah-teal/10 rounded-2xl p-4 text-raudhah-ink mt-1 outline-none focus:border-raudhah-gold transition-all shadow-sm font-bold"
            />
          </div>
        </div>

        <button
          onClick={calculatePlan}
          disabled={!targetDate}
          className="w-full max-w-sm py-5 bg-raudhah-teal text-white rounded-2xl font-black shadow-lg shadow-raudhah-teal/20 hover:shadow-raudhah-teal/30 transition-all active:translate-y-1 active:shadow-inner disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest border-b-4 border-raudhah-ink"
        >
          Jana Strategi Saya
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4">
      {/* Progress Card */}
      <div className="relative overflow-hidden bg-white/80 rounded-[3rem] p-8 border-2 border-raudhah-teal/10 shadow-sm glass-v7">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-[0.2em]">Pencernaan Harian</p>
            <h2 className="text-5xl font-black text-raudhah-ink tracking-tighter">
              {plan?.dailyPages}
              <span className="text-xl font-bold text-raudhah-teal/40 ml-2 italic">ms</span>
            </h2>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-widest">Baki Masa</p>
            <div className="flex items-center gap-2 bg-raudhah-gold/10 px-4 py-2 rounded-2xl border border-raudhah-gold/20">
              <p className="text-2xl font-black text-raudhah-gold">{plan?.daysRemaining}</p>
              <span className="text-[10px] font-black text-raudhah-gold/60 uppercase">Hari</span>
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-4">
          <div className="relative h-6 bg-raudhah-teal/5 rounded-full overflow-hidden border border-raudhah-teal/10 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (plan!.currentPage / 604) * 100)}%` }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-raudhah-teal to-raudhah-gold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            />
          </div>
          <div className="flex justify-between text-[10px] text-raudhah-teal/40 font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Book size={12} />
              <span>Halaman: {plan?.currentPage} / 604</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={12} />
              <span>Target: {plan?.targetDate}</span>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-raudhah-gold/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-black text-raudhah-teal/30 uppercase tracking-[0.3em]">Manzil Hari Ini</h4>
          <div className="flex items-center gap-2 text-raudhah-gold/60">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sedang Daki</span>
          </div>
        </div>

        <div className="bg-white border-2 border-raudhah-teal/10 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-raudhah-teal/30 transition-all shadow-sm hover:shadow-lg active:scale-[0.99]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-raudhah-teal/5 border border-raudhah-teal/10 flex items-center justify-center text-raudhah-teal font-black text-xl shadow-inner group-hover:bg-raudhah-teal group-hover:text-white transition-all">
              {plan?.dailyPages}
            </div>
            <div className="space-y-1">
              <p className="text-raudhah-ink font-black text-lg tracking-tight uppercase">Muka Surat {plan?.currentPage} - {Math.min(604, plan!.currentPage + plan!.dailyPages - 1)}</p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-raudhah-teal/5 text-raudhah-teal text-[10px] font-black rounded-lg uppercase border border-raudhah-teal/10 italic">Juzuk {Math.ceil(plan!.currentPage / 20)}</span>
                <p className="text-[10px] text-raudhah-teal/30 font-bold uppercase tracking-widest">±{plan?.dailyPages} Muka Surat</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => updateProgress(plan!.dailyPages)}
            className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm group-active:scale-90"
            title="Selesai Bacaan"
          >
            <Check size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Settings / Reset */}
      <div className="pt-4 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 px-6 py-3 bg-raudhah-gold/5 rounded-full border border-raudhah-gold/10 max-w-xs text-center">
          <Info size={14} className="text-raudhah-gold shrink-0" />
          <p className="text-[10px] text-raudhah-gold font-black uppercase tracking-tighter">Jadual ini dikira berdasarkan baki hari dan halaman.</p>
        </div>

        <button
          onClick={resetPlan}
          className="flex items-center gap-2 py-3 px-8 rounded-2xl border-2 border-raudhah-teal/5 text-raudhah-teal/30 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-raudhah-ink hover:border-raudhah-teal/10 transition-all active:scale-95 group shadow-sm bg-transparent"
        >
          <RotateCcw size={14} className="group-hover:rotate-180 transition-all duration-500" /> Reset Plan & Kira Semula
        </button>
      </div>

      <div className="h-20" /> {/* Spacer */}
    </div>
  );
};

export default KhatamPlanner;
