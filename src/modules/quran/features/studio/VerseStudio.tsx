import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse, QuranChapter, MorphologyResult } from '../../../../types';
import ReactMarkdown from 'react-markdown';
import { chatWithVerseContext } from '../../../../services/aiService';

// Tier 2 Components
import TadabburAI from './TadabburAI';
import WordRootExplorer from '../../components/WordRootExplorer';

interface VerseStudioProps {
    verse: QuranVerse;
    chapter: QuranChapter | null;
    onClose: () => void;
    tab: 'CHAT' | 'TAFSIR' | 'ANALYSIS' | 'TADABBUR';
    setTab: (tab: 'CHAT' | 'TAFSIR' | 'ANALYSIS' | 'TADABBUR') => void;
    
    // External Data (Optional, can be fetched internally if needed)
    tafsirData?: any;
    loadingTafsir?: boolean;
    morphologyData?: MorphologyResult | null;
}

const VerseStudio: React.FC<VerseStudioProps> = ({
    verse,
    chapter,
    onClose,
    tab,
    setTab,
    tafsirData,
    loadingTafsir,
    morphologyData
}) => {
    // --- Internal State ---
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Chat on Mount / Verse Change
    useEffect(() => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: `Assalamualaikum. Saya Ustaz AI. Tanyalah saya apa sahaja tentang Surah ${chapter?.name_simple}, Ayat ${verse.verse_key.split(':')[1]}. Saya boleh huraikan tafsir, hukum tajwid, atau pengajaran ayat ini.`,
            timestamp: Date.now()
        }]);
        setInput('');
        setIsLoading(false);
    }, [verse.id, chapter?.id]); // Reset when verse changes

    // Scroll chat to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatWithVerseContext(
                verse.verse_key,
                verse.text_uthmani || "",
                currentInput
            );

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Maaf, saya menghadapi masalah untuk menjawab soalan ini. Sila cuba lagi.",
                timestamp: Date.now(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                <div className="relative w-full h-full md:max-w-2xl md:h-[90vh] md:rounded-3xl bg-background-dark overflow-hidden shadow-2xl flex flex-col border border-white/10">

                    {/* Background Assets */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img className="w-full h-full object-cover opacity-20 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcIF6ckGOawn5UxGZxvu6enudnlwbhj4CPTJqUs1v86YZr5wfWqoabWOCWi750LY4gH73znwA9Btty3fme0dKk-6AIOurPKpXVIQpzo3960jBJvyJsN-z7Kel6LadMOSTOIQphBVBo-FNYbrxCYE4EasQKv6nqml7wNxNN4CVHpNJPoTBaTcyiCP_zfPSxsaIRxKn7O1a1tZ4ZYTMxEBE44FuoyE5QA2GQRg6edJQwYoTb4QEs-aqK2GAch6iSSdCn-rCQsxlOosxv" alt="Galaxy" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-[#020617]"></div>
                    </div>

                    {/* Header Section */}
                    <div className="z-10 w-full px-6 pt-6 pb-4 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
                        {/* Handle & Close */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-cyan-500 tracking-[0.2em] uppercase">Verse Studio</span>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        {/* Title Area */}
                        <div className="text-center mb-6">
                            <h1 className="text-xl text-white font-medium">
                                <span className="text-slate-400 font-light">Surah {chapter?.name_simple}</span> : {verse?.verse_key.split(':')[1]}
                            </h1>
                            <p className="font-arabic text-2xl mt-2 text-white/90">{verse?.text_uthmani}</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 rounded-xl bg-slate-900/50 border border-white/10">
                            {(['CHAT', 'TAFSIR', 'ANALYSIS', 'TADABBUR'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`flex-1 py-2 text-[10px] sm:text-xs font-bold tracking-wider rounded-lg transition-all ${tab === t
                                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto relative z-10 px-6 py-6 scrollbar-thin scrollbar-thumb-slate-700">

                        {tab === 'ANALYSIS' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/20 flex items-start gap-3 mb-6">
                                    <i className="fa-solid fa-circle-info text-cyan-500 mt-1"></i>
                                    <p className="text-slate-300 text-xs leading-relaxed">
                                        Word Root Explorer analyzes the triliteral roots of words in this verse to reveal deeper semantic connections across the Quran.
                                    </p>
                                </div>
                                
                                <WordRootExplorer 
                                    verseKey={verse.verse_key}
                                    text={verse.text_uthmani || ''}
                                />
                            </div>
                        )}

                        {tab === 'TAFSIR' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="relative w-full rounded-2xl bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20 p-5 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fa-solid fa-sparkles text-blue-400"></i>
                                        <h4 className="text-blue-400 text-sm font-bold">AI Insight</h4>
                                    </div>
                                    <p className="text-slate-200 text-sm leading-relaxed">
                                        (AI Tafsir Integration Placeholder - Connect to aiService)
                                    </p>
                                </div>
                            </div>
                        )}

                        {tab === 'TADABBUR' && (
                            <div className="space-y-4 animate-fade-in">
                                <TadabburAI 
                                    verseKey={verse.verse_key}
                                    text={verse.text_uthmani || ''}
                                    translation={verse.translations?.[0]?.text || ''}
                                />
                            </div>
                        )}

                        {tab === 'CHAT' && (
                            <div className="flex flex-col h-full animate-fade-in">
                                <div className="flex-1 space-y-4 mb-4">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                                            <i className="fa-solid fa-robot text-4xl text-slate-600"></i>
                                            <p className="text-sm text-slate-400">Ask Ustaz AI about this verse...</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, i) => (
                                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                        ? 'bg-cyan-600 text-white rounded-tr-sm'
                                                        : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                                                    }`}>
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="relative w-full pt-2">
                                    <input
                                        className="w-full h-12 rounded-full bg-slate-900 border border-white/10 pl-5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                                        placeholder="Type your question..."
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading || !input.trim()}
                                        className="absolute right-1.5 top-3.5 h-9 w-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <i className="fa-solid fa-paper-plane text-xs"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerseStudio;