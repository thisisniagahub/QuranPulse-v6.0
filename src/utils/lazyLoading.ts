import React, { Suspense, lazy } from 'react';
import { PulseLoader } from '../components/PulseLoader';

// Lazy loading wrapper with fallback
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  FallbackComponent: React.ComponentType = PulseLoader
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => React.createElement(
    Suspense,
    { fallback: React.createElement(FallbackComponent) },
    React.createElement(LazyComponent, props)
  );
};

// Intersection Observer for lazy loading images
export const useLazyImage = (src: string, options?: IntersectionObserverInit) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, options]);

  React.useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setError(null);
    };
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  return { ref: imgRef, src: imageSrc, isLoading, error };
};

// Virtual scrolling hook for long lists
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const handleScroll = React.useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);
  
  return {
    containerRef,
    visibleItems,
    offsetY,
    startIndex,
    endIndex,
    onScroll: handleScroll
  };
};

// Preload critical resources
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      link.as = 'image';
    }
    
    document.head.appendChild(link);
  });
};

// Dynamic import with timeout
export const dynamicImportWithTimeout = async <T>(
  importFunc: () => Promise<T>,
  timeout: number = 5000
): Promise<T> => {
  return Promise.race([
    importFunc(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Module load timeout')), timeout)
    )
  ]);
};