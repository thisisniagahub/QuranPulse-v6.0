import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse } from '../../types';

interface ShareCardProps {
  verse: QuranVerse;
  surahName: string;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ verse, surahName, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'gold'>('dark');
  const [copied, setCopied] = useState(false);

  const themes = {
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      text: 'text-white',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
    },
    light: {
      bg: 'bg-gradient-to-br from-amber-50 via-white to-amber-50',
      text: 'text-slate-800',
      accent: 'text-amber-600',
      border: 'border-amber-200',
    },
    gold: {
      bg: 'bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900',
      text: 'text-amber-100',
      accent: 'text-amber-300',
      border: 'border-amber-500/50',
    },
  };

  const theme = themes[selectedTheme];

  const handleCopyText = async () => {
    const text = `${verse.text_uthmani}\n\n"${verse.translations?.[0]?.text || ''}"\n\n— ${surahName} : ${verse.verse_key.split(':')[1]}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${verse.text_uthmani}\n\n"${verse.translations?.[0]?.text || ''}"\n\n— ${surahName} : ${verse.verse_key.split(':')[1]}\n\n#QuranPulse`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surahName} - Ayat ${verse.verse_key.split(':')[1]}`,
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
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-all"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="max-w-md w-full space-y-6">
        {/* Card Preview */}
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${theme.bg} ${theme.border} border-2 rounded-3xl p-8 shadow-2xl`}
        >
          {/* Decorative Top */}
          <div className={`text-center mb-6 ${theme.accent}`}>
            <span className="text-2xl">﷽</span>
          </div>

          {/* Arabic Text */}
          <p 
            className={`font-uthmani text-center text-2xl leading-[2.5] mb-6 ${theme.text}`}
            dir="rtl"
          >
            {verse.text_uthmani}
          </p>

          {/* Translation */}
          {verse.translations?.[0] && (
            <p className={`text-center text-sm italic mb-6 ${theme.accent} opacity-80`}>
              "{verse.translations[0].text.replace(/<[^>]*>/g, '')}"
            </p>
          )}

          {/* Reference */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-8 h-px ${selectedTheme === 'light' ? 'bg-slate-300' : 'bg-white/20'}`} />
            <p className={`text-xs font-bold tracking-wider uppercase ${theme.accent}`}>
              {surahName} : {verse.verse_key.split(':')[1]}
            </p>
            <div className={`w-8 h-px ${selectedTheme === 'light' ? 'bg-slate-300' : 'bg-white/20'}`} />
          </div>

          {/* Branding */}
          <div className="mt-6 text-center">
            <p className={`text-[10px] font-bold tracking-widest ${theme.accent} opacity-50`}>
              QURANPULSE
            </p>
          </div>
        </motion.div>

        {/* Theme Selector */}
        <div className="flex items-center justify-center gap-3">
          <p className="text-slate-500 text-xs mr-2">Tema:</p>
          {(['dark', 'light', 'gold'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedTheme === t ? 'scale-110 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'
              } ${
                t === 'dark' ? 'bg-slate-800 border-cyan-500' :
                t === 'light' ? 'bg-amber-50 border-amber-300' :
                'bg-amber-700 border-amber-400'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyText}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              copied 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Disalin!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Salin Teks
              </>
            )}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Kongsi
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
