import { supabase } from '../lib/supabase';
import { HybridResponse } from './aiService';

// --- TYPES ---

export interface MCPWorshipData {
  source: 'cache' | 'jakim' | 'calculation';
  zone: string;
  date: string;
  times: {
    imsak: string;
    subuh: string;
    syuruk: string;
    zohor: string;
    asar: string;
    maghrib: string;
    isyak: string;
  };
}

export interface MCPComplianceData {
  source: 'cache' | 'jakim_fatwa' | 'jakim_halal';
  query: string;
  status: 'found' | 'not_found' | 'error';
  data: {
    title?: string;
    ruling?: string;
    reference_url?: string;
    date?: string;
  };
}

// --- SERVICE ---

export const UstazOrchestrator = {
  /**
   * Detects user intent and routes to the appropriate Supabase Edge Function.
   */
  async detectAndCall(query: string, lang: 'ms' | 'en' = 'ms'): Promise<HybridResponse | null> {
    const lowerQuery = query.toLowerCase();

    // 1. CLUSTER G: ADMIN (System Stats) - Checked early for specific keywords
    if (this.isAdminIntent(lowerQuery)) {
      return await this.handleAdminIntent(lowerQuery, lang);
    }

    // 2. CLUSTER A: COMPLIANCE (Hukum/Fatwa) - Higher priority than Worship
    if (this.isComplianceIntent(lowerQuery)) {
      return await this.handleComplianceIntent(lowerQuery, lang);
    }

    // 3. CLUSTER B: WORSHIP (Waktu Solat)
    if (this.isWorshipIntent(lowerQuery)) {
      return await this.handleWorshipIntent(lowerQuery, lang);
    }

    // 4. CLUSTER E: ZAKAT (Calculation)
    if (this.isZakatIntent(lowerQuery)) {
      return await this.handleZakatIntent(lowerQuery, lang);
    }

    // 5. CLUSTER D: QURAN CONTEXT
    if (this.isQuranIntent(lowerQuery)) {
      return await this.handleQuranIntent(lowerQuery, lang);
    }

    // 6. CLUSTER C: EDUCATION (Hadith/Tafsir)
    if (this.isEducationIntent(lowerQuery)) {
      return await this.handleEducationIntent(lowerQuery, lang);
    }

    // 7. CLUSTER F: IQRA LEARNING
    if (this.isIqraIntent(lowerQuery)) {
      return await this.handleIqraIntent(lowerQuery, lang);
    }

    // 8. CLUSTER G: ASR/VOICE RECITATION
    if (this.isASRIntent(lowerQuery)) {
      return await this.handleASRIntent(lowerQuery, lang);
    }

    return null;
  },

  // --- HELPERS ---

  isWorshipIntent(q: string): boolean {
    const keywords = ['waktu', 'solat', 'pukul', 'azan', 'subuh', 'zohor', 'asar', 'maghrib', 'isyak', 'imsak'];
    return keywords.some(k => q.includes(k));
  },

  isComplianceIntent(q: string): boolean {
    const keywords = ['hukum', 'fatwa', 'halal', 'haram', 'boleh ke', 'status', 'dalil'];
    return keywords.some(k => q.includes(k));
  },

  isEducationIntent(q: string): boolean {
    const keywords = ['hadis', 'hadith', 'riwayat', 'tafsir']; // Reduced keywords to avoid clash with Quran
    return keywords.some(k => q.includes(k));
  },

  isQuranIntent(q: string): boolean {
    // Matches: "ayat tentang...", "surah yasin", "cari ayat"
    const keywords = ['ayat', 'surah', 'quran', 'firman', 'tanda', 'dalil quran'];
    return keywords.some(k => q.includes(k));
  },

  isZakatIntent(q: string): boolean {
    const keywords = ['zakat', 'fitrah', 'nisab', 'bayar', 'kalkulator', 'kira'];
    return keywords.some(k => q.includes(k));
  },

  isIqraIntent(q: string): boolean {
    const keywords = ['iqra', 'belajar', 'mengaji', 'huruf', 'makhraj', 'tajwid', 'bacaan'];
    return keywords.some(k => q.includes(k));
  },

  isAdminIntent(q: string): boolean {
    const keywords = ['admin', 'stats', 'analytics', 'users', 'pengguna', 'system', 'health', 'dashboard'];
    return keywords.some(k => q.includes(k));
  },

  isASRIntent(q: string): boolean {
    const keywords = ['asr', 'rekod', 'record', 'voice', 'suara', 'analisis bacaan', 'semak bacaan', 'qwer', 'recitation'];
    return keywords.some(k => q.includes(k));
  },

  async handleIqraIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🧠 MCP: Routing to 'Iqra Module'");
    // For now, we guide them to the Iqra section or provide basic tips
    // In future, this could call an 'mcp-iqra' edge function

    return {
      summary: lang === 'ms'
        ? "📖 **Modul Iqra Digital**\n\nUntuk belajar mengaji dengan bantuan AI Voice Coach, sila ke bahagian **Iqra** dalam aplikasi."
        : "📖 **Digital Iqra Module**\n\nTo learn recitation with AI Voice Coach assistance, please navigate to the **Iqra** section.",
      steps: lang === 'ms'
        ? ["Buka menu 'Iqra'", "Pilih Tahap (1-6)", "Mula latihan suara"]
        : ["Open 'Iqra' menu", "Select Level (1-6)", "Start voice practice"],
      widget: { id: 'iqra-navigation', props: { target: '/iqra' } }
    };
  },

  async handleEducationIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🧠 MCP: Routing to 'mcp-education'");
    try {
      const intent = (query.includes('tafsir') || query.includes('ayat')) ? 'tafsir' : 'hadith';

      const { data, error } = await supabase.functions.invoke('mcp-education', {
        body: { intent, query }
      });

      if (error) throw error;

      if (!data.results || data.results.length === 0) return null;

      const items = data.results.map((item: any) =>
        intent === 'hadith'
          ? `📜 **${item.collection_name} #${item.hadith_number}**\n"${item.content_translation}"`
          : `📖 **Tafsir ${item.surah}:${item.verse}**\n${item.tafsir}`
      ).join('\n\n');

      return {
        summary: `🎓 **Sumber Ilmu (${intent === 'hadith' ? 'Hadith' : 'Tafsir'})**\n\n${items}`,
        resources: []
      };

    } catch (e) {
      console.error("MCP Education Error:", e);
      return null;
    }
  },

  // --- PUBLIC API FOR UI SERVICES ---

  /**
   * Fetches raw worship data from the MCP Edge Function.
   * Can be used by UI components or other services.
   */
  async getWorshipData(zone: string): Promise<MCPWorshipData | null> {
    try {
      const { data, error } = await supabase.functions.invoke('mcp-worship', {
        body: { zone }
      });

      if (error) throw error;
      return data as MCPWorshipData;
    } catch (e) {
      console.error("MCP getWorshipData failed:", e);
      return null;
    }
  },

  async handleWorshipIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🧠 MCP: Routing to 'mcp-worship'");
    try {
      // Basic Zone Extraction (Regex for MY zones)
      const zoneMatch = query.match(/\b(WLP|JHR|KDH|KTN|MLK|NSN|PHG|PNG|PRK|PLS|SBH|SWK|SGR|TRG)[0-9]{2}\b/i);
      const zone = zoneMatch ? zoneMatch[0].toUpperCase() : 'WLP01';

      const res = await this.getWorshipData(zone);
      if (!res) return null;

      // FORMATTING (Client-side Rendering for I18n)
      const title = lang === 'ms'
        ? `Waktu Solat (${res.source === 'jakim' ? 'JAKIM' : 'Kalkulasi'})`
        : `Prayer Times (${res.source === 'jakim' ? 'Official' : 'Calculated'})`;

      const summary = `✅ **${title}**\n\n` +
        `📍 Zone: **${res.zone}** | 📅 ${res.date}\n\n` +
        `• Imsak: ${res.times.imsak}\n` +
        `• Subuh: ${res.times.subuh}\n` +
        `• Syuruk: ${res.times.syuruk}\n` +
        `• Zohor: ${res.times.zohor}\n` +
        `• Asar: ${res.times.asar}\n` +
        `• Maghrib: ${res.times.maghrib}\n` +
        `• Isyak: ${res.times.isyak}`;

      return {
        summary,
        steps: lang === 'ms'
          ? ["Semak portal rasmi e-solat", "Pastikan jam dikalibrasi"]
          : ["Check official e-solat portal", "Ensure clock is calibrated"],
        resources: [{ type: 'link', title: 'E-Solat Portal', url: 'https://www.e-solat.gov.my/' }]
      };
    } catch (e) {
      console.error("MCP Worship Error:", e);
      return null;
    }
  },

  async handleComplianceIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🧠 MCP: Routing to 'mcp-compliance'");
    try {
      const type = query.includes('halal') ? 'halal' : 'fatwa';
      const { data, error } = await supabase.functions.invoke('mcp-compliance', {
        body: { type, query }
      });

      if (error) throw error;
      const res = data as MCPComplianceData;

      if (res.status !== 'found') return null;

      const title = lang === 'ms' ? 'Status Rasmi' : 'Official Status';
      const sourceName = res.source === 'jakim_fatwa' ? 'E-SMAF (Fatwa)' : 'Halal Malaysia';

      const summary = `⚖️ **${title} (${type.toUpperCase()})**\n\n` +
        `**${res.data.title || query}**\n` +
        `${res.data.ruling}\n\n` +
        `📌 Sumber: ${sourceName}`;

      return {
        summary,
        resources: res.data.reference_url
          ? [{ type: 'link', title: 'Dokumen Asal', url: res.data.reference_url }]
          : []
      };
    } catch (e) {
      console.error("MCP Compliance Error:", e);
      return null;
    }
  },

  async handleQuranIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🧠 MCP: Routing to 'mcp-quran'");
    try {
      const intent = query.includes('random') ? 'random' : 'search';
      // Extract search term: "ayat tentang sabar" -> "sabar"
      // Simple heuristic for MVP
      const cleanQuery = query.replace(/ayat|tentang|mengenai|cari/gi, '').trim();

      const { data, error } = await supabase.functions.invoke('mcp-quran', {
        body: { intent, query: cleanQuery, lang }
      });

      if (error) throw error;

      if (intent === 'random') {
        return {
          summary: `🎲 **Ayat Pilihan**\n\n"${data.data.arabic}"\n\n_${data.data.ref}_`,
          resources: []
        };
      }

      if (!data.results || data.results.length === 0) return null;

      const list = data.results.map((r: any) => `🔹 **${r.ref}**\n"${r.text}"`).join('\n\n');
      return {
        summary: `📖 **Hasil Carian Quran**\n\n${list}`,
        resources: []
      };

    } catch (e) {
      console.error("MCP Quran Error:", e);
      return null;
    }
  },

  async handleZakatIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🧠 MCP: Routing to 'mcp-zakat'");
    try {
      // Mock Parsing (In prod, use LLM to extract entity entities)
      const type = query.includes('emas') ? 'gold' : query.includes('simpanan') ? 'savings' : 'income';
      // Extract number: "kira zakat gaji 5000" -> 5000
      const amountMatch = query.match(/\d+/);
      const amount = amountMatch ? parseInt(amountMatch[0]) : 0;

      if (amount === 0) {
        return {
          summary: "Sila nyatakan jumlah untuk pengiraan Zakat. Contoh: 'Kira zakat gaji 5000'",
          resources: []
        };
      }

      const { data, error } = await supabase.functions.invoke('mcp-zakat', {
        body: { type, amount, state: 'WLP' } // Default state
      });

      if (error) throw error;
      const res = data.result;

      const emoji = res.status === 'eligible' ? '✅' : 'info';
      const summary = `💰 **Kalkulator Zakat (${type.toUpperCase()})**\n\n` +
        `💵 Jumlah: RM${amount}\n` +
        `📊 Status: **${res.status === 'eligible' ? 'WAJIB BAYAR' : 'TIDAK WAJIB'}**\n` +
        `💸 Zakat: **RM${res.zakat_payable_myr}**\n\n` +
        `_Nisab 2025: RM${res.breakdown?.nisab_2025 || res.breakdown?.nisab_value || 'N/A'}_`;

      return {
        summary,
        resources: [{ type: 'link', title: 'Bayar Zakat Online', url: 'https://www.zakat2u.com.my/' }]
      };

    } catch (e) {
      console.error("MCP Zakat Error:", e);
      return null;
    }
  },

  async handleAdminIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🛡️ MCP: Routing to 'mcp-admin'");
    try {
      // Determine intent from query
      let intent: 'user_stats' | 'content_stats' | 'system_health' = 'user_stats';
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('content') || lowerQuery.includes('quran') || lowerQuery.includes('hadith')) {
        intent = 'content_stats';
      } else if (lowerQuery.includes('health') || lowerQuery.includes('system') || lowerQuery.includes('cache')) {
        intent = 'system_health';
      }

      // Determine timeframe
      let timeframe: 'today' | 'week' | 'month' = 'today';
      if (lowerQuery.includes('week') || lowerQuery.includes('minggu')) {
        timeframe = 'week';
      } else if (lowerQuery.includes('month') || lowerQuery.includes('bulan')) {
        timeframe = 'month';
      }

      const { data, error } = await supabase.functions.invoke('mcp-admin', {
        body: { intent, query, timeframe }
      });

      if (error) throw error;

      const title = lang === 'ms' ? 'Laporan Admin' : 'Admin Report';
      const summary = `🛡️ **${title}**\n\n${data.data?.summary || 'Tiada data'}`;

      return {
        summary,
        resources: [{ type: 'link', title: 'Admin Dashboard', url: '/admin' }]
      };

    } catch (e) {
      console.error("MCP Admin Error:", e);
      return null;
    }
  },

  // --- ASR HANDLER ---
  async handleASRIntent(query: string, lang: 'ms' | 'en'): Promise<HybridResponse | null> {
    console.log("🎤 MCP: Routing to 'ASR Engine'");

    try {
      // For text-based queries about ASR, provide guidance
      const isQuery = query.includes('?') || query.includes('apa') || query.includes('bagaimana');

      if (isQuery) {
        const title = lang === 'ms' ? 'Analisis Bacaan Al-Quran' : 'Quran Recitation Analysis';
        const summary = lang === 'ms'
          ? `🎤 **${title}**\n\nUntuk menganalisis bacaan anda:\n1. Pergi ke modul "Iqra Digital"\n2. Pilih ayat yang ingin dibaca\n3. Tekan butang rakam dan bacalah\n4. Sistem akan menganalisis dan memberi maklum balas Q-WER\n\n**Q-WER** = Quran Weighted Error Rate\n- Makhraj (3.0x): Titik artikulasi\n- Tajwid (2.5x): Hukum bacaan\n- Harakat (2.0x): Baris/saktah\n- Irama (1.0x): Kelancaran`
          : `🎤 **${title}**\n\nTo analyze your recitation:\n1. Go to "Iqra Digital" module\n2. Select a verse to recite\n3. Press record and recite\n4. System will analyze and provide Q-WER feedback\n\n**Q-WER** = Quran Weighted Error Rate\n- Makhraj (3.0x): Articulation points\n- Tajweed (2.5x): Recitation rules\n- Harakat (2.0x): Vowels/timing\n- Rhythm (1.0x): Fluency`;

        return {
          summary,
          widget: { id: 'RecitationAnalyzer', props: {} },
          resources: [
            { type: 'link', title: 'Iqra Digital', url: '/iqra' },
            { type: 'link', title: 'Q-WER Guide', url: '/docs/qwer' }
          ]
        };
      }

      // For direct ASR requests, invoke the Edge Function
      const { data, error } = await supabase.functions.invoke('mcp-asr', {
        body: { intent: 'health' }
      });

      if (error) throw error;

      const title = lang === 'ms' ? 'ASR Engine Status' : 'ASR Engine Status';
      return {
        summary: `🎤 **${title}**: ${data.status === 'healthy' ? '✅ Aktif' : '⚠️ Tidak tersedia'}`,
        resources: []
      };

    } catch (e) {
      console.error("MCP ASR Error:", e);
      return null;
    }
  }
};