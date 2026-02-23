import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Vibrate, Target, Footprints, ArrowRight } from 'lucide-react';
import { TAWAF_DOA, DOA_RABBANA_ATINA } from '../data/tawafDoa';

const TawafTracker: React.FC = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [stepCount, setStepCount] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [distanceKm, setDistanceKm] = useState(0);
    const [isNearRukunYamani, setIsNearRukunYamani] = useState(false);
    const [hapticEnabled, setHapticEnabled] = useState(true);

    // Average steps per tawaf round (approx 450-500 steps for 400m)
    const STEPS_PER_ROUND = 480;
    const STEP_LENGTH_M = 0.75; // Average step length in meters

    // Simulate step detection (in real app, use DeviceMotion API)
    useEffect(() => {
        if (!isTracking) return;

        const interval = setInterval(() => {
            setStepCount(prev => {
                const newCount = prev + 1;

                // Check if completed a round
                if (newCount >= STEPS_PER_ROUND) {
                    handleRoundComplete();
                    return 0;
                }

                // Check if near Rukun Yamani (about 75-90% of round)
                const progress = newCount / STEPS_PER_ROUND;
                if (progress >= 0.75 && progress < 0.9 && !isNearRukunYamani) {
                    setIsNearRukunYamani(true);
                    triggerHaptic('rukunYamani');
                } else if (progress >= 0.9) {
                    setIsNearRukunYamani(false);
                }

                return newCount;
            });

            setTotalSteps(prev => prev + 1);
            setDistanceKm(prev => prev + (STEP_LENGTH_M / 1000));
        }, 1000); // 1 step per second for demo

        return () => clearInterval(interval);
    }, [isTracking, isNearRukunYamani]);

    const handleRoundComplete = useCallback(() => {
        setCurrentRound(prev => {
            const newRound = prev + 1;
            if (newRound <= 7) {
                triggerHaptic('roundComplete', newRound);
                // Could trigger audio here
            }
            if (newRound >= 7) {
                setIsTracking(false);
                triggerHaptic('tawafComplete');
            }
            return Math.min(newRound, 7);
        });
    }, []);

    const triggerHaptic = (type: 'roundComplete' | 'rukunYamani' | 'tawafComplete', round?: number) => {
        if (!hapticEnabled) return;

        if ('vibrate' in navigator) {
            switch (type) {
                case 'roundComplete':
                    // Vibrate pattern: round number of short pulses
                    const pattern = Array.from({ length: round || 1 }, () => [100, 50]).flat();
                    navigator.vibrate(pattern);
                    break;
                case 'rukunYamani':
                    navigator.vibrate([200, 100, 200]); // Double pulse
                    break;
                case 'tawafComplete':
                    navigator.vibrate([300, 100, 300, 100, 500]); // Celebration pattern
                    break;
            }
        }
    };

    const resetTracker = () => {
        setIsTracking(false);
        setCurrentRound(0);
        setStepCount(0);
        setTotalSteps(0);
        setDistanceKm(0);
        setIsNearRukunYamani(false);
    };

    const progress = (stepCount / STEPS_PER_ROUND) * 100;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-raudhah-teal/20 to-blue-500/20">
                        <Target className="text-raudhah-teal" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Tawaf Tracker</h3>
                        <p className="text-xs text-slate-400">Kira pusingan automatik</p>
                    </div>
                </div>
                <button
                    onClick={() => setHapticEnabled(!hapticEnabled)}
                    className={`p-2 rounded-lg transition-all ${hapticEnabled
                        ? 'bg-raudhah-teal/10 text-raudhah-teal'
                        : 'bg-slate-800 text-slate-500'
                        }`}
                    title={hapticEnabled ? 'Haptic On' : 'Haptic Off'}
                >
                    <Vibrate size={18} />
                </button>
            </div>

            {/* Tawaf Progress Visual */}
            <div className="relative flex items-center justify-center py-8">
                {/* Kaabah Representation */}
                <div className="relative w-40 h-40">
                    {/* Tawaf Rings */}
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute inset-0 rounded-full border-2 ${i < currentRound
                                ? 'border-raudhah-teal'
                                : i === currentRound
                                    ? 'border-raudhah-teal'
                                    : 'border-slate-700'
                                }`}
                            style={{
                                transform: `scale(${1 + i * 0.15})`,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: i <= currentRound ? 1 : 0.3 }}
                        />
                    ))}

                    {/* Kaabah Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-lg border-2 border-amber-500/50 flex items-center justify-center">
                            <span className="text-3xl">🕋</span>
                        </div>
                    </div>

                    {/* Moving Dot (Pilgrim Position) */}
                    {isTracking && currentRound < 7 && (
                        <motion.div
                            className="absolute w-4 h-4 bg-raudhah-teal rounded-full shadow-lg shadow-teal-400/50"
                            style={{
                                top: '50%',
                                left: '50%',
                            }}
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <div className="absolute -top-6 -left-6 w-16 h-16 flex items-center justify-center">
                                <div className="w-3 h-3 bg-raudhah-teal rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Round Counter */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full transition-all ${i < currentRound
                                ? 'bg-raudhah-teal'
                                : i === currentRound
                                    ? 'bg-raudhah-teal animate-pulse'
                                    : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-raudhah-teal">{currentRound}</p>
                    <p className="text-xs text-slate-500">Pusingan</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-white">{totalSteps}</p>
                    <p className="text-xs text-slate-500">Langkah</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-amber-400">{distanceKm.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">km</p>
                </div>
            </div>

            {/* Current Round Progress */}
            {isTracking && currentRound < 7 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Pusingan {currentRound + 1}</span>
                        <span className="text-raudhah-teal">{stepCount}/{STEPS_PER_ROUND} langkah</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-raudhah-teal to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Rukun Yamani Alert */}
            {isNearRukunYamani && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-emerald-500/20 to-pink-500/10 border border-emerald-500/50 rounded-xl"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="text-emerald-400" size={18} />
                        <p className="text-emerald-400 font-semibold">Hampir di Rukun Yamani!</p>
                    </div>
                    <p className="text-lg text-white font-arabic text-right">
                        {DOA_RABBANA_ATINA.arabic}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{DOA_RABBANA_ATINA.malay}</p>
                </motion.div>
            )}

            {/* Current Doa */}
            {isTracking && currentRound < 7 && !isNearRukunYamani && TAWAF_DOA[currentRound] && (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-xs text-raudhah-teal mb-2">Doa Pusingan {currentRound + 1}:</p>
                    <p className="text-lg text-white font-arabic text-right leading-relaxed">
                        {TAWAF_DOA[currentRound].doaAr}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">{TAWAF_DOA[currentRound].doaMy}</p>
                </div>
            )}

            {/* Completion Message */}
            {currentRound >= 7 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-br from-raudhah-teal/20 to-green-500/10 border border-green-500/50 rounded-xl text-center"
                >
                    <span className="text-5xl">🎉</span>
                    <h4 className="text-xl font-bold text-green-400 mt-2">Tawaf Selesai!</h4>
                    <p className="text-slate-300 mt-1">Alhamdulillah. Teruskan ke Solat Sunat Tawaf.</p>
                </motion.div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
                <button
                    onClick={() => setIsTracking(!isTracking)}
                    disabled={currentRound >= 7}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${isTracking
                        ? 'bg-amber-500 text-black'
                        : 'bg-gradient-to-r from-raudhah-teal to-blue-500 text-black'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isTracking ? (
                        <>
                            <Pause size={18} />
                            Pause
                        </>
                    ) : (
                        <>
                            <Play size={18} className="ml-1" />
                            {currentRound === 0 ? 'Mula Tawaf' : 'Sambung'}
                        </>
                    )}
                </button>
                <button
                    onClick={resetTracker}
                    className="p-3 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                    aria-label="Set semula Tawaf"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Haptic Guide */}
            <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-500 text-center">
                    <Vibrate size={12} className="inline mr-1" />
                    Telefon akan bergetar mengikut pusingan (1x untuk pusingan 1, 2x untuk pusingan 2...)
                </p>
            </div>
        </div>
    );
};

export default TawafTracker;
