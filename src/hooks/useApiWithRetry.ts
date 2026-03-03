import { useState, useCallback } from 'react';
import { storage } from '@/lib/storage';

interface UseApiWithRetryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export const useApiWithRetry = <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): UseApiWithRetryResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiCall();
        setData(result);
        return;
      } catch (err) {
        lastError = err as Error;
        console.warn(`Attempt ${attempt} failed:`, err);
        
        if (attempt < maxRetries) {
          // Exponential backoff with jitter
          const delay = retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All attempts failed
    const errorMessage = lastError?.message || 'Unknown error occurred';
    setError(`Failed after ${maxRetries} attempts: ${errorMessage}`);
    setLoading(false);
  }, [apiCall, maxRetries, retryDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

// Hook for handling API calls with automatic retry and caching
export const useCachedApi = <T>(
  key: string,
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  cacheTime: number = 5 * 60 * 1000, // 5 minutes
  retryDelay: number = 1000
): UseApiWithRetryResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    // Check cache first
    const cached = storage.get<T>(`cache_${key}`);
    const cachedTime = storage.get<string>(`cache_${key}_time`);
    
    if (cached !== null && cachedTime !== null) {
      const timeDiff = Date.now() - Number(cachedTime);
      if (timeDiff < cacheTime) {
        setData(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiCall();
        setData(result);
        
        // Cache the result
        storage.set(`cache_${key}`, result);
        storage.set(`cache_${key}_time`, Date.now().toString());
        
        return;
      } catch (err) {
        lastError = err as Error;
        console.warn(`Attempt ${attempt} failed:`, err);
        
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    const errorMessage = lastError?.message || 'Unknown error occurred';
    setError(`Failed after ${maxRetries} attempts: ${errorMessage}`);
    setLoading(false);
  }, [key, apiCall, maxRetries, cacheTime, retryDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    storage.remove(`cache_${key}`);
    storage.remove(`cache_${key}_time`);
  }, [key]);

  return { data, loading, error, execute, reset };
};
