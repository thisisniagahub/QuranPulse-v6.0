import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { askUstazAI } from '../../../services/aiService';

// Themes
const THEMES = [
  { id: 'neon', bg: 'bg-gradient-to-br from-slate-900 to-black', text: 'text-cyan-400', accent: 'border-cyan-500/50', font: 'font-sans' },
  { id: 'islamic', bg: 'bg-emerald-950', text: 'text-amber-200', accent: 'border-amber-500/50', font: 'font-serif' },
  { id: 'minimal', bg: 'bg-white', text: 'text-slate-900', accent: 'border-black', font: 'font-mono' },
  { id: 'sunset', bg: 'bg-gradient-to-tr from-orange-900 to-purple-900', text: 'text-white', accent: 'border-white/20', font: 'font-sans' },
];

const PosterGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("Sesungguhnya bersama kesukaran itu ada kesenangan.");
  const [source, setSource] = useState("Al-Insyirah: 6");
  const [theme, setTheme] = useState(THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Content Gen
  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      // Mocking context for now, ideally user inputs topic
      const prompt = [{
          id: '1', 
          role: 'user' as const, 
          content: 'Berikan satu ayat pendek motivasi Islamik yang puitis berserta sumber (Quran/Hadith) untuk poster media sosial. Format: "Quote|Sumber".'
      }];
      const res = await askUstazAI(prompt as any); // Type cast for simplicity
      const [q, s] = res.split('|');
      if (q) setText(q.replace(/"/g, '').trim());
      if (s) setSource(s.trim());
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Image
  const handleDownload = async () => {
    if (canvasRef.current) {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `quranpulse-poster-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* 1. CONTROLS */}
      <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2">
        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-purple-400"></i> Settings
            </h3>
            
            {/* Input Text */}
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Quote Content</label>
                    <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none min-h-[100px]"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Source / Author</label>
                    <input 
                        value={source} 
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
                    />
                </div>
            </div>

            {/* AI Magic */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {isGenerating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                    Auto-Generate Content
                </button>
            </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Visual Theme</h3>
            <div className="grid grid-cols-2 gap-3">
                {THEMES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t)}
                        className={`h-16 rounded-lg border-2 transition-all ${theme.id === t.id ? 'border-purple-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'} ${t.bg}`}
                    >
                        <span className={`text-xs font-bold ${t.text}`}>{t.id}</span>
                    </button>
                ))}
            </div>
        </div>

        <button 
            onClick={handleDownload}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
        >
            <i className="fa-solid fa-download"></i> Download Poster (HD)
        </button>
      </div>

      {/* 2. CANVAS PREVIEW */}
      <div className="flex-1 bg-black/20 rounded-3xl border border-white/5 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
          
          {/* The Actual Poster Node */}
          <div 
            ref={canvasRef}
            className={`relative aspect-[4/5] w-full max-w-[500px] shadow-2xl shadow-black/50 ${theme.bg} flex flex-col p-12 justify-between overflow-hidden`}
          >
              {/* Decorative Border */}
              <div className={`absolute inset-4 border ${theme.accent} opacity-30 pointer-events-none`}></div>
              
              {/* Header */}
              <div className="flex items-center gap-2 opacity-80">
                  <div className={`w-8 h-8 rounded-full border ${theme.accent} flex items-center justify-center`}>
                      <i className={`fa-solid fa-quran ${theme.text} text-xs`}></i>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.text}`}>QuranPulse</span>
              </div>

              {/* Content */}
              <div className="relative z-10 my-auto">
                  <i className={`fa-solid fa-quote-left text-4xl opacity-20 mb-6 block ${theme.text}`}></i>
                  <h1 className={`text-3xl md:text-4xl font-bold leading-tight mb-6 ${theme.font} ${theme.text}`}>
                      {text}
                  </h1>
                  <div className={`h-1 w-20 ${theme.accent.replace('border', 'bg')} mb-6`}></div>
                  <p className={`text-sm opacity-80 uppercase tracking-widest font-medium ${theme.text}`}>
                      {source}
                  </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end opacity-60">
                  <div className={`text-[8px] ${theme.text}`}>
                      Generated via<br/>QuranPulse AI Studio
                  </div>
                  <div className={`text-2xl ${theme.text}`}>
                      <i className="fa-brands fa-instagram"></i>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default PosterGenerator;
