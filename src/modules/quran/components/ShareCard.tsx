import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse } from '../../../types';

interface ShareCardProps {
  verse: QuranVerse;
  surahName: string;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ verse, surahName, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'nature' | 'minimal'>('dark');
  const [copied, setCopied] = useState(false);

  // Theme Definitions
  const themes = {
    dark: {
      id: 'dark',
      name: 'Deep Space',
      containerClass: 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border border-cyan-500/20',
      textClass: 'text-white',
      accentClass: 'text-cyan-400',
      decoration: (
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        </div>
      )
    },
    nature: {
      id: 'nature',
      name: 'Nature',
      containerClass: 'bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-500/20',
      textClass: 'text-emerald-50',
      accentClass: 'text-emerald-300',
      decoration: (
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-950 to-transparent"></div>
        </div>
      )
    },
    minimal: {
      id: 'minimal',
      name: 'Minimalist',
      containerClass: 'bg-[#f8fafc] border border-slate-200',
      textClass: 'text-slate-800',
      accentClass: 'text-slate-500',
      decoration: (
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute inset-4 border border-slate-300 rounded-2xl opacity-50"></div>
        </div>
      )
    }
  };

  const currentTheme = themes[selectedTheme];

  const handleCopyText = async () => {
    const text = `${verse.text_uthmani}\n\n\"${verse.translations?.[0]?.text || ''}\"\n\n— ${surahName} : ${verse.verse_key.split(':')[1]}\n\n(Shared via QuranPulse)`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${verse.text_uthmani}\n\n\"${verse.translations?.[0]?.text || ''}\"\n\n— ${surahName} : ${verse.verse_key.split(':')[1]}\n\n#QuranPulse #Tadabbur`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ayat Pilihan: ${surahName}`,
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm z-20"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className="w-full max-w-sm flex flex-col gap-6">
        <h3 className="text-center text-white font-bold text-lg">Kongsi Ayat</h3>

        {/* --- PREVIEW CARD (INSTAGRAM STORY SIZE) --- */}
        <div className="relative aspect-[9/16] w-full shadow-2xl">
          <motion.div
            ref={cardRef}
            key={selectedTheme}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full h-full rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden ${currentTheme.containerClass}`}
          >
            {/* Background Decoration */}
            {currentTheme.decoration}

            {/* Top: Header */}
            <div className="relative z-10 text-center pt-4">
              <span className={`text-3xl font-amiri ${currentTheme.accentClass}`}>﷽</span>
            </div>

            {/* Middle: Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
              {/* Arabic */}
              <p className={`font-uthmani text-center text-3xl leading-[2.2] drop-shadow-sm ${currentTheme.textClass}`} dir="rtl">
                {verse.text_uthmani}
              </p>

              {/* Translation */}
              {verse.translations?.[0] && (
                <div className="relative">
                  <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-4xl opacity-20 font-serif ${currentTheme.textClass}`}>"</span>
                  <p className={`text-center font-serif italic text-sm leading-relaxed px-4 ${selectedTheme === 'minimal' ? 'text-slate-600' : 'text-slate-300'}`}>
                    {verse.translations[0].text.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom: Footer */}
            <div className="relative z-10">
              <div className={`w-full h-px mb-4 opacity-30 ${selectedTheme === 'minimal' ? 'bg-slate-400' : 'bg-white'}`}></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${currentTheme.accentClass}`}>{surahName}</p>
                  <p className={`text-[10px] opacity-70 ${currentTheme.textClass}`}>Ayat {verse.verse_key.split(':')[1]}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold ${currentTheme.textClass}`}>QURAN<span className={currentTheme.accentClass}>PULSE</span></p>
                  <p className={`text-[8px] opacity-60 ${currentTheme.textClass}`}>v6.0</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col gap-4">
          {/* Theme Selector */}
          <div className="flex justify-center gap-3 bg-slate-900/50 p-2 rounded-full backdrop-blur-sm border border-white/10 mx-auto">
            {(['dark', 'nature', 'minimal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedTheme === t ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {themes[t].name}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyText}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {copied ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>}
              {copied ? 'Disalin!' : 'Salin Teks'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3.5 rounded-xl bg-cyan-500 text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              <i className="fa-solid fa-share-nodes"></i>
              Kongsi
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShareCard;