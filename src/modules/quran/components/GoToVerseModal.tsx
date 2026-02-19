import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoToVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToVerse: (verseKey: string) => void;
  totalVerses: number;
  currentChapter: number;
}

const GoToVerseModal: React.FC<GoToVerseModalProps> = ({
  isOpen,
  onClose,
  onGoToVerse,
  totalVerses,
  currentChapter
}) => {
  const [verseNumber, setVerseNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(verseNumber);
    
    if (isNaN(num) || num < 1 || num > totalVerses) {
      setError(`Sila masukkan nombor antara 1 - ${totalVerses}`);
      return;
    }
    
    onGoToVerse(`${currentChapter}:${num}`);
    setVerseNumber('');
    setError('');
    onClose();
  };

  const handleQuickJump = (num: number) => {
    onGoToVerse(`${currentChapter}:${num}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-full max-w-sm"
          >
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl mx-4 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🔍</span>
                  Pergi ke Ayat
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Surah ini ada {totalVerses} ayat
                </p>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Input */}
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                    Nombor Ayat
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalVerses}
                    value={verseNumber}
                    onChange={(e) => {
                      setVerseNumber(e.target.value);
                      setError('');
                    }}
                    placeholder={`1 - ${totalVerses}`}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-center text-xl font-bold focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
                  )}
                </div>

                {/* Quick Jump Buttons */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                    Lompat Pantas
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, Math.floor(totalVerses * 0.25), Math.floor(totalVerses * 0.5), Math.floor(totalVerses * 0.75), totalVerses]
                      .filter((v, i, a) => a.indexOf(v) === i && v > 0)
                      .map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleQuickJump(num)}
                          className="py-2 px-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm font-bold hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                        >
                          {num}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all"
                  >
                    Pergi →
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoToVerseModal;
