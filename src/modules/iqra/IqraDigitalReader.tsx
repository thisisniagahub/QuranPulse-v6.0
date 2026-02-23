import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Award, Lightbulb, BookOpen, CheckCircle, RefreshCcw, MessageSquare, Volume2 } from 'lucide-react';
import { useIqraSession } from './hooks/useIqraSession';
import ASRRecorder from './components/ASRRecorder';
import LessonFeedback from './components/LessonFeedback';

interface IqraDigitalReaderProps {
  volume: number;
  initialPage?: number;
  onBack: () => void;
}

const IqraDigitalReader: React.FC<IqraDigitalReaderProps> = ({ volume, initialPage = 0, onBack }) => {
  const {
    currentLesson,
    rawPageData,
    lessonStarted,
    showTips,
    showResult,
    aiFeedback,
    isFirstLesson,
    isLastLesson,
    nextLesson,
    prevLesson,
    toggleTips,
    startLesson,
    resetResult,
    evaluatePerformance,
    playRef
  } = useIqraSession(volume, initialPage);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Swipe Logic Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft && !isLastLesson) {
      nextLesson();
    }
    if (isSwipeRight && !isFirstLesson) {
      prevLesson();
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleASRResult = (text: string, confidence: number, feedback?: string) => {
    evaluatePerformance(confidence, feedback);
  };


  if (!currentLesson || !rawPageData) {
    return <div className="text-white p-10">Data untuk Jilid {volume} sedang dikemaskini.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-raudhah-teal text-black p-2 rounded z-[100]">
        Langkau ke kandungan utama
      </a>

      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-raudhah-teal"
            aria-label="Kembali ke Menu Utama"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{currentLesson.unitTitle}</h1>
            <div className="text-xs text-raudhah-teal flex items-center gap-2">
              <span className="bg-teal-900/50 px-2 py-0.5 rounded text-[10px] border border-teal-800" aria-label={`Iqra Jilid ${volume}`}>
                IQRA {volume}
              </span>
              <span>{currentLesson.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTips}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-raudhah-teal ${showTips ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/10 text-slate-400'}`}
            aria-label={showTips ? "Sembunyikan Tips" : "Lihat Tips Pengajar"}
            aria-pressed={showTips}
          >
            <Lightbulb className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono" aria-label={`Muka Surat ${currentLesson.pageRef}`}>
            Pg {currentLesson.pageRef}
          </div>
        </div>
      </header>

      {/* Main Content Area (With Swipe Handlers) */}
      <main
        id="main-content"
        className="flex-1 relative overflow-y-auto overflow-x-hidden focus:outline-none scroll-smooth"
        tabIndex={-1}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

        {/* LESSON START OVERLAY */}
        <AnimatePresence>
          {!lessonStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="lesson-start-title"
            >
              <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-raudhah-teal to-emerald-700 shadow-lg shadow-teal-500/20 mb-4">
                    <BookOpen className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h2 id="lesson-start-title" className="text-3xl font-bold">{currentLesson.title}</h2>
                  <p className="text-slate-400">{currentLesson.unitTitle}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-raudhah-teal uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" aria-hidden="true" />
                    Objektif Pembelajaran
                  </h3>
                  <ul className="space-y-3">
                    {currentLesson.objectives.map((obj) => (
                      <li key={obj.id} className="flex gap-3 text-sm text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-raudhah-teal mt-2 shrink-0" aria-hidden="true" />
                        <span>{obj.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={startLesson}
                  className="w-full py-4 bg-raudhah-teal hover:bg-raudhah-teal text-black font-bold rounded-xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-raudhah-teal/50 animate-pulse touch-manipulation"
                  autoFocus
                >
                  <Play className="w-5 h-5" fill="currentColor" aria-hidden="true" />
                  MULA BELAJAR
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT OVERLAY */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
              role="alertdialog"
              aria-live="assertive"
            >
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                {showResult === 'success' ? (
                  <>
                    <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Tahniah!</h3>
                    <p className="text-slate-400 mb-6">Bacaan anda menepati objektif pelajaran ini.</p>
                    <button
                      onClick={nextLesson}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-400 touch-manipulation"
                      autoFocus
                    >
                      Teruskan
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                      <RefreshCcw className="w-10 h-10 text-red-500" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Cuba Lagi</h3>
                    <p className="text-slate-400 mb-6">Sila perbaiki bacaan anda mengikut tips yang diberi.</p>
                    <button
                      onClick={resetResult}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-white touch-manipulation"
                      autoFocus
                    >
                      Ulang Semula
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Teaching Tips Panel */}
        <AnimatePresence>
          {showTips && lessonStarted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-900/20 border-b border-amber-500/20 overflow-hidden"
              role="region"
              aria-label="Tips Pengajar"
            >
              <div className="p-4 max-w-3xl mx-auto flex gap-4">
                <div className="shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-400 text-sm mb-1">Tips Pengajar</h4>
                  <ul className="list-disc list-inside text-sm text-amber-200/80 space-y-1">
                    {currentLesson.teachingTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* READER GRID */}
        <div className="max-w-3xl mx-auto p-4 md:p-8 pb-32">
          {/* Main Focus Header */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-arabic mb-2 text-white leading-tight" aria-label={`Fokus bacaan: ${rawPageData.focus}`}>{rawPageData.focus}</h2>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest" aria-hidden="true">FOKUS BACAAN</p>
          </div>

          {/* Grid Content */}
          <div className="grid gap-4" role="list" dir="rtl">
            {rawPageData.grid.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4" role="listitem">
                {/* Kanan (First in RTL flow = visually on the Right) */}
                <button
                  onClick={() => playRef(row.kanan)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-raudhah-teal/50 active:bg-white/20 transition-all rounded-2xl p-4 md:p-6 flex items-center justify-center aspect-[2.5/1] cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-raudhah-teal focus:bg-white/10 touch-manipulation"
                  aria-label={`Bacaan Kanan: ${row.kanan}. Tekan untuk dengar.`}
                >
                  <span className="text-3xl md:text-4xl font-arabic select-none pointer-events-none" dir="rtl">{row.kanan}</span>
                  <div className="absolute inset-0 bg-raudhah-teal/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                  {/* Audio Indicator */}
                  <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Volume2 className="w-4 h-4 text-raudhah-teal" />
                  </div>
                </button>

                {/* Kiri (Second in RTL flow = visually on the Left) */}
                <button
                  onClick={() => playRef(row.kiri)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-raudhah-teal/50 active:bg-white/20 transition-all rounded-2xl p-4 md:p-6 flex items-center justify-center aspect-[2.5/1] cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-raudhah-teal focus:bg-white/10 touch-manipulation"
                  aria-label={`Bacaan Kiri: ${row.kiri}. Tekan untuk dengar.`}
                >
                  <span className="text-3xl md:text-4xl font-arabic select-none pointer-events-none" dir="rtl">{row.kiri}</span>
                  <div className="absolute inset-0 bg-raudhah-teal/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                  {/* Audio Indicator */}
                  <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Volume2 className="w-4 h-4 text-raudhah-teal" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Controls */}
      <footer className="h-24 pb-4 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-between px-4 md:px-6 z-50 fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-opacity-95">
        <button
          onClick={prevLesson}
          disabled={isFirstLesson}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none active:scale-95"
          aria-label="Pelajaran Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Prev</span>
        </button>

        <div className="flex gap-4 items-center -mt-6">
          {/* Main Action Button (ASR) */}
          <ASRRecorder
            expectedText={rawPageData.focus}
            onResult={handleASRResult}
          />
        </div>

        <button
          onClick={nextLesson}
          disabled={isLastLesson}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 text-raudhah-teal hover:text-raudhah-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none active:scale-95"
          aria-label="Pelajaran Seterusnya"
        >
          <ChevronRight className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Next</span>
        </button>
      </footer>

      <LessonFeedback
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        lessonTitle={`${currentLesson.unitTitle}: ${currentLesson.title}`}
      />
    </div>
  );
};

export default IqraDigitalReader;
