import { supabase } from '../lib/supabase';

// --- TYPES ---
export interface MCPResponse {
    intent: string;
    confidence: number;
    data: any;
}

export interface MCPWorshipData {
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
    source?: 'cache' | 'jakim' | 'calculation' | 'fallback';
    zone?: string;
    hijri?: string;
}

export interface MCPComplianceData {
    source: string;
    status: 'found' | 'not_found' | 'error';
    data?: {
        title: string;
        ruling: string;
        reference_url?: string;
        date?: string;
    };
}

export interface MCPEducationData {
    source: string;
    results: Array<{
        collection_name: string;
        hadith_number: number;
        title?: string;
        content_arabic?: string;
        content_translation?: string;
        grade?: string;
        tafsir?: string;
        reflection?: string;
    }>;
}

// --- CONSTANTS ---
const EDGE_FUNCTION_TIMEOUT = 10000; // 10 seconds timeout

export const mcpService = {
    /**
     * CLASSIFY INTENT (Legacy/Local Placeholder)
     * In a full implementation, this would call a lightweight intent classifier model.
     */
    async classifyIntent(query: string): Promise<MCPResponse> {
        // Simple regex-based local classification for speed
        if (query.match(/prayer|waktu|solat|azan|imsak/i)) {
            return { intent: 'worship.prayer_times', confidence: 0.95, data: {} };
        }
        if (query.match(/quran|ayat|surah|bacaan/i)) {
            return { intent: 'quran.search', confidence: 0.9, data: {} };
        }
        if (query.match(/hukum|halal|haram|boleh tak|fatwa/i)) {
            return { intent: 'compliance.check', confidence: 0.85, data: {} };
        }
        if (query.match(/hadith|hadis|tafsir|maksud ayat/i)) {
            return { intent: 'education.query', confidence: 0.85, data: {} };
        }
        if (query.match(/zakat|fitrah/i)) {
            return { intent: 'zakat.calculate', confidence: 0.9, data: {} };
        }

        return { intent: 'general.chat', confidence: 0.5, data: {} };
    },

    /**
     * EXECUTE WORKER
     * Routes the intent to the correct client-side logic or widget
     */
    async executeWorker(intent: string, params: any) {
        if (intent === 'worship.prayer_times') {
            return { type: 'widget', widget: 'PrayerTimes', data: params };
        }
        return null;
    },

    /**
     * GET WORSHIP DATA (Official JAKIM via Edge Function)
     * @param zone JAKIM Zone Code (e.g. WLP01)
     * @param lat Optional latitude for fallback calc
     * @param lng Optional longitude for fallback calc
     */
    async getWorshipData(zone: string, lat?: number, lng?: number): Promise<MCPWorshipData | null> {
        console.log(`📡 MCP: Invoking 'mcp-worship' for zone ${zone}...`);

        try {
            const { data, error } = await supabase.functions.invoke('mcp-worship', {
                body: { zone, lat, lng }
            });

            if (error) {
                console.error('❌ MCP Worship Error:', error);
                throw error;
            }

            console.log(`✅ MCP Worship Success (${data.source})`);
            return data as MCPWorshipData;

        } catch (err) {
            console.warn('⚠️ MCP Call Failed, using local fallback:', err);
            
            // EMERGENCY FALLBACK (If Edge Function is totally down)
            // Returns a safe estimation or empty state to prevent app crash
            return {
                date: new Date().toISOString().split('T')[0],
                times: {
                    imsak: '05:50',
                    subuh: '06:00',
                    syuruk: '07:15',
                    zohor: '13:20',
                    asar: '16:30',
                    maghrib: '19:20',
                    isyak: '20:35'
                },
                source: 'fallback',
                zone: zone
            };
        }
    },

    /**
     * CHECK COMPLIANCE (Fatwa/Halal)
     */
    async checkCompliance(type: 'fatwa' | 'halal', query: string): Promise<MCPComplianceData | null> {
        try {
            const { data, error } = await supabase.functions.invoke('mcp-compliance', {
                body: { type, query, lang: 'ms' }
            });
            if (error) throw error;
            return data as MCPComplianceData;
        } catch (err) {
            console.error('❌ MCP Compliance Error:', err);
            return null;
        }
    },

    /**
     * SEARCH KNOWLEDGE (Hadith/Tafsir)
     */
    async searchKnowledge(intent: 'hadith' | 'tafsir', query: string): Promise<MCPEducationData | null> {
        try {
            const { data, error } = await supabase.functions.invoke('mcp-education', {
                body: { intent, query }
            });
            if (error) throw error;
            return data as MCPEducationData;
        } catch (err) {
            console.error('❌ MCP Education Error:', err);
            return null;
        }
    }
};

// Export as both for compatibility
export const MCPService = mcpService;