/**
 * Skeleton Components for Loading States
 * Premium glassmorphism skeleton loaders
 */

import React from 'react';
import { motion } from 'framer-motion';

// Base shimmer animation
const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'xl' | '2xl' | '3xl';
}

// Base Skeleton Block
export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  rounded = 'lg' 
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return (
    <div className={`relative overflow-hidden bg-white/5 ${roundedClasses[rounded]} ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

// Verse Card Skeleton
export const VerseCardSkeleton: React.FC = () => (
  <div className="py-8 px-6 bg-slate-900/40 rounded-xl border border-white/10 my-3">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="w-8 h-8" rounded="full" />
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8" rounded="full" />
        <Skeleton className="w-8 h-8" rounded="full" />
        <Skeleton className="w-8 h-8" rounded="full" />
      </div>
    </div>
    
    {/* Arabic Text */}
    <div className="text-center mb-6">
      <Skeleton className="h-12 w-3/4 mx-auto mb-2" rounded="lg" />
      <Skeleton className="h-12 w-2/3 mx-auto" rounded="lg" />
    </div>
    
    {/* Transliteration */}
    <Skeleton className="h-4 w-2/3 mx-auto mb-4" rounded="md" />
    
    {/* Translation */}
    <div className="border-t border-slate-800/50 pt-4 mt-4">
      <Skeleton className="h-4 w-full mb-2" rounded="md" />
      <Skeleton className="h-4 w-4/5 mx-auto" rounded="md" />
    </div>
  </div>
);

// Surah List Item Skeleton
export const SurahCardSkeleton: React.FC = () => (
  <div className="p-4 bg-slate-900/40 rounded-xl border border-white/10 flex items-center gap-4">
    <Skeleton className="w-12 h-12" rounded="xl" />
    <div className="flex-1">
      <Skeleton className="h-5 w-32 mb-2" rounded="md" />
      <Skeleton className="h-3 w-24" rounded="sm" />
    </div>
    <Skeleton className="h-8 w-8" rounded="full" />
  </div>
);

// Chat Message Skeleton
export const ChatMessageSkeleton: React.FC = () => (
  <div className="flex gap-3 mb-4">
    <Skeleton className="w-10 h-10 shrink-0" rounded="full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-24 mb-2" rounded="md" />
      <Skeleton className="h-20 w-full" rounded="xl" />
    </div>
  </div>
);

// Prayer Times Skeleton
export const PrayerTimesSkeleton: React.FC = () => (
  <div className="flex gap-4 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="w-20 h-24 shrink-0" rounded="xl" />
    ))}
  </div>
);

// Dashboard Bento Card Skeleton
export const BentoCardSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };
  
  return (
    <div className={`p-4 bg-slate-900/40 rounded-2xl border border-white/10 ${sizeClasses[size]}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10" rounded="xl" />
        <Skeleton className="h-5 w-24" rounded="md" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" rounded="lg" />
      <Skeleton className="h-3 w-full" rounded="sm" />
    </div>
  );
};

// Full Page Loading Skeleton
export const PageLoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-950 p-4 animate-pulse">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="w-32 h-10" rounded="lg" />
      <Skeleton className="w-10 h-10" rounded="full" />
    </div>
    
    {/* Content */}
    <div className="space-y-4">
      <BentoCardSkeleton size="lg" />
      <div className="grid grid-cols-2 gap-4">
        <BentoCardSkeleton size="md" />
        <BentoCardSkeleton size="md" />
      </div>
      <PrayerTimesSkeleton />
    </div>
  </div>
);

export default Skeleton;
