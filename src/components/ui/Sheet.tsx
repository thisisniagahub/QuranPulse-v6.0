import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    side?: 'left' | 'right' | 'top' | 'bottom';
    children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, side = 'bottom', children }) => {
    const slideVariants = {
        left: { x: '-100%' },
        right: { x: '100%' },
        top: { y: '-100%' },
        bottom: { y: '100%' },
    };

    const positionStyles = {
        left: 'left-0 top-0 h-full w-80 max-w-[85vw]',
        right: 'right-0 top-0 h-full w-80 max-w-[85vw]',
        top: 'top-0 left-0 w-full max-h-[85vh]',
        bottom: 'bottom-0 left-0 w-full max-h-[85vh]',
    };

    const borderStyles = {
        left: 'rounded-r-2xl border-r',
        right: 'rounded-l-2xl border-l',
        top: 'rounded-b-2xl border-b',
        bottom: 'rounded-t-2xl border-t',
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />
                    {/* Sheet Content */}
                    <motion.div
                        initial={slideVariants[side]}
                        animate={{ x: 0, y: 0 }}
                        exit={slideVariants[side]}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            "fixed z-50 bg-slate-900 border-slate-700/50 shadow-2xl",
                            positionStyles[side],
                            borderStyles[side]
                        )}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }>(
    ({ className, children, onClose, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("relative h-full flex flex-col p-6 pb-safe-bottom", className)}
            {...props}
        >
            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Close sheet"
                    className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
            {children}
        </div>
    )
);
SheetContent.displayName = 'SheetContent';

export const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("mb-4", className)} {...props} />
    )
);
SheetHeader.displayName = 'SheetHeader';

export const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h2 ref={ref} className={cn("text-xl font-semibold text-white", className)} {...props} />
    )
);
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-slate-400 mt-1", className)} {...props} />
    )
);
SheetDescription.displayName = 'SheetDescription';
