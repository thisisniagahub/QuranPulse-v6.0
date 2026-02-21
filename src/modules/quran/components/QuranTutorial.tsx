import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuranTutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

const TUTORIAL_STEPS = [
    {
        id: 'WELCOME',
        title: "Selamat Datang ke QuranPulse v6.0",
        desc: "Aplikasi peneman Al-Quran masa depan anda. Mari kita lihat ciri-ciri menarik yang disediakan.",
        icon: "🌌",
        image: null
    },
    {
        id: 'SETTINGS',
        title: "Tetapan Paparan",
        desc: "Klik ikon ⚙️ untuk ubah saiz tulisan, tema warna, dan mod bacaan (Tadabbur/Iqra/Nahu).",
        icon: "⚙️",
        highlight: "settings-btn"
    },
    {
        id: 'AUDIO',
        title: "Audio & Terjemahan",
        desc: "Kini anda boleh dengar terjemahan dibacakan (AI Voice). Buka tab 'Audio' dalam tetapan untuk kawalan penuh.",
        icon: "🎧",
        highlight: "audio-feature"
    },
    {
        id: 'STUDIO',
        title: "Ustaz AI & Tafsir",
        desc: "Klik mana-mana ayat untuk buka 'Verse Studio'. Anda boleh tanya soalan terus kepada Ustaz AI.",
        icon: "🤖",
        highlight: "studio-feature"
    },
    {
        id: 'READY',
        title: "Sedia Untuk Bermula?",
        desc: "Semoga mendapat barakah dan ilmu yang bermanfaat. Selamat membaca!",
        icon: "✨",
        image: null
    }
];

const QuranTutorial: React.FC<QuranTutorialProps> = ({ isOpen, onClose }) => {
    const [stepIndex, setStepIndex] = useState(0);

    if (!isOpen) return null;

    const currentStep = TUTORIAL_STEPS[stepIndex];
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === TUTORIAL_STEPS.length - 1;

    const handleNext = () => {
        if (isLast) {
            onClose();
        } else {
            setStepIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirst) setStepIndex(prev => prev - 1);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Content Card */}
            <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full max-w-sm bg-slate-900 border border-raudhah-teal/20 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-raudhah-teal/10 blur-3xl rounded-full pointer-events-none" />

                <div className="p-6 text-center">
                    {/* Icon/Image */}
                    <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-5 shadow-inner border border-slate-700">
                        {currentStep.icon}
                    </div>

                    {/* Text */}
                    <h2 className="text-xl font-bold text-white mb-2">{currentStep.title}</h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        {currentStep.desc}
                    </p>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-1.5 mb-6">
                        {TUTORIAL_STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === stepIndex ? 'bg-raudhah-teal w-5' : 'bg-slate-700'}`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        {!isFirst && (
                            <button
                                onClick={handlePrev}
                                className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors text-xs font-bold"
                            >
                                Kembali
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`flex-1 py-2.5 rounded-lg bg-raudhah-teal text-black text-xs font-bold hover:bg-raudhah-teal transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]`}
                        >
                            {isLast ? "Mula Membaca 🚀" : "Seterusnya"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default QuranTutorial;
