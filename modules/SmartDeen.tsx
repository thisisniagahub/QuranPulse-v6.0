
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askUstazAI, convertToJawi, getHadithByTopic, generateLearningPlan } from '../services/geminiService';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { motion } from "framer-motion";

// --- Audio Utils for Gemini Live API ---

function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Safety check for alignment
  if (bytes.byteLength % 2 !== 0) {
      return new Float32Array(0);
  }

  // Convert Int16 PCM (from Gemini) to Float32 for AudioContext
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

function float32To16BitPCM(float32Arr: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Arr.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Arr.length; i++) {
    // Clamp and convert to Int16
    const s = Math.max(-1, Math.min(1, float32Arr[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true); // Little endian
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

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

  // --- Live Voice Call State ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'reconnecting'>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking

  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Canvas Visualizer Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askUstazAI(userMsg.content, useThinking);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
       const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Maaf, I encountered a connection issue. Please try again.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
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

  // --- CANVAS VISUALIZER LOGIC ---
  const drawVisualizer = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const analyser = analyserRef.current;
      
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const draw = () => {
          animationFrameRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Center variables
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const radius = 40; // Base circle size

          // Calculate average volume for pulse
          let sum = 0;
          for(let i=0; i<bufferLength; i++) sum += dataArray[i];
          const avg = sum / bufferLength;
          const scale = 1 + (avg / 256) * 1.5;

          // Draw Glow
          const gradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius * 3 * scale);
          gradient.addColorStop(0, 'rgba(45, 212, 191, 0.6)'); // Teal center
          gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');
          
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 2 * scale, 0, 2 * Math.PI);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Draw Waveform Ring
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#2dd4bf'; // Teal Pulse color

          for (let i = 0; i < bufferLength; i++) {
              const amp = dataArray[i] / 2; // Amplitude
              const angle = (i / bufferLength) * Math.PI * 2;
              
              const r = radius + amp; // Modulate radius by amplitude
              const x = cx + r * Math.cos(angle);
              const y = cy + r * Math.sin(angle);

              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();

          // Draw Core Circle
          ctx.beginPath();
          ctx.arc(cx, cy, radius * scale, 0, 2 * Math.PI);
          ctx.fillStyle = '#0f766e';
          ctx.fill();
      };
      
      draw();
  };


  // --- Live API Logic ---
  const startLiveSession = async () => {
    try {
      // API Key Check
      try {
        if ((window as any).aistudio) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                const success = await (window as any).aistudio.openSelectKey();
                if (!success) return;
            }
        }
      } catch (e) {
          console.warn("API Check skipped", e);
      }

      setIsLiveActive(true);
      setConnectionStatus('connecting');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // 1. Setup Audio Output
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      await audioContextRef.current.resume();
      nextStartTimeRef.current = audioContextRef.current.currentTime;

      // 2. Setup Audio Input
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      await inputContextRef.current.resume();
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 3. Connect to Gemini Live
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } 
            },
            systemInstruction: "You are a friendly, wise, and empathetic Islamic scholar (Ustaz). You provide brief, clear, and reassuring answers about Islam, Fiqh, and daily life. Keep responses natural and conversational.",
        },
        callbacks: {
            onopen: () => {
                setConnectionStatus('connected');
                startMicrophoneStream();
            },
            onmessage: async (message: LiveServerMessage) => {
                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    setIsSpeaking(true);
                    playAudioChunk(base64Audio);
                }
                if (message.serverContent?.turnComplete) {
                    setIsSpeaking(false);
                }
                if (message.serverContent?.interrupted) {
                     stopAudioPlayback();
                     setIsSpeaking(false);
                     if (audioContextRef.current) {
                        nextStartTimeRef.current = audioContextRef.current.currentTime;
                     }
                }
            },
            onclose: () => {
                setConnectionStatus('disconnected');
            },
            onerror: (err) => {
                console.error("Live API Error:", err);
                setConnectionStatus('reconnecting');
            }
        }
      });

    } catch (error) {
        console.error("Failed to start live session:", error);
        stopLiveSession();
    }
  };

  const startMicrophoneStream = () => {
      if (!inputContextRef.current || !streamRef.current || !sessionPromiseRef.current) return;

      const ctx = inputContextRef.current;
      const source = ctx.createMediaStreamSource(streamRef.current);
      
      // ANALYSER NODE for Visualizer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser); // Connect source to analyser
      
      // ScriptProcessor for Data Sending
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = float32To16BitPCM(inputData);
          const base64 = arrayBufferToBase64(pcm16);

          sessionPromiseRef.current?.then(session => {
              session.sendRealtimeInput({
                  media: {
                      mimeType: "audio/pcm;rate=16000",
                      data: base64
                  }
              });
          }).catch(err => console.error(err));
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      workletNodeRef.current = processor;
      
      // Start Visualizer Loop
      drawVisualizer();
  };

  const playAudioChunk = (base64: string) => {
      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      const float32 = base64ToFloat32Array(base64);
      if (float32.length === 0) return;

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + buffer.duration;
      
      sourcesRef.current.add(source);
      source.onended = () => {
          sourcesRef.current.delete(source);
          if (sourcesRef.current.size === 0) setIsSpeaking(false);
      };
  };

  const stopAudioPlayback = () => {
      sourcesRef.current.forEach(source => { try { source.stop(); } catch(e){} });
      sourcesRef.current.clear();
  };

  const stopLiveSession = () => {
      // Stop Visualizer
      if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
      }
      
      if (workletNodeRef.current) {
          workletNodeRef.current.disconnect();
          workletNodeRef.current = null;
      }
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (inputContextRef.current) {
          inputContextRef.current.close();
          inputContextRef.current = null;
      }
      if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
      }
      
      stopAudioPlayback();
      setIsLiveActive(false);
      setConnectionStatus('disconnected');
  };

  return (
    <div className="flex flex-col h-full relative bg-islamic-dark">
      {/* Header Context with Maze Pattern */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-teal-pulse/20 p-3 flex flex-col gap-2 px-4 z-10 relative overflow-hidden shadow-lg">
         <div className="absolute inset-0 bg-maze opacity-10 pointer-events-none"></div>
         
         <div className="flex items-center justify-between relative z-10">
             <div className="inline-flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${useThinking ? 'bg-blue-500 animate-pulse text-blue-500' : 'bg-teal-pulse text-teal-pulse'}`}></div>
                <div>
                    <h3 className="text-sm font-bold text-white leading-none">Smart Deen AI</h3>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${useThinking ? 'text-blue-400' : 'text-slate-400'}`}>
                        {useThinking ? 'Deep Reasoning' : 'Standard Mode'}
                    </span>
                </div>
            </div>
            
            <div className="flex gap-2">
                 <button 
                    onClick={startLiveSession}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-[0_0_10px_rgba(22,163,74,0.4)] animate-pulse-slow"
                >
                    <i className="fa-solid fa-phone-volume"></i> Call
                </button>
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
                className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'JAWI' ? 'bg-slate-800 text-white shadow-inner border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
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
                        ? 'bg-teal-900/20 border border-teal-pulse/30 text-white rounded-br-none'
                        : msg.isError 
                            ? 'bg-red-900/20 border border-red-500/50 text-red-200 rounded-bl-none'
                            : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}
                    >
                    {/* Subtle grid for user messages */}
                    {msg.role === 'user' && <div className="absolute inset-0 bg-maze opacity-5 pointer-events-none"></div>}

                    {msg.role === 'assistant' && !msg.isError && (
                        <div className="flex items-center gap-2 mb-2 opacity-70 border-b border-white/10 pb-1">
                        <i className="fa-solid fa-user-graduate text-xs text-teal-pulse"></i>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-teal-pulse">Ustaz AI</span>
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
                        <span className="w-1.5 h-1.5 bg-teal-pulse rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-teal-pulse rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-teal-pulse rounded-full animate-bounce delay-200"></span>
                        </div>
                        {useThinking && <span className="text-xs text-blue-400 italic flex items-center gap-1"><i className="fa-solid fa-brain"></i> Thinking deeply...</span>}
                    </div>
                    </div>
                </div>
                )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 relative z-20">
                <div className={`flex gap-2 items-end bg-slate-800/50 p-2 rounded-xl border transition-colors backdrop-blur-md ${useThinking ? 'border-blue-500/30 focus-within:border-blue-500' : 'border-slate-700 focus-within:border-teal-pulse'}`}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={useThinking ? "Ask complex questions (e.g. Inheritance logic)..." : "Ask about Fiqh, Daily life..."}
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
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' 
                        : 'bg-teal-pulse text-black hover:bg-teal-400 shadow-teal-500/20'
                    }`}
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
                            <div className={`block w-8 h-4 rounded-full transition-colors border ${useThinking ? 'bg-blue-900/50 border-blue-500' : 'bg-slate-800 border-slate-600'}`}></div>
                            <div className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${useThinking ? 'translate-x-4 bg-blue-200' : ''}`}></div>
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
                <div className="w-16 h-16 bg-teal-900/20 rounded-2xl flex items-center justify-center mx-auto text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                    <span className="font-arabic text-4xl mb-2">ج</span>
                </div>
                <h3 className="text-xl font-bold text-white">Jawi Converter</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Transform Rumi text into classic Jawi script instantly.</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-1 border border-slate-800 focus-within:border-teal-500/50 transition-colors">
                <textarea
                  value={rumiText}
                  onChange={(e) => setRumiText(e.target.value)}
                  placeholder="Type here (e.g. Selamat Pagi)"
                  className="w-full bg-transparent text-white p-4 min-h-[120px] outline-none resize-none text-base placeholder:text-slate-600"
                />
                <div className="px-4 pb-4">
                     <button onClick={handleJawiConvert} disabled={isConverting || !rumiText.trim()} className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
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
                <input type="text" value={hadithTopic} onChange={(e) => setHadithTopic(e.target.value)} placeholder="Topic..." className="flex-1 bg-transparent px-4 py-2 text-white outline-none" />
                <button onClick={handleHadithSearch} className="bg-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center"><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            {hadithResult && (
                <div className="bg-slate-800/40 rounded-3xl border border-purple-500/20 p-6 space-y-6">
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
                <textarea value={plannerGoal} onChange={(e) => setPlannerGoal(e.target.value)} placeholder="e.g. Memorize Surah Al-Mulk..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none h-20" />
                <button onClick={handleGeneratePlan} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl">Generate Schedule</button>
            </div>
            {planResult && (
                <div className="bg-slate-800/30 rounded-3xl border border-blue-500/20 p-6">
                    <h3 className="text-white font-bold text-lg mb-4">{planResult.planName}</h3>
                    {planResult.schedule.map((item: any, idx: number) => (
                        <div key={idx} className="mb-4 ml-4 border-l border-slate-700 pl-4 relative">
                            <div className="absolute -left-[21px] top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                            <p className="text-xs text-blue-400 font-bold uppercase">{item.day}</p>
                            <p className="text-sm text-white">{item.task}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}


      {/* --- LIVE CALL OVERLAY (Canvas Version) --- */}
      {isLiveActive && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
              <button onClick={stopLiveSession} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <div className="mb-12 text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">Voice Call with Ustaz</h2>
                      <p className={`text-sm font-medium uppercase tracking-widest ${connectionStatus === 'connected' ? 'text-teal-400' : 'text-yellow-500'}`}>
                          {connectionStatus === 'connected' ? (isSpeaking ? 'Ustaz Speaking...' : 'Listening...') : 'Connecting...'}
                      </p>
                  </div>

                  {/* CANVAS VISUALIZER */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                       <canvas ref={canvasRef} width="256" height="256" className="absolute inset-0 w-full h-full" />
                       <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center shadow-lg relative z-10 border border-slate-700">
                           <i className={`fa-solid ${isSpeaking ? 'fa-user-graduate' : 'fa-microphone'} text-2xl text-white`}></i>
                       </div>
                  </div>
              </div>

              <div className="flex items-center gap-6 mb-8">
                  <button onClick={stopLiveSession} className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-transform hover:scale-105 active:scale-95">
                      <i className="fa-solid fa-phone-slash text-2xl"></i>
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default SmartDeen;
