import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranVerse } from '../../types';

interface VerseNotesModalProps {
  verse: QuranVerse | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (verseKey: string, note: string) => void;
  existingNote?: string;
}

const VerseNotesModal: React.FC<VerseNotesModalProps> = ({
  verse,
  isOpen,
  onClose,
  onSave,
  existingNote = ''
}) => {
  const [note, setNote] = useState(existingNote);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNote(existingNote);
    }
  }, [isOpen, existingNote]);

  const handleSave = () => {
    if (!verse) return;
    setIsSaving(true);
    
    // Save to localStorage
    const notesKey = 'quranpulse_verse_notes';
    const existingNotes = JSON.parse(localStorage.getItem(notesKey) || '{}');
    existingNotes[verse.verse_key] = {
      note,
      updatedAt: new Date().toISOString(),
      verseText: verse.text_uthmani?.substring(0, 50)
    };
    localStorage.setItem(notesKey, JSON.stringify(existingNotes));
    
    onSave(verse.verse_key, note);
    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    if (!verse) return;
    
    const notesKey = 'quranpulse_verse_notes';
    const existingNotes = JSON.parse(localStorage.getItem(notesKey) || '{}');
    delete existingNotes[verse.verse_key];
    localStorage.setItem(notesKey, JSON.stringify(existingNotes));
    
    onSave(verse.verse_key, '');
    onClose();
  };

  if (!verse) return null;

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-full max-w-lg mx-4"
          >
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📝</span>
                  Nota Peribadi
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Surah {verse.verse_key.split(':')[0]}, Ayat {verse.verse_key.split(':')[1]}
                </p>
              </div>

              {/* Verse Preview */}
              <div className="p-4 border-b border-slate-800">
                <p className="font-uthmani text-lg text-white text-right leading-loose" dir="rtl">
                  {verse.text_uthmani.substring(0, 100)}
                  {verse.text_uthmani.length > 100 && '...'}
                </p>
              </div>

              {/* Note Input */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                    Nota Anda
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tulis refleksi, pengajaran, atau nota peribadi anda di sini..."
                    className="w-full h-40 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    autoFocus
                  />
                  <p className="text-slate-500 text-xs mt-2 text-right">
                    {note.length} aksara
                  </p>
                </div>

                {/* Tips */}
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                  <p className="text-amber-400 font-bold text-xs mb-1">💡 Tips</p>
                  <p className="text-slate-400 text-xs">
                    Nota anda disimpan secara lokal dan boleh diakses bila-bila masa.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  {existingNote && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-3 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-all"
                    >
                      🗑️
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        Simpan Nota
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VerseNotesModal;
