import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse } from '../../types';

interface BookmarkCollection {
  id: string;
  name: string;
  icon: string;
  color: string;
  verses: string[]; // verse_key array
  createdAt: string;
}

interface BookmarkCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVerse?: QuranVerse | null;
  onAddToCollection?: (collectionId: string) => void;
}

const DEFAULT_COLLECTIONS: BookmarkCollection[] = [
  { id: 'favorites', name: 'Kegemaran', icon: '⭐', color: 'amber', verses: [], createdAt: new Date().toISOString() },
  { id: 'hafazan', name: 'Hafazan', icon: '📖', color: 'purple', verses: [], createdAt: new Date().toISOString() },
  { id: 'study', name: 'Untuk Dikaji', icon: '📚', color: 'cyan', verses: [], createdAt: new Date().toISOString() },
];

const STORAGE_KEY = 'quranpulse_bookmark_collections';

const getStoredCollections = (): BookmarkCollection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading collections:', e);
  }
  return DEFAULT_COLLECTIONS;
};

const storeCollections = (collections: BookmarkCollection[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
};

const COLOR_OPTIONS = [
  { id: 'amber', bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
  { id: 'purple', bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
  { id: 'cyan', bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400' },
  { id: 'emerald', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
  { id: 'rose', bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400' },
  { id: 'blue', bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
];

const ICON_OPTIONS = ['⭐', '📖', '📚', '💡', '🔖', '❤️', '🌙', '✨', '📝', '🎯'];

const BookmarkCollectionsModal: React.FC<BookmarkCollectionsModalProps> = ({
  isOpen,
  onClose,
  currentVerse,
  onAddToCollection
}) => {
  const [collections, setCollections] = useState<BookmarkCollection[]>(getStoredCollections());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('⭐');
  const [newColor, setNewColor] = useState('amber');
  const [selectedCollection, setSelectedCollection] = useState<BookmarkCollection | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCollections(getStoredCollections());
    }
  }, [isOpen]);

  const handleCreateCollection = () => {
    if (!newName.trim()) return;
    
    const newCollection: BookmarkCollection = {
      id: `collection_${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      verses: [],
      createdAt: new Date().toISOString()
    };
    
    const updated = [...collections, newCollection];
    setCollections(updated);
    storeCollections(updated);
    setNewName('');
    setIsCreating(false);
  };

  const handleDeleteCollection = (id: string) => {
    if (id === 'favorites' || id === 'hafazan' || id === 'study') {
      return; // Can't delete default collections
    }
    const updated = collections.filter(c => c.id !== id);
    setCollections(updated);
    storeCollections(updated);
  };

  const handleAddToCollection = (collectionId: string) => {
    if (!currentVerse) return;
    
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        if (!c.verses.includes(currentVerse.verse_key)) {
          return { ...c, verses: [...c.verses, currentVerse.verse_key] };
        }
      }
      return c;
    });
    
    setCollections(updated);
    storeCollections(updated);
    onAddToCollection?.(collectionId);
    onClose();
  };

  const handleRemoveFromCollection = (collectionId: string, verseKey: string) => {
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, verses: c.verses.filter(v => v !== verseKey) };
      }
      return c;
    });
    
    setCollections(updated);
    storeCollections(updated);
  };

  const getColorClasses = (colorId: string) => {
    return COLOR_OPTIONS.find(c => c.id === colorId) || COLOR_OPTIONS[0];
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
          >
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-4 border-b border-slate-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🔖</span>
                    {selectedCollection ? selectedCollection.name : 'Koleksi Penanda'}
                  </h3>
                  <button 
                    onClick={() => selectedCollection ? setSelectedCollection(null) : onClose()}
                    className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all"
                  >
                    {selectedCollection ? '←' : '✕'}
                  </button>
                </div>
                {currentVerse && !selectedCollection && (
                  <p className="text-slate-400 text-sm mt-1">
                    Tambah {currentVerse.verse_key} ke koleksi
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedCollection ? (
                  // Collection Detail View
                  <div className="space-y-3">
                    {selectedCollection.verses.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <p className="text-4xl mb-2">📭</p>
                        <p>Koleksi ini kosong</p>
                      </div>
                    ) : (
                      selectedCollection.verses.map(verseKey => (
                        <div 
                          key={verseKey}
                          className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700"
                        >
                          <span className="text-white font-medium">{verseKey}</span>
                          <button
                            onClick={() => handleRemoveFromCollection(selectedCollection.id, verseKey)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Buang
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                ) : isCreating ? (
                  // Create New Collection Form
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                        Nama Koleksi
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Contoh: Ayat Ketenangan"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                        Ikon
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ICON_OPTIONS.map(icon => (
                          <button
                            key={icon}
                            onClick={() => setNewIcon(icon)}
                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                              newIcon === icon
                                ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                        Warna
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map(color => (
                          <button
                            key={color.id}
                            onClick={() => setNewColor(color.id)}
                            className={`w-10 h-10 rounded-lg ${color.bg} transition-all ${
                              newColor === color.id
                                ? `border-2 ${color.border}`
                                : 'border border-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setIsCreating(false)}
                        className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleCreateCollection}
                        disabled={!newName.trim()}
                        className="flex-1 py-3 bg-cyan-500 text-black rounded-xl font-bold disabled:opacity-50"
                      >
                        Cipta
                      </button>
                    </div>
                  </div>
                ) : (
                  // Collections List
                  <div className="space-y-3">
                    {collections.map(collection => {
                      const colors = getColorClasses(collection.color);
                      const isInCollection = currentVerse && collection.verses.includes(currentVerse.verse_key);
                      
                      return (
                        <div
                          key={collection.id}
                          className={`p-4 rounded-xl border transition-all ${colors.bg} ${colors.border}`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => currentVerse ? handleAddToCollection(collection.id) : setSelectedCollection(collection)}
                              className="flex items-center gap-3 flex-1 text-left"
                            >
                              <span className="text-2xl">{collection.icon}</span>
                              <div>
                                <p className={`font-bold ${colors.text}`}>{collection.name}</p>
                                <p className="text-slate-400 text-xs">{collection.verses.length} ayat</p>
                              </div>
                            </button>
                            
                            {currentVerse && isInCollection && (
                              <span className="text-emerald-400 text-sm">✓ Ditambah</span>
                            )}
                            
                            {!currentVerse && collection.id !== 'favorites' && collection.id !== 'hafazan' && collection.id !== 'study' && (
                              <button
                                onClick={() => handleDeleteCollection(collection.id)}
                                className="text-red-400 hover:text-red-300 text-sm px-2"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Create New Button */}
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full p-4 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
                    >
                      <span>+</span>
                      <span>Cipta Koleksi Baru</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookmarkCollectionsModal;
