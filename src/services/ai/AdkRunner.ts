import { supabase } from '../../lib/supabase';
import { AdkAgent } from './AdkAgent';

/**
 * AdkRunner (Orchestrator)
 * 
 * Central coordinator for QuranPulse AI features. 
 * Responsibilities:
 * 1. Generate sha256 cache keys for prompts.
 * 2. Check Supabase `ai_knowledge_cache` for fast semantic hits.
 * 3. Delegate cache misses to the AdkAgent (worker).
 * 4. Save successful agent responses back to the cache.
 */
export class AdkRunner {
  private agent: AdkAgent;

  constructor() {
    this.agent = new AdkAgent();
  }

  /**
   * Generates a deterministic cache key for text queries.
   */
  private async generateCacheKey(messages: any[]): Promise<string> {
    const rawText = JSON.stringify(messages);
    const msgUint8 = new TextEncoder().encode(rawText.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Main entry point for AI queries.
   */
  public async ask(messages: any[], context?: Record<string, any>): Promise<string> {
    const cacheKey = await this.generateCacheKey(messages);

    try {
      // 1. Check Supabase Cache
      const { data: cachedData, error: cacheError } = await supabase
        .from('ai_knowledge_cache')
        .select('responseText')
        .eq('queryHash', cacheKey)
        .single();

      // @ts-ignore
      if (!cacheError && cachedData?.responseText) {
        // @ts-ignore
        console.log(`[AdkRunner] Cache HIT: ${cacheKey.substring(0, 8)}`);
        // @ts-ignore
        return cachedData.responseText;
      }

      console.log(`[AdkRunner] Cache MISS: ${cacheKey.substring(0, 8)}. Delegating to AdkAgent...`);

      // 2. Delegate to worker node and rotate keys if necessary
      const response = await this.agent.generateResponse(messages, context);

      // 3. Save to Cache asynchronously (fire and forget)
      supabase.from('ai_knowledge_cache').insert({
        queryHash: cacheKey,
        originalQuery: JSON.stringify(messages).substring(0, 500),
        responseText: response,
        context: context || {}
      }).then(({ error }) => {
        if (error) console.error('[AdkRunner] Failed to warm cache:', error.message);
      });

      return response;

    } catch (error) {
      console.error('[AdkRunner] Execution Failed:', error);
      throw new Error("Maaf, pelayan AI sedang mengalami tekanan tinggi. Sila cuba sebentar lagi.");
    }
  }
}

export const aiOrchestrator = new AdkRunner();
