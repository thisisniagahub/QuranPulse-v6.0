// Retry utility for non-React API calls

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export const retryWithBackoff = async <T>(
  apiCall: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetry
  } = options;

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      lastError = err as Error;
      console.warn(`API attempt ${attempt} failed:`, err);
      
      if (onRetry) {
        onRetry(attempt, lastError);
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All attempts failed
  throw lastError || new Error('Unknown error occurred during retry');
};

// Simple retry wrapper for common API operations
export const createRetryableApi = <T extends any[], R>(
  apiFunction: (...args: T) => Promise<R>,
  options: RetryOptions = {}
) => {
  return async (...args: T): Promise<R> => {
    return retryWithBackoff(() => apiFunction(...args), options);
  };
};