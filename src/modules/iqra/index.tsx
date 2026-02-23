import React, { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Trophy, ChevronRight, Lock, Gamepad2, Mic, GraduationCap, Sparkles } from 'lucide-react';

const IqraDigitalReader = lazy(() => import('./IqraDigitalReader'));
const IqraGameEngine = lazy(() => import('./game/IqraGameEngine'));
const KafaDashboard = lazy(() => import('./kafa/KafaDashboard'));
import IqraHub from './IqraHub';

const IqraModule = () => {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [mode, setMode] = useState<'MENU' | 'GAME'>('MENU');
  const [activeTab, setActiveTab] = useState<'iqra' | 'kafa'>('iqra');



  if (selectedVolume) {
    return (
      <Suspense
        fallback={
          <div className="h-full min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-raudhah-teal border-t-transparent rounded-full" />
          </div>
        }
      >
        <IqraDigitalReader volume={selectedVolume} initialPage={selectedPage} onBack={() => setSelectedVolume(null)} />
      </Suspense>
    );
  }

  if (mode === 'GAME') {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 bg-black">
          <button onClick={() => setMode('MENU')} className="text-white">Back to Menu</button>
        </div>
        <Suspense
          fallback={
            <div className="h-full min-h-[50vh] flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-raudhah-teal border-t-transparent rounded-full" />
            </div>
          }
        >
          <IqraGameEngine />
        </Suspense>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-midnight-gradient pb-24 font-sans text-white relative">
      {/* Global Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-pattern-dots-raudhah z-0"></div>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/20 to-[#050505] z-10" />
        <img loading="lazy"
          src="/assets/iqra/iqra-hero.png"
          alt="Iqra Learning"
          className="w-full h-full object-cover opacity-50"
          onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070'}
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 z-20">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-raudhah-teal font-mono text-xs tracking-widest uppercase mb-2 block flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Pusat Pembelajaran
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              {activeTab === 'iqra' ? 'IQRA DIGITAL' : 'AKADEMI KAFA'}
            </h1>
            <p className="text-slate-400 max-w-sm">
              {activeTab === 'iqra'
                ? "Mula perjalanan anda membaca Al-Quran dengan kaedah yang sistematik dan bantuan AI."
                : "Kuasai subjek UPKK dan fardu ain dengan modul interaktif yang menyeronokkan."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats & Actions */}
      <div className="px-6 -mt-8 relative z-30 mb-8 space-y-4">
        {/* Stats (Glass Card) */}
        <div className="bg-[#0c224b]/60 border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)] border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Tahap Semasa</p>
              <p className="text-lg font-black text-white leading-tight">Level 1</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-raudhah-teal/10 flex items-center justify-center text-raudhah-teal shadow-[0_0_10px_rgba(34,211,238,0.2)] border border-raudhah-teal/20">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Bintang</p>
              <p className="text-lg font-black text-white leading-tight">0/120</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Floating Capsule) */}
        <div className="bg-[#031a38]/80 p-1.5 rounded-2xl border border-white/10 flex relative shadow-md backdrop-blur-sm">
          <motion.div
            className="absolute top-1.5 bottom-1.5 bg-teal-600 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] z-0"
            initial={false}
            animate={{
              left: activeTab === 'iqra' ? '6px' : '50%',
              right: activeTab === 'iqra' ? '50%' : '6px',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button
            onClick={() => setActiveTab('iqra')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider relative z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'iqra' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" />
            Modul Iqra
          </button>
          <button
            onClick={() => setActiveTab('kafa')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider relative z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'kafa' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <GraduationCap className="w-4 h-4" />
            Akademi KAFA
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'iqra' ? (
          <motion.div
            key="iqra-grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <IqraHub
              onSelectPage={(vol, page) => {
                setSelectedVolume(vol);
                setSelectedPage(page);
              }}
              onStartGame={() => setMode('GAME')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="kafa-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="h-full min-h-[50vh] flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-raudhah-teal border-t-transparent rounded-full" />
                </div>
              }
            >
              <KafaDashboard onSelectSubject={() => { }} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IqraModule;
