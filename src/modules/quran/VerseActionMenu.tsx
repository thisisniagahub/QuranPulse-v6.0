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
          transition={{ duration: 0.1 }}
          className="absolute right-0 top-10 z-50 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
             <div className="px-4 py-2 border-b border-white/5 bg-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pilihan Ayat {verse.verse_key}</span>
             </div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-white/5 flex items-center gap-3 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors ${item.color}`}>
                   <i className={`${item.solid ? 'fa-solid' : 'fa-regular'} ${item.icon}`}></i>
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerseActionMenu;
