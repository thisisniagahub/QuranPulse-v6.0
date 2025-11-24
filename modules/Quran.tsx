import React, { useEffect, useState, useRef } from 'react';
import { QuranChapter, QuranVerse, QuranTranslationResource, Reciter, ChatMessage } from '../types';
import { getAllChapters, getVerses, getChapterAudio, getAvailableTranslations, getFeaturedReciters } from '../services/quranService';
import { getVerseTafsir, analyzeMorphology, getSemanticQuranSearch, chatWithVerseContext, getVerseConnections } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface TafsirResult {
    tafsir: string;
    reflection: string;
    keywords: { term: string; meaning: string }[];
}

interface MorphologyResult {
    root: string;
    type: string;
    grammar: string;
    translation: string;
    usage_context: string;
}

interface SemanticResult {
    surah: string;
    ayah: number;
    arabic: string;
    translation_en: string;
    translation_ms: string;
    explanation: string;
}

const Quran: React.FC = () => {
  // View State
  const [view, setView] = useState<'LIST' | 'READING'>('LIST');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- SETTINGS & UX STATE ---
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showWordByWord, setShowWordByWord] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Data State
  const [chapters, setChapters] = useState<QuranChapter[]>([]);
  const [availableTranslations, setAvailableTranslations] = useState<QuranTranslationResource[]>([]);
  const [selectedTranslationId, setSelectedTranslationId] = useState<number>(131);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSemanticMode, setIsSemanticMode] = useState(false);
  const [semanticResults, setSemanticResults] = useState<SemanticResult[]>([]);
  const [isSearchingSemantic, setIsSearchingSemantic] = useState(false);

  const [selectedChapter, setSelectedChapter] = useState<QuranChapter | null>(null);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  
  // Audio Studio State
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciterId, setSelectedReciterId] = useState<number>(7);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sleep Timer State
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const sleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Verse Studio & Other Refs...
  const [studioVerse, setStudioVerse] = useState<QuranVerse | null>(null);
  const [studioTab, setStudioTab] = useState<'CHAT' | 'TAFSIR' | 'ANALYSIS'>('CHAT');
  const [tafsirData, setTafsirData] = useState<TafsirResult | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState<any | null>(null);
  const [morphologyData, setMorphologyData] = useState<MorphologyResult | null>(null);
  const [loadingMorphology, setLoadingMorphology] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [connectionVerse, setConnectionVerse] = useState<QuranVerse | null>(null);
  const [connectionsData, setConnectionsData] = useState<any>(null);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const [chaptersData, translationsData] = await Promise.all([getAllChapters(), getAvailableTranslations()]);
        setChapters(chaptersData);
        setAvailableTranslations(translationsData);
        setReciters(getFeaturedReciters());
        setLoading(false);
      } catch (err) { setError("Failed to load data."); }
    };
    initData();
  }, []);

  // Initialize Sleep Timer logic
  useEffect(() => {
      if (sleepTimer && isPlaying) {
          if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
          sleepTimeoutRef.current = setTimeout(() => {
              stopAudio();
              setSleepTimer(null);
              alert("Sleep Timer: Audio stopped.");
          }, sleepTimer * 60 * 1000);
      } else {
          if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
      }
      return () => { if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current); };
  }, [sleepTimer, isPlaying]);

  useEffect(() => {
    if (selectedChapter) {
      setLoading(true);
      setView('READING');
      stopAudio();
      Promise.all([
        getVerses(selectedChapter.id, selectedTranslationId),
        getChapterAudio(selectedChapter.id, selectedReciterId)
      ]).then(([versesData, audioData]) => {
        setVerses(versesData || []); 
        setAudioMap(audioData || {});
        setLoading(false);
      });
    }
  }, [selectedChapter, selectedTranslationId, selectedReciterId]);

  // Zoom logic
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
      setIsZooming(true);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - touchStartDist;
      
      // Sensitivity factor
      if (Math.abs(delta) > 10) {
        setFontSize(prev => Math.min(60, Math.max(18, prev + (delta > 0 ? 1 : -1))));
        setTouchStartDist(dist); // reset for continuous zoom
      }
    }
  };

  const onTouchEnd = () => {
    setTouchStartDist(null);
    setIsZooming(false);
  };

  const stopAudio = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
      }
      setIsPlaying(false);
      setPlayingVerseKey(null);
  };

  const playVerse = async (verseKey: string) => {
    const url = audioMap[verseKey];
    if (!url) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.playbackRate = playbackSpeed;
    audio.ontimeupdate = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration || 0); };
    audio.onended = () => {
        const currentIndex = verses.findIndex(v => v.verse_key === verseKey);
        if (currentIndex !== -1 && currentIndex < verses.length - 1) playVerse(verses[currentIndex + 1].verse_key);
        else stopAudio();
    };
    setPlayingVerseKey(verseKey);
    setIsPlaying(true);
    try { await audio.play(); if (autoScroll) verseRefs.current[verseKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){}
  };

  const togglePlayPause = async () => {
      if(audioRef.current) {
          if(isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
          else { await audioRef.current.play(); setIsPlaying(true); }
      } else if (playingVerseKey) playVerse(playingVerseKey);
      else if (verses.length > 0) playVerse(verses[0].verse_key);
  };
  
  // Filter Chapters
  const filteredChapters = chapters.filter(c => c.name_simple.toLowerCase().includes(searchQuery.toLowerCase()));

  // Word Click
  const handleWordClick = async (word: any) => {
      setActiveWord(word); setMorphologyData(null); setLoadingMorphology(true);
      try { const result = await analyzeMorphology(word.text_uthmani, word.translation?.text || ""); setMorphologyData(result); } 
      catch (e) {} finally { setLoadingMorphology(false); }
  };

  // Handle Semantic Search
  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingSemantic(true);
    setSemanticResults([]);
    try {
        const data = await getSemanticQuranSearch(searchQuery);
        if (data && data.results) {
            setSemanticResults(data.results);
        }
    } catch (e) {
        console.error("Semantic search failed");
    } finally {
        setIsSearchingSemantic(false);
    }
  };

  const handleVerseConnections = async (verse: QuranVerse) => {
      setConnectionVerse(verse);
      setShowConnections(true);
      setConnectionsData(null);
      setLoadingConnections(true);
      try {
          const data = await getVerseConnections(verse.verse_key, verse.translations?.[0]?.text || "");
          setConnectionsData(data);
      } catch (e) {
      } finally {
          setLoadingConnections(false);
      }
  };

  const openVerseStudio = (verse: QuranVerse) => {
      setStudioVerse(verse);
      setStudioTab('CHAT');
      // Reset Chat
      setChatMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `Assalamu Alaikum. Ask me about Verse ${verse.verse_key}. I can explain its Tafsir, ruling, or context.`,
          timestamp: Date.now()
      }]);
  };

  const handleStudioSend = async () => {
      if (!chatInput.trim() || !studioVerse) return;
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput, timestamp: Date.now() };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsChatLoading(true);
      try {
          const reply = await chatWithVerseContext(studioVerse.verse_key, studioVerse.translations?.[0]?.text || "", userMsg.content);
          setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: reply, timestamp: Date.now() }]);
      } catch (e) {
      } finally { setIsChatLoading(false); }
  };

  // Load Tafsir
  useEffect(() => {
      if (studioVerse && studioTab === 'TAFSIR' && !tafsirData) {
          setLoadingTafsir(true);
          getVerseTafsir("Surah", studioVerse.verse_key, studioVerse.translations?.[0]?.text || "")
              .then(res => setTafsirData(res))
              .finally(() => setLoadingTafsir(false));
      }
  }, [studioVerse, studioTab]);

  return (
    <div className="min-h-full relative bg-islamic-dark pb-24 font-sans text-slate-200">
      
      {/* --- CONNECTIONS MODAL --- */}
      {showConnections && connectionVerse && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowConnections(false)}>
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-1">Verse Connections</h3>
                        <p className="text-purple-200 text-sm">Semantic Network for {connectionVerse.verse_key}</p>
                    </div>
                    <button onClick={() => setShowConnections(false)} className="absolute top-4 right-4 text-white/70 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loadingConnections ? (
                        <div className="flex flex-col items-center py-8 gap-4">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-purple-300 animate-pulse">Tracing Quranic themes...</p>
                        </div>
                    ) : connectionsData ? (
                        <div className="space-y-6">
                            {/* Topics */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {connectionsData.topics?.map((topic: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
                                            #{topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Related Verses */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Connected Verses</h4>
                                {connectionsData.related_verses?.map((item: any, i: number) => (
                                    <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-teal-400 font-bold text-xs bg-teal-900/20 px-2 py-0.5 rounded">{item.ref}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-3 italic">"{item.text}"</p>
                                        <div className="flex gap-2 items-start bg-purple-900/10 p-2 rounded-lg">
                                            <i className="fa-solid fa-link text-purple-500 text-xs mt-1"></i>
                                            <p className="text-xs text-purple-300">{item.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">No connections found.</div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* --- AUDIO SETTINGS MODAL (With Sleep Timer) --- */}
      {showAudioSettings && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end animate-fade-in" onClick={() => setShowAudioSettings(false)}>
            <div className="bg-slate-900 w-full rounded-t-3xl border-t border-slate-700 shadow-2xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <i className="fa-solid fa-music text-gold-500"></i> Audio Studio
                    </h3>
                    <button onClick={() => setShowAudioSettings(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                </div>

                {/* Reciter */}
                <div className="mb-6">
                    <label className="text-xs text-slate-500 font-bold uppercase mb-3 block">Select Reciter</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {reciters.map(reciter => (
                            <button key={reciter.id} onClick={() => setSelectedReciterId(reciter.id)} className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${selectedReciterId === reciter.id ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-slate-800 border-slate-700 text-white'}`}>
                                <span className="text-sm font-bold">{reciter.name}</span>
                                {selectedReciterId === reciter.id && <i className="fa-solid fa-check text-gold-500"></i>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Speed & Sleep Timer */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="text-xs text-slate-500 font-bold uppercase mb-3 block">Speed</label>
                         <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
                            {[1, 1.5, 2].map(speed => (
                                <button key={speed} onClick={() => setPlaybackSpeed(speed)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${playbackSpeed === speed ? 'bg-gold-500 text-black' : 'text-slate-400'}`}>{speed}x</button>
                            ))}
                         </div>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 font-bold uppercase mb-3 block">Sleep Timer</label>
                         <select 
                            value={sleepTimer || ""} 
                            onChange={(e) => setSleepTimer(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white text-sm outline-none focus:border-gold-500"
                         >
                             <option value="">Off</option>
                             <option value="15">15 Mins</option>
                             <option value="30">30 Mins</option>
                             <option value="60">1 Hour</option>
                         </select>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- WORD ANALYSIS MODAL --- */}
      {activeWord && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setActiveWord(null)}>
              <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-teal-500/30 shadow-[0_0_40px_rgba(20,184,166,0.2)] overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                  <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-800 to-slate-900">
                      <p className="font-arabic text-5xl text-white mb-2 drop-shadow-md">{activeWord.text_uthmani}</p>
                      <p className="text-teal-400 text-lg font-serif italic">{activeWord.translation?.text}</p>
                  </div>
                  <div className="p-6">
                      {loadingMorphology ? (
                          <div className="flex justify-center py-4"><i className="fa-solid fa-circle-notch fa-spin text-teal-500 text-2xl"></i></div>
                      ) : morphologyData ? (
                          <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                      <p className="text-[10px] text-slate-500 uppercase font-bold">Root Word</p>
                                      <p className="font-arabic text-xl text-white">{morphologyData.root}</p>
                                  </div>
                                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                      <p className="text-[10px] text-slate-500 uppercase font-bold">Type</p>
                                      <p className="text-white font-bold text-sm">{morphologyData.type}</p>
                                  </div>
                              </div>
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Grammar</p>
                                  <p className="text-white text-sm">{morphologyData.grammar}</p>
                              </div>
                              <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-500/20">
                                  <p className="text-[10px] text-teal-400 uppercase font-bold mb-1">Deep Meaning</p>
                                  <p className="text-teal-100 text-sm leading-relaxed">{morphologyData.usage_context}</p>
                              </div>
                          </div>
                      ) : <p className="text-center text-slate-500">Analysis unavailable</p>}
                  </div>
              </div>
          </div>
      )}

      {/* --- VERSE STUDIO MODAL --- */}
      {studioVerse && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-end sm:items-center sm:justify-center animate-fade-in">
              <div className="bg-slate-900 w-full sm:max-w-2xl sm:rounded-3xl h-[85vh] sm:h-[600px] rounded-t-3xl border border-slate-700 flex flex-col shadow-2xl animate-slide-up relative">
                   {/* Header */}
                   <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl">
                       <div>
                           <h3 className="text-white font-bold flex items-center gap-2">
                               <i className="fa-solid fa-microchip text-teal-500"></i> Verse Studio
                           </h3>
                           <p className="text-xs text-slate-400">AI Deep Dive: Surah {selectedChapter?.name_simple} : {studioVerse.verse_key.split(':')[1]}</p>
                       </div>
                       <button onClick={() => setStudioVerse(null)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"><i className="fa-solid fa-xmark"></i></button>
                   </div>
                   
                   {/* Tabs */}
                   <div className="flex border-b border-slate-800">
                       {['CHAT', 'TAFSIR', 'ANALYSIS'].map(tab => (
                           <button 
                             key={tab} 
                             onClick={() => setStudioTab(tab as any)}
                             className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${studioTab === tab ? 'border-teal-500 text-teal-400 bg-teal-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                           >
                               {tab}
                           </button>
                       ))}
                   </div>

                   {/* Content */}
                   <div className="flex-1 overflow-y-auto p-4 bg-slate-950/50">
                        {studioTab === 'CHAT' && (
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
                                      onKeyDown={e => e.key === 'Enter' && handleStudioSend()}
                                      placeholder="Ask about this verse..."
                                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-teal-500"
                                    />
                                    <button onClick={handleStudioSend} disabled={isChatLoading || !chatInput.trim()} className="w-10 h-10 bg-teal-600 rounded-xl text-white flex items-center justify-center hover:bg-teal-500 disabled:opacity-50"><i className="fa-solid fa-paper-plane"></i></button>
                                </div>
                            </div>
                        )}

                        {studioTab === 'TAFSIR' && (
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

                        {studioTab === 'ANALYSIS' && (
                            <div className="space-y-4">
                                <p className="text-center text-slate-400 text-sm mb-4">Tap on any word in the verse (Reading View) to see detailed morphology here.</p>
                                {studioVerse.words?.map((word, i) => (
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
      )}

      {/* --- LIST VIEW --- */}
      {view === 'LIST' && (
        <div className="p-4 space-y-4 animate-fade-in">
           {/* Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/5 shadow-2xl p-6">
             <div className="absolute right-0 bottom-0 opacity-10 w-40 h-40 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
             <h2 className="text-3xl font-serif font-bold text-white relative z-10">Kalamullah</h2>
             <p className="text-purple-200 text-sm mt-1 relative z-10">The Divine Speech.</p>
          </div>
          
          {/* Search Bar with Semantic Toggle */}
          <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-2 border border-slate-800 sticky top-0 z-20 shadow-md">
             <div className="flex items-center gap-3">
                 <i className={`fa-solid ${isSemanticMode ? 'fa-wand-magic-sparkles text-purple-400' : 'fa-magnifying-glass text-slate-500'}`}></i>
                 <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder={isSemanticMode ? 'Describe feeling (e.g. Anxiety)...' : 'Search Surah (e.g. Kahf)...'} 
                    className="bg-transparent outline-none text-white text-sm w-full"
                    onKeyDown={(e) => e.key === 'Enter' && isSemanticMode && handleSemanticSearch()} 
                 />
                 {isSemanticMode && (
                     <button onClick={handleSemanticSearch} className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Search</button>
                 )}
             </div>
             
             {/* Mode Toggle */}
             <div className="flex gap-2 pt-2 border-t border-slate-800">
                 <button onClick={() => setIsSemanticMode(false)} className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${!isSemanticMode ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500'}`}>Name Search</button>
                 <button onClick={() => setIsSemanticMode(true)} className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${isSemanticMode ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500'}`}>AI Semantic Search</button>
             </div>
          </div>

          {/* Semantic Results */}
          {isSemanticMode && isSearchingSemantic && (
              <div className="text-center py-12">
                   <i className="fa-solid fa-circle-notch fa-spin text-purple-500 text-2xl mb-2"></i>
                   <p className="text-slate-500 text-xs">Finding relevant verses...</p>
              </div>
          )}

          {isSemanticMode && semanticResults.length > 0 && (
              <div className="space-y-4 animate-slide-up">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Top Matches (English & Malay)</h4>
                  {semanticResults.map((res, i) => (
                      <div key={i} className="bg-slate-900 border border-purple-500/30 p-5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => {
                          const surah = chapters.find(c => c.id === (res.ayah > 200 ? 2 : 1)); 
                          if(surah) setSelectedChapter(surah);
                      }}>
                          <div className="flex justify-between items-center mb-3">
                              <span className="text-purple-400 font-bold text-sm">{res.surah} : {res.ayah}</span>
                              <span className="text-[10px] bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded border border-purple-500/20">Match</span>
                          </div>
                          
                          {/* Arabic */}
                          <p className="font-arabic text-2xl text-white text-right mb-4 leading-loose">{res.arabic}</p>
                          
                          {/* Translations */}
                          <div className="space-y-2 mb-4">
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase font-bold mr-2">EN</span>
                                <span className="text-slate-300 text-sm italic">"{res.translation_en}"</span>
                              </div>
                              <div className="border-t border-slate-800/50 pt-2">
                                <span className="text-[10px] text-teal-500 uppercase font-bold mr-2">BM</span>
                                <span className="text-teal-100 text-sm italic">"{res.translation_ms}"</span>
                              </div>
                          </div>

                          {/* Context/Explanation */}
                          <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
                              <p className="text-xs text-purple-300"><i className="fa-solid fa-circle-info mr-2"></i> 
                                  <span className="font-bold">Context:</span> {res.explanation}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* Regular Grid */}
          {!isSemanticMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-10">
                {filteredChapters.map((surah) => (
                  <div key={surah.id} onClick={() => setSelectedChapter(surah)} className="group bg-slate-900 p-4 rounded-xl hover:bg-slate-800 transition-all cursor-pointer border border-slate-800 relative">
                    <div className="absolute top-4 left-4 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold">{surah.id}</div>
                    <div className="ml-14 flex justify-between items-center h-full">
                       <div><h4 className="font-bold text-white text-lg">{surah.name_simple}</h4><p className="text-xs text-slate-500">{surah.verses_count} Ayat</p></div>
                       <p className="font-arabic text-2xl text-slate-600">{surah.name_arabic}</p>
                    </div>
                  </div>
                ))}
              </div>
          )}
        </div>
      )}

      {/* --- READING VIEW --- */}
      {view === 'READING' && selectedChapter && (
        <div className="bg-islamic-dark min-h-screen">
          <div className="sticky top-0 z-30 bg-islamic-dark/95 backdrop-blur-md border-b border-slate-800 p-3 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <button onClick={() => {setView('LIST'); stopAudio();}} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><i className="fa-solid fa-arrow-left"></i></button>
                 <div><h2 className="font-bold text-white text-sm">{selectedChapter.name_simple}</h2></div>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => setShowAudioSettings(true)} className="w-8 h-8 rounded-full bg-slate-800 text-gold-400 flex items-center justify-center"><i className="fa-solid fa-music"></i></button>
                 {/* Translation Toggle */}
                 <button onClick={() => setShowTranslation(!showTranslation)} className={`w-8 h-8 rounded-full flex items-center justify-center ${showTranslation ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    <i className="fa-solid fa-language"></i>
                 </button>
                 <button onClick={() => setShowSettings(true)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><i className="fa-solid fa-font"></i></button>
             </div>
          </div>
          
          <div 
            className="pb-40 px-4 min-h-screen" 
            onTouchStart={onTouchStart} 
            onTouchMove={onTouchMove} 
            onTouchEnd={onTouchEnd}
          >
             {loading ? <div className="text-center py-20 text-slate-500">Loading Verses...</div> : (
                 <AnimatePresence>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     {isZooming && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                             <div className="bg-black/70 text-white px-4 py-2 rounded-full font-bold text-xl backdrop-blur-md">
                                 {fontSize}px
                             </div>
                         </div>
                     )}
                     {verses.map((verse) => {
                         const isPlayingThis = playingVerseKey === verse.verse_key;
                         return (
                             <div key={verse.id} ref={el => { verseRefs.current[verse.verse_key] = el; }} className={`py-10 border-b border-slate-800/50 ${isPlayingThis ? 'bg-teal-900/10 -mx-4 px-4 border-l-4 border-l-teal-500' : ''}`}>
                                 <div className="flex justify-between mb-6">
                                     <div className="flex gap-2">
                                         <button 
                                            onClick={() => handleVerseConnections(verse)}
                                            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-purple-400 flex items-center justify-center hover:bg-slate-700 transition-colors"
                                         >
                                            <span className="text-xs font-bold">{verse.verse_key.split(':')[1]}</span>
                                         </button>
                                         <button onClick={() => openVerseStudio(verse)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-teal-400 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                            <i className="fa-solid fa-microchip text-xs"></i>
                                         </button>
                                     </div>
                                     <button onClick={() => playVerse(verse.verse_key)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlayingThis ? 'bg-teal-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                         <i className={`fa-solid ${isPlayingThis ? 'fa-pause' : 'fa-play'}`}></i>
                                     </button>
                                 </div>
                                 <div className="text-right w-full mb-6">
                                     {showWordByWord && verse.words ? (
                                         <div className="flex flex-wrap justify-end gap-x-4 gap-y-6" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                                             {verse.words.map((word, i) => (
                                                 <span key={i} onClick={() => handleWordClick(word)} className={`font-uthmani cursor-pointer hover:text-teal-300 ${activeWord?.id === word.id ? 'text-blue-400' : 'text-white'}`}>{word.text_uthmani}</span>
                                             ))}
                                         </div>
                                     ) : (
                                         <p className="font-uthmani leading-[3] text-white" style={{ fontSize: `${fontSize}px` }} dir="rtl">{verse.text_uthmani}</p>
                                     )}
                                 </div>
                                 {showTranslation && <p className="text-slate-300 text-lg font-light leading-relaxed">{verse.translations?.[0]?.text.replace(/<sup.*?<\/sup>/g, "")}</p>}
                             </div>
                         );
                     })}
                     </motion.div>
                 </AnimatePresence>
             )}
          </div>
        </div>
      )}
      
      {/* Mini Player */}
      {playingVerseKey && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-900/95 border border-gold-500/20 p-4 rounded-2xl shadow-2xl z-50">
            <div className="flex items-center gap-4">
                <button onClick={togglePlayPause} className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-black font-bold"><i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i></button>
                <div className="flex-1">
                    <p className="text-xs font-bold text-white">Surah {selectedChapter?.name_simple} : {playingVerseKey.split(':')[1]}</p>
                    <input type="range" min="0" max={duration || 100} value={currentTime} onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} className="w-full h-1 bg-slate-700 rounded-full appearance-none accent-gold-500" />
                </div>
            </div>
            {sleepTimer && <div className="absolute -top-3 right-4 bg-gold-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full">Sleep Timer: {sleepTimer}m</div>}
        </div>
      )}
    </div>
  );
};

export default Quran;