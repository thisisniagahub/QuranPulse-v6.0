import { AdkAgent } from './AdkAgent';
import { redis } from '../redis/client';
import crypto from 'crypto';

const agent = new AdkAgent();
const CACHE_TTL = 3600 * 24; // Simpan cache selama 24 jam (dalam saat)

export class AdkRunner {
  
  /**
   * Menjana hash unik (SHA256) untuk soalan bagi dijadikan Key Redis
   */
  private generateCacheKey(text: string): string {
    return `ai_cache:${crypto.createHash('sha256').update(text).digest('hex')}`;
  }

  /**
   * Fungsi utama untuk bertanya kepada AI dengan lapisan Cache
   */
  async ask(question: string): Promise<string> {
    const cacheKey = this.generateCacheKey(question);

    try {
      // 1. Semak Cache (Redis)
      const cachedResponse = await redis.get(cacheKey);

      if (cachedResponse) {
        console.log('⚡ [AdkRunner] HIT: Jawapan diambil dari Redis Cache.');
        return cachedResponse;
      }

      console.log('🐢 [AdkRunner] MISS: Tiada cache. Memanggil AdkAgent...');

      // 2. Panggil Agent (Gemini API)
      const freshResponse = await agent.generateResponse(question);

      // 3. Simpan jawapan ke dalam Redis (Cache)
      // 'EX' bermaksud Expire dalam masa TTL saat
      await redis.set(cacheKey, freshResponse, 'EX', CACHE_TTL);
      console.log('💾 [AdkRunner] Jawapan baru disimpan ke Redis.');

      return freshResponse;

    } catch (error) {
      console.error('❌ [AdkRunner] Error:', error);
      throw error;
    }
  }
}
