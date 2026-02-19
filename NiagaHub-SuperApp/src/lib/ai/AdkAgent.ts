import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS = 'gemini-2.5-flash';

// Baca kunci dari .env dan pisahkan dengan koma
const API_KEYS = process.env.GOOGLE_API_KEYS
  ? process.env.GOOGLE_API_KEYS.split(',').map((k) => k.trim())
  : [];

if (API_KEYS.length === 0) {
  console.error('❌ Error: No GOOGLE_API_KEYS found in .env.local');
}

export class AdkAgent {
  /**
   * Menjana respon teks menggunakan strategi Round-Robin / Failover
   * @param prompt Soalan pengguna
   * @returns Respon teks dari AI
   */
  async generateResponse(prompt: string): Promise<string> {
    let lastError = null;

    // Cuba setiap kunci yang ada dalam senarai
    for (let i = 0; i < API_KEYS.length; i++) {
      const currentKey = API_KEYS[i];
      try {
        console.log(`🤖 [AdkAgent] Mencuba API Key #${i + 1}...`);
        
        const genAI = new GoogleGenerativeAI(currentKey);
        const model = genAI.getGenerativeModel({ model: MODELS });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`✅ [AdkAgent] Berjaya menggunakan Key #${i + 1}`);
        return text;

      } catch (error: any) {
        console.warn(`⚠️ [AdkAgent] Gagal Key #${i + 1}: ${error.message}`);
        
        // Simpan error terakhir untuk dilontar jika semua kunci gagal
        lastError = error;

        // Jika error 429 (Rate Limit), kita teruskan loop ke kunci seterusnya.
        // Jika error lain (contoh 401 Invalid Key), kita pun teruskan juga sebagai failover.
        continue;
      }
    }

    // Jika sampai sini, bermakna semua kunci gagal
    console.error('🔥 [AdkAgent] SEMUA API KEY GAGAL!');
    throw lastError || new Error('All API keys failed to generate response.');
  }
}
