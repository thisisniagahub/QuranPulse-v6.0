/**
 * Iqra JSON Reader Component
 * Displays Iqra lessons from JSON data with Arabic text rendering
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IqraPage {
  page: number;
  title: string;
  instruction_jawi?: string;
  instruction_rumi?: string;
  content: string[];
}

interface IqraBook {
  [key: string]: IqraPage[];
}

interface IqraJsonReaderProps {
  bookId?: string; // 'iqra-1', 'iqra-2', etc.
  onClose?: () => void;
}

const BOOK_INFO = [
  { id: 'iqra-1', name: 'Iqra 1', key: 'Iqra_1', color: 'from-green-500 to-emerald-600' },
  { id: 'iqra-2', name: 'Iqra 2', key: 'Iqra_2', color: 'from-yellow-500 to-amber-600' },
  { id: 'iqra-3', name: 'Iqra 3', key: 'Iqra_3', color: 'from-orange-500 to-red-600' },
  { id: 'iqra-4', name: 'Iqra 4', key: 'Iqra_4', color: 'from-blue-500 to-indigo-600' },
  { id: 'iqra-5', name: 'Iqra 5', key: 'Iqra_5', color: 'from-purple-500 to-violet-600' },
  { id: 'iqra-6', name: 'Iqra 6', key: 'Iqra_6', color: 'from-pink-500 to-rose-600' },
];

export const IqraJsonReader: React.FC<IqraJsonReaderProps> = ({ 
  bookId = 'iqra-1',
  onClose 
}) => {
  const [currentBookId, setCurrentBookId] = useState(bookId);
  const [pages, setPages] = useState<IqraPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState(32);

  // Get current book info
  const currentBookInfo = BOOK_INFO.find(b => b.id === currentBookId) || BOOK_INFO[0];

  // Load book data
  useEffect(() => {
    setIsLoading(true);
    fetch(`/iqra_json/${currentBookId}.json`)
      .then(res => res.json())
      .then((data: IqraBook) => {
        const bookKey = currentBookInfo.key;
        setPages(data[bookKey] || []);
        setCurrentPage(1);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Iqra data:', err);
        setPages([]);
        setIsLoading(false);
      });
  }, [currentBookId, currentBookInfo.key]);

  const currentPageData = pages.find(p => p.page === currentPage);
  const maxPage = pages.length > 0 ? Math.max(...pages.map(p => p.page)) : 1;

  const goNext = () => {
    if (currentPage < maxPage) {
      setCurrentPage(p => p + 1);
    } else {
      // Move to next book
      const idx = BOOK_INFO.findIndex(b => b.id === currentBookId);
      if (idx < BOOK_INFO.length - 1) {
        setCurrentBookId(BOOK_INFO[idx + 1].id);
      }
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    } else {
      // Move to previous book
      const idx = BOOK_INFO.findIndex(b => b.id === currentBookId);
      if (idx > 0) {
        setCurrentBookId(BOOK_INFO[idx - 1].id);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-slate-950 rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Memuatkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-white/10">
      {/* Header with Book Selector */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Book Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {BOOK_INFO.map((book, idx) => (
              <button
                key={book.id}
                onClick={() => setCurrentBookId(book.id)}
                className={`min-w-[40px] h-10 px-3 rounded-lg font-bold text-sm transition-all flex-shrink-0 ${
                  currentBookId === book.id
                    ? `bg-gradient-to-r ${book.color} text-white shadow-lg`
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Font Size Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize(s => Math.max(20, s - 4))}
              className="w-8 h-8 rounded bg-white/10 text-white/60 hover:bg-white/20"
            >
              <i className="fa-solid fa-minus text-xs" />
            </button>
            <span className="text-white/40 text-xs w-8 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(s => Math.min(56, s + 4))}
              className="w-8 h-8 rounded bg-white/10 text-white/60 hover:bg-white/20"
            >
              <i className="fa-solid fa-plus text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentBookId}-${currentPage}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
          >
            {/* Page Title */}
            {currentPageData?.title && (
              <h2 className="text-center text-lg font-bold text-cyan-400 mb-2">
                {currentPageData.title}
              </h2>
            )}

            {/* Instruction */}
            {currentPageData?.instruction_rumi && (
              <p className="text-center text-sm text-emerald-400/80 mb-6 italic">
                {currentPageData.instruction_rumi}
              </p>
            )}

            {/* Arabic Content */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4"
              dir="rtl"
            >
              {currentPageData?.content.map((line, idx) => (
                <p
                  key={idx}
                  className="font-uthmani text-slate-900 leading-loose tracking-wide"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Jawi Instruction */}
            {currentPageData?.instruction_jawi && (
              <p className="text-center text-sm text-amber-400/80 mt-4" dir="rtl">
                {currentPageData.instruction_jawi}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Prev Button */}
          <button
            onClick={goPrev}
            disabled={currentBookId === 'iqra-1' && currentPage === 1}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-right text-white" />
          </button>

          {/* Page Info */}
          <div className="text-center">
            <p className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentBookInfo.color}`}>
              {currentBookInfo.name}
            </p>
            <p className="text-white/40 text-sm">
              Muka {currentPage} / {maxPage}
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={goNext}
            disabled={currentBookId === 'iqra-6' && currentPage === maxPage}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-left text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IqraJsonReader;
