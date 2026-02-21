import React from 'react';

/**
 * SkipToContent - Accessibility component for keyboard navigation
 * 
 * This hidden link becomes visible when focused, allowing keyboard users
 * to skip directly to the main content, bypassing repetitive navigation.
 */
interface SkipToContentProps {
    contentId?: string;
    children?: React.ReactNode;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
    contentId = 'main-content',
    children = 'Skip to main content'
}) => {
    return (
        <a
            href={`#${contentId}`}
            className="
                sr-only focus:not-sr-only
                fixed top-0 left-0 z-[9999]
                bg-raudhah-teal text-slate-900
                px-4 py-3 font-semibold
                focus:outline-none focus:ring-2 focus:ring-cyan-300
                transform -translate-y-full focus:translate-y-0
                transition-transform duration-200
            "
        >
            {children}
        </a>
    );
};

export default SkipToContent;
