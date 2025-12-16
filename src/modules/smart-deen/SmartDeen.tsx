import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { convertToJawi, getHadithByTopic } from '../../services/aiService';
import { geminiCliService } from '../../services/geminiCliService';
import { ollamaAiService } from '../../services/ollamaAiService';
import { motion, AnimatePresence } from "framer-motion";
import UstazAvatar from './UstazAvatar';
import NeuralTyping from './NeuralTyping';
import SuggestionChips from './SuggestionChips';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import KhatamPlanner from './components/KhatamPlanner';

interface SmartDeenProps {
    userName?: string;
    hasBottomNav?: boolean;
}

const PERSONAS = {
    AZHAR: { id: 'AZHAR', name: 'Ustaz Azhar', role: 'Pakar Fiqh & Hukum', style: 'Tegas & Tepat', color: 'cyan' },
    AISHAH: { id: 'AISHAH', name: 'Ustazah Aishah', role: 'Kaunseling Keluarga', style: 'Lembut & Penyayang', color: 'pink' },
    AIMAN: { id: 'AIMAN', name: 'Abang Aiman', role: 'Mentor Belia', style: 'Santai & Relatable', color: 'emerald' }
};

const SmartDeen: React.FC<SmartDeenProps> = ({ userName, hasBottomNav = false }) => {
    const { user } = useAuth();
    const displayName = userName || user?.name || "Sahabat";
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');
    const [selectedPersona, setSelectedPersona] = useState<'AZHAR' | 'AISHAH' | 'AIMAN'>('AZHAR');        
    
    // Core State
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Assalamualaikum, ${displayName}. Saya ${PERSONAS[selectedPersona].name}. Ada apa-apa yang boleh saya bantu mengenai agama hari ini?`,
            timestamp: Date.now()
        }
    ]);

    // Refs
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Audio
    const { isListening, startListening, stopListening } = useSpeechRecognition((text) => {
        setInput(text);
        // Optional: Auto-send after voice
    });

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            // Priority: Gemini CLI -> Ollama -> Fallback
            // Construct prompt with persona context
            const personaPrompt = `Anda adalah ${PERSONAS[selectedPersona].name}, seorang ${PERSONAS[selectedPersona].role}. Gaya bahasa anda ${PERSONAS[selectedPersona].style}. Jawab soalan ini dengan tepat dan berhikmah: "${userMsg.content}"`;

            let responseText = await geminiCliService.generateContent(personaPrompt);
            
            // If Gemini fails or returns empty, try Ollama
            if (!responseText) {
                 const ollamaRes = await ollamaAiService.chat([
                    { role: 'system', content: `You are ${PERSONAS[selectedPersona].name}.` },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: userMsg.content }
                 ]);
                 responseText = ollamaRes.message.content;
            }

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Maaf, saya mengalami masalah teknikal sebentar. Sila cuba lagi.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-[#020617]">
            {/* Header / Persona Selector */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <UstazAvatar persona={selectedPersona} isThinking={isThinking} />
                    <div>
                        <h2 className="text-white font-bold text-sm">{PERSONAS[selectedPersona].name}</h2>
                        <div className="flex items-center gap-2">
                             <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                             <p className="text-xs text-slate-400">{PERSONAS[selectedPersona].role}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
                    {(Object.keys(PERSONAS) as Array<keyof typeof PERSONAS>).map((p) => (
                        <button
                            key={p}
                            onClick={() => setSelectedPersona(p)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-all ${selectedPersona === p ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {p === 'AZHAR' ? '👳🏻‍♂️' : p === 'AISHAH' ? '🧕🏻' : '🧢'}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CHAT TAB --- */}
            {activeTab === 'CHAT' && (
                <>
                    <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 space-y-4 ${hasBottomNav ? 'pb-32' : 'pb-24'} scroll-smooth`}>
                         <div className="text-center py-4">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Hari Ini</p>
                        </div>

                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-800'}`}>
                                        {msg.role === 'user' ? '😎' : (msg.role === 'assistant' && selectedPersona === 'AZHAR' ? '👳🏻‍♂️' : selectedPersona === 'AISHAH' ? '🧕🏻' : '🧢')}
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600 text-white rounded-br-none' 
                                            : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-bl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isThinking && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">⏳</div>
                                 <div className="bg-slate-800/50 p-3 rounded-2xl rounded-bl-none border border-white/5">
                                    <NeuralTyping />
                                 </div>
                            </motion.div>
                        )}
                        
                        {/* Suggestion Chips if chat is empty/start */}
                        {messages.length < 3 && !isThinking && (
                             <SuggestionChips onSelect={(text) => setInput(text)} />
                        )}
                    </div>

                    <div className={`absolute inset-x-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent z-20 ${hasBottomNav ? 'bottom-[80px]' : 'bottom-0'}`}>
                        <div className={`flex gap-2 items-end bg-slate-900/80 p-2 rounded-2xl border transition-all backdrop-blur-xl shadow-2xl ${isThinking ? 'border-amber-500/30 shadow-amber-900/20' : 'border-cyan-500/30'}`}>
                            <button
                                onClick={isListening ? stopListening : startListening}
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 animate-pulse text-white' : 'hover:bg-slate-700 text-slate-400'}`}
                            >
                                <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                            </button>
                            
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tanya ustaz..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 resize-none py-2 max-h-32 text-sm"
                                rows={1}
                            />

                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${input.trim() && !isThinking ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                            >
                                <i className="fa-solid fa-paper-plane"></i>
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
