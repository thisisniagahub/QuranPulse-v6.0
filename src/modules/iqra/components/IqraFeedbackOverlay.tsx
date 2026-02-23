/**
 * IqraFeedbackOverlay Component
 * 
 * Extracted from IqraInteractiveCoach for reusability
 * Shows success/error feedback after quiz answers in Raudhah theme
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-presence';
import { CheckCircle2, AlertCircle, Loader2, BrainCircuit, ChevronRight } from 'lucide-react';

interface IqraFeedbackOverlayProps {
    isCorrect: boolean | null;
    onNext: () => void;
    onDiagnose?: () => void;
    diagnosing?: boolean;
    analysisText?: string;
}

export const IqraFeedbackOverlay: React.FC<IqraFeedbackOverlayProps> = ({
    isCorrect,
    onNext,
    onDiagnose,
    diagnosing = false,
    analysisText,
}) => {
    if (isCorrect === null) return null;

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`p-8 rounded-[3.5rem] border-l-[16px] bg-white flex flex-col gap-8 shadow-2xl relative overflow-hidden ${isCorrect ? 'border-raudhah-teal' : 'border-red-500'
                }`}
        >
            {/* Status Header */}
            <div className="flex items-center gap-8 relative z-10">
                <div
                    className={`shrink-0 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-warm ${isCorrect ? 'bg-raudhah-teal text-white' : 'bg-red-500 text-white'
                        }`}
                >
                    {isCorrect ? <CheckCircle2 size={42} /> : <AlertCircle size={42} />}
                </div>
                <div className="flex-1">
                    <h3
                        className={`text-3xl font-black uppercase tracking-tight ${isCorrect ? 'text-raudhah-teal' : 'text-red-500'
                            }`}
                    >
                        {isCorrect ? 'Tahniah!' : 'Cuba Lagi'}
                    </h3>
                    <p className="font-bold text-raudhah-teal/60 text-lg tracking-tight capitalize leading-tight">
                        {isCorrect
                            ? 'Bacaan anda sangat tepat dan lancar.'
                            : 'Terdapat perbezaan kecil dalam bacaan anda.'}
                    </p>
                </div>
            </div>

            {/* Diagnose Button (for incorrect answers) */}
            {!isCorrect && onDiagnose && (
                <button
                    onClick={onDiagnose}
                    disabled={diagnosing}
                    className="w-full flex items-center justify-center gap-4 py-6 bg-raudhah-teal/5 text-raudhah-teal rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-raudhah-teal/10 hover:bg-raudhah-teal/10 transition-all shadow-sm active:scale-95 group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {diagnosing ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <BrainCircuit size={20} className="relative z-10" />
                    )}
                    <span className="relative z-10">Analisis Kesalahan</span>
                </button>
            )}

            {/* Analysis Text */}
            <AnimatePresence>
                {analysisText && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-raudhah-gold/5 p-8 rounded-[2.5rem] border border-raudhah-gold/10 text-lg font-medium text-raudhah-ink/80 leading-relaxed italic"
                    >
                        "{analysisText}"
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Continue Button */}
            <button
                onClick={onNext}
                className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-md text-white transition-all shadow-warm flex items-center justify-center gap-4 border-b-[6px] active:border-b-0 active:translate-y-1.5 ${isCorrect
                        ? 'bg-raudhah-teal border-raudhah-ink'
                        : 'bg-raudhah-ink border-raudhah-teal'
                    }`}
            >
                {isCorrect ? 'Seterusnya' : 'Sebut Semula'} <ChevronRight size={28} />
            </button>
        </motion.div>
    );
};

export default IqraFeedbackOverlay;
