import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse } from '../../types';

interface VerseToolbarProps {
  verse: QuranVerse;
  onBookmark: (verse: QuranVerse) => void;
  onShare: (verse: QuranVerse) => void;
  onCopy: (verse: QuranVerse) => void;
  onHafazan: (verse: QuranVerse) => void;
  onTafsir?: (verse: QuranVerse) => void;
  onNotes?: (verse: QuranVerse) => void;
  onAddToCollection?: (verse: QuranVerse) => void;
  isBookmarked?: boolean;
  hasNote?: boolean;
}

const VerseToolbar: React.FC<VerseToolbarProps> = ({
  verse,
  onBookmark,
  onShare,
  onCopy,
  onHafazan,
  onTafsir,
  onNotes,
  onAddToCollection,
  isBookmarked = false,
  hasNote = false,
}) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    onCopy(verse);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const tools = [
    {
      id: 'share',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
      label: 'Kongsi',
      onClick: () => onShare(verse),
      color: 'text-blue-400 hover:bg-blue-500/20',
    },
    {
      id: 'hafazan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      label: 'Hafazan',
      onClick: () => onHafazan(verse),
      color: 'text-purple-400 hover:bg-purple-500/20',
    },
    {
      id: 'bookmark',
      icon: isBookmarked ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      label: 'Penanda',
      onClick: () => onBookmark(verse),
      color: isBookmarked ? 'text-amber-400 bg-amber-500/20' : 'text-amber-400 hover:bg-amber-500/20',
    },
    ...(onAddToCollection ? [{
      id: 'collection',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      label: 'Koleksi',
      onClick: () => onAddToCollection(verse),
      color: 'text-cyan-400 hover:bg-cyan-500/20',
    }] : []),
    {
      id: 'copy',
      icon: showCopied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      ),
      label: showCopied ? 'Disalin!' : 'Salin',
      onClick: handleCopy,
      color: showCopied ? 'text-green-400 bg-green-500/20' : 'text-cyan-400 hover:bg-cyan-500/20',
    },
    ...(onTafsir ? [{
      id: 'tafsir',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      label: 'Tafsir',
      onClick: () => onTafsir(verse),
      color: 'text-emerald-400 hover:bg-emerald-500/20',
    }] : []),
    ...(onNotes ? [{
      id: 'notes',
      icon: hasNote ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      label: hasNote ? 'Nota' : 'Tambah Nota',
      onClick: () => onNotes(verse),
      color: hasNote ? 'text-amber-400 bg-amber-500/20' : 'text-amber-400 hover:bg-amber-500/20',
    }] : []),
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-3 border-t border-slate-800/50">
      {tools.map((tool) => (
        <motion.button
          key={tool.id}
          whileTap={{ scale: 0.95 }}
          onClick={tool.onClick}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${tool.color}`}
        >
          {tool.icon}
          <span className="text-[10px] font-bold uppercase tracking-wider">{tool.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default VerseToolbar;
