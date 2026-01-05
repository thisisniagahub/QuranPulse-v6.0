// --- Audio Cache Service (IndexedDB) ---
// Purpose: Store audio files locally for offline playback and faster loading.

const DB_NAME = 'QuranPulseAudioCache';
const STORE_NAME = 'audio_files';
const DB_VERSION = 1;

class AudioCacheService {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<void> | null = null;

    constructor() {
        this.init();
    }

    // Initialize Database
    private async init(): Promise<void> {
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB Error:", event);
                reject("Failed to open audio cache DB");
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                // console.log("✅ Audio Cache DB Ready");
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'url' });
                }
            };
        });

        return this.initPromise;
    }

    /**
     * Get audio URL (either Blob URL from cache or original)
     * If not in cache, it returns original and triggers background download.
     */
    async getAudio(originalUrl: string): Promise<string> {
        await this.init();
        
        try {
            const cachedBlob = await this.getFromCache(originalUrl);
            if (cachedBlob) {
                console.log("⚡ Serving from Audio Cache:", originalUrl);
                return URL.createObjectURL(cachedBlob);
            }
        } catch (e) {
            console.warn("Cache lookup failed, using network:", e);
        }

        // Not in cache: Trigger background download
        this.cacheAudio(originalUrl);
        
        return originalUrl;
    }

    /**
     * Save audio file to IndexedDB
     */
    async cacheAudio(url: string): Promise<void> {
        await this.init();
        
        // Don't cache if already exists
        const exists = await this.getFromCache(url);
        if (exists) return;

        try {
            // console.log("📥 Caching Audio:", url);
            const response = await fetch(url);
            const blob = await response.blob();

            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            store.put({
                url: url,
                blob: blob,
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error("Failed to cache audio:", url, error);
        }
    }

    /**
     * Check if a URL is already in cache
     */
    async isCached(url: string): Promise<boolean> {
        await this.init();
        const blob = await this.getFromCache(url);
        return !!blob;
    }

    /**
     * Internal: Retrieve blob from DB
     */
    private getFromCache(url: string): Promise<Blob | null> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB not initialized");

            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(url);

            request.onsuccess = () => {
                const record = request.result;
                resolve(record ? record.blob : null);
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Prefetch a list of URLs (e.g., next verses)
     */
    async prefetch(urls: string[]) {
        urls.forEach(url => this.cacheAudio(url));
    }

    /**
     * Clear Cache (e.g., in Settings)
     */
    async clearCache() {
        await this.init();
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        transaction.objectStore(STORE_NAME).clear();
        console.log("🗑️ Audio Cache Cleared");
    }
}

export const audioCache = new AudioCacheService();
