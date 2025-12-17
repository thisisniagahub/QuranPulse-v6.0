/**
 * Verse Share Card Component
 * Generates beautiful shareable cards for social media
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QuranVerse } from '../types';
import html2canvas from 'html2canvas';

interface VerseShareCardProps {
  verse: QuranVerse;
  surahName: string;
  onClose: () => void;
}

// Preset themes for the share card
const themes = [
  {
    name: 'Cyber Night',
    bg: 'bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  {
    name: 'Golden Dawn',
    bg: 'bg-gradient-to-br from-amber-950 via-yellow-900 to-amber-950',
    accent: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  {
    name: 'Royal Purple',
    bg: 'bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-950',
    accent: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  {
    name: 'Forest Green',
    bg: 'bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950',
    accent: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
];

export const VerseShareCard: React.FC<VerseShareCardProps> = ({
  verse,
  surahName,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const theme = themes[selectedTheme];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `quranpulse-${verse.verse_key}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback to copy
      const text = `${verse.text_uthmani}\n\n"${verse.translations?.[0]?.text || ''}"\n\n— ${surahName}:${verse.verse_key.split(':')[1]}`;
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
      return;
    }

    try {
      await navigator.share({
        title: `Quran Pulse - ${surahName}:${verse.verse_key.split(':')[1]}`,
        text: `${verse.translations?.[0]?.text || ''}\n\n— ${surahName}:${verse.verse_key.split(':')[1]}`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        {/* Theme Selector */}
        <div className="flex justify-center gap-2 mb-4">
          {themes.map((t, i) => (
            <button
              key={i}
              onClick={() => setSelectedTheme(i)}
              className={`w-8 h-8 rounded-full ${t.bg} border-2 ${
                selectedTheme === i ? 'border-white' : 'border-transparent'
              } transition-all`}
              title={t.name}
            />
          ))}
        </div>

        {/* The Card */}
        <div
          ref={cardRef}
          className={`${theme.bg} ${theme.border} border rounded-3xl p-8 shadow-2xl`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <p className={`text-xs ${theme.accent} font-bold tracking-wider uppercase mb-1`}>
              {surahName}
            </p>
            <p className="text-white/60 text-xs">
              Ayat {verse.verse_key.split(':')[1]}
            </p>
          </div>

          {/* Arabic Text */}
          <p
            className="text-center text-white font-uthmani text-2xl leading-loose mb-6 drop-shadow-lg"
            dir="rtl"
          >
            {verse.text_uthmani}
          </p>

          {/* Translation */}
          {verse.translations?.[0] && (
            <p className="text-center text-white/80 text-sm italic leading-relaxed mb-6">
              "{verse.translations[0].text.replace(/<[^>]*>/g, '')}"
            </p>
          )}

          {/* Branding */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
            <img src="/logo-full.png" alt="Quran Pulse" className="w-6 h-6" />
            <span className={`text-xs font-bold ${theme.accent}`}>
              Quran Pulse
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <i className="fa-solid fa-download"></i>
            )}
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-share"></i>
            Share
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default VerseShareCard;
