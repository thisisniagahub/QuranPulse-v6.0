/**
 * Iqra Authentic Reader Component
 * 100% EXACT replica of original Iqra book layout
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

interface IqraAuthenticReaderProps {
  bookId?: string;
  onClose?: () => void;
}

const BOOK_INFO = [
  { id: 'iqra-1', name: '1', key: 'Iqra_1', color: '#16a34a' },
  { id: 'iqra-2', name: '2', key: 'Iqra_2', color: '#eab308' },
  { id: 'iqra-3', name: '3', key: 'Iqra_3', color: '#f97316' },
  { id: 'iqra-4', name: '4', key: 'Iqra_4', color: '#3b82f6' },
  { id: 'iqra-5', name: '5', key: 'Iqra_5', color: '#8b5cf6' },
  { id: 'iqra-6', name: '6', key: 'Iqra_6', color: '#ec4899' },
];

export const IqraAuthenticReader: React.FC<IqraAuthenticReaderProps> = ({
  bookId = 'iqra-1',
  onClose
}) => {
  const [currentBookId, setCurrentBookId] = useState(bookId);
  const [pages, setPages] = useState<IqraPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
      const idx = BOOK_INFO.findIndex(b => b.id === currentBookId);
      if (idx > 0) {
        setCurrentBookId(BOOK_INFO[idx - 1].id);
      }
    }
  };

  // Parse content line to get left and right columns
  const parseContentLine = (line: string): { left: string; right: string } => {
    // Split by multiple spaces or tab-like separators
    const parts = line.split(/\s{3,}|\t/).filter(p => p.trim());
    if (parts.length >= 2) {
      return { left: parts[0].trim(), right: parts[1].trim() };
    }
    return { left: line.trim(), right: '' };
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-white rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-arabic">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-300" style={{ minHeight: '600px' }}>
      {/* Book Selector - Top Bar */}
      <div className="bg-gray-100 border-b-2 border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1">
          {BOOK_INFO.map((book) => (
            <button
              key={book.id}
              onClick={() => setCurrentBookId(book.id)}
              className={`w-10 h-10 rounded-full font-bold text-white text-lg transition-all shadow-md ${
                currentBookId === book.id ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: book.color }}
            >
              {book.name}
            </button>
          ))}
        </div>
        <div className="text-gray-600 font-bold">
          Muka {currentPage} / {maxPage}
        </div>
      </div>

      {/* Main Content Area - EXACT Iqra Layout */}
      <div className="flex-1 bg-white p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentBookId}-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {/* IQRA PAGE - Authentic Layout */}
            <div className="border-2 border-gray-400 bg-white" style={{ fontFamily: "'Amiri Quran', 'Traditional Arabic', serif" }}>
              
              {/* HEADER - Red background with lesson title */}
              <div 
                className="text-center py-4 border-b-2 border-gray-400"
                style={{ backgroundColor: '#dc2626' }}
              >
                {/* Parse first line as header content */}
                {currentPageData?.content?.[0] && (
                  <div className="text-white text-4xl font-bold leading-relaxed" dir="rtl">
                    {/* Show romanization labels above */}
                    <div className="text-sm font-normal mb-2 tracking-widest">
                      {currentPage === 1 ? (
                        <>
                          <span className="mr-8">BA</span>
                          <span>A</span>
                        </>
                      ) : null}
                    </div>
                    {/* Arabic text */}
                    <span className="text-5xl">{currentPageData.content[0]}</span>
                  </div>
                )}
              </div>

              {/* CONTENT ROWS - Table-like grid */}
              <div className="divide-y-2 divide-gray-300">
                {currentPageData?.content?.slice(1).map((line, idx) => {
                  const { left, right } = parseContentLine(line);
                  
                  return (
                    <div 
                      key={idx} 
                      className="grid grid-cols-2 divide-x-2 divide-gray-300"
                    >
                      {/* Right Column (RTL - appears on left visually but is first in reading order) */}
                      <div 
                        className="py-4 px-6 text-center text-3xl leading-relaxed"
                        dir="rtl"
                        style={{ fontFamily: "'Amiri Quran', 'Traditional Arabic', serif" }}
                      >
                        {right || '\u00A0'}
                      </div>
                      {/* Left Column */}
                      <div 
                        className="py-4 px-6 text-center text-3xl leading-relaxed"
                        dir="rtl"
                        style={{ fontFamily: "'Amiri Quran', 'Traditional Arabic', serif" }}
                      >
                        {left}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-100 border-t-2 border-gray-300 px-4 py-3 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={currentBookId === 'iqra-1' && currentPage === 1}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold disabled:opacity-30 hover:bg-gray-700 transition-colors"
        >
          ← Sebelum
        </button>
        
        <div className="text-center">
          <p className="font-bold text-lg text-gray-800">IQRA' {currentBookInfo.name}</p>
          {currentPageData?.title && (
            <p className="text-sm text-gray-600">{currentPageData.title}</p>
          )}
        </div>

        <button
          onClick={goNext}
          disabled={currentBookId === 'iqra-6' && currentPage === maxPage}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold disabled:opacity-30 hover:bg-green-700 transition-colors"
        >
          Seterusnya →
        </button>
      </div>
    </div>
  );
};

export default IqraAuthenticReader;
