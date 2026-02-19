/**
 * LazyImage Component
 * 
 * Performance-optimized image component with:
 * - Intersection observer for lazy loading
 * - Blur placeholder while loading
 * - Error fallback
 * - Responsive sizing
 */

import React, { useState } from 'react';
import { useIntersectionObserver } from '../../hooks/usePerformance';
import { cn } from '../../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: string;
    placeholderColor?: string;
    aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
};

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    fallback = '/assets/placeholder.png',
    placeholderColor = 'bg-slate-800',
    aspectRatio = 'auto',
    className,
    ...props
}) => {
    const [ref, isVisible] = useIntersectionObserver();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div
            ref={ref}
            className={cn(
                'relative overflow-hidden',
                aspectRatioClasses[aspectRatio],
                placeholderColor,
                className
            )}
        >
            {isVisible && (
                <img
                    src={hasError ? fallback : src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    loading="lazy"
                    decoding="async"
                    {...props}
                />
            )}

            {/* Loading shimmer */}
            {!isLoaded && isVisible && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
            )}
        </div>
    );
};

export default LazyImage;
