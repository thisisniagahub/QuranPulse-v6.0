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

interface SmartDeenProps {
    userName?: string;
    hasBottomNav?: boolean;
}

const SmartDeen: React.FC<SmartDeenProps> = ({ userName, hasBottomNav = false }) => {
    const { user } = useAuth();
    const displayName = userName || user?.name || "Sahabat";
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');
    
    // Mock implementation for UI stability while CopilotKit is disabled
    const [messages, setMessages] = useState<any[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('AZHAR');
    const switchPersona = (p: PersonaKey) => setSelectedPersona(p);
    const sendMessage = async (text: string) => {
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setIsThinking(true);
        
        // Use the real AI Service here if available, otherwise mock
        // For now, we simulate the "Widget" response to test the UI
        setTimeout(() => {
            let mockResponse = "Maaf, sistem sedang sibuk.";
            
            // Mocking logic to test Widgets (Remove this later when connecting real AI)
            if (text.toLowerCase().includes('zakat')) {
                mockResponse = "Boleh, mari kita kira zakat anda. <<<WIDGET:{\"id\":\"ZAKAT_CALC\"}>>>";
            } else if (text.toLowerCase().includes('infaq') || text.toLowerCase().includes('sedekah')) {
                mockResponse = "Alhamdulillah, moga murah rezeki tuan. <<<WIDGET:{\"id\":\"INFAQ_CARD\",\"props\":{\"amount\":30}}>>>";
            } else if (text.toLowerCase().includes('solat') || text.toLowerCase().includes('waktu')) {
                mockResponse = "Berikut adalah waktu solat bagi kawasan anda. <<<WIDGET:{\"id\":\"PRAYER_TIMES\"}>>>";
            } else {
                mockResponse = "Saya faham. Boleh tuan jelaskan lagi?";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: mockResponse }]);
            setIsThinking(false);
        }, 1500);
    };    const [input, setInput] = useState('');

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
        <div className="flex flex-col h-full relative bg-[#020617]">
            {/* Register Generative UI Actions */}
            <PrayerTimesAction />

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
                    {(Object.keys(PERSONAS) as PersonaKey[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => switchPersona(p)}
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
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-800'}`}>
                                            {msg.role === 'user' ? '😎' : (msg.role === 'assistant' && selectedPersona === 'AZHAR' ? '👳🏻‍♂️' : selectedPersona === 'AISHAH' ? '🧕🏻' : '🧢')}
                                        </div>
                                        <div className={`rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-cyan-600 text-white rounded-br-none' 
                                                : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-bl-none'
                                        }`}>
                                            {/* Render Clean Text */}
                                            {cleanAIResponse(msg.content)}
                                            
                                            {/* Compliance: Report Button */}
                                            {msg.role === 'assistant' && (
                                                <div className="mt-2 pt-2 border-t border-white/10 flex justify-end">
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
                        {/* JAKIM Disclaimer */}
                        <div className="text-[10px] text-slate-500 text-center mb-2 italic">
                            "Ustaz AI adalah alat bantuan pembelajaran. Untuk hukum syarak muktamad, rujuk asatizah bertauliah."
                        </div>

                        {/* Speech Error Message */}
                        {speechError && (
                            <div className="mb-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
                                <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                                {speechError}
                            </div>
                        )}
                        <div className={`flex gap-2 items-end bg-slate-900/80 p-2 rounded-2xl border transition-all backdrop-blur-xl shadow-2xl ${isThinking ? 'border-amber-500/30 shadow-amber-900/20' : 'border-cyan-500/30'}`}>
                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={!isSupported}
                                title={!isSupported ? 'Browser tidak menyokong pengecaman suara' : isListening ? 'Henti' : 'Tekan untuk bercakap'}
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${
                                    !isSupported 
                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                                        : isListening 
                                            ? 'bg-red-500 animate-pulse text-white' 
                                            : 'hover:bg-slate-700 text-slate-400'
                                }`}
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