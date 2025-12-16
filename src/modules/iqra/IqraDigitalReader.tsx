import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IqraDigitalBook {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  description: string;
  pages: number;
}

interface Syllabus {
  title: string;
  titleMalay: string;
  notice: string;
  noticeMalay: string;
  books: IqraDigitalBook[];
}

interface IqraDigitalReaderProps {
  onClose?: () => void;
}

const IqraDigitalReader: React.FC<IqraDigitalReaderProps> = ({ onClose }) => {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [currentBook, setCurrentBook] = useState<string>('iqra-1');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load syllabus on mount
  useEffect(() => {
    fetch('/iqra-digital/syllabus.json')
      .then(res => res.json())
      .then(data => {
        setSyllabus(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load syllabus:', err);
        setIsLoading(false);
      });
  }, []);

  // Load SVG page
  useEffect(() => {
    const pageNum = String(currentPage).padStart(2, '0');
    fetch(`/iqra-digital/${currentBook}/page-${pageNum}.svg`)
      .then(res => res.text())
      .then(svg => setSvgContent(svg))
      .catch(err => {
        console.error('Failed to load page:', err);
        setSvgContent('');
      });
  }, [currentBook, currentPage]);

  const currentBookData = syllabus?.books.find(b => b.id === currentBook);
  const maxPages = currentBookData?.pages || 1;

  const nextPage = () => {
    if (currentPage < maxPages) {
      setCurrentPage(p => p + 1);
    } else {
      // Move to next book
      const bookIndex = syllabus?.books.findIndex(b => b.id === currentBook) || 0;
      if (bookIndex < (syllabus?.books.length || 0) - 1) {
        setCurrentBook(syllabus!.books[bookIndex + 1].id);
        setCurrentPage(1);
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    } else {
      // Move to previous book
      const bookIndex = syllabus?.books.findIndex(b => b.id === currentBook) || 0;
      if (bookIndex > 0) {
        const prevBook = syllabus!.books[bookIndex - 1];
        setCurrentBook(prevBook.id);
        setCurrentPage(prevBook.pages);
      }
    }
  };

  // Touch swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
    setTouchStart(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-2xl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-arabic text-lg">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-xl">
      {/* Compact Mobile Header */}
      <div className="bg-white border-b border-slate-100 px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Title - Hidden on small screens, compact on medium */}
          <div className="hidden sm:block flex-shrink-0">
            <h1 className="font-arabic text-lg md:text-xl text-slate-900 leading-tight">{syllabus?.title}</h1>
          </div>
          
          {/* Book Selector - Full width on mobile */}
          <div className="flex items-center gap-1 flex-1 sm:flex-initial justify-center sm:justify-end overflow-x-auto no-scrollbar">
            {syllabus?.books.map(book => (
              <button
                key={book.id}
                onClick={() => { setCurrentBook(book.id); setCurrentPage(1); }}
                className={`min-w-[36px] h-9 md:min-w-[44px] md:h-10 px-2 md:px-3 rounded-lg font-bold text-sm md:text-base transition-all flex-shrink-0 ${
                  currentBook === book.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300'
                }`}
              >
                {book.level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Viewer - Mobile Optimized */}
      <div 
        className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-slate-50"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentBook}-${currentPage}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl overflow-hidden w-full h-full flex items-center justify-center"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          >
            <div 
              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compact Mobile Navigation Footer */}
      <div className="bg-white border-t border-slate-100 px-3 py-2 md:px-6 md:py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Prev Button */}
          <button
            onClick={prevPage}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center transition-colors disabled:opacity-30"
            disabled={currentBook === 'iqra-1' && currentPage === 1}
          >
            <i className="fa-solid fa-chevron-right text-slate-600 text-sm md:text-base"></i>
          </button>

          {/* Center Info */}
          <div className="text-center flex-1 px-2">
            <p className="font-arabic text-lg md:text-xl text-slate-900 leading-tight">{currentBookData?.title}</p>
            <p className="text-xs md:text-sm text-slate-400 font-arabic">
              {currentPage} / {maxPages}
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={nextPage}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center transition-colors disabled:opacity-30"
            disabled={currentBook === 'iqra-6' && currentPage === maxPages}
          >
            <i className="fa-solid fa-chevron-left text-slate-600 text-sm md:text-base"></i>
          </button>
        </div>
      </div>

      {/* Minimal Shariah Notice - Mobile */}
      <div className="bg-slate-50 px-2 py-1.5 md:py-2 text-center border-t border-slate-100">
        <p className="text-[10px] md:text-xs text-slate-400 truncate">{syllabus?.noticeMalay}</p>
      </div>
    </div>
  );
};

export default IqraDigitalReader;
