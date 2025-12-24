import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranChapter } from '../../types';

interface SurahInfoPanelProps {
  chapter: QuranChapter;
  isOpen: boolean;
  onClose: () => void;
}

// Juz mapping for first verse of each Juz (simplified)
const getJuzInfo = (chapterId: number): { juz: number; hizb: number } => {
  const juzStarts: Record<number, number> = {
    1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 9, 10: 10,
    11: 11, 12: 11, 13: 12, 14: 13, 15: 13, 16: 14, 17: 14, 18: 15,
    19: 16, 20: 16, 21: 17, 22: 17, 23: 18, 24: 18, 25: 18, 26: 19,
    27: 19, 28: 20, 29: 20, 30: 21, 31: 21, 32: 21, 33: 21, 34: 22,
    35: 22, 36: 22, 37: 23, 38: 23, 39: 23, 40: 24, 41: 24, 42: 25,
    43: 25, 44: 25, 45: 25, 46: 26, 47: 26, 48: 26, 49: 26, 50: 26,
    51: 26, 52: 27, 53: 27, 54: 27, 55: 27, 56: 27, 57: 27, 58: 28,
    59: 28, 60: 28, 61: 28, 62: 28, 63: 28, 64: 28, 65: 28, 66: 28,
    67: 29, 68: 29, 69: 29, 70: 29, 71: 29, 72: 29, 73: 29, 74: 29,
    75: 29, 76: 29, 77: 29, 78: 30, 79: 30, 80: 30, 81: 30, 82: 30,
    83: 30, 84: 30, 85: 30, 86: 30, 87: 30, 88: 30, 89: 30, 90: 30,
    91: 30, 92: 30, 93: 30, 94: 30, 95: 30, 96: 30, 97: 30, 98: 30,
    99: 30, 100: 30, 101: 30, 102: 30, 103: 30, 104: 30, 105: 30,
    106: 30, 107: 30, 108: 30, 109: 30, 110: 30, 111: 30, 112: 30,
    113: 30, 114: 30
  };
  const juz = juzStarts[chapterId] || 1;
  const hizb = Math.ceil(juz * 2);
  return { juz, hizb };
};

const SurahInfoPanel: React.FC<SurahInfoPanelProps> = ({ chapter, isOpen, onClose }) => {
  const { juz, hizb } = getJuzInfo(chapter.id);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-[61] max-w-md mx-auto"
          >
            <div className="bg-slate-900 border-t border-cyan-500/30 rounded-t-3xl shadow-2xl overflow-hidden">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3" />
              
              {/* Header with Arabic Name */}
              <div className="text-center px-6 pt-4 pb-6">
                <h2 className="font-uthmani text-4xl text-white mb-2">
                  {chapter.name_arabic}
                </h2>
                <p className="text-cyan-400 font-bold text-lg">
                  {chapter.name_simple}
                </p>
                <p className="text-slate-400 text-sm">
                  {chapter.translated_name?.name || chapter.name_simple}
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 px-4 pb-4">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-2xl font-bold text-white">{chapter.verses_count}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ayat</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-2xl font-bold text-cyan-400">{juz}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Juz'</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-2xl font-bold text-emerald-400">{hizb}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Hizb</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-2xl font-bold text-amber-400">{chapter.revelation_order}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tertib</p>
                </div>
              </div>
              
              {/* Revelation Type Badge */}
              <div className="px-4 pb-4">
                <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${
                  chapter.revelation_place === 'makkah' 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  <span className="text-xl">
                    {chapter.revelation_place === 'makkah' ? '🕋' : '🕌'}
                  </span>
                  <span className="font-bold uppercase tracking-wider text-sm">
                    {chapter.revelation_place === 'makkah' ? 'Surah Makkiyyah' : 'Surah Madaniyyah'}
                  </span>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-800 text-slate-400 font-bold text-sm uppercase tracking-wider hover:bg-slate-700 transition-colors"
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

export default SurahInfoPanel;
