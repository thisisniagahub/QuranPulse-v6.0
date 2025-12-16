import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { convertToJawi, getHadithByTopic, askUstazAI } from '../../services/aiService';
import { geminiCliService } from '../../services/geminiCliService';
import { ollamaAiService } from '../../services/ollamaAiService';
import { motion } from "framer-motion";
import UstazAvatar from './UstazAvatar';
import NeuralTyping from './NeuralTyping';
import SuggestionChips from './SuggestionChips';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import KhatamPlanner from './components/KhatamPlanner';

const SmartDeen: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');
    const [selectedPersona, setSelectedPersona] = useState<'AZHAR' | 'AISHAH' | 'AIMAN'>('AZHAR');        

    const PERSONAS = {
        AZHAR: {
            id: 'AZHAR',
            name: 'Ustaz Azhar',
            role: 'Hukum & Fiqh',
            desc: 'Tegas, padat, dan berfokus pada hukum hakam mazhab Syafi\'i.',
            avatar: '👳🏻‍♂️',
            color: 'text-emerald-400',
            bg: 'bg-emerald-900/20 border-emerald-500/30'
        },
        AISHAH: {
            id: 'AISHAH',
            name: 'Ustazah Aishah',
            role: 'Keluarga & Jiwa',
            desc: 'Lembut, menyentuh hati, fokus pada psikologi dan nasihat kehidupan.',
            avatar: '🧕🏻',
            color: 'text-rose-400',
            bg: 'bg-rose-900/20 border-rose-500/30'
        },
        AIMAN: {
            id: 'AIMAN',
            name: 'Akhi Aiman',
            role: 'Mentor Gen-Z',
            desc: 'Santai, moden, guna bahasa mudah faham dan analogi teknologi.',
            avatar: '🧑🏻‍💻',
            color: 'text-cyan-400',
            bg: 'bg-cyan-900/20 border-cyan-500/30'
        }
    };

  // --- Text Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Assalamualaikum! Saya Ustaz AI (Powered by Ollama). Pilih persona dan tanya soalan anda.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false); // TTS State
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- TTS Logic (ElevenLabs + Fallback) ---
  const handleSpeak = async (text: string) => {
    if (isAvatarSpeaking) {
        window.speechSynthesis.cancel();
        // Also stop any audio element if playing
        const audioEl = document.getElementById('ustaz-audio') as HTMLAudioElement;
        if (audioEl) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
        setIsAvatarSpeaking(false);
        return;
    }

    setIsAvatarSpeaking(true);

    try {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        
        if (!apiKey) throw new Error("No ElevenLabs Key");

        // Rachel Voice ID: 21m00Tcm4TlvDq8ikWAM (Calm & Clear)
        // Adam Voice ID: pMsXgVXv3BLzUgSXRplE (Male, Deep - Good for Ustaz)
        const VOICE_ID = 'pMsXgVXv3BLzUgSXRplE'; 

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2", // Better for Malay
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            })
        });

        if (!response.ok) throw new Error("ElevenLabs API Error");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.id = 'ustaz-audio';
        
        audio.onended = () => {
            setIsAvatarSpeaking(false);
            URL.revokeObjectURL(url);
        };
        
        audio.onerror = () => {
             console.warn("Audio Playback Error");
             setIsAvatarSpeaking(false);
        };

        audio.play();

    } catch (error) {
        console.warn("ElevenLabs Failed (Using Fallback):", error);
        
        // Fallback to Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        // Try Malay/Indo voice
        const preferredVoice = voices.find(v => v.lang.includes('ms-MY') || v.lang.includes('id-ID'));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.onstart = () => setIsAvatarSpeaking(true);
        utterance.onend = () => setIsAvatarSpeaking(false);
        utterance.onerror = () => setIsAvatarSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }
  };

  // Ensure voices are loaded (Chrome quirk)
  useEffect(() => {
      window.speechSynthesis.getVoices();
  }, []);

  // --- Voice Input Hook ---
  const { isListening, startListening, isSupported: isVoiceSupported } = useSpeechRecognition({
      onResult: (text) => setInput(text)
  });

  // --- Jawi State ---
  const [rumiText, setRumiText] = useState('');
  const [jawiResult, setJawiResult] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // --- Hadith State ---
  const [hadithTopic, setHadithTopic] = useState('');
  const [hadithResult, setHadithResult] = useState<any>(null);
  const [isSearchingHadith, setIsSearchingHadith] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Text Chat Logic ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgPlaceholder: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: 'Sedang berfikir...', 
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      // --- UNIFIED HYBRID AI SERVICE ---
      
      const history = messages
        .filter(m => !m.isError && m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));
        
      // Add current user message to history context
      const contextMessages: ChatMessage[] = [
          ...history,
          { role: 'user', content: currentInput }
      ];

      // Call the service directly (Static Import)
      const finalResponse = await askUstazAI(contextMessages as any);

      // Update the placeholder with real response
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId
          ? { ...msg, content: finalResponse }
          : msg
      ));

      setIsLoading(false);

    } catch (error: any) {
       console.error("Chat error:", error);
       setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId
          ? { ...msg, content: "Maaf, Ustaz AI menghadapi masalah teknikal. Sila cuba sebentar lagi.", isError: true }
          : msg
      ));
      setIsLoading(false);
    }
  };

  // --- Jawi Logic ---
  const handleJawiConvert = async () => {
      if (!rumiText.trim() || isConverting) return;
      setIsConverting(true);
      const result = await convertToJawi(rumiText);
      setJawiResult(result);
      setIsConverting(false);
  };

  // --- Hadith Logic ---
  const handleHadithSearch = async () => {
      if (!hadithTopic.trim() || isSearchingHadith) return;
      setIsSearchingHadith(true);
      setHadithResult(null);
      const result = await getHadithByTopic(hadithTopic);
      setHadithResult(result);
      setIsSearchingHadith(false);
  };

  return (
    <div className="flex flex-col h-full relative bg-[#020617]">
      {/* Header Context with Maze Pattern */}
      <div className="bg-[#020617]/90 backdrop-blur border-b border-cyan-500/20 p-3 flex flex-col gap-2 px-4 z-10 relative overflow-hidden shadow-lg shadow-cyan-500/5">
         <div className="absolute inset-0 bg-maze opacity-10 pointer-events-none"></div>

         <div className="flex items-center justify-between relative z-10">
             <div className="inline-flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${useThinking ? 'bg-secondary animate-pulse text-secondary' : 'bg-primary text-primary'}`}></div>
                <div>
                    <h3 className="text-sm font-bold text-white leading-none">Smart Deen AI</h3>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${useThinking ? 'text-secondary' : 'text-slate-400'}`}>
                        {useThinking ? 'Deep Reasoning' : 'Standard Mode'}
                    </span>
                </div>
            </div>
         </div>

         {/* Sub-Nav Scrollable */}
         <div className="flex gap-2 relative z-10 mt-1 overflow-x-auto no-scrollbar pb-1">
             {['CHAT', 'JAWI', 'HADITH', 'PLANNER'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-800 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     {tab === 'CHAT' ? 'Tanya Ustaz' : tab}
                 </button>
             ))}
         </div>
      </div>

      {/* --- CHAT TAB --- */}
      {activeTab === 'CHAT' && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">

                {/* Avatar Stage */}
                <div className="pt-2 pb-4">
                    <UstazAvatar isThinking={useThinking} isSpeaking={isAvatarSpeaking} />       
                </div>

                {/* Welcome & Persona Selection */}
                {messages.length <= 1 && (
                     <div className="max-w-lg mx-auto animate-fade-in pb-8">
                         <div className="text-center mb-8">
                             <h2 className="text-2xl font-bold text-white mb-2">Pilih Pembimbing Anda</h2>
                             <p className="text-slate-400 text-sm">Siapa yang anda ingin rujuk hari ini?</p>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                             {(Object.keys(PERSONAS) as Array<keyof typeof PERSONAS>).map((key) => {      
                                 const p = PERSONAS[key];
                                 const isSelected = selectedPersona === key;
                                 return (
                                     <button
                                         key={key}
                                         onClick={() => setSelectedPersona(key)}
                                         className={`relative p-4 rounded-2xl border text-left transition-all duration-300 group ${isSelected ? `${p.bg} shadow-lg scale-105 ring-1 ring-white/20` : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}
                                     >
                                         {isSelected && (
                                             <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                                         )}
                                         <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{p.avatar}</div>
                                         <h3 className={`font-bold text-sm mb-1 ${p.color}`}>{p.name}</h3>
                                         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{p.role}</p>
                                         <p className="text-[10px] text-slate-400 leading-relaxed opacity-80">{p.desc}</p>
                                     </button>
                                 );
                             })}
                         </div>

                         {/* Quick Starters based on Persona */}
                         <div className="space-y-3">
                             <p className="text-xs text-center text-slate-500 font-bold uppercase tracking-widest">Topik Cadangan</p>
                             <div className="flex flex-wrap justify-center gap-2">
                                 {selectedPersona === 'AZHAR' && ['Hukum Trade Forex?', 'Cara Jamak Qasar?', 'Hukum Lupa Rakaat'].map(t => (
                                     <button key={t} onClick={() => { setInput(t); handleSend(); }} className="px-4 py-2 rounded-full bg-emerald-900/20 border border-emerald-500/20 text-emerald-300 text-xs hover:bg-emerald-500/20 transition-all">{t}</button>
                                 ))}
                                 {selectedPersona === 'AISHAH' && ['Saya rasa burnout...', 'Tips didik anak degil', 'Doa penenang hati'].map(t => (
                                     <button key={t} onClick={() => { setInput(t); handleSend(); }} className="px-4 py-2 rounded-full bg-rose-900/20 border border-rose-500/20 text-rose-300 text-xs hover:bg-rose-500/20 transition-all">{t}</button>
                                 ))}
                                 {selectedPersona === 'AIMAN' && ['AI dalam Islam?', 'Tips productivity Muslim', 'Kerja vs Ibadah'].map(t => (
                                     <button key={t} onClick={() => { setInput(t); handleSend(); }} className="px-4 py-2 rounded-full bg-cyan-900/20 border border-cyan-500/20 text-cyan-300 text-xs hover:bg-cyan-500/20 transition-all">{t}</button>
                                 ))}
                             </div>
                         </div>
                     </div>
                )}

                {messages.filter(m => m.id !== 'welcome').map((msg) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-lg backdrop-blur-md border relative overflow-hidden ${msg.role === 'user' ? 'bg-cyan-900/30 border-cyan-500/30 text-white rounded-br-sm' : msg.isError ? 'bg-red-900/20 border-red-500/50 text-red-200 rounded-bl-sm' : 'bg-slate-900/60 border-slate-700/50 text-slate-200 rounded-bl-sm'}`}
                    >
                        {msg.role === 'assistant' && !msg.isError && (
                            <div className="flex items-center justify-between mb-2 opacity-70 border-b border-white/5 pb-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">Ustaz AI (Local)</span>
                                <button 
                                    onClick={() => handleSpeak(msg.content)}
                                    className={`text-xs hover:text-white transition-colors ${isAvatarSpeaking ? 'text-green-400 animate-pulse' : 'text-slate-400'}`}
                                    title="Baca Jawapan"
                                >
                                    <i className={`fa-solid ${isAvatarSpeaking ? 'fa-volume-high' : 'fa-volume-low'}`}></i>
                                </button>
                            </div>
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">{msg.content}</div>
                    </div>
                </motion.div>
                ))}

                {isLoading && (
                <div className="flex justify-start animate-fade-in">
                    <div className="bg-slate-900/60 rounded-2xl rounded-bl-sm p-4 border border-slate-700/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <NeuralTyping />
                            <span className="text-xs text-cyan-500/70 italic">Sedang menaip...</span>
                        </div>
                    </div>
                </div>
                )}
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
                <div className={`flex gap-2 items-end bg-slate-900/80 p-2 rounded-2xl border transition-all backdrop-blur-xl shadow-2xl ${useThinking ? 'border-amber-500/30 shadow-amber-900/20 focus-within:border-amber-500/50' : 'border-cyan-500/30 shadow-cyan-900/20 focus-within:border-cyan-500/50'}`}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={useThinking ? "Soalan mendalam..." : "Tanya apa sahaja..."}
                    className="flex-1 bg-transparent text-white text-sm p-3 min-h-[44px] max-h-32 resize-none outline-none placeholder:text-slate-500"
                    rows={1}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                {isVoiceSupported && (
                    <button
                        onClick={startListening}
                        disabled={isLoading || isListening}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all mb-0.5 ${ isListening ? 'bg-red-500/20 text-red-500 border border-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                        title="Cakap untuk tulis"
                    >
                        <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                    </button>
                )}

                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all mb-0.5 ${ useThinking ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-cyan-500 text-black hover:bg-cyan-400'}`}
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
                </div>
            </div>
          </>
      )}

      {/* --- OTHER TABS --- */}
      {activeTab === 'JAWI' && (
        <div className="flex-1 p-4 space-y-6 animate-slide-up overflow-y-auto pb-24">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,191,165,0.1)]">
                    <span className="font-arabic text-4xl mb-2">ج</span>
                </div>
                <h3 className="text-xl font-bold text-white">Jawi Converter</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Tukar tulisan Rumi ke Jawi segera.</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-1 border border-slate-800 focus-within:border-primary/50 transition-colors">
                <textarea
                  value={rumiText}
                  onChange={(e) => setRumiText(e.target.value)}
                  placeholder="Taip di sini (contoh: Selamat Pagi)"
                  className="w-full bg-transparent text-white p-4 min-h-[120px] outline-none resize-none text-base placeholder:text-slate-600"
                />
                <div className="px-4 pb-4">
                     <button onClick={handleJawiConvert} disabled={isConverting || !rumiText.trim()} className="w-full py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                        {isConverting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Tukar ke Jawi</>}</button>
                </div>
            </div>
            {jawiResult && (
                <div className="animate-fade-in space-y-2">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[100px] relative">
                        <p className="font-arabic text-3xl text-white leading-loose text-right" dir="rtl">{jawiResult}</p>
                    </div>
                </div>
            )}
        </div>
      )}

      {activeTab === 'HADITH' && (
        <div className="flex-1 p-4 space-y-6 animate-slide-up overflow-y-auto pb-24">
             <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Carian Hadith</h2>
            </div>
            <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex gap-2">
                <input id="hadith-topic" name="hadith-topic" type="text" value={hadithTopic} onChange={(e) => setHadithTopic(e.target.value)} placeholder="Topik..." className="flex-1 bg-transparent px-4 py-2 text-white outline-none" />
                <button onClick={handleHadithSearch} className="bg-primary text-black w-12 h-12 rounded-xl flex items-center justify-center" title="Cari Hadith"><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            {hadithResult && (
                <div className="bg-slate-800/40 rounded-3xl border border-primary/20 p-6 space-y-6">      
                    <p className="font-arabic text-2xl text-white text-right" dir="rtl">{hadithResult.arabic}</p>
                    <p className="text-slate-300 text-sm italic">"{hadithResult.translation}"</p>
                </div>
            )}
        </div>
      )}

      {activeTab === 'PLANNER' && (
        <div className="flex-1 p-4 space-y-6 animate-slide-up overflow-y-auto pb-24">
            <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-bold text-white">Smart Khatam Planner</h2>
                <p className="text-xs text-slate-400">Jadual bacaan pintar mengikut kesesuaian masa anda.</p>
            </div>
            <KhatamPlanner />
        </div>
      )}
    </div>
  );
};

export default SmartDeen;
