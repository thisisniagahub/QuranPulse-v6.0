import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Accordion Context
interface AccordionContextType {
    expandedItems: string[];
    toggleItem: (value: string) => void;
    type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | null>(null);

// Root Accordion
interface AccordionProps {
    children: React.ReactNode;
    type?: 'single' | 'multiple';
    defaultValue?: string | string[];
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    children,
    type = 'single',
    defaultValue,
    className
}) => {
    const [expandedItems, setExpandedItems] = useState<string[]>(
        Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
    );

    const toggleItem = (value: string) => {
        if (type === 'single') {
            setExpandedItems(prev => prev.includes(value) ? [] : [value]);
        } else {
            setExpandedItems(prev =>
                prev.includes(value)
                    ? prev.filter(v => v !== value)
                    : [...prev, value]
            );
        }
    };

    return (
        <AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
            <div className={cn("space-y-2", className)}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

// Accordion Item
interface AccordionItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
    value,
    children,
    className
}) => {
    return (
        <div
            className={cn(
                "rounded-xl border border-slate-700/50 bg-slate-900/50",
                "overflow-hidden",
                className
            )}
            data-value={value}
        >
            {children}
        </div>
    );
};

// Accordion Trigger
interface AccordionTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
    value,
    children,
    className
}) => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionTrigger must be used within Accordion');

    const isExpanded = context.expandedItems.includes(value);

    return (
        <button
            type="button"
            onClick={() => context.toggleItem(value)}
            className={cn(
                "flex w-full items-center justify-between p-4",
                "text-left font-medium text-white",
                "hover:bg-slate-800/50 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-raudhah-teal/50 focus:ring-inset",
                className
            )}
            aria-expanded={isExpanded}
        >
            {children}
            <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </motion.div>
        </button>
    );
};

// Accordion Content
interface AccordionContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
    value,
    children,
    className
}) => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionContent must be used within Accordion');

    const isExpanded = context.expandedItems.includes(value);

    return (
        <AnimatePresence initial={false}>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className={cn("px-4 pb-4 text-slate-300", className)}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Accordion;
