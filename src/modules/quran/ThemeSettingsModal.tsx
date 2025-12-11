import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ThemeType = 'dark' | 'light' | 'sepia' | 'auto';
type FontType = 'uthmani' | 'indopak' | 'tajweed';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  currentFont: FontType;
  onThemeChange: (theme: ThemeType) => void;
  onFontChange: (font: FontType) => void;
}

const THEMES: { id: ThemeType; name: string; icon: string; preview: { bg: string; text: string; accent: string } }[] = [
  { 
    id: 'dark', 
    name: 'Gelap', 
    icon: '🌙',
    preview: { bg: 'bg-slate-900', text: 'text-white', accent: 'bg-cyan-500' }
  },
  { 
    id: 'light', 
    name: 'Cerah', 
    icon: '☀️',
    preview: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-blue-500' }
  },
  { 
    id: 'sepia', 
    name: 'Sepia', 
    icon: '📜',
    preview: { bg: 'bg-amber-50', text: 'text-amber-900', accent: 'bg-amber-600' }
  },
  { 
    id: 'auto', 
    name: 'Auto', 
    icon: '🔄',
    preview: { bg: 'bg-gradient-to-r from-slate-900 to-white', text: 'text-white', accent: 'bg-purple-500' }
  },
];

const FONTS: { id: FontType; name: string; nameAr: string; description: string; sample: string }[] = [
  { 
    id: 'uthmani', 
    name: 'Uthmani', 
    nameAr: 'عثماني',
    description: 'Font standard Mushaf Uthmani',
    sample: 'بِسْمِ اللَّهِ'
  },
  { 
    id: 'indopak', 
    name: 'IndoPak', 
    nameAr: 'إندوباك',
    description: 'Gaya tulisan Asia Selatan',
    sample: 'بِسْمِ اللَّهِ'
  },
  { 
    id: 'tajweed', 
    name: 'Tajweed', 
    nameAr: 'تجويد',
    description: 'Dengan warna hukum tajwid',
    sample: 'بِسْمِ اللَّهِ'
  },
];

const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentFont,
  onThemeChange,
  onFontChange
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'font'>('theme');

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-full max-w-md mx-4"
          >
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🎨</span>
                  Tema & Font
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-950 border-b border-slate-800">
                {[
                  { id: 'theme', label: 'Tema', icon: '🎨' },
                  { id: 'font', label: 'Font Arab', icon: '✍️' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                      activeTab === tab.id
                        ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {activeTab === 'theme' && (
                  <div className="grid grid-cols-2 gap-3">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          currentTheme === theme.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {/* Preview */}
                        <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview.bg} flex items-center justify-center overflow-hidden`}>
                          {theme.id === 'auto' ? (
                            <div className="flex w-full h-full">
                              <div className="w-1/2 bg-slate-900 flex items-center justify-center">
                                <span className="text-white text-xs">🌙</span>
                              </div>
                              <div className="w-1/2 bg-white flex items-center justify-center">
                                <span className="text-gray-900 text-xs">☀️</span>
                              </div>
                            </div>
                          ) : (
                            <div className={`w-8 h-1 rounded ${theme.preview.accent}`} />
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">{theme.icon}</span>
                          <span className={`font-bold ${currentTheme === theme.id ? 'text-purple-400' : 'text-white'}`}>
                            {theme.name}
                          </span>
                        </div>
                        
                        {currentTheme === theme.id && (
                          <div className="mt-2 text-center">
                            <span className="text-xs text-purple-400">✓ Aktif</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'font' && (
                  <div className="space-y-3">
                    {FONTS.map(font => (
                      <button
                        key={font.id}
                        onClick={() => onFontChange(font.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          currentFont === font.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`font-bold ${currentFont === font.id ? 'text-purple-400' : 'text-white'}`}>
                              {font.name}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">{font.description}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-arabic text-xl ${
                              font.id === 'tajweed' ? 'text-emerald-400' : 'text-white'
                            }`}>
                              {font.sample}
                            </p>
                            {currentFont === font.id && (
                              <span className="text-xs text-purple-400">✓ Aktif</span>
                            )}
                          </div>
                        </div>
                        
                        {font.id === 'tajweed' && (
                          <div className="mt-2 flex gap-1">
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Ghunnah</span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Idgham</span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Ikhfa</span>
                          </div>
                        )}
                      </button>
                    ))}

                    {/* Info */}
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <p className="text-purple-400 font-bold text-xs mb-1">💡 Info</p>
                      <p className="text-slate-400 text-xs">
                        Font Tajweed akan memaparkan warna berbeza mengikut hukum tajwid untuk memudahkan bacaan.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all"
                >
                  Selesai
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemeSettingsModal;
