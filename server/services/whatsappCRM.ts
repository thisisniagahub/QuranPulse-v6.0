import { supabase } from '../lib/supabase';

export const WhatsappCRM = {

    /**
     * CRM: Simpan atau Kemaskini Contact bila user mesej
     */
    async syncContact(phone: string, name?: string, pushName?: string) {
        const displayName = pushName || name || "Unknown";

        // Upsert contact
        const { error } = await supabase
            .from('crm_contacts')
            .upsert({
                phone_number: phone,
                name: displayName,
                last_interaction_at: new Date().toISOString()
            }, { onConflict: 'phone_number' });

        if (error) console.error("CRM Sync Error:", error);
    },

    /**
     * UTILS: Dapatkan Template Mesej (Quick Reply)
     */
    async getTemplates() {
        const { data } = await supabase
            .from('whatsapp_templates')
            .select('*')
            .order('title');
        return data || [];
    },

    /**
     * BROADCAST: Cipta Kempen Baru
     */
    async createBroadcast(title: string, message: string, targetTag: string) {
        const { data, error } = await supabase
            .from('broadcast_campaigns')
            .insert({
                title,
                message_content: message,
                target_tags: [targetTag],
                status: 'pending' // Worker will pick this up
            })
            .select()
            .single();

        return { data, error };
    },

    /**
     * SCHEDULER: Jadualkan mesej individu
     */
    async scheduleMessage(phone: string, message: string, date: Date) {
        const { error } = await supabase
            .from('scheduled_messages')
            .insert({
                phone_number: phone,
                message_content: message,
                send_at: date.toISOString(),
                status: 'pending'
            });

        return { error };
    }
};
