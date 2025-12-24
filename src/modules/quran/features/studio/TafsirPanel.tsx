import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse } from '../../../../types';

interface TafsirPanelProps {
  verse: QuranVerse;
  isOpen: boolean;
  onClose: () => void;
}

// Available Tafsir Sources
const TAFSIR_SOURCES = [
  { id: 'ibnkathir', name: 'Ibn Kathir', nameAr: 'ابن كثير', language: 'en' },
  { id: 'jalalayn', name: 'Al-Jalalayn', nameAr: 'الجلالين', language: 'ar' },
  { id: 'qurtubi', name: 'Al-Qurtubi', nameAr: 'القرطبي', language: 'ar' },
  { id: 'tabari', name: 'At-Tabari', nameAr: 'الطبري', language: 'ar' },
  { id: 'saadi', name: "As-Sa'di", nameAr: 'السعدي', language: 'ar' },
  { id: 'muyassar', name: 'Al-Muyassar', nameAr: 'الميسر', language: 'ar' },
];

const TafsirPanel: React.FC<TafsirPanelProps> = ({ verse, isOpen, onClose }) => {
  const [selectedTafsir, setSelectedTafsir] = useState(TAFSIR_SOURCES[0]);
  const [tafsirContent, setTafsirContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Tafsir from API
  useEffect(() => {
    if (!isOpen) return;

    const fetchTafsir = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Using Quran.com API for tafsir
        const [chapterId, verseNumber] = verse.verse_key.split(':');
        const tafsirId = {
          'ibnkathir': 169,
          'jalalayn': 74,
          'qurtubi': 90,
          'tabari': 91,
          'saadi': 170,
          'muyassar': 16
        }[selectedTafsir.id] || 169;

        const response = await fetch(
          `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${verse.verse_key}`
        );

        if (!response.ok) throw new Error('Failed to fetch tafsir');

        const data = await response.json();
        setTafsirContent(data.tafsir?.text || 'Tafsir tidak tersedia untuk ayat ini.');
      } catch (err) {
        console.error('Tafsir fetch error:', err);
        setError('Tidak dapat memuatkan tafsir. Sila cuba lagi.');
        setTafsirContent('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTafsir();
  }, [isOpen, verse.verse_key, selectedTafsir.id]);

  // Clean HTML tags from tafsir content
  const cleanContent = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950/90 backdrop-blur-xl z-[71] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-cyan-500/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 p-5 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    <span>📖</span>
                    Tafsir & Huraian
                  </h3>
                  <p className="text-cyan-200/70 text-sm mt-1 font-mono tracking-wide">
                    Surah {verse.verse_key.split(':')[0]} : Ayat {verse.verse_key.split(':')[1]}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-800/50 text-slate-400 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/50"
                >
                  ✕
                </button>
              </div>

              {/* Verse Preview (Compact) */}
              <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <p className="font-uthmani text-lg text-white text-right leading-loose opacity-90">
                  {verse.text_uthmani}
                </p>
              </div>
            </div>

            {/* Tafsir Source Selector */}
            <div className="p-4 border-b border-white/5 bg-black/20">
              <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-3 font-bold">
                PILIH SUMBER
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {TAFSIR_SOURCES.map(source => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedTafsir(source)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedTafsir.id === source.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-700/50'
                      }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tafsir Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm">Memuatkan tafsir...</p>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Source Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-lg">{selectedTafsir.nameAr}</span>
                    <span>•</span>
                    <span>{selectedTafsir.name}</span>
                  </div>

                  {/* Content */}
                  <div
                    className={`text-slate-300 leading-relaxed ${selectedTafsir.language === 'ar' ? 'text-right font-arabic text-lg' : 'text-base'
                      }`}
                    dir={selectedTafsir.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {cleanContent(tafsirContent)}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cyan-500/20 bg-black/40 backdrop-blur-xl">
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800/50 text-slate-300 font-bold rounded-xl hover:bg-cyan-900/50 hover:text-cyan-400 hover:border hover:border-cyan-500/50 transition-all"
              >
                Tutup Panel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TafsirPanel;
