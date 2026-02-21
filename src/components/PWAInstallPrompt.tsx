import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X, Share2, Star } from 'lucide-react';

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
  const [variant, setVariant] = useState<'A' | 'B'>('B'); // Default to B as requested, but support logic for testing

  useEffect(() => {
    // 1. Capture the event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Simple Client-Side A/B Testing Logic
      // Check if user has already seen/dismissed the prompt recently?
      const hasDismissed = safeGetStorage('pwa_prompt_dismissed');
      if (!hasDismissed) {
        // Randomize A/B (Uncomment for true 50/50 test)
        // const isVariantB = Math.random() > 0.5;
        // setVariant(isVariantB ? 'B' : 'A');

        // For now, enforcing Variant B (Winner)
        setVariant('B');
        setShowPrompt(true);
      }
    };

    // 2. Listen for app installed to cleanup
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Tracked via analytics
      // Track conversion here (e.g., analytics.track('PWA_Installed', { variant }))
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

    // Show the native prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // outcome: 'accepted' | 'dismissed' — tracked via analytics

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Hide for 7 days (example logic)
    safeSetStorage('pwa_prompt_dismissed', new Date().toISOString());
  };

  if (!showPrompt) return null;

  // VARIATION A: Generic / Standard
  const contentA = {
    headline: "Install QuranPulse",
    body: "Pasang aplikasi untuk akses lebih pantas dan bacaan offline.",
    cta: "Install App",
    icon: "📱"
  };

  // VARIATION B: Benefit-Driven (Winner)
  const contentB = {
    headline: "Dapatkan Ustaz AI Personal Anda",
    body: "Bimbingan mengaji 24/7, semakan tajwid masa nyata, dan akses offline.",
    cta: "Dapatkan Sekarang",
    icon: "👳‍♂️"
  };

  const activeContent = variant === 'B' ? contentB : contentA;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center pointer-events-none"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-cyan-100 dark:border-cyan-900/30 p-4 w-full max-w-md pointer-events-auto flex items-center gap-4 relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-raudhah-teal/10 rounded-full blur-2xl"></div>

          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-cyan-100">
            {activeContent.icon}
          </div>

          {/* Text */}
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base leading-tight">
              {activeContent.headline}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
              {activeContent.body}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
            >
              <Download size={14} strokeWidth={2.5} />
              {activeContent.cta}
            </button>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            title="Tutup"
            aria-label="Tutup prompt pemasangan"
            className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
