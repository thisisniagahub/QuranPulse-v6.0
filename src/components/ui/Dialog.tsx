import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
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
                    {/* Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                            className="relative"
                        >
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    onClose?: () => void;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ className, children, onClose, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative w-full max-w-lg rounded-2xl p-6",
                "bg-slate-900 border border-slate-700/50",
                "shadow-2xl shadow-cyan-500/10",
                className
            )}
            {...props}
        >
            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            {children}
        </div>
    )
);
DialogContent.displayName = 'DialogContent';

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("mb-4", className)} {...props} />
    )
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h2 ref={ref} className={cn("text-xl font-semibold text-white", className)} {...props} />
    )
);
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-slate-400 mt-1", className)} {...props} />
    )
);
DialogDescription.displayName = 'DialogDescription';

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("mt-6 flex justify-end gap-3", className)} {...props} />
    )
);
DialogFooter.displayName = 'DialogFooter';
