/**
 * IqraAIPanel Component
 * 
 * Extracted from IqraInteractiveCoach for reusability
 * Provides AI-powered chat/question interface for Iqra module in Raudhah theme
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, BrainCircuit, Sparkles } from 'lucide-react';
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
                    className="fixed inset-x-0 bottom-28 p-4 md:p-8 z-50 pointer-events-none"
                >
                    <div className="max-w-2xl mx-auto bg-raudhah-ivory border-2 border-raudhah-teal rounded-[3.5rem] shadow-2xl p-8 md:p-10 pointer-events-auto relative overflow-hidden">
                        {/* Status bar top */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-raudhah-teal via-raudhah-gold to-raudhah-teal" />

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-raudhah-teal flex items-center justify-center shadow-warm">
                                    <BrainCircuit size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-raudhah-ink uppercase tracking-[0.2em] text-xs">
                                        Ustaz AI Stream
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-widest">Neural Link Active</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl glass-v7 text-raudhah-teal hover:bg-raudhah-teal/10 transition-all border border-raudhah-teal/10"
                                aria-label="Close Chat"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-8 relative z-10">
                            {/* Response Display */}
                            <AnimatePresence mode="wait">
                                {chatResponse ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-raudhah-teal/5 p-8 rounded-[2.5rem] border border-raudhah-teal/10 text-lg font-medium text-raudhah-ink leading-relaxed italic"
                                    >
                                        <div className="flex gap-2 mb-2">
                                            <Sparkles size={16} className="text-raudhah-gold" />
                                        </div>
                                        "{chatResponse}"
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            {/* Input Area */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Tanya ustaz sesuatu..."
                                    disabled={isLoading}
                                    className="flex-1 bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-2xl text-md p-5 focus:ring-4 focus:ring-raudhah-teal/10 outline-none text-raudhah-ink tracking-tight font-medium disabled:opacity-50"
                                />
                                <button
                                    onClick={handleAskUstaz}
                                    disabled={isLoading || !userQuery.trim()}
                                    className="bg-raudhah-teal text-white w-20 h-20 rounded-2xl flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all shadow-warm disabled:opacity-50 group"
                                    aria-label="Send message"
                                >
                                    {isLoading ? (
                                        <div className="inline-flex animate-spin">
                                            <Loader2 size={28} />
                                        </div>
                                    ) : (
                                        <Send size={28} className="group-hover:translate-x-1 transition-transform" />
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
