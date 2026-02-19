import React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

interface TabsContextType {
    value: string;
    setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

export const Tabs: React.FC<TabsProps> = ({
    className,
    defaultValue = '',
    value: controlledValue,
    onValueChange,
    children,
    ...props
}) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const setValue = React.useCallback((newValue: string) => {
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    }, [onValueChange]);

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-slate-700/50",
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value: triggerValue, children, ...props }, ref) => {
        const context = React.useContext(TabsContext);
        if (!context) throw new Error('TabsTrigger must be used within Tabs');

        const isActive = context.value === triggerValue;

        return (
            <button
                ref={ref}
                type="button"
                onClick={() => context.setValue(triggerValue)}
                className={cn(
                    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50",
                    isActive
                        ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value: contentValue, children, ...props }, ref) => {
        const context = React.useContext(TabsContext);
        if (!context) throw new Error('TabsContent must be used within Tabs');

        if (context.value !== contentValue) return null;

        return (
            <div
                ref={ref}
                className={cn("mt-4 focus-visible:outline-none", className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);
TabsContent.displayName = 'TabsContent';
