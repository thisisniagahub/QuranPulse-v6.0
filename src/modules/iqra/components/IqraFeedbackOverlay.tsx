/**
 * IqraFeedbackOverlay Component
 * 
 * Extracted from IqraInteractiveCoach for reusability
 * Shows success/error feedback after quiz answers
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-8 rounded-[3rem] border-l-[16px] glass-hud flex flex-col gap-6 shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${isCorrect ? 'border-emerald-500' : 'border-red-500'
                } hud-border`}
        >
            {/* Status Header */}
            <div className="flex items-center gap-6">
                <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        }`}
                >
                    {isCorrect ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
                </div>
                <div className="flex-1">
                    <h3
                        className={`text-2xl font-black uppercase tracking-tight ${isCorrect ? 'text-emerald-400 glow-text' : 'text-red-400 glow-text'
                            }`}
                    >
                        {isCorrect ? 'SYNCHRONIZED' : 'INTERFERENCE_DETECTED'}
                    </h3>
                    <p className="font-bold text-slate-300 text-md opacity-80 uppercase tracking-wider">
                        {isCorrect
                            ? 'Character identification successful.'
                            : 'Structural error detected in selection.'}
                    </p>
                </div>
            </div>

            {/* Diagnose Button (for incorrect answers) */}
            {!isCorrect && onDiagnose && (
                <button
                    onClick={onDiagnose}
                    disabled={diagnosing}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 rounded-2xl text-red-400 font-black text-xs uppercase tracking-[0.3em] border border-red-500/20 hover:bg-white/10 transition-all"
                >
                    {diagnosing ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <BrainCircuit size={16} />
                    )}
                    DIAGNOSE_MISTAKE
                </button>
            )}

            {/* Analysis Text */}
            <AnimatePresence>
                {analysisText && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-black/40 p-6 rounded-3xl border border-white/5 text-sm font-medium text-slate-400 leading-relaxed italic"
                    >
                        {analysisText}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Continue Button */}
            <button
                onClick={onNext}
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-md text-white transition-all shadow-2xl flex items-center justify-center gap-4 ${isCorrect
                        ? 'bg-emerald-600 shadow-emerald-900/40'
                        : 'bg-red-600 shadow-red-900/40'
                    } hover:brightness-110 active:translate-y-1 border border-white/10`}
            >
                CONTINUE_SESSION <ChevronRight size={24} />
            </button>
        </motion.div>
    );
};

export default IqraFeedbackOverlay;
