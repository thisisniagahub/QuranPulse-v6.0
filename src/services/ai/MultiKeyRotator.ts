
import { getEnv } from '../../utils/env';

export class MultiKeyRotator {
    private keys: string[] = [];
    private currentIndex: number = 0;

    constructor(envVarName: string) {
        const rawKeys = getEnv(envVarName) || '';
        this.keys = rawKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);

        if (this.keys.length === 0) {
            console.warn(`⚠️ MultiKeyRotator: No keys found for ${envVarName}`);
        } else {
            console.log(`📡 MultiKeyRotator: Loaded ${this.keys.length} keys for ${envVarName}`);
        }
    }

    /**
     * Get the next available key (Round Robin)
     */
    getNextKey(): string | null {
        if (this.keys.length === 0) return null;

        const key = this.keys[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        return key;
    }

    /**
     * Get all keys (for backup failover logic)
     */
    getAllKeys(): string[] {
        return this.keys;
    }

    /**
     * Execute a function with automatic retry on key failure (429/403)
     */
    async executeWithRetry<T>(fn: (key: string) => Promise<T>, maxRetries: number = 3): Promise<T> {
        let attempts = 0;
        let lastError: any = null;

        while (attempts < Math.min(this.keys.length, maxRetries)) {
            const key = this.getNextKey();
            if (!key) throw new Error("No API keys available.");

            try {
                return await fn(key);
            } catch (error: any) {
                const status = error.response?.status;
                if (status === 429 || status === 403 || status === 401) {
                    console.warn(`🔑 Key Rotation: Key failed with ${status}. Rotating to next...`);
                    attempts++;
                    lastError = error;
                } else {
                    // Non-key error, don't rotate
                    throw error;
                }
            }
        }

        throw lastError || new Error("All API keys exhausted or failed.");
    }
}

// Pre-configured rotators
export const geminiRotator = new MultiKeyRotator('VITE_GEMINI_API_KEY'); // Can be comma-separated in .env
export const groqRotator = new MultiKeyRotator('VITE_GROQ_API_KEY');
