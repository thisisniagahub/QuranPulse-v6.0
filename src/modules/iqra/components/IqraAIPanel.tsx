/**
 * IqraAIPanel Component
 * 
 * Extracted from IqraInteractiveCoach for reusability
 * Provides AI-powered chat/question interface for Iqra module
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, BrainCircuit } from 'lucide-react';
import { askUstazAI } from '../../../services/aiService';

interface IqraAIPanelProps {
    isOpen: boolean;
    onClose: () => void;
    contextInfo?: string; // e.g., current letter being studied
}

export const IqraAIPanel: React.FC<IqraAIPanelProps> = ({
    isOpen,
    onClose,
    contextInfo = '',
}) => {
    const [userQuery, setUserQuery] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAskUstaz = async () => {
        if (!userQuery.trim()) return;

        setIsLoading(true);
        setChatResponse('');

        try {
            const response = await askUstazAI([
                {
                    id: 'sys',
                    role: 'system',
                    content: `Anda adalah Guru Iqra yang mesra. ${contextInfo ? `Soalan pelajar mengenai ${contextInfo}.` : 'Bantu pelajar belajar huruf hijaiyah.'}`,
                    timestamp: Date.now(),
                },
                {
                    id: 'usr',
                    role: 'user',
                    content: userQuery,
                    timestamp: Date.now(),
                },
            ]);
            setChatResponse(response);
        } catch (error) {
            console.error('AI Error:', error);
            setChatResponse('Maaf, Ustaz AI sedang sibuk. Sila cuba lagi sebentar.');
        } finally {
            setIsLoading(false);
            setUserQuery('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAskUstaz();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    className="fixed inset-x-0 bottom-28 p-8 z-50 pointer-events-none"
                >
                    <div className="max-w-2xl mx-auto glass-hud border-2 border-primary rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,1)] p-8 pointer-events-auto relative overflow-hidden hud-border">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-pattern opacity-[0.05] pointer-events-none" />

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center neon-glow-primary">
                                    <BrainCircuit size={20} className="text-primary" />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.3em] text-xs glow-text">
                                    USTAZ_AI Stream
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
                                aria-label="Close Chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-8 relative z-10">
                            {/* Response Display */}
                            <AnimatePresence mode="wait">
                                {chatResponse && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white/5 p-6 rounded-3xl border border-white/10 text-md font-medium text-slate-200 leading-relaxed italic backdrop-blur-md"
                                    >
                                        {chatResponse}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input Area */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Query neural network..."
                                    disabled={isLoading}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl text-sm p-5 focus:ring-2 focus:ring-primary outline-none text-white tracking-wide disabled:opacity-50"
                                />
                                <button
                                    onClick={handleAskUstaz}
                                    disabled={isLoading || !userQuery.trim()}
                                    className="bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50 disabled:hover:scale-100"
                                    aria-label="Send message"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <Send size={24} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IqraAIPanel;
