import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse } from '../../types';

interface VerseActionMenuProps {
  verse: QuranVerse;
  isOpen: boolean;
  onClose: () => void;
  onBookmark: (verse: QuranVerse) => void;
  onShare: (verse: QuranVerse) => void;
  onCopy: (verse: QuranVerse) => void;
  onHafazan: (verse: QuranVerse) => void;
  onTafsir?: (verse: QuranVerse) => void;
  onNotes?: (verse: QuranVerse) => void;
  onAddToCollection?: (verse: QuranVerse) => void;
  onAskUstaz?: (verse: QuranVerse) => void;
  isBookmarked?: boolean;
  hasNote?: boolean;
}

const VerseActionMenu: React.FC<VerseActionMenuProps> = ({
  verse,
  isOpen,
  onClose,
  onBookmark,
  onShare,
  onCopy,
  onHafazan,
  onTafsir,
  onNotes,
  onAddToCollection,
  onAskUstaz,
  isBookmarked = false,
  hasNote = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    ...(onAskUstaz ? [{
      id: 'ask-ustaz',
      label: 'Tanya Ustaz AI',
      icon: 'fa-robot',
      onClick: () => { onAskUstaz(verse); onClose(); },
      color: 'text-cyan-400'
    }] : []),
    {
      id: 'copy',
      label: 'Salin Ayat',
      icon: 'fa-copy',
      onClick: () => { onCopy(verse); onClose(); },
      color: 'text-cyan-400'
    },
    {
      id: 'share',
      label: 'Kongsi Paparan',
      icon: 'fa-share-nodes',
      onClick: () => { onShare(verse); onClose(); },
      color: 'text-blue-400'
    },
    {
      id: 'bookmark',
      label: isBookmarked ? 'Buang Penanda' : 'Tanda Bacaan',
      icon: isBookmarked ? 'fa-bookmark' : 'fa-bookmark',
      onClick: () => { onBookmark(verse); onClose(); },
      color: 'text-amber-400',
      solid: isBookmarked
    },
    ...(onTafsir ? [{
      id: 'tafsir',
      label: 'Baca Tafsir & Huraian',
      icon: 'fa-book-open',
      onClick: () => { onTafsir(verse); onClose(); },
      color: 'text-emerald-400'
    }] : []),
    ...(onHafazan ? [{
      id: 'hafazan',
      label: 'Masuk Mod Hafazan',
      icon: 'fa-brain',
      onClick: () => { onHafazan(verse); onClose(); },
      color: 'text-purple-400'
    }] : []),
    ...(onNotes ? [{
      id: 'notes',
      label: hasNote ? 'Edit Nota Peribadi' : 'Tambah Nota',
      icon: 'fa-note-sticky',
      onClick: () => { onNotes(verse); onClose(); },
      color: 'text-yellow-400'
    }] : []),
    ...(onAddToCollection ? [{
      id: 'collection',
      label: 'Simpan ke Koleksi',
      icon: 'fa-folder-plus',
      onClick: () => { onAddToCollection(verse); onClose(); },
      color: 'text-pink-400'
    }] : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 z-50 w-64 bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-cyan-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
             <div className="px-4 py-3 border-b border-cyan-500/20 bg-cyan-950/30">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest flex items-center justify-between">
                    <span>SYSTEM MENU</span>
                    <span>{verse.verse_key}</span>
                </span>
             </div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-100 flex items-center gap-3 transition-all group border-l-2 border-transparent hover:border-cyan-400"
              >
                <div className={`w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all ${item.color}`}>
                   <i className={`${item.solid ? 'fa-solid' : 'fa-regular'} ${item.icon} group-hover:text-cyan-300 transition-colors`}></i>
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerseActionMenu;
