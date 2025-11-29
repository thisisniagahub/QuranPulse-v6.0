import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { QuranChapter, QuranVerse, QuranTranslationResource, Reciter, ChatMessage, TafsirResult, MorphologyResult, SemanticResult, QuranWord } from '../types';
import { getAllChapters, getVerses, getChapterAudio, getAvailableTranslations, getFeaturedReciters } from '../services/quranService';
import { getVerseTafsirAI as getVerseTafsir, analyzeMorphology, getSemanticQuranSearch, chatWithVerseContext, getVerseConnections } from '../services/aiService';
import { speak, stopTTS, isSpeaking } from '../services/ttsService';
import QuranList from './quran/QuranList';
import QuranReader from './quran/QuranReader';
import VerseStudio from './quran/VerseStudio';

const Quran: React.FC = () => {
  // View State
  // View State
  const [view, setView] = useState<'LIST' | 'READING'>('LIST');
  // const [loading, setLoading] = useState(true); // REPLACED
  // const [error, setError] = useState<string | null>(null); // REPLACED
  
  // --- SETTINGS & UX STATE ---
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showWordByWord, setShowWordByWord] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Data State
  // Data State (Managed by React Query)
  // const [chapters, setChapters] = useState<QuranChapter[]>([]); // REPLACED
  // const [availableTranslations, setAvailableTranslations] = useState<QuranTranslationResource[]>([]); // REPLACED
  const [selectedTranslationId, setSelectedTranslationId] = useState<number>(131);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSemanticMode, setIsSemanticMode] = useState(false);
  const [semanticResults, setSemanticResults] = useState<SemanticResult[]>([]);
  const [isSearchingSemantic, setIsSearchingSemantic] = useState(false);

  const [selectedChapter, setSelectedChapter] = useState<QuranChapter | null>(null);
  // const [verses, setVerses] = useState<QuranVerse[]>([]); // REPLACED
  
  // Audio Context
  const { 
    playTrack, 
    stopTrack, 
    isPlaying, 
    currentTrack, 
    playbackSpeed, 
    setSpeed, 
    sleepTimer, 
    setTimer 
  } = useAudioPlayer();

  // Derived state for UI compatibility
  const playingVerseKey = currentTrack?.verseKey || null;

  // Audio Studio State (Reciter only)
  // const [audioMap, setAudioMap] = useState<Record<string, string>>({}); // REPLACED with derived state
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciterId, setSelectedReciterId] = useState<number>(7);
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Verse Studio & Other Refs...

  // Verse Studio & Other Refs...
  const [studioVerse, setStudioVerse] = useState<QuranVerse | null>(null);
  const [studioTab, setStudioTab] = useState<'CHAT' | 'TAFSIR' | 'ANALYSIS'>('CHAT');
  const [tafsirData, setTafsirData] = useState<TafsirResult | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeWord, setActiveWord] = useState<QuranWord | null>(null);
  const [morphologyData, setMorphologyData] = useState<MorphologyResult | null>(null);
  const [loadingMorphology, setLoadingMorphology] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [connectionVerse, setConnectionVerse] = useState<QuranVerse | null>(null);
  const [connectionsData, setConnectionsData] = useState<{ topics: string[]; related_verses: any[] } | null>(null);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // --- REACT QUERY DATA FETCHING ---
  
  // 1. Fetch Chapters
  const { data: chapters = [], isLoading: loadingChapters, error: chaptersError } = useQuery({
    queryKey: ['chapters'],
    queryFn: getAllChapters,
    staleTime: Infinity, // Chapters don't change often
  });

  // 2. Fetch Translations
  const { data: availableTranslations = [] } = useQuery({
    queryKey: ['translations'],
    queryFn: getAvailableTranslations,
    staleTime: Infinity,
  });

  // Initialize Reciters (Static)
  useEffect(() => {
    setReciters(getFeaturedReciters());
  }, []);

  // Combined Loading State
  const loading = loadingChapters;
  const error = chaptersError ? "Failed to load chapters" : null;

  // Initialize Sleep Timer logic
  // Sleep Timer handled by Context

  // 3. Fetch Verses (Dependent on selectedChapter)
  const { data: verses = [], isLoading: loadingVerses } = useQuery({
    queryKey: ['verses', selectedChapter?.id, selectedTranslationId],
    queryFn: () => getVerses(selectedChapter!.id, selectedTranslationId),
    enabled: !!selectedChapter,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // 4. Fetch Audio (Dependent on selectedChapter & Reciter)
  const { data: audioMap = {} } = useQuery({
    queryKey: ['audio', selectedChapter?.id, selectedReciterId],
    queryFn: () => getChapterAudio(selectedChapter!.id, selectedReciterId),
    enabled: !!selectedChapter,
    staleTime: 1000 * 60 * 60,
  });

  // Sync Audio Map - REMOVED as we use data directly


  // Handle View Change
  useEffect(() => {
    if (selectedChapter) {
      setView('READING');
      stopTrack();
    }
  }, [selectedChapter]);

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

  const playVerse = async (verseKey: string) => {
    const url = audioMap[verseKey];
    if (!url) return;

    await playTrack({
      url,
      title: `Surah ${selectedChapter?.name_simple}`,
      subtitle: `Ayah ${verseKey.split(':')[1]}`,
      verseKey,
      reciterId: selectedReciterId
    });

    if (autoScroll) {
       verseRefs.current[verseKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Auto-play next verse logic (handled by context onEnded ideally, but for now we can simulate or rely on the list)
  // Note: The context handles single track. To play next, we need to know the list.
  // For now, let's keep it simple: The context plays one track. 
  // To support playlist, we'd need to pass the playlist to context or handle onEnded here.
  // Let's implement a simple onEnded handler in useEffect to play next.

  const { setOnEnded } = useAudioPlayer();

  useEffect(() => {
    setOnEnded(() => {
      if (currentTrack?.verseKey) {
        const currentIndex = verses.findIndex(v => v.verse_key === currentTrack.verseKey);
        if (currentIndex !== -1 && currentIndex < verses.length - 1) {
          playVerse(verses[currentIndex + 1].verse_key);
        }
      }
    });
  }, [verses, currentTrack, audioMap]);
  
  // Word Click
  const handleWordClick = async (word: QuranWord) => {
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

  // --- TTS Logic ---
  const handleReadTranslation = async (text: string) => {
      if (isSpeaking()) {
          stopTTS();
      } else {
          await speak(text, { lang: 'en-US', rate: 1.0 });
      }
  };

  return (
    <div className="min-h-full relative bg-islamic-dark pb-24 font-sans text-slate-200">
      
      {/* Background Layer */}
      <div className="app-bg-layer bg-downbg app-bg-subtle"></div>
      <div className="gradient-overlay-dark"></div>
      
      {/* --- CONNECTIONS MODAL --- */}
      {showConnections && connectionVerse && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowConnections(false)}>
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-secondary/30 shadow-[0_0_50px_rgba(255,215,0,0.2)] overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-gradient-to-br from-primary-dark to-secondary-dark relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-1">Verse Connections</h3>
                        <p className="text-secondary-light text-sm">Semantic Network for {connectionVerse.verse_key}</p>
                    </div>
                    <button onClick={() => setShowConnections(false)} aria-label="Close" className="absolute top-4 right-4 text-white/70 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loadingConnections ? (
                        <div className="flex flex-col items-center py-8 gap-4">
                            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-secondary-light animate-pulse">Tracing Quranic themes...</p>
                        </div>
                    ) : connectionsData ? (
                        <div className="space-y-6">
                            {/* Topics */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {connectionsData.topics?.map((topic: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-secondary/20 text-secondary-light rounded-full text-xs font-bold border border-secondary/30">
                                            #{topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Related Verses */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Connected Verses</h4>
                                {connectionsData.related_verses?.map((item: any, i: number) => (
                                    <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-secondary/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-primary font-bold text-xs bg-primary/20 px-2 py-0.5 rounded">{item.ref}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-3 italic">"{item.text}"</p>
                                        {/* Translation */}
                                    {showTranslation && (
                                        <div className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                                            <div className="flex items-start gap-2">
                                                <p className="flex-1">{connectionVerse.translations?.[0]?.text.replace(/<[^>]*>/g, '')}</p>
                                                <button 
                                                    onClick={() => handleReadTranslation(connectionVerse.translations?.[0]?.text.replace(/<[^>]*>/g, '') || '')}
                                                    className="text-slate-400 hover:text-primary transition-colors p-1"
                                                    title="Listen to Translation"
                                                >
                                                    <i className="fa-solid fa-volume-low"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}</div>
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
                    <button onClick={() => setShowAudioSettings(false)} aria-label="Close" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
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
                                <button key={speed} onClick={() => setSpeed(speed)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${playbackSpeed === speed ? 'bg-gold-500 text-black' : 'text-slate-400'}`}>{speed}x</button>
                            ))}
                         </div>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 font-bold uppercase mb-3 block">Sleep Timer</label>
                         <select 
                            value={sleepTimer || ""} 
                            onChange={(e) => setTimer(e.target.value ? parseInt(e.target.value) : null)}
                            aria-label="Sleep Timer"
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
              <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-primary/30 shadow-[0_0_40px_rgba(0,191,165,0.2)] overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                  <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-800 to-slate-900">
                      <p className="font-arabic text-5xl text-white mb-2 drop-shadow-md">{activeWord.text_uthmani}</p>
                      <p className="text-primary text-lg font-serif italic">{activeWord.translation?.text}</p>
                  </div>
                  <div className="p-6">
                      {loadingMorphology ? (
                          <div className="flex justify-center py-4"><i className="fa-solid fa-circle-notch fa-spin text-primary text-2xl"></i></div>
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
                              <div className="bg-primary/20 p-4 rounded-xl border border-primary/20">
                                  <p className="text-[10px] text-primary uppercase font-bold mb-1">Deep Meaning</p>
                                  <p className="text-primary-light text-sm leading-relaxed">{morphologyData.usage_context}</p>
                              </div>
                          </div>
                      ) : <p className="text-center text-slate-500">Analysis unavailable</p>}
                  </div>
              </div>
          </div>
      )}

      {/* --- VERSE STUDIO MODAL --- */}
      {studioVerse && (
          <VerseStudio
              verse={studioVerse}
              chapter={selectedChapter}
              onClose={() => setStudioVerse(null)}
              tab={studioTab}
              setTab={setStudioTab}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSend={handleStudioSend}
              isChatLoading={isChatLoading}
              tafsirData={tafsirData}
              loadingTafsir={loadingTafsir}
              morphologyData={morphologyData}
          />
      )}

      {/* --- LIST VIEW --- */}
      {view === 'LIST' && (
        <QuranList
            chapters={chapters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onChapterSelect={(chapter) => setSelectedChapter(chapter)}
            isSemanticMode={isSemanticMode}
            setIsSemanticMode={setIsSemanticMode}
            handleSemanticSearch={handleSemanticSearch}
            isSearchingSemantic={isSearchingSemantic}
            semanticResults={semanticResults}
        />
      )}

      {/* --- READING VIEW --- */}
      {view === 'READING' && selectedChapter && (
        <QuranReader
            chapter={selectedChapter}
            verses={verses}
            loading={loadingVerses}
            fontSize={fontSize}
            showTranslation={showTranslation}
            showTransliteration={showTransliteration}
            showWordByWord={showWordByWord}
            activeWord={activeWord}
            handleWordClick={handleWordClick}
            playingVerseKey={playingVerseKey}
            playVerse={playVerse}
            handleVerseConnections={handleVerseConnections}
            openVerseStudio={openVerseStudio}
            verseRefs={verseRefs}
            isZooming={isZooming}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onBack={() => { setView('LIST'); stopTrack(); }}
            onOpenSettings={() => setShowSettings(true)}
            onOpenAudioSettings={() => setShowAudioSettings(true)}
            onToggleTranslation={() => setShowTranslation(!showTranslation)}
        />
      )}
      
      {/* Global Mini Player is now in App.tsx */}
    </div>
  );
};

export default Quran;