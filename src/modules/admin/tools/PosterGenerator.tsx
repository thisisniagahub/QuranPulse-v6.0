import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { askUstazAI } from '../../../services/aiService';
import { Wand2, Download, Image as ImageIcon, Sparkles, Loader2, Palette } from 'lucide-react';

// Themes
const THEMES = [
  { id: 'neon', name: 'Cyber Deen', bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#0c4a6e]', text: 'text-cyan-400', accent: 'border-cyan-500/50', font: 'font-sans' },
  { id: 'islamic', name: 'Royal Gold', bg: 'bg-[#0f172a]', text: 'text-amber-200', accent: 'border-amber-500/50', font: 'font-serif' },
  { id: 'minimal', name: 'Clean White', bg: 'bg-white', text: 'text-slate-900', accent: 'border-black', font: 'font-mono' },
  { id: 'sunset', name: 'Maghrib Vibe', bg: 'bg-gradient-to-tr from-orange-900 to-purple-900', text: 'text-white', accent: 'border-white/20', font: 'font-sans' },
];

const PosterGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("Sesungguhnya bersama kesukaran itu ada kesenangan.");
  const [source, setSource] = useState("Al-Insyirah: 6");
  const [theme, setTheme] = useState(THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Content Gen
  const handleAiGenerate = async () => {
    if (!topic) return alert("Please enter a topic first (e.g., 'Sabar', 'Rezeki')");
    
    setIsGenerating(true);
    try {
      const prompt = [
          {
              id: 'sys',
              role: 'system' as const,
              content: 'Anda adalah pereka konten Islamik kreatif. Berikan satu ayat pendek (quote) yang puitis dan mendalam berserta sumber (Quran/Hadith) berdasarkan topik. Format WAJIB: "Quote|Sumber". Contoh: "Sabar itu indah|Yusuf: 83". Jangan bagi penjelasan lain.',
              timestamp: Date.now()
          },
          {
              id: 'usr', 
              role: 'user' as const, 
              content: `Topik: ${topic}`,
              timestamp: Date.now()
          }
      ];
      
      const res = await askUstazAI(prompt as any); 
      
      // Safe parsing
      const parts = res.split('|');
      if (parts.length >= 2) {
          setText(parts[0].replace(/"/g, '').trim());
          setSource(parts[1].trim());
      } else {
          // Fallback if AI messes up format
          setText(res.replace(/"/g, '').trim());
          setSource("Ustaz AI");
      }
    } catch (e) {
      console.error(e);
      alert("AI Generation failed. Check API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Image
  const handleDownload = async () => {
    if (canvasRef.current) {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `quranpulse-poster-${topic || 'quote'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* 1. CONTROLS */}
      <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Generator Panel */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-purple-400" /> 
                AI Content Studio
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-bold">Topic / Keyword</label>
                    <div className="flex gap-2">
                        <input 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Sabar, Rezeki, Ujian..."
                            className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none placeholder:text-slate-600"
                            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                        />
                        <button 
                            onClick={handleAiGenerate}
                            disabled={isGenerating || !topic}
                            className="px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        >
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-bold">Quote Editor</label>
                    <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none min-h-[100px] mb-3"
                    />
                    <input 
                        value={source} 
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Palette className="w-4 h-4 text-cyan-400" />
                Visual Theme
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {THEMES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t)}
                        className={`relative h-16 rounded-xl border-2 transition-all overflow-hidden group ${theme.id === t.id ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'}`}
                    >
                        <div className={`absolute inset-0 ${t.bg}`}></div>
                        <span className={`relative z-10 text-xs font-bold ${t.text}`}>{t.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <button 
            onClick={handleDownload}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
        >
            <Download className="w-5 h-5" /> Download HD Poster
        </button>
      </div>

      {/* 2. CANVAS PREVIEW */}
      <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center p-8 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
          
          {/* The Actual Poster Node */}
          <div 
            ref={canvasRef}
            className={`relative aspect-[4/5] w-full max-w-[480px] shadow-2xl shadow-black/80 ${theme.bg} flex flex-col p-12 justify-between overflow-hidden transition-all duration-500`}
          >
              {/* Decorative Border */}
              <div className={`absolute inset-6 border ${theme.accent} opacity-30 pointer-events-none`}></div>
              
              {/* Header */}
              <div className="flex items-center gap-3 opacity-90">
                  <div className={`w-10 h-10 rounded-xl border ${theme.accent} flex items-center justify-center backdrop-blur-sm`}>
                      <ImageIcon className={`w-5 h-5 ${theme.text}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.text}`}>QuranPulse</span>
                    <span className={`text-[8px] opacity-60 uppercase tracking-widest ${theme.text}`}>Daily Reminders</span>
                  </div>
              </div>

              {/* Content */}
              <div className="relative z-10 my-auto">
                  <div className="text-6xl opacity-10 absolute -top-10 -left-4">❝</div>
                  <h1 className={`text-3xl md:text-4xl font-bold leading-tight mb-8 relative z-10 ${theme.font} ${theme.text} drop-shadow-lg`}>
                      {text}
                  </h1>
                  <div className={`h-1 w-24 ${theme.accent.replace('border', 'bg')} mb-6 opacity-80`}></div>
                  <p className={`text-sm opacity-90 uppercase tracking-widest font-medium ${theme.text} flex items-center gap-2`}>
                      <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                      {source}
                  </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end opacity-60 border-t border-current pt-4 border-opacity-20">
                  <div className={`text-[8px] uppercase tracking-widest ${theme.text}`}>
                      Generated via<br/>QuranPulse AI Studio
                  </div>
                  <div className={`text-xl ${theme.text}`}>
                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-50">
                        <span className="text-[10px] font-bold">QP</span>
                    </div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default PosterGenerator;