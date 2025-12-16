/**
 * Bookmark Button Component
 * A reusable bookmark toggle button for verse cards
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toggleBookmark, isBookmarked } from '@/services/bookmarkService';

interface BookmarkButtonProps {
  surahNumber: number;
  ayahNumber: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onToggle?: (isNowBookmarked: boolean) => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  surahNumber,
  ayahNumber,
  size = 'md',
  showLabel = false,
  className = '',
  onToggle,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  // Check initial bookmark status
  useEffect(() => {
    const checkStatus = async () => {
      const status = await isBookmarked(surahNumber, ayahNumber);
      setBookmarked(status);
      setLoading(false);
    };
    checkStatus();
  }, [surahNumber, ayahNumber]);

  const handleToggle = async () => {
    if (loading || animating) return;
    
    setAnimating(true);
    
    try {
      const isNowBookmarked = await toggleBookmark(surahNumber, ayahNumber);
      setBookmarked(isNowBookmarked);
      onToggle?.(isNowBookmarked);
    } catch (error) {
      console.error('Bookmark toggle failed:', error);
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      disabled={loading}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center gap-2
        transition-all duration-200
        ${bookmarked 
          ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(90,185,255,0.3)]' 
          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
        }
        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        ${className}
      `}
      title={bookmarked ? 'Buang Bookmark' : 'Tambah Bookmark'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <motion.i 
        className={`fa-${bookmarked ? 'solid' : 'regular'} fa-bookmark`}
        animate={{ 
          scale: animating ? [1, 1.3, 1] : 1,
          rotate: animating ? [0, 10, -10, 0] : 0
        }}
        transition={{ duration: 0.3 }}
      />
      {showLabel && (
        <span className="text-xs font-medium">
          {bookmarked ? 'Saved' : 'Save'}
        </span>
      )}
    </motion.button>
  );
};

export default BookmarkButton;
