import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askUstazAI, convertToJawi, getHadithByTopic, generateLearningPlan } from '../services/aiService';
import { motion } from "framer-motion";

const SmartDeen: React.FC = () => {
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

      await askUstazAI(
        history as any, 
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );
      
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
    <div className="flex flex-col h-full relative bg-space-dark">
      {/* Header Context with Maze Pattern */}
      <div className="bg-space-dark/90 backdrop-blur border-b border-white/10 p-3 flex flex-col gap-2 px-4 z-10 relative overflow-hidden shadow-lg">
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                    <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-md relative overflow-hidden ${
                        msg.role === 'user'
                        ? 'bg-primary/20 border border-primary/30 text-white rounded-br-none'
                        : msg.isError 
                            ? 'bg-red-900/20 border border-red-500/50 text-red-200 rounded-bl-none'
                            : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
                    }`}
                    >
                    {/* Subtle grid for user messages */}
                    {msg.role === 'user' && <div className="absolute inset-0 bg-maze opacity-5 pointer-events-none"></div>}

                    {msg.role === 'assistant' && !msg.isError && (
                        <div className="flex items-center gap-2 mb-2 opacity-70 border-b border-white/10 pb-1">
                        <i className="fa-solid fa-user-graduate text-xs text-primary"></i>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-primary">Ustaz AI</span>
                        </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">{msg.content}</div>
                    </div>
                </div>
                ))}
                
                {isLoading && (
                <div className="flex justify-start animate-fade-in">
                    <div className="bg-slate-800/50 rounded-2xl rounded-bl-none p-4 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                        </div>
                        {useThinking && <span className="text-xs text-secondary italic flex items-center gap-1"><i className="fa-solid fa-brain"></i> Thinking deeply...</span>}
                    </div>
                    </div>
                </div>
                )}
            </div>

            <div className="p-4 bg-space-dark border-t border-white/10 relative z-20">
                <div className={`flex gap-2 items-end bg-white/5 p-2 rounded-xl border transition-colors backdrop-blur-md ${useThinking ? 'border-secondary/30 focus-within:border-secondary' : 'border-white/10 focus-within:border-primary'}`}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={useThinking ? "Ask complex questions (e.g. Inheritance logic)..." : "Ask about Fiqh, Daily life..."}
                    aria-label="Chat Input"
                    className="flex-1 bg-transparent text-white text-sm p-2 min-h-[44px] max-h-32 resize-none outline-none placeholder:text-slate-500"
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
                    className={`w-10 h-10 rounded-lg text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mb-0.5 transform active:scale-95 ${
                        useThinking 
                        ? 'bg-secondary hover:bg-secondary-hover text-black shadow-secondary/20' 
                        : 'bg-primary text-black hover:bg-primary-hover shadow-primary/20'
                    }`}
                    aria-label="Send Message"
                    title="Send Message"
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                     <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wide opacity-70">
                        AI can make mistakes. Verify with a scholar.
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Thinking Mode</span>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                checked={useThinking} 
                                onChange={(e) => setUseThinking(e.target.checked)}
                                className="sr-only" 
                            />
                            <div className={`block w-8 h-4 rounded-full transition-colors border ${useThinking ? 'bg-secondary/20 border-secondary' : 'bg-slate-800 border-slate-600'}`}></div>
                            <div className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${useThinking ? 'translate-x-4 bg-secondary' : ''}`}></div>
                        </div>
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
                <input type="text" value={hadithTopic} onChange={(e) => setHadithTopic(e.target.value)} placeholder="Topic..." aria-label="Hadith Topic" className="flex-1 bg-transparent px-4 py-2 text-white outline-none" />
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
                <textarea value={plannerGoal} onChange={(e) => setPlannerGoal(e.target.value)} placeholder="e.g. Memorize Surah Al-Mulk..." aria-label="Learning Goal" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none h-20" />
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
