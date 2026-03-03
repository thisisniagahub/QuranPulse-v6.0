/**
 * Versioned, cached localStorage utility
 * - All keys are prefixed with version for safe migration
 * - In-memory Map cache reduces expensive I/O reads
 * - Wrapped in try-catch for SSR/incognito safety
 */
const STORAGE_VERSION = 'qp:v1';
const cache = new Map<string, string | null>();

function prefixKey(key: string): string {
  return `${STORAGE_VERSION}:${key}`;
}

export const storage = {
  get<T = string>(key: string): T | null {
    const prefixed = prefixKey(key);
    if (!cache.has(prefixed)) {
      try {
        cache.set(prefixed, localStorage.getItem(prefixed));
      } catch {
        return null;
      }
    }
    const raw = cache.get(prefixed);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  set(key: string, value: unknown): void {
    const prefixed = prefixKey(key);
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      localStorage.setItem(prefixed, serialized);
      cache.set(prefixed, serialized);
    } catch {
      // Quota exceeded or incognito
    }
  },

  remove(key: string): void {
    const prefixed = prefixKey(key);
    try {
      localStorage.removeItem(prefixed);
      cache.delete(prefixed);
    } catch {}
  },

  clearCache(): void {
    cache.clear();
  },
};

// Invalidate cache when another tab changes storage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key) cache.delete(e.key);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') cache.clear();
  });
}
