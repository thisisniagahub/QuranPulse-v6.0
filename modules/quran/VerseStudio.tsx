import React, { useRef, useEffect } from 'react';
import { QuranVerse, ChatMessage, TafsirResult, MorphologyResult, QuranChapter } from '../../types';

interface VerseStudioProps {
    verse: QuranVerse;
    chapter: QuranChapter | null;
    onClose: () => void;
    tab: 'CHAT' | 'TAFSIR' | 'ANALYSIS';
    setTab: (tab: 'CHAT' | 'TAFSIR' | 'ANALYSIS') => void;
    chatMessages: ChatMessage[];
    chatInput: string;
    setChatInput: (input: string) => void;
    handleSend: () => void;
    isChatLoading: boolean;
    tafsirData: TafsirResult | null;
    loadingTafsir: boolean;
    morphologyData: MorphologyResult | null; // Note: This might need to be fetched per word, but for studio we might want verse-level analysis or just instructions
}

const VerseStudio: React.FC<VerseStudioProps> = ({
    verse,
    chapter,
    onClose,
    tab,
    setTab,
    chatMessages,
    chatInput,
    setChatInput,
    handleSend,
    isChatLoading,
    tafsirData,
    loadingTafsir,
    morphologyData
}) => {
    const chatScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-end sm:items-center sm:justify-center animate-fade-in">
            <div className="bg-slate-900 w-full sm:max-w-2xl sm:rounded-3xl h-[85vh] sm:h-[600px] rounded-t-3xl border border-slate-700 flex flex-col shadow-2xl animate-slide-up relative">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl">
                    <div>
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <i className="fa-solid fa-microchip text-teal-500"></i> Verse Studio
                        </h3>
                        <p className="text-xs text-slate-400">AI Deep Dive: Surah {chapter?.name_simple} : {verse.verse_key.split(':')[1]}</p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"><i className="fa-solid fa-xmark"></i></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    {['CHAT', 'TAFSIR', 'ANALYSIS'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${tab === t ? 'border-teal-500 text-teal-400 bg-teal-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-950/50">
                    {tab === 'CHAT' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-4 mb-4">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && <div className="text-slate-500 text-xs animate-pulse">Ustaz AI is typing...</div>}
                                <div ref={chatScrollRef}></div>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about this verse..."
                                    aria-label="Ask about this verse"
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-teal-500"
                                />
                                <button onClick={handleSend} aria-label="Send Message" disabled={isChatLoading || !chatInput.trim()} className="w-10 h-10 bg-teal-600 rounded-xl text-white flex items-center justify-center hover:bg-teal-500 disabled:opacity-50"><i className="fa-solid fa-paper-plane"></i></button>
                            </div>
                        </div>
                    )}

                    {tab === 'TAFSIR' && (
                        <div className="space-y-4">
                            {loadingTafsir ? (
                                <div className="flex flex-col items-center py-10 gap-3">
                                    <i className="fa-solid fa-book-open-reader fa-bounce text-2xl text-teal-500"></i>
                                    <p className="text-xs text-slate-500">Consulting Tafsir Ibn Kathir...</p>
                                </div>
                            ) : tafsirData ? (
                                <div className="animate-fade-in space-y-4">
                                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                        <h4 className="text-gold-400 font-bold text-sm mb-2 flex items-center gap-2"><i className="fa-solid fa-scroll"></i> Tafsir Summary</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">{tafsirData.tafsir}</p>
                                    </div>
                                    <div className="bg-teal-900/10 p-4 rounded-xl border border-teal-500/20">
                                        <h4 className="text-teal-400 font-bold text-sm mb-2 flex items-center gap-2"><i className="fa-solid fa-lightbulb"></i> Reflection</h4>
                                        <p className="text-teal-100 text-sm italic">"{tafsirData.reflection}"</p>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-500 font-bold text-xs uppercase mb-2">Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {tafsirData.keywords?.map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-800 rounded-lg text-xs border border-slate-700 text-white">
                                                    <span className="font-arabic text-teal-400 mr-2">{kw.term}</span>
                                                    {kw.meaning}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {tab === 'ANALYSIS' && (
                        <div className="space-y-4">
                            <p className="text-center text-slate-400 text-sm mb-4">Tap on any word in the verse (Reading View) to see detailed morphology here.</p>
                            {verse.words?.map((word, i) => (
                                <div key={i} className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                                    <span className="font-arabic text-2xl text-white w-12 text-center">{word.text_uthmani}</span>
                                    <div>
                                        <p className="text-teal-400 text-sm font-bold">{word.translation?.text}</p>
                                        <p className="text-slate-500 text-xs">{word.char_type_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerseStudio;
