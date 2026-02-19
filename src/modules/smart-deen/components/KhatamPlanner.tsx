import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  try {
    const savedPlan = localStorage.getItem('khatam_plan');
    if (!savedPlan) return null;
    return JSON.parse(savedPlan) as KhatamPlan;
  } catch {
    return null;
  }
};

const safeSetPlan = (plan: KhatamPlan): void => {
  try {
    localStorage.setItem('khatam_plan', JSON.stringify(plan));
  } catch {
    // Ignore storage errors
  }
};

const safeRemovePlan = (): void => {
  try {
    localStorage.removeItem('khatam_plan');
  } catch {
    // Ignore storage errors
  }
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
      <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <i className="fa-solid fa-flag-checkered text-2xl text-white"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Misi Khatam Quran</h3>
          <p className="text-sm text-slate-400">Bina jadual bacaan peribadi anda. Kami akan bantu anda istiqamah.</p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tarikh Target Khatam</label>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white mt-1 outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mula Dari Muka Surat</label>
            <input 
              type="number" 
              min="1" max="604"
              value={startPage}
              onChange={(e) => setStartPage(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white mt-1 outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <button 
          onClick={calculatePlan}
          disabled={!targetDate}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-bold shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Jana Jadual Saya
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target Harian</p>
            <h2 className="text-4xl font-bold text-white mt-1">{plan?.dailyPages} <span className="text-lg font-medium text-slate-500">muka surat</span></h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Baki Hari</p>
            <p className="text-xl font-bold text-amber-400">{plan?.daysRemaining} hari</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-slate-800 rounded-full mb-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(plan!.currentPage / 604) * 100}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>Page {plan?.currentPage}</span>
          <span>Target: {plan?.targetDate}</span>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white px-1">Tugasan Hari Ini</h4>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-sm">
              {plan?.currentPage}
            </div>
            <div>
              <p className="text-white font-bold text-sm">Baca Muka Surat {plan?.currentPage} - {Math.min(604, plan!.currentPage + plan!.dailyPages - 1)}</p>
              <p className="text-xs text-slate-500">Juzuk {Math.ceil(plan!.currentPage / 20)}</p>
            </div>
          </div>
          <button 
            onClick={() => updateProgress(plan!.dailyPages)}
            className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        </div>
      </div>

      {/* Settings / Reset */}
      <button 
        onClick={resetPlan}
        className="w-full py-3 rounded-xl border border-slate-800 text-slate-500 text-xs hover:bg-slate-800 hover:text-white transition-all"
      >
        Reset / Kira Semula Plan
      </button>
    </div>
  );
};

export default KhatamPlanner;
