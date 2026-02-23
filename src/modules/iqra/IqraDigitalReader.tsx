/**
 * 📖 Iqra' Digital Reader
 * The core reading interface for Iqra' pages
 * 
 * Features:
 * - High-readability Raudhah Ivory interface
 * - Interactive Arabic tiles with audio playback
 * - ASR integration for real-time verification
 * - Teaching tips and progress tracking
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Play, Award,
  Lightbulb, BookOpen, CheckCircle, RefreshCcw,
  MessageSquare, Volume2, Sparkles, Trophy
} from 'lucide-react';
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
    return (
      <div className="min-h-screen bg-raudhah-ivory flex items-center justify-center p-10 text-raudhah-teal font-black">
        Data untuk Jilid {volume} sedang dikemaskini.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-raudhah-ivory text-raudhah-ink flex flex-col font-sans transition-colors duration-500 overflow-hidden">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-raudhah-teal text-white p-2 rounded z-[100] font-black uppercase tracking-widest text-[10px]">
        Langkau ke kandungan utama
      </a>

      {/* Header */}
      <header className="h-16 border-b border-raudhah-teal/10 flex items-center justify-between px-4 glass-v7 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-raudhah-teal/5 rounded-2xl transition-all active:scale-95 group focus:outline-none focus:ring-2 focus:ring-raudhah-teal"
            aria-label="Kembali ke Menu Utama"
          >
            <ChevronLeft className="w-6 h-6 text-raudhah-teal group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="font-black text-raudhah-ink leading-none tracking-tight">{currentLesson.unitTitle}</h1>
            <div className="text-[10px] text-raudhah-teal/60 font-black flex items-center gap-2 mt-1 uppercase tracking-widest">
              <span className="bg-raudhah-teal/10 px-1.5 py-0.5 rounded border border-raudhah-teal/20" aria-label={`Iqra Jilid ${volume}`}>
                IQRA {volume}
              </span>
              <span>{currentLesson.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTips}
            className={`p-2 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-raudhah-teal ${showTips ? 'bg-raudhah-gold text-raudhah-ink shadow-warm' : 'hover:bg-raudhah-teal/5 text-raudhah-teal/40'}`}
            aria-label={showTips ? "Sembunyikan Tips" : "Lihat Tips Pengajar"}
            aria-pressed={showTips}
          >
            <Lightbulb className="w-5 h-5" />
          </button>
          <div className="px-3 py-1.5 glass-v7 border border-raudhah-teal/10 rounded-xl text-[10px] font-black text-raudhah-teal/60 uppercase tracking-widest" aria-label={`Muka Surat ${currentLesson.pageRef}`}>
            MS {currentLesson.pageRef}
          </div>
        </div>
      </header>

      {/* Main Content Area (With Swipe Handlers) */}
      <main
        id="main-content"
        className="flex-1 relative overflow-y-auto overflow-x-hidden focus:outline-none scroll-smooth no-scrollbar"
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
              className="absolute inset-0 z-40 bg-raudhah-ivory flex flex-col items-center justify-center p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="lesson-start-title"
            >
              <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-raudhah-teal to-emerald-700 shadow-warm mb-4">
                    <BookOpen className="w-10 h-10 text-white" aria-hidden="true" />
                  </div>
                  <h2 id="lesson-start-title" className="text-4xl font-black text-raudhah-ink tracking-tight uppercase">{currentLesson.title}</h2>
                  <p className="text-raudhah-teal/60 font-black uppercase tracking-widest text-xs">{currentLesson.unitTitle}</p>
                </div>

                <div className="glass-v7 border border-raudhah-teal/10 rounded-[2rem] p-8 shadow-warm">
                  <h3 className="text-[10px] font-black text-raudhah-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Award className="w-4 h-4" aria-hidden="true" />
                    Objektif Pembelajaran
                  </h3>
                  <ul className="space-y-4">
                    {currentLesson.objectives.map((obj) => (
                      <li key={obj.id} className="flex gap-4 text-sm text-raudhah-ink/70 font-medium">
                        <div className="w-2 h-2 rounded-full bg-raudhah-teal mt-1.5 shrink-0 shadow-glow" aria-hidden="true" />
                        <span>{obj.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={startLesson}
                  className="w-full py-5 bg-raudhah-teal hover:bg-raudhah-ink text-white font-black rounded-2xl transition-all transform active:scale-95 shadow-warm flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-raudhah-teal/50 animate-pulse touch-manipulation uppercase tracking-widest text-sm"
                  autoFocus
                >
                  <Play className="w-5 h-5 fill-current" aria-hidden="true" />
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
              className="absolute inset-0 z-[100] bg-raudhah-ink/20 backdrop-blur-md flex items-center justify-center p-6"
              role="alertdialog"
              aria-live="assertive"
            >
              <div className="bg-raudhah-ivory border border-raudhah-teal/10 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-raudhah-teal via-raudhah-gold to-raudhah-teal" />

                {showResult === 'success' ? (
                  <>
                    <div className="mx-auto w-24 h-24 bg-raudhah-teal/10 rounded-full flex items-center justify-center mb-8 relative">
                      <div className="absolute inset-0 bg-raudhah-teal/5 animate-ping rounded-full" />
                      <Trophy className="w-12 h-12 text-raudhah-teal" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-black text-raudhah-ink mb-2 tracking-tight uppercase">Tahniah!</h3>
                    <p className="text-raudhah-teal/60 font-medium mb-8">Bacaan anda menepati objektif pelajaran ini.</p>
                    <button
                      onClick={nextLesson}
                      className="w-full py-4 bg-raudhah-teal hover:bg-raudhah-ink text-white rounded-2xl font-black shadow-warm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-raudhah-teal touch-manipulation uppercase tracking-widest text-xs"
                      autoFocus
                    >
                      Teruskan
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-24 h-24 bg-raudhah-gold/10 rounded-full flex items-center justify-center mb-8 relative">
                      <RefreshCcw className="w-12 h-12 text-raudhah-gold" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-black text-raudhah-ink mb-2 tracking-tight uppercase">Cuba Lagi</h3>
                    <p className="text-raudhah-teal/60 font-medium mb-8">Sila perbaiki bacaan anda mengikut tips yang diberi.</p>
                    <button
                      onClick={resetResult}
                      className="w-full py-4 bg-raudhah-ink text-white rounded-2xl font-black shadow-warm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-raudhah-ink touch-manipulation uppercase tracking-widest text-xs"
                      autoFocus
                    >
                      Ulang Semula
                      <RefreshCcw className="w-4 h-4" />
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
              className="bg-raudhah-gold/10 border-b border-raudhah-gold/20 overflow-hidden"
              role="region"
              aria-label="Tips Pengajar"
            >
              <div className="p-6 max-w-3xl mx-auto flex gap-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-raudhah-gold rounded-2xl flex items-center justify-center shadow-warm">
                    <Lightbulb className="w-6 h-6 text-raudhah-ink" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-raudhah-ink text-xs uppercase tracking-widest mb-2">Tips Pengajar</h4>
                  <ul className="list-none space-y-2">
                    {currentLesson.teachingTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-raudhah-teal/80 font-medium flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-raudhah-gold mt-1 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* READER GRID */}
        <div className="max-w-3xl mx-auto p-4 md:p-8 pb-40">
          {/* Main Focus Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-24 h-24 bg-raudhah-teal/5 rounded-full blur-2xl -z-10" />
            <span className="text-[10px] font-black text-raudhah-gold uppercase tracking-[0.4em] mb-2 block">Focus Bacaan</span>
            <h2 className="text-6xl md:text-7xl font-arabic mb-2 text-raudhah-ink leading-tight drop-shadow-sm" aria-label={`Fokus bacaan: ${rawPageData.focus}`}>{rawPageData.focus}</h2>
            <div className="w-12 h-1 bg-raudhah-teal/20 mx-auto rounded-full mt-4" />
          </div>

          {/* Grid Content */}
          <div className="grid gap-6" role="list" dir="rtl">
            {rawPageData.grid.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-6" role="listitem">
                {/* Kanan */}
                <button
                  onClick={() => playRef(row.kanan)}
                  className="group relative glass-v7 hover:bg-white border border-raudhah-teal/10 hover:border-raudhah-gold active:scale-95 transition-all rounded-[2.5rem] p-6 flex items-center justify-center aspect-[2.2/1] cursor-pointer shadow-sm hover:shadow-warm focus:outline-none focus:ring-2 focus:ring-raudhah-gold touch-manipulation"
                  aria-label={`Bacaan Kanan: ${row.kanan}. Tekan untuk dengar.`}
                >
                  <span className="text-4xl md:text-5xl font-arabic text-raudhah-ink group-hover:text-raudhah-teal transition-colors" dir="rtl">{row.kanan}</span>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-xl bg-raudhah-teal/10 flex items-center justify-center text-raudhah-teal">
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Kiri */}
                <button
                  onClick={() => playRef(row.kiri)}
                  className="group relative glass-v7 hover:bg-white border border-raudhah-teal/10 hover:border-raudhah-gold active:scale-95 transition-all rounded-[2.5rem] p-6 flex items-center justify-center aspect-[2.2/1] cursor-pointer shadow-sm hover:shadow-warm focus:outline-none focus:ring-2 focus:ring-raudhah-gold touch-manipulation"
                  aria-label={`Bacaan Kiri: ${row.kiri}. Tekan untuk dengar.`}
                >
                  <span className="text-4xl md:text-5xl font-arabic text-raudhah-ink group-hover:text-raudhah-teal transition-colors" dir="rtl">{row.kiri}</span>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-xl bg-raudhah-teal/10 flex items-center justify-center text-raudhah-teal">
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Controls */}
      <footer className="h-28 pb-8 glass-v7 border-t border-raudhah-teal/10 flex items-center justify-between px-6 z-50 fixed bottom-0 left-0 right-0 shadow-[0_-8px_30px_rgba(27,107,90,0.05)]">
        <button
          onClick={prevLesson}
          disabled={isFirstLesson}
          className="flex flex-col items-center justify-center w-20 h-full gap-1.5 text-raudhah-teal/30 hover:text-raudhah-teal disabled:opacity-10 disabled:cursor-not-allowed transition-all active:scale-95 group"
          aria-label="Pelajaran Sebelumnya"
        >
          <div className="w-10 h-10 rounded-2xl bg-raudhah-teal/5 flex items-center justify-center group-hover:bg-raudhah-teal/10">
            <ChevronLeft className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Sebelum</span>
        </button>

        <div className="flex gap-4 items-center -mt-10">
          {/* Main Action Button (ASR) */}
          <div className="relative">
            <div className="absolute inset-0 bg-raudhah-teal/10 blur-2xl rounded-full scale-150 animate-pulse" />
            <ASRRecorder
              expectedText={rawPageData.focus}
              onResult={handleASRResult}
            />
          </div>
        </div>

        <button
          onClick={nextLesson}
          disabled={isLastLesson}
          className="flex flex-col items-center justify-center w-20 h-full gap-1.5 text-raudhah-teal hover:text-raudhah-ink disabled:opacity-10 disabled:cursor-not-allowed transition-all active:scale-95 group"
          aria-label="Pelajaran Seterusnya"
        >
          <div className="w-10 h-10 rounded-2xl bg-raudhah-teal/5 flex items-center justify-center group-hover:bg-raudhah-teal/10">
            <ChevronRight className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Seterusnya</span>
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
