import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import UstazAvatar from './UstazAvatar';
import NeuralTyping from './NeuralTyping';
import SuggestionChips from './SuggestionChips';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import KhatamPlanner from './components/KhatamPlanner';
import { PERSONAS, PersonaKey } from '../../constants/personas';
import { PrayerTimesAction } from './components/PrayerTimesAction';
import { AIWidgetRenderer, cleanAIResponse } from '../../components/ai/AIWidgetRenderer';
import { askUstazAI } from '../../services/aiService';
import { ChatMessage } from '../../types';

interface SmartDeenProps {
    userName?: string;
    hasBottomNav?: boolean;
}

const SmartDeen: React.FC<SmartDeenProps> = ({ userName, hasBottomNav = false }) => {
    const { user } = useAuth();
    const displayName = userName || user?.name || "Sahabat";
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');

    // Real Implementation
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('AZHAR');
    const switchPersona = (p: PersonaKey) => setSelectedPersona(p);

    const sendMessage = async (text: string) => {
        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now()
        };

        const newHistory = [...messages, newUserMsg];
        setMessages(newHistory);
        setIsThinking(true);

        try {
            // Call Real AI Service
            // Passing the full history ensures context is maintained
            const responseText = await askUstazAI(newHistory, undefined, selectedPersona);

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Ustaz AI Error:", error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Maaf, sistem sedang sibuk. Sila cuba sebentar lagi.",
                timestamp: Date.now(),
                isError: true
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    }; const [input, setInput] = useState('');

    // Refs
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Audio
    const { isListening, startListening, stopListening, error: speechError, isSupported } = useSpeechRecognition({
        onResult: ({ transcript }) => setInput(transcript),
        lang: 'ms-MY'
    });

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-midnight-gradient overflow-hidden">
            {/* Ambient Background (Deep Navy) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#0A1E42] rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/patterns/cyber-islamic-grid.svg')] bg-[size:60px_60px]"></div>
            </div>

            {/* Register Generative UI Actions */}
            <PrayerTimesAction />

            {/* Header / Persona Selector */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-[#0A1E42]/80 backdrop-blur-md z-10 relative shadow-lg shadow-cyan-900/10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <UstazAvatar persona={selectedPersona} isThinking={isThinking} />
                        {isThinking && <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse"></div>}
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm tracking-wide drop-shadow-md">{PERSONAS[selectedPersona].name}</h2>
                        <div className="flex items-center gap-2">
                            <span className={`flex h-2 w-2 relative`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isThinking ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isThinking ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                            </span>
                            <p className="text-[10px] text-cyan-200/70 font-mono uppercase tracking-wider">{PERSONAS[selectedPersona].role}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1 bg-[#020617]/50 p-1 rounded-xl border border-white/10">
                    {(Object.keys(PERSONAS) as PersonaKey[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => switchPersona(p)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${selectedPersona === p ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {p === 'AZHAR' ? '👳🏻‍♂️' : p === 'AISHAH' ? '🧕🏻' : '🧢'}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CHAT TAB --- */}
            {activeTab === 'CHAT' && (
                <>
                    <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 space-y-4 ${hasBottomNav ? 'pb-32' : 'pb-24'} scroll-smooth relative z-10`}>
                        <div className="text-center py-4">
                            <p className="text-[10px] text-cyan-500/50 uppercase tracking-[0.2em] font-bold">Hari Ini</p>
                        </div>

                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-cyan-600 border border-cyan-400' : 'bg-[#0f1e38] border border-white/10'}`}>
                                            {msg.role === 'user' ? '😎' : (msg.role === 'assistant' && selectedPersona === 'AZHAR' ? '👳🏻‍♂️' : selectedPersona === 'AISHAH' ? '🧕🏻' : '🧢')}
                                        </div>
                                        <div className={`rounded-3xl p-4 text-sm leading-relaxed shadow-xl backdrop-blur-md ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-none border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                            : 'bg-[#0f1e38]/80 text-custom-light-blue border border-cyan-500/10 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                                            }`}>
                                            {/* Render Clean Text */}
                                            {cleanAIResponse(msg.content)}

                                            {/* Compliance: Report Button */}
                                            {msg.role === 'assistant' && (
                                                <div className="mt-2 pt-2 border-t border-white/5 flex justify-end">
                                                    <button
                                                        className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                                                        title="Lapor jawapan tidak tepat"
                                                        onClick={() => alert("Laporan dihantar.")}
                                                    >
                                                        <i className="fa-regular fa-flag"></i> Lapor
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Render Generative UI Widget (Only for assistant) */}
                                    {msg.role === 'assistant' && (
                                        <div className="w-full max-w-[85%] pl-11">
                                            <AIWidgetRenderer content={msg.content} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isThinking && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0f1e38] border border-white/10 flex items-center justify-center text-xs animate-spin-slow">⏳</div>
                                <div className="bg-[#0f1e38]/80 p-3 rounded-2xl rounded-bl-none border border-cyan-500/20">
                                    <NeuralTyping />
                                </div>
                            </motion.div>
                        )}

                        {/* Suggestion Chips */}
                        {messages.length < 3 && !isThinking && (
                            <SuggestionChips onSelect={(text) => setInput(text)} />
                        )}
                    </div>

                    <div className={`absolute inset-x-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent z-20 ${hasBottomNav ? 'bottom-[80px]' : 'bottom-0'}`}>
                        {/* JAKIM Disclaimer */}
                        <div className="text-[9px] text-slate-500 text-center mb-3 italic opacity-60">
                            "Ustaz AI adalah alat bantuan pembelajaran. Untuk hukum syarak muktamad, rujuk asatizah bertauliah."
                        </div>

                        {/* Speech Error */}
                        {speechError && (
                            <div className="mb-2 p-2 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center backdrop-blur-sm">
                                <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                                {speechError}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className={`flex gap-2 items-end bg-[#0f1e38]/90 p-2 rounded-2xl border transition-all backdrop-blur-xl shadow-2xl ${isThinking ? 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'}`}>
                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={!isSupported}
                                title={!isSupported ? 'Browser tidak menyokong pengecaman suara' : isListening ? 'Henti' : 'Tekan untuk bercakap'}
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${!isSupported
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : isListening
                                        ? 'bg-red-500/80 animate-pulse text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                                        : 'hover:bg-cyan-900/30 text-cyan-400 hover:text-cyan-300'
                                    }`}
                            >
                                <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                            </button>

                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tanya ustaz apa sahaja..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 resize-none py-2 max-h-32 text-sm font-medium"
                                rows={1}
                            />

                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${input.trim() && !isThinking ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'}`}
                            >
                                <i className="fa-solid fa-paper-plane transform translate-x-px translate-y-px"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* --- OTHER TABS --- */}
            {activeTab === 'PLANNER' && <KhatamPlanner />}
            {activeTab === 'JAWI' && <div className="p-10 text-center text-slate-500">Modul Jawi sedang dikemaskini...</div>}
        </div>
    );
};

export default SmartDeen;