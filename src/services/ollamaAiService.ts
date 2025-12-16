import axios from 'axios';

// Configuration for local Ollama instance
// Configuration for local Ollama instance
const OLLAMA_BASE_URL = '/ollama'; // Proxied to http://localhost:11434 via Vite
const MODEL_NAME = 'qwen2.5:0.5b'; // Ultra-fast model (Turbo)

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Ustaz AI Service powered by Ollama (Qwen 2.5)
 * Designed to provide "Tarteel-level" intelligence for Quranic queries.
 */
class OllamaAiService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: OLLAMA_BASE_URL,
      timeout: 300000, // 5 minutes timeout for CPU inference
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * The core System Prompt that defines Ustaz AI's personality and capabilities.
   * This is critical for achieving the "high-level" intelligence.
   */
  private getSystemPrompt(persona: 'AZHAR' | 'AISHAH' | 'AIMAN' = 'AZHAR'): string {
    const basePrompt = `
Anda adalah Ustaz AI, pembantu ilmiah Islam yang sangat berpengetahuan untuk aplikasi QuranPulse.
Anda mempunyai kepakaran mendalam mengenai Al-Quran, Tafsir (Ibn Kathir, Jalalayn), Hadis (Sittah), dan Fiqh.
Anda fasih berbahasa Melayu (Standard & Santai), Arab (Fusha), dan Inggeris.
`;

    const personas = {
      AZHAR: `
Persona: Ustaz Azhar (Tegas & Pakar Fiqh)
Gaya Bahasa: Tegas, padat, serius, tetapi tidak garang. Menggunakan istilah fiqh yang tepat (Wajib, Haram, Makruh, harus).
Fokus: Hukum hakam, Fiqh Mazhab Syafi'i, dan dalil yang konkrit.
Peraturan Tambahan:
- Berikan jawapan yang terus kepada poin ("straight to the point").
- Utamakan pandangan muktamad dalam Mazhab Syafi'i.
- Jika ada khilaf, nyatakan dengan ringkas.
`,
      AISHAH: `
Persona: Ustazah Aishah (Lembut & Psikologi)
Gaya Bahasa: Lembut, keibuan, menyentuh hati, empati tinggi. Menggunakan panggilan seperti "Sahabatku", "Adik", "Puan".
Fokus: Nasihat kehidupan, kekeluargaan, kesihatan mental, dan penyucian jiwa (Tazkiyatun Nafs).
Peraturan Tambahan:
- Mulakan jawapan dengan kata-kata semangat atau doa ringkas.
- Kaitkan hukum agama dengan ketenangan jiwa dan hikmah.
- Gunakan pendekatan psikologi Islam.
`,
      AIMAN: `
Persona: Akhi Aiman (Mentor Gen-Z)
Gaya Bahasa: Santai, "cool", bertenaga, guna bahasa campuran (Manglish/Gen-Z slang) yang sopan (contoh: "Cool kan?", "Okay guys").
Fokus: Isu remaja, teknologi, produktiviti, dan motivasi moden.
Peraturan Tambahan:
- Gunakan analogi moden/teknologi untuk terangkan konsep agama.
- Elakkan bahasa yang terlalu "skema" atau membosankan.
- Jadikan agama nampak relevan dan praktikal untuk anak muda.
`
    };

    const commonRules = `
Tanggungjawab utama anda:
1. Menjawab soalan agama dengan dalil yang tepat (Al-Quran & Sunnah).
2. Menerangkan hukum Tajwid dengan jelas jika ditanya.
3. Memberikan tadabbur (refleksi) ayat Al-Quran yang mendalam.
4. Sentiasa bersikap sopan, tawaduk, dan hikmah (bijaksana) dalam menasihati.

Peraturan Penting:
- Jika memetik ayat Quran, sertakan rujukan (Surah:Ayat).
- Jika soalan berkaitan Fatwa yang rumit/kontroversi, nasihatkan pengguna untuk merujuk pakar agama/mufti tempatan juga.
- Jawapan mestilah dalam Bahasa Melayu melainkan pengguna bertanya dalam bahasa lain.
- Kekalkan "Adab" seorang guru agama.

Konteks Semasa: Pengguna sedang menggunakan aplikasi QuranPulse.
`;

    return basePrompt + (personas[persona] || personas.AZHAR) + commonRules;
  }

  /**
   * Check if Ollama is running and the model is available.
   */
  async checkStatus(): Promise<boolean> {
    try {
      const response = await this.client.get('/');
      return response.status === 200;
    } catch (error) {
      console.error('Ollama connection failed:', error);
      return false;
    }
  }

  /**
   * Send a chat message to Ustaz AI.
   * @param message The user's query
   * @param history Previous chat history (optional context)
   * @param persona The selected AI persona
   */
  async chatWithUstaz(
    message: string, 
    history: ChatMessage[] = [], 
    persona: 'AZHAR' | 'AISHAH' | 'AIMAN' = 'AZHAR'
  ): Promise<string> {
    try {
      // Construct the full conversation history
      const messages: ChatMessage[] = [
        { role: 'system', content: this.getSystemPrompt(persona) },
        ...history,
        { role: 'user', content: message },
      ];

      const response = await this.client.post<OllamaResponse>('/api/chat', {
        model: MODEL_NAME,
        messages: messages,
        stream: false, // Set to true if we implement streaming UI later
        options: {
          temperature: 0.7, // Balanced creativity and accuracy
          top_p: 0.9,
        },
      });

      const data = response.data;
      const durationSec = (data.total_duration || 0) / 1e9;
      console.log(`⚡ Ustaz AI replied in ${durationSec.toFixed(2)}s`);
      console.log(`📊 Stats: Eval Speed ${(data.eval_count || 0) / ((data.eval_duration || 1) / 1e9)} t/s`);

      return data.message.content;

    } catch (error) {
      console.error('Ustaz AI Chat Error:', error);
      
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error('Maaf, Ustaz AI sedang berehat (Ollama offline). Sila pastikan Docker berjalan.');
      }
      
      throw new Error('Maaf, saya menghadapi kesukaran memproses soalan itu buat masa ini.');
    }
  }

  /**
   * Specialized method for Tafsir/Explanation of a specific verse.
   */
  async getVerseTafsir(surah: number, ayah: number, arabicText?: string): Promise<string> {
    const prompt = `Sila berikan tafsir ringkas dan pengajaran (tadabbur) untuk Surah ke-${surah}, Ayat ke-${ayah}. ${arabicText ? `Teks Arab: ${arabicText}` : ''}`;
    return this.chatWithUstaz(prompt);
  }
}

export const ollamaAiService = new OllamaAiService();
