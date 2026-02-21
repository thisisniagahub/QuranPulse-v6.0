/**
 * 🎓 Iqra to Quran Transition
 * Celebration and guidance when user completes Iqra 6 and is ready for Quran
 * 
 * Features:
 * - Digital "Konvokesyen" ceremony
 * - Achievement unlocks
 * - Juz Amma recommendation
 * - Personalized reading plan
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award, BookOpen, Star, ChevronRight, Play,
    Sparkles, Target, Calendar, Trophy
} from 'lucide-react';

interface IqraGraduationProps {
    userName: string;
    iqraLevel: number;
    completionDate: string;
    onStartQuran: () => void;
    onClose: () => void;
    isOpen: boolean;
}

const RECOMMENDED_SURAHS = [
    { number: 1, name: 'Al-Fatiha', nameAr: 'الفاتحة', verses: 7, level: 'Beginner' },
    { number: 112, name: 'Al-Ikhlas', nameAr: 'الإخلاص', verses: 4, level: 'Beginner' },
    { number: 113, name: 'Al-Falaq', nameAr: 'الفلق', verses: 5, level: 'Beginner' },
    { number: 114, name: 'An-Nas', nameAr: 'الناس', verses: 6, level: 'Beginner' },
    { number: 110, name: 'An-Nasr', nameAr: 'النصر', verses: 3, level: 'Easy' },
    { number: 108, name: 'Al-Kauthar', nameAr: 'الكوثر', verses: 3, level: 'Easy' },
];

const IqraGraduation: React.FC<IqraGraduationProps> = ({
    userName,
    iqraLevel,
    completionDate,
    onStartQuran,
    onClose,
    isOpen
}) => {
    const [showCeremony, setShowCeremony] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<'gentle' | 'moderate' | 'intensive'>('gentle');

    // Trigger confetti on open
    useEffect(() => {
        if (!(isOpen && showCeremony)) return;

        let cancelled = false;

        const runConfetti = async () => {
            if (typeof window === 'undefined') return;

            try {
                const { default: confetti } = await import('canvas-confetti');
                if (cancelled) return;

                const duration = 3000;
                const end = Date.now() + duration;

                const frame = () => {
                    if (cancelled) return;

                    confetti({
                        particleCount: 3,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#06b6d4', '#8b5cf6', '#f59e0b'],
                    });
                    confetti({
                        particleCount: 3,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#06b6d4', '#8b5cf6', '#f59e0b'],
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                };

                frame();
            } catch {
                // Ignore animation failures
            }
        };

        void runConfetti();

        return () => {
            cancelled = true;
        };
    }, [isOpen, showCeremony]);

    const readingPlans = {
        gentle: { pages: 1, days: 604, label: '1 muka/hari', description: 'Santai & konsisten' },
        moderate: { pages: 2, days: 302, label: '2 muka/hari', description: 'Seimbang' },
        intensive: { pages: 4, days: 151, label: '4 muka/hari', description: 'Intensif' },
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                >
                    {/* Ceremony View */}
                    <AnimatePresence mode="wait">
                        {showCeremony ? (
                            <motion.div
                                key="ceremony"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="relative rounded-3xl overflow-hidden"
                            >
                                {/* Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                                {/* Decorative Stars */}
                                <div className="absolute inset-0 overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                            }}
                                            animate={{
                                                opacity: [0.2, 1, 0.2],
                                                scale: [1, 1.5, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: Math.random() * 2,
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="relative p-8 text-center">
                                    {/* Trophy */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', duration: 1 }}
                                        className="mb-6"
                                    >
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 
                                   rounded-full flex items-center justify-center shadow-2xl
                                   shadow-yellow-500/30 relative">
                                            <Trophy className="w-12 h-12 text-white" />
                                            <div className="absolute -inset-2 rounded-full border-2 border-yellow-400/50 animate-ping" />
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl font-bold text-white mb-2"
                                    >
                                        Tahniah, {userName}! 🎉
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-lg text-purple-300 mb-6"
                                    >
                                        Anda telah menamatkan Iqra' Level {iqraLevel}
                                    </motion.p>

                                    {/* Certificate */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="bg-gradient-to-br from-amber-100 to-yellow-200 
                             text-slate-800 rounded-xl p-6 mb-6 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/50 rounded-full blur-3xl" />
                                        <div className="relative">
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <Star className="w-5 h-5 text-amber-600" />
                                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                                                    Sijil Digital
                                                </span>
                                                <Star className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <h2 className="text-xl font-arabic mb-2">شهادة إتمام القراءة</h2>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Dengan ini diakui bahawa <span className="font-bold">{userName}</span> telah
                                                berjaya menamatkan kursus Iqra' dengan cemerlang.
                                            </p>
                                            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                                                <span>📅 {new Date(completionDate).toLocaleDateString('ms-MY')}</span>
                                                <span>🏆 Level {iqraLevel}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Achievement Unlocked */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 }}
                                        className="bg-gradient-to-r from-raudhah-teal/20 to-purple-500/20 
                             border border-raudhah-teal/20 rounded-xl p-4 mb-6"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-raudhah-teal to-purple-500 
                                     rounded-xl flex items-center justify-center">
                                                <BookOpen className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-raudhah-teal uppercase tracking-wider">Unlocked</p>
                                                <p className="text-white font-semibold">Al-Quran Full Access</p>
                                                <p className="text-xs text-slate-400">114 Surah • 604 Pages</p>
                                            </div>
                                            <Sparkles className="w-6 h-6 text-yellow-400 ml-auto" />
                                        </div>
                                    </motion.div>

                                    {/* Continue Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.1 }}
                                        onClick={() => setShowCeremony(false)}
                                        className="w-full py-4 bg-gradient-to-r from-raudhah-teal to-purple-500 
                             rounded-xl text-white font-semibold text-lg
                             hover:shadow-lg hover:shadow-cyan-500/25 transition-all
                             flex items-center justify-center gap-2"
                                    >
                                        Mulakan Perjalanan Al-Quran
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            /* Reading Plan Selection */
                            <motion.div
                                key="plan"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-white mb-2">Mulakan dari mana?</h2>
                                    <p className="text-sm text-slate-400 mb-6">
                                        Kami cadangkan bermula dengan surah-surah pendek di Juz Amma
                                    </p>

                                    {/* Recommended Surahs */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-raudhah-teal mb-3 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            Surah Dicadangkan
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {RECOMMENDED_SURAHS.map((surah) => (
                                                <button
                                                    key={surah.number}
                                                    onClick={onStartQuran}
                                                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl 
                                   text-left transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-arabic text-white">
                                                            {surah.nameAr}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-slate-500 
                                                    group-hover:text-raudhah-teal transition-colors" />
                                                    </div>
                                                    <p className="text-xs text-slate-400">{surah.name} • {surah.verses} ayat</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reading Plan */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Pilih Pelan Bacaan
                                        </h3>
                                        <div className="space-y-2">
                                            {(Object.keys(readingPlans) as Array<keyof typeof readingPlans>).map((plan) => (
                                                <button
                                                    key={plan}
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className={`w-full p-4 rounded-xl text-left transition-all ${selectedPlan === plan
                                                            ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50'
                                                            : 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-white">{readingPlans[plan].label}</p>
                                                            <p className="text-xs text-slate-400">{readingPlans[plan].description}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-raudhah-teal">~{readingPlans[plan].days} hari</p>
                                                            <p className="text-xs text-slate-500">untuk khatam</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 
                               rounded-xl text-slate-300 transition-colors"
                                        >
                                            Nanti Dulu
                                        </button>
                                        <button
                                            onClick={onStartQuran}
                                            className="flex-1 py-3 bg-gradient-to-r from-raudhah-teal to-purple-500 
                               rounded-xl text-white font-semibold
                               hover:shadow-lg hover:shadow-cyan-500/25 transition-all
                               flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Mula Sekarang
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IqraGraduation;
