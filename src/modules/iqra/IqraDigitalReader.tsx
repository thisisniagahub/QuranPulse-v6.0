import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Award, Lightbulb, BookOpen, CheckCircle, RefreshCcw } from 'lucide-react';
import { useIqraSession } from './hooks/useIqraSession';
import ASRRecorder from './components/ASRRecorder';

interface IqraDigitalReaderProps {
  volume: number;
  onBack: () => void;
}

const IqraDigitalReader: React.FC<IqraDigitalReaderProps> = ({ volume, onBack }) => {
  const {
    currentLesson,
    rawPageData,
    lessonStarted,
    showTips,
    showResult,
    isFirstLesson,
    isLastLesson,
    nextLesson,
    prevLesson,
    toggleTips,
    startLesson,
    resetResult,
    evaluatePerformance
  } = useIqraSession(volume);

  const handleASRResult = (text: string, confidence: number) => {
    evaluatePerformance(confidence);
  };

  if (!currentLesson || !rawPageData) {
    return <div className="text-white p-10">Data untuk Jilid {volume} sedang dikemaskini.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{currentLesson.unitTitle}</h1>
            <div className="text-xs text-cyan-400 flex items-center gap-2">
              <span className="bg-cyan-900/50 px-2 py-0.5 rounded text-[10px] border border-cyan-800">
                IQRA {volume}
              </span>
              <span>{currentLesson.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={toggleTips}
            className={`p-2 rounded-full transition-colors ${showTips ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/10 text-slate-400'}`}
          >
            <Lightbulb className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono">
             Pg {currentLesson.pageRef}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        
        {/* LESSON START OVERLAY */}
        <AnimatePresence>
          {!lessonStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center p-6"
            >
              <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">{currentLesson.title}</h2>
                  <p className="text-slate-400">{currentLesson.unitTitle}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Objektif Pembelajaran
                  </h3>
                  <ul className="space-y-3">
                    {currentLesson.objectives.map((obj) => (
                      <li key={obj.id} className="flex gap-3 text-sm text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                        <span>{obj.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={startLesson}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
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
            >
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                {showResult === 'success' ? (
                  <>
                    <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Tahniah!</h3>
                    <p className="text-slate-400 mb-6">Bacaan anda menepati objektif pelajaran ini.</p>
                    <button 
                      onClick={nextLesson}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold"
                    >
                      Teruskan
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                      <RefreshCcw className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Cuba Lagi</h3>
                    <p className="text-slate-400 mb-6">Sila perbaiki bacaan anda mengikut tips yang diberi.</p>
                    <button 
                      onClick={resetResult}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold"
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
            >
              <div className="p-4 max-w-3xl mx-auto flex gap-4">
                <div className="shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
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
            <h2 className="text-5xl font-arabic mb-2 text-white">{rawPageData.focus}</h2>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">FOKUS BACAAN</p>
          </div>

          {/* Grid Content */}
          <div className="grid gap-4">
            {rawPageData.grid.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4">
                {/* Kanan */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/50 transition-all rounded-xl p-6 flex items-center justify-center aspect-[3/1] cursor-pointer group relative">
                   <span className="text-3xl md:text-4xl font-arabic">{row.kanan}</span>
                   <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                </div>
                
                {/* Kiri */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/50 transition-all rounded-xl p-6 flex items-center justify-center aspect-[3/1] cursor-pointer group relative">
                   <span className="text-3xl md:text-4xl font-arabic">{row.kiri}</span>
                   <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="h-20 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 z-50">
        <button 
          onClick={prevLesson}
          disabled={isFirstLesson}
          className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden md:inline font-medium">Sebelumnya</span>
        </button>

        <div className="flex gap-4">
            <ASRRecorder 
                expectedText={rawPageData.focus}
                onResult={handleASRResult}
            />
        </div>

        <button 
          onClick={nextLesson}
          disabled={isLastLesson}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden md:inline font-medium">Seterusnya</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default IqraDigitalReader;