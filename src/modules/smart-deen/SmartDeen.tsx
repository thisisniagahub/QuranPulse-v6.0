/**
 * 🤖 Smart Deen (Ustaz AI)
 * The premium AI spiritual companion in Raudhah theme
 * 
 * Features:
 * - Raudhah Ivory/Teal interface
 * - Persona switching (Azhar, Aishah, Zak)
 * - Real-time AI chat with voice support
 * - Generative UI widget integration
 * - Compass and khatam planner integration
 */

import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, Mic, MicOff, AlertTriangle, Flag,
    Sparkles, BrainCircuit, User, Loader2,
    MessageSquare, ChevronRight, Bookmark, ArrowLeft
} from 'lucide-react';
import UstazahAvatar from './UstazahAvatar';
import NeuralTyping from './NeuralTyping';
import SuggestionChips from './SuggestionChips';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { PERSONAS, PersonaKey } from '../../constants/personas';
import { PrayerTimesAction } from './components/PrayerTimesAction';
import { AIWidgetRenderer, cleanAIResponse } from '../../components/ai/AIWidgetRenderer';
import { askUstazAI } from '../../services/aiService';
import { ChatMessage } from '../../types';

const KhatamPlanner = lazy(() => import('./components/KhatamPlanner'));

interface SmartDeenProps {
    userName?: string;
    hasBottomNav?: boolean;
    onBack?: () => void;
}

