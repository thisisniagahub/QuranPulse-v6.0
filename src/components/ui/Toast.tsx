import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    toast: (options: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
}

// Context
const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((options: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).slice(2);
        const newToast: Toast = { ...options, id };
        setToasts((prev) => [...prev, newToast]);

        // Auto dismiss
        const duration = options.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </ToastContext.Provider>
    );
};

// Container (renders in portal position)
const ToastContainer: React.FC<{ toasts: Toast[]; dismiss: (id: string) => void }> = ({
    toasts,
    dismiss,
}) => {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Individual Toast
const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
    const { title, description, variant = 'default' } = toast;

    const variants = {
        default: {
            bg: 'bg-slate-800 border-slate-700',
            icon: null,
        },
        success: {
            bg: 'bg-emerald-900/80 border-emerald-700/50',
            icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
        },
        error: {
            bg: 'bg-red-900/80 border-red-700/50',
            icon: <AlertCircle className="h-5 w-5 text-red-400" />,
        },
        warning: {
            bg: 'bg-amber-900/80 border-amber-700/50',
            icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
        },
        info: {
            bg: 'bg-cyan-900/80 border-cyan-700/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            icon: <Info className="h-5 w-5 text-cyan-400" />,
        },
    };

    const variantStyle = variants[variant];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
                "relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm",
                variantStyle.bg
            )}
        >
            {variantStyle.icon && <div className="flex-shrink-0 pt-0.5">{variantStyle.icon}</div>}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{title}</p>
                {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
            </div>
            <button
                onClick={onDismiss}
                aria-label="Dismiss toast"
                className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

// Helper functions for quick toasts
export const toast = {
    success: (title: string, description?: string) => {
        // Note: Must be called inside a component that has access to ToastContext
        console.warn('Use useToast().toast() instead of toast.success() outside components');
    },
};
