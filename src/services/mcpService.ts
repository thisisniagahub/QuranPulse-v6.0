import { supabase } from '../lib/supabase';

export interface MCPResponse {
    intent: string;
    confidence: number;
    data: any;
}

export const mcpService = {
    async classifyIntent(query: string): Promise<MCPResponse> {
        // Placeholder implementation to satisfy build
        // In production this would call an Edge Function or local logic
        console.log('Classifying intent via MCP:', query);

        // Simple regex fallback
        if (query.match(/prayer|waktu|solat/i)) return { intent: 'worship.prayer_times', confidence: 0.9, data: {} };
        if (query.match(/quran|ayat|surah/i)) return { intent: 'quran.search', confidence: 0.9, data: {} };

        return { intent: 'general.chat', confidence: 0.5, data: {} };
    },

    async executeWorker(intent: string, params: any) {
        if (intent === 'worship.prayer_times') {
            return { type: 'widget', widget: 'PrayerTimes', data: params };
        }
        return null;
    }
};