const SmartDeen: React.FC<SmartDeenProps> = ({ userName, hasBottomNav = false, onBack }) => {
    const { user } = useAuth();
    const displayName = userName || user?.name || "Sahabat";
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');

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
    };

    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { isListening, startListening, stopListening, error: speechError, isSupported } = useSpeechRecognition({
        onResult: ({ transcript }) => setInput(transcript),
        lang: 'ms-MY'
    });

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

    const getPersonaEmoji = (p: PersonaKey) => {
        switch (p) {
            case 'AZHAR': return '👳🏻‍♂️';
            case 'AISHAH': return '🧕🏻';
            case 'ZAK': return '🧢';
            default: return '🤖';
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-raudhah-ivory overflow-hidden transition-colors duration-500">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-raudhah-teal/10 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-raudhah-gold/5 rounded-full blur-[100px] opacity-60 animate-pulse delay-1000"></div>
                <div className="absolute inset-0 opacity-20 bg-pattern-dots-raudhah"></div>
            </div>

            {/* Generative UI Actions */}
            <PrayerTimesAction />

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-raudhah-teal/10 glass-v7 z-20 relative shadow-sm">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-raudhah-teal/5 rounded-2xl transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 text-raudhah-teal" />
                        </button>
                    )}
                    <div className="relative">
                        <UstazahAvatar persona={selectedPersona} isThinking={isThinking} />
                        {isThinking && <div className="absolute -inset-1 rounded-full border-2 border-raudhah-gold animate-pulse"></div>}
                    </div>
                    <div>
                        <h2 className="text-raudhah-ink font-black text-sm tracking-tight leading-none mb-1 uppercase">{PERSONAS[selectedPersona].name}</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className={`flex h-1.5 w-1.5 relative`}>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isThinking ? 'bg-raudhah-gold' : 'bg-emerald-500'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isThinking ? 'bg-raudhah-gold' : 'bg-emerald-500'}`}></span>
                                </span>
                            </div>
                            <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-widest">{PERSONAS[selectedPersona].role}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 p-1.5 glass-v7 rounded-2xl border border-raudhah-teal/10 shadow-sm">
                    {(Object.keys(PERSONAS) as PersonaKey[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => switchPersona(p)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95 ${selectedPersona === p ? 'bg-raudhah-teal/10 text-raudhah-teal shadow-inner border border-raudhah-teal/20' : 'text-raudhah-teal/20 hover:text-raudhah-teal hover:bg-white'}`}
                            title={PERSONAS[p].name}
                        >
                            {getPersonaEmoji(p)}
                        </button>
                    ))}
                </div>
            </header>

            {/* --- CHAT TAB --- */}
            {activeTab === 'CHAT' && (
                <>
                    <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 ${hasBottomNav ? 'pb-36' : 'pb-28'} scroll-smooth relative z-10 no-scrollbar`}>
                        {/* Chat Background Watermark */}
                        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                            <BrainCircuit className="w-64 h-64 text-raudhah-teal opacity-[0.03]" />
                        </div>

                        <div className="text-center py-4 relative z-10">
                            <span className="text-[10px] text-raudhah-teal/40 uppercase tracking-[0.4em] font-black bg-raudhah-teal/5 px-4 py-1.5 rounded-full border border-raudhah-teal/10 shadow-sm">Masej Baru</span>
                        </div>

                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id || idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex flex-col gap-3 relative z-10 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs flex-shrink-0 shadow-sm border border-raudhah-teal/10 glass-v7 ${msg.role === 'user' ? 'bg-raudhah-teal text-white' : 'bg-white text-raudhah-ink'}`}>
                                            {msg.role === 'user' ? <User size={18} /> : getPersonaEmoji(selectedPersona)}
                                        </div>
                                        <div className={`rounded-3xl p-5 text-sm md:text-base leading-relaxed shadow-sm backdrop-blur-md border transition-all ${msg.role === 'user'
                                            ? 'bg-raudhah-teal text-white rounded-tr-none border-raudhah-ink/10'
                                            : 'bg-white text-raudhah-ink rounded-tl-none border-raudhah-teal/10'
                                            }`}>
                                            {/* Render Clean Text */}
                                            <div className="font-medium">
                                                {cleanAIResponse(msg.content)}
                                            </div>

                                            {/* Action Bar */}
                                            {msg.role === 'assistant' && (
                                                <div className="mt-4 pt-3 border-t border-raudhah-teal/5 flex justify-between items-center">
                                                    <div className="flex gap-4">
                                                        <button className="text-[10px] text-raudhah-teal/40 hover:text-raudhah-teal flex items-center gap-1 transition-colors uppercase font-black tracking-widest">
                                                            <Bookmark size={12} /> Simpan
                                                        </button>
                                                        <button className="text-[10px] text-raudhah-teal/40 hover:text-raudhah-teal flex items-center gap-1 transition-colors uppercase font-black tracking-widest">
                                                            <Sparkles size={12} /> Kupas
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="text-[10px] text-raudhah-teal/20 hover:text-raudhah-red/60 flex items-center gap-1 transition-colors uppercase font-black tracking-widest"
                                                        title="Lapor jawapan tidak tepat"
                                                        onClick={() => alert("Laporan telah dihantar untuk semakan compliance.")}
                                                    >
                                                        <Flag size={10} /> Lapor
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Render Generative UI Widget */}
                                    {msg.role === 'assistant' && (
                                        <div className="w-full max-w-[85%] pl-14">
                                            <AIWidgetRenderer content={msg.content} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isThinking && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white border border-raudhah-teal/10 flex items-center justify-center shadow-sm">
                                    <Loader2 className="animate-spin text-raudhah-teal" size={20} />
                                </div>
                                <div className="bg-white/80 p-5 rounded-3xl rounded-tl-none border border-raudhah-teal/10 shadow-sm backdrop-blur-md min-w-[120px]">
                                    <NeuralTyping />
                                </div>
                            </motion.div>
                        )}

                        {/* Suggestion Chips */}
                        {messages.length < 3 && !isThinking && (
                            <div className="pt-4">
                                <SuggestionChips onSelect={(text) => setInput(text)} />
                            </div>
                        )}
                    </div>

                    {/* Input Container */}
                    <div className={`fixed inset-x-0 p-6 md:p-8 bg-gradient-to-t from-raudhah-ivory via-raudhah-ivory to-transparent z-30 transition-all ${hasBottomNav ? 'bottom-[80px]' : 'bottom-0'}`}>
                        {/* JAKIM / Compliance Disclaimer */}
                        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-raudhah-gold/5 border border-raudhah-gold/10 rounded-2xl shadow-sm">
                            <AlertTriangle size={12} className="text-raudhah-gold" />
                            <p className="text-[9px] text-raudhah-ink/60 text-center font-bold tracking-tight">
                                "Ustaz AI adalah alat bantuan pembelajaran. Konsultasi hukum syarak muktamad wajib dirujuk kepada asatizah bertauliah."
                            </p>
                        </div>

                        {/* Speech Error */}
                        <AnimatePresence>
                            {speechError && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    className="max-w-4xl mx-auto mb-4 p-3 bg-raudhah-red/10 border border-raudhah-red/20 rounded-2xl text-raudhah-red text-xs text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <AlertTriangle size={14} /> {speechError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input Area */}
                        <div className={`max-w-4xl mx-auto flex gap-4 items-end bg-white p-3 rounded-[2.5rem] border-2 transition-all shadow-xl ${isThinking ? 'border-raudhah-gold shadow-raudhah-gold/5' : 'border-raudhah-teal/10 shadow-raudhah-teal/5 focus-within:border-raudhah-teal'}`}>
                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={!isSupported}
                                title={!isSupported ? 'Browser tidak menyokong ASR' : isListening ? 'Henti' : 'Tekan & Sebut'}
                                className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${!isSupported
                                    ? 'bg-raudhah-teal/5 text-raudhah-teal/20 cursor-not-allowed'
                                    : isListening
                                        ? 'bg-raudhah-red animate-pulse text-white shadow-lg'
                                        : 'bg-raudhah-teal/5 hover:bg-raudhah-teal/10 text-raudhah-teal'
                                    }`}
                            >
                                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>

                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tanya Ustaz apa sahaja..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-raudhah-ink placeholder-raudhah-teal/20 resize-none py-3 max-h-32 text-base font-medium no-scrollbar"
                                rows={1}
                            />

                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all shadow-warm border-b-4 active:border-b-0 active:translate-y-1 ${input.trim() && !isThinking ? 'bg-raudhah-teal text-white border-raudhah-ink' : 'bg-raudhah-teal/5 text-raudhah-teal/20 border-raudhah-teal/10 cursor-not-allowed'}`}
                                title="Hantar Mesej"
                            >
                                <Send size={24} className={input.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* --- SCANNER / JAWI / PLANNER TABS --- */}
            {activeTab === 'PLANNER' && (
                <main className="flex-1 overflow-y-auto no-scrollbar p-6 relative z-10">
                    <Suspense
                        fallback={
                            <div className="h-full flex flex-col items-center justify-center p-10 space-y-4">
                                <Loader2 className="animate-spin text-raudhah-teal" size={32} />
                                <p className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-widest text-center">Menghitung Strategi Khatam...</p>
                            </div>
                        }
                    >
                        <div className="max-w-2xl mx-auto py-8">
                            <KhatamPlanner />
                        </div>
                    </Suspense>
                </main>
            )}

            {activeTab === 'JAWI' && (
                <main className="flex-1 flex flex-col items-center justify-center p-10 space-y-6 text-center animate-pulse">
                    <div className="w-24 h-24 bg-raudhah-teal/5 rounded-[2.5rem] flex items-center justify-center border border-raudhah-teal/10">
                        <MessageSquare className="w-12 h-12 text-raudhah-teal/20" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-raudhah-ink uppercase tracking-tight">Modul Pintar</h3>
                        <p className="text-raudhah-teal/40 font-bold italic">Sedang dalam proses penyelarasan visual Raudhah.</p>
                    </div>
                </main>
            )}
        </div>
    );
};

export default SmartDeen;
