import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X, Sparkles, Zap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const safeGetStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors
  }
};

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const hasDismissed = safeGetStorage('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    safeSetStorage('pwa_prompt_dismissed', new Date().toISOString());
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center pointer-events-none"
      >
        <div className="relative w-full max-w-md pointer-events-auto">
          {/* Glass Card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_40px_rgba(27,107,90,0.15)] dark:shadow-[0_8px_40px_rgba(27,107,90,0.3)]">

            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-teal-50/50 to-emerald-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950/50" />

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            />

            {/* Content */}
            <div className="relative p-4 md:p-5 flex items-center gap-4">

              {/* App Icon */}
              <motion.div
                className="flex-shrink-0"
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/30 flex items-center justify-center relative">
                  <img
                    src="/logo-primary.png"
                    alt="QuranPulse"
                    className="w-10 h-10 object-contain drop-shadow-md"
                  />
                  {/* Notification Badge */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles size={10} className="text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-base leading-tight tracking-tight">
                  Teman Ibadah Digital Anda
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                  Waktu solat tepat, Ustaz AI 24/7, dan zikir harian — satu app.
                </p>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleInstallClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-teal-600/25 transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Zap size={13} strokeWidth={2.5} className="fill-current" />
                Pasang
              </motion.button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            title="Tutup"
            aria-label="Tutup prompt pemasangan"
            className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all hover:scale-110"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
