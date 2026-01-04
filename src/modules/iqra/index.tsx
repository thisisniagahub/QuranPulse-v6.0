import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Trophy, ChevronRight, Lock, Gamepad2, Mic } from 'lucide-react';
import IqraDigitalReader from './IqraDigitalReader';
import IqraGameEngine from './game/IqraGameEngine';

const IqraModule = () => {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [mode, setMode] = useState<'MENU' | 'GAME'>('MENU');

  const iqraBooks = [
    { id: 1, title: 'Iqra 1', subtitle: 'Pengenalan Huruf', color: 'from-emerald-500 to-teal-600', locked: false },
    { id: 2, title: 'Iqra 2', subtitle: 'Sambungan Huruf', color: 'from-blue-500 to-cyan-600', locked: false },
    { id: 3, title: 'Iqra 3', subtitle: 'Bacaan Mad', color: 'from-indigo-500 to-purple-600', locked: false },
    { id: 4, title: 'Iqra 4', subtitle: 'Baris & Tanwin', color: 'from-pink-500 to-rose-600', locked: false },
    { id: 5, title: 'Iqra 5', subtitle: 'Qalqalah & Waqaf', color: 'from-orange-500 to-amber-600', locked: false },
    { id: 6, title: 'Iqra 6', subtitle: 'Tajwid Lanjutan', color: 'from-red-500 to-crimson-600', locked: false },
  ];

  if (selectedVolume) {
    return <IqraDigitalReader volume={selectedVolume} onBack={() => setSelectedVolume(null)} />;
  }

  if (mode === 'GAME') {
    return (
        <div className="h-screen flex flex-col">
            <div className="p-4 bg-black">
                <button onClick={() => setMode('MENU')} className="text-white">Back to Menu</button>
            </div>
            <IqraGameEngine />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24 font-sans text-white">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-[#050505] z-10" />
        <img 
          src="/assets/iqra/iqra-hero.png" 
          alt="Iqra Learning" 
          className="w-full h-full object-cover opacity-50"
          onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070'} 
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2 block">Pusat Pembelajaran</span>
            <h1 className="text-4xl font-bold text-white mb-2">IQRA DIGITAL</h1>
            <p className="text-slate-400 max-w-sm">
              Mula perjalanan anda membaca Al-Quran dengan kaedah yang sistematik dan bantuan AI.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats & Actions */}
      <div className="px-6 -mt-8 relative z-30 mb-8 space-y-4">
        {/* Stats */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tahap Semasa</p>
              <p className="font-bold text-white">Iqra 1</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Bintang</p>
              <p className="font-bold text-white">0/120</p>
            </div>
          </div>
        </div>

        {/* Extra Modes */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => setMode('GAME')}
                className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Gamepad2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="font-bold text-sm">Mini Games</p>
                    <p className="text-xs text-slate-500">Uji Minda</p>
                </div>
            </button>
            <button className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <Mic className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="font-bold text-sm">Voice Coach</p>
                    <p className="text-xs text-slate-500">Coming Soon</p>
                </div>
            </button>
        </div>
      </div>

      {/* Book Grid */}
      <div className="px-6">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Pilih Jilid
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {iqraBooks.map((book, index) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !book.locked && setSelectedVolume(book.id)}
              className={`relative overflow-hidden rounded-2xl p-6 text-left group transition-all ${book.locked ? 'opacity-50 grayscale' : 'hover:scale-[1.02]'}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${book.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-white/20 transition-colors" />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{book.title}</h3>
                  <p className="text-slate-400 text-sm">{book.subtitle}</p>
                </div>
                {book.locked ? (
                  <Lock className="w-5 h-5 text-slate-500" />
                ) : (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${book.color} flex items-center justify-center shadow-lg`}>
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Progress Bar (Mock) */}
              {!book.locked && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progres</span>
                    <span>0%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-0" />
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IqraModule;