import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { askUstazAI, convertToJawi, getHadithByTopic, generateLearningPlan } from '../../services/aiService';
import { motion } from "framer-motion";
import UstazAvatar from './UstazAvatar';
import NeuralTyping from './NeuralTyping';
import SuggestionChips from './SuggestionChips';

const SmartDeen: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'CHAT' | 'JAWI' | 'HADITH' | 'PLANNER'>('CHAT');

  // --- Text Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Assalamu Alaikum. I am Ustaz AI. Ask me anything about your Deen (Fiqh, Aqidah). I follow the Shafi'i school of thought.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Jawi State ---
  const [rumiText, setRumiText] = useState('');
  const [jawiResult, setJawiResult] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // --- Hadith State ---
  const [hadithTopic, setHadithTopic] = useState('');
  const [hadithResult, setHadithResult] = useState<any>(null);
  const [isSearchingHadith, setIsSearchingHadith] = useState(false);

  // --- Planner State ---
  const [plannerGoal, setPlannerGoal] = useState('');
  const [planResult, setPlanResult] = useState<any>(null);
  const [isPlanning, setIsPlanning] = useState(false);

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
      content: '',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      const history = messages
        .filter(m => !m.isError)
        .map(m => ({ role: m.role, content: m.content }));
      
      history.push({ role: 'user', content: currentInput });

      const finalResponse = await askUstazAI(
        history as any, 
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );
      
      // Safety: Ensure final state matches full response (in case stream missed a chunk or was fast)
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, content: finalResponse }
          : msg
      ));
      
      setIsLoading(false);
      
    } catch (error) {
       console.error("Chat error:", error);
       setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, content: "Maaf, I encountered a connection issue. Please try again.", isError: true }
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

  // --- Planner Logic ---
  const handleGeneratePlan = async () => {
      if (!plannerGoal.trim() || isPlanning) return;
      setIsPlanning(true);
      setPlanResult(null);
      const result = await generateLearningPlan(plannerGoal);
      setPlanResult(result);
      setIsPlanning(false);
  }

  // --- Live API Logic (Stubbed) ---


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
            
            <div className="flex gap-2">
                 {/* Live Call Button Removed */}
            </div>
         </div>

         {/* Sub-Nav Scrollable for more items */}
         <div className="flex gap-2 relative z-10 mt-1 overflow-x-auto no-scrollbar pb-1">
             <button 
                onClick={() => setActiveTab('CHAT')}
                className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'CHAT' ? 'bg-slate-800 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
             >
                 Tanya Ustaz
             </button>
             <button 
                onClick={() => setActiveTab('JAWI')}
                className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'JAWI' ? 'bg-white/10 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
             >
                 Jawi
             </button>
             <button 
                onClick={() => setActiveTab('HADITH')}
                className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'HADITH' ? 'bg-slate-800 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
             >
                 Hadith
             </button>
             <button 
                onClick={() => setActiveTab('PLANNER')}
                className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'PLANNER' ? 'bg-slate-800 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
             >
                 Planner
             </button>
         </div>
      </div>

      {/* --- CHAT TAB --- */}
      {activeTab === 'CHAT' && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                
                {/* Avatar Stage (Only show when few messages or user wants to feel connection) */}
                <div className="pt-2 pb-4">
                    <UstazAvatar isThinking={useThinking} isSpeaking={isLoading && !useThinking} />
                </div>
                
                {/* Welcome & Suggestions (Only if just starting) */}
                {messages.length <= 1 && (
                     <div className="max-w-md mx-auto animate-fade-in">
                         <p className="text-center text-slate-400 text-sm mb-4">
                             Assalamu Alaikum, {user?.name.split(' ')[0]}. I am your AI companion for Islamic knowledge. How may I assist you today?
                         </p>
                         <SuggestionChips onSelect={(q) => { setInput(q); handleSend(); }} />
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
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-lg backdrop-blur-md border relative overflow-hidden ${
                        msg.role === 'user'
                        ? 'bg-cyan-900/30 border-cyan-500/30 text-white rounded-br-sm'
                        : msg.isError 
                            ? 'bg-red-900/20 border-red-500/50 text-red-200 rounded-bl-sm'
                            : 'bg-slate-900/60 border-slate-700/50 text-slate-200 rounded-bl-sm'
                    }`}
                    >
                        {/* Glow for User Msg */}
                        {msg.role === 'user' && <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>}

                        {msg.role === 'assistant' && !msg.isError && (
                            <div className="flex items-center gap-2 mb-2 opacity-70 border-b border-white/5 pb-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">Ustaz AI</span>
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
                            <span className="text-xs text-cyan-500/70 italic">{useThinking ? 'Compiling sources...' : 'Reasoning...'}</span>
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
                    placeholder={useThinking ? "Ask deep questions..." : "Ask me anything..."}
                    className="flex-1 bg-transparent text-white text-sm p-3 min-h-[44px] max-h-32 resize-none outline-none placeholder:text-slate-500"
                    rows={1}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all mb-0.5 ${
                        useThinking 
                        ? 'bg-amber-500 text-black hover:bg-amber-400' 
                        : 'bg-cyan-500 text-black hover:bg-cyan-400'
                    }`}
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                     <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">
                        AI Scholar v6.0 • Shafi'i Madhab
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                checked={useThinking} 
                                onChange={(e) => setUseThinking(e.target.checked)}
                                className="sr-only" 
                            />
                            <div className={`block w-8 h-4 rounded-full transition-colors border ${useThinking ? 'bg-amber-900/50 border-amber-500' : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'}`}></div>
                            <div className={`absolute left-0.5 top-0.5 w-3 h-3 rounded-full transition-transform shadow-sm ${useThinking ? 'translate-x-4 bg-amber-500' : 'bg-slate-400'}`}></div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${useThinking ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-400'}`}>Deep Mode</span>
                    </label>
                </div>
            </div>
          </>
      )}

      {/* --- OTHER TABS (Code remains same as before but truncated here for brevity, assume they exist) --- */}
      {/* ... [JAWI, HADITH, PLANNER TABS] ... */}
      
      {activeTab === 'JAWI' && (
        <div className="flex-1 p-4 space-y-6 animate-slide-up overflow-y-auto pb-24">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,191,165,0.1)]">
                    <span className="font-arabic text-4xl mb-2">ج</span>
                </div>
                <h3 className="text-xl font-bold text-white">Jawi Converter</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Transform Rumi text into classic Jawi script instantly.</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-1 border border-slate-800 focus-within:border-primary/50 transition-colors">
                <textarea
                  value={rumiText}
                  onChange={(e) => setRumiText(e.target.value)}
                  placeholder="Type here (e.g. Selamat Pagi)"
                  aria-label="Rumi Text Input"
                  className="w-full bg-transparent text-white p-4 min-h-[120px] outline-none resize-none text-base placeholder:text-slate-600"
                />
                <div className="px-4 pb-4">
                     <button onClick={handleJawiConvert} disabled={isConverting || !rumiText.trim()} className="w-full py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                        {isConverting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Convert</>}
                    </button>
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
             {/* Hadith UI Implementation */}
             <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Hadith Finder</h2>
            </div>
            <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex gap-2">
                <input id="hadith-topic" name="hadith-topic" type="text" value={hadithTopic} onChange={(e) => setHadithTopic(e.target.value)} placeholder="Topic..." aria-label="Hadith Topic" className="flex-1 bg-transparent px-4 py-2 text-white outline-none" />
                <button onClick={handleHadithSearch} className="bg-primary text-black w-12 h-12 rounded-xl flex items-center justify-center" aria-label="Search Hadith" title="Search Hadith"><i className="fa-solid fa-magnifying-glass"></i></button>
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
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Learning Planner</h2>
            </div>
             <div className="space-y-4">
                <textarea id="learning-goal" name="learning-goal" value={plannerGoal} onChange={(e) => setPlannerGoal(e.target.value)} placeholder="e.g. Memorize Surah Al-Mulk..." aria-label="Learning Goal" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none h-20" />
                <button onClick={handleGeneratePlan} className="w-full py-4 bg-secondary hover:bg-secondary-hover text-black font-bold rounded-2xl">Generate Schedule</button>
            </div>
            {planResult && (
                <div className="bg-slate-800/30 rounded-3xl border border-secondary/20 p-6">
                    <h3 className="text-white font-bold text-lg mb-4">{planResult.planName}</h3>
                    {planResult.schedule.map((item: any, idx: number) => (
                        <div key={idx} className="mb-4 ml-4 border-l border-slate-700 pl-4 relative">
                            <div className="absolute -left-[21px] top-0 w-3 h-3 bg-secondary rounded-full"></div>
                            <p className="text-xs text-secondary font-bold uppercase">{item.day}</p>
                            <p className="text-sm text-white">{item.task}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SmartDeen;
