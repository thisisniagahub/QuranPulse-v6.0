import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface AchievementToastProps {
  isVisible: boolean;
  title: string;
  description?: string;
  xpReward?: number;
  durationMs?: number;
  onClose?: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({
  isVisible,
  title,
  description,
  xpReward,
  durationMs = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (!isVisible || !onClose) return;

    const timer = window.setTimeout(() => onClose(), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-4 z-[90] w-[320px] rounded-2xl border border-amber-400/40 bg-slate-900/95 p-4 shadow-[0_0_35px_rgba(251,191,36,0.2)]"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-amber-500/20 p-2 text-amber-300">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{title}</p>
              {description && (
                <p className="mt-1 text-xs text-slate-300">{description}</p>
              )}
              {typeof xpReward === 'number' && (
                <p className="mt-2 text-xs font-bold text-raudhah-teal">+{xpReward} XP</p>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close achievement toast"
              >
                x
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementToast;
