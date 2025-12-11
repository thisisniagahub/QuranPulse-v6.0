import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse } from '../../types';

interface RangeRepeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  verses: QuranVerse[];
  onStartRepeat: (startVerse: number, endVerse: number, repeatCount: number) => void;
  currentChapter: number;
}

const RangeRepeatModal: React.FC<RangeRepeatModalProps> = ({
  isOpen,
  onClose,
  verses,
  onStartRepeat,
  currentChapter
}) => {
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(1);
  const [repeatCount, setRepeatCount] = useState(3);
  const [error, setError] = useState('');

  const totalVerses = verses.length;

  useEffect(() => {
    if (isOpen) {
      setEndVerse(Math.min(startVerse + 2, totalVerses));
    }
  }, [isOpen, startVerse, totalVerses]);

  const handleStartVerse = (val: number) => {
    setStartVerse(val);
    if (val > endVerse) {
      setEndVerse(Math.min(val + 2, totalVerses));
    }
    setError('');
  };

  const handleSubmit = () => {
    if (startVerse > endVerse) {
      setError('Ayat mula mesti kurang dari ayat akhir');
      return;
    }
    if (startVerse < 1 || endVerse > totalVerses) {
      setError(`Sila pilih antara ayat 1 - ${totalVerses}`);
      return;
    }
    onStartRepeat(startVerse, endVerse, repeatCount);
    onClose();
  };

  const repeatOptions = [1, 2, 3, 5, 7, 10, 15, 20];

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
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🔄</span>
                  Ulangan Hafazan
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Pilih julat ayat untuk diulang
                </p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-5">
                {/* Range Selector */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Verse */}
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                      Mula dari Ayat
                    </label>
                    <select
                      value={startVerse}
                      onChange={(e) => handleStartVerse(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-center font-bold focus:border-purple-500 focus:outline-none"
                    >
                      {Array.from({ length: totalVerses }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* End Verse */}
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                      Hingga Ayat
                    </label>
                    <select
                      value={endVerse}
                      onChange={(e) => setEndVerse(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-center font-bold focus:border-purple-500 focus:outline-none"
                    >
                      {Array.from({ length: totalVerses - startVerse + 1 }, (_, i) => startVerse + i).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                  <p className="text-slate-400 text-sm">
                    Ulang ayat <span className="text-purple-400 font-bold">{currentChapter}:{startVerse}</span>
                    {' '}hingga{' '}
                    <span className="text-purple-400 font-bold">{currentChapter}:{endVerse}</span>
                  </p>
                  <p className="text-cyan-400 font-bold mt-1">
                    {endVerse - startVerse + 1} ayat
                  </p>
                </div>

                {/* Repeat Count */}
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                    Bilangan Ulangan
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {repeatOptions.map(count => (
                      <button
                        key={count}
                        onClick={() => setRepeatCount(count)}
                        className={`py-2 rounded-lg font-bold text-sm transition-all ${
                          repeatCount === count
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {count}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">
                    {error}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🔄</span>
                    Mula Ulangan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RangeRepeatModal;
