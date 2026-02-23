import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, RotateCcw } from 'lucide-react';
import { TAWAF_DOA, DOA_RABBANA_ATINA, NIAT_TAWAF } from '../data/tawafDoa';
import { SAI_DOA, DOA_SAFA, NIAT_SAI } from '../data/saiDoa';

type Mode = 'tawaf' | 'sai';

const MutawwifAudio: React.FC = () => {
    const [mode, setMode] = useState<Mode>('tawaf');
    const [currentRound, setCurrentRound] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showNiat, setShowNiat] = useState(true);

    const totalRounds = 7;
    const currentDoa = mode === 'tawaf' ? TAWAF_DOA[currentRound - 1] : SAI_DOA[currentRound - 1];
    const niat = mode === 'tawaf' ? NIAT_TAWAF : NIAT_SAI;

    const handleNext = () => {
        if (currentRound < totalRounds) {
            setCurrentRound(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentRound > 1) {
            setCurrentRound(prev => prev - 1);
        }
    };

    const handleReset = () => {
        setCurrentRound(1);
        setShowNiat(true);
        setIsPlaying(false);
    };

    const handleModeSwitch = (newMode: Mode) => {
        setMode(newMode);
        setCurrentRound(1);
        setShowNiat(true);
        setIsPlaying(false);
    };

    return (
        <div className="space-y-4">
            {/* Mode Selector */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
                <button
                    onClick={() => handleModeSwitch('tawaf')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'tawaf'
                        ? 'bg-raudhah-teal text-black'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    🕋 Tawaf
                </button>
                <button
                    onClick={() => handleModeSwitch('sai')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'sai'
                        ? 'bg-raudhah-teal text-black'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    🏃 Sa'i
                </button>
            </div>

            {/* Niat Section */}
            <AnimatePresence>
                {showNiat && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-amber-400 font-semibold">📿 Niat {mode === 'tawaf' ? 'Tawaf' : "Sa'i"}</h4>
                            <button
                                onClick={() => setShowNiat(false)}
                                className="text-xs text-slate-400 hover:text-white"
                            >
                                Tutup
                            </button>
                        </div>
                        <p className="text-xl text-white font-arabic text-right leading-relaxed mb-2">
                            {niat.arabic}
                        </p>
                        <p className="text-sm text-slate-300">{niat.malay}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Round Progress */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalRounds }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentRound(i + 1)}
                        aria-label={`Pergi ke pusingan ${i + 1}`}
                        className={`flex-1 h-2 rounded-full transition-all ${i + 1 === currentRound
                            ? 'bg-raudhah-teal shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                            : i + 1 < currentRound
                                ? 'bg-teal-600'
                                : 'bg-slate-700'
                            }`}
                    />
                ))}
            </div>

            {/* Current Round Display */}
            <div className="text-center">
                <span className="text-5xl font-bold text-raudhah-teal">{currentRound}</span>
                <span className="text-2xl text-slate-400">/{totalRounds}</span>
                <p className="text-sm text-slate-400 mt-1">
                    {mode === 'tawaf' ? 'Pusingan' : `Dari ${SAI_DOA[currentRound - 1]?.from?.toUpperCase()} ke ${SAI_DOA[currentRound - 1]?.to?.toUpperCase()}`}
                </p>
            </div>

            {/* Doa Display */}
            <motion.div
                key={`${mode}-${currentRound}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
            >
                <p className="text-2xl text-white font-arabic text-right leading-loose mb-4">
                    {currentDoa?.doaAr}
                </p>
                <hr className="border-slate-700 my-3" />
                <p className="text-slate-300 leading-relaxed">
                    {currentDoa?.doaMy}
                </p>
            </motion.div>

            {/* Special Doa - Rabbana Atina (for Tawaf) */}
            {mode === 'tawaf' && (
                <div className="bg-gradient-to-br from-emerald-500/20 to-pink-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <h4 className="text-emerald-400 font-semibold mb-2">
                        🔮 Doa Antara Rukun Yamani & Hajar Aswad
                    </h4>
                    <p className="text-lg text-white font-arabic text-right leading-relaxed mb-2">
                        {DOA_RABBANA_ATINA.arabic}
                    </p>
                    <p className="text-sm text-slate-300">{DOA_RABBANA_ATINA.malay}</p>
                </div>
            )}

            {/* Special Doa - Safa (for Sa'i) */}
            {mode === 'sai' && (
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                    <h4 className="text-green-400 font-semibold mb-2">
                        ⛰️ Doa di Bukit Safa
                    </h4>
                    <p className="text-lg text-white font-arabic text-right leading-relaxed mb-2">
                        {DOA_SAFA.arabic}
                    </p>
                    <p className="text-sm text-slate-300">{DOA_SAFA.malay}</p>
                </div>
            )}

            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
                <button
                    onClick={handlePrev}
                    disabled={currentRound === 1}
                    className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Pusingan sebelumnya"
                >
                    <SkipBack size={20} />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 rounded-full bg-gradient-to-r from-raudhah-teal to-blue-500 text-black shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
                >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentRound === totalRounds}
                    className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Pusingan seterusnya"
                >
                    <SkipForward size={20} />
                </button>

                <button
                    onClick={handleReset}
                    className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all"
                    aria-label="Mula semula"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Hands-Free Mode Hint */}
            <div className="text-center py-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-500">
                    💡 <span className="text-raudhah-teal">Mod Hands-Free:</span> Pakai earphone, simpan telefon dalam poket, dan fokus pada Kaabah
                </p>
            </div>
        </div>
    );
};

export default MutawwifAudio;
