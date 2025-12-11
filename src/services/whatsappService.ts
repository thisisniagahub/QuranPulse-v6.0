import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_WHATSAPP_API_URL;
const API_KEY = import.meta.env.VITE_WHATSAPP_API_KEY;
const PHONE_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;

export const whatsappService = {
  // Check Connection
  checkConnection: async () => {
    if (!API_URL || !API_KEY || !PHONE_ID) return false;
    try {
      // Simple fetch to verify token validity (e.g., get phone number details)
      const res = await fetch(`${API_URL}/${PHONE_ID}`, {
        headers: { Authorization: `Bearer ${API_KEY}` }
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Send Individual Message
  sendMessage: async (to: string, message: string) => {
    // Log to DB first
    const { data: log, error } = await supabase
      .from('whatsapp_messages')
      .insert({
        phone_number: to,
        message_body: message,
        status: 'sending',
        direction: 'outbound'
      })
      .select()
      .single();

    if (error) throw error;

    try {
      // Call WhatsApp API
      const res = await fetch(`${API_URL}/${PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        // Update status
        await supabase
          .from('whatsapp_messages')
          .update({ status: 'sent', metadata: data })
          .eq('id', log.id);
        return true;
      } else {
        throw new Error(data.error?.message || 'Failed to send');
      }
    } catch (e: any) {
      // Update status to failed
      await supabase
        .from('whatsapp_messages')
        .update({ status: 'failed', metadata: { error: e.message } })
        .eq('id', log.id);
      throw e;
    }
  },

  // Broadcast Message
  broadcastMessage: async (target: 'all' | 'pro' | 'free', message: string) => {
    // 1. Get users with phone numbers
    let query = supabase.from('profiles').select('id, phone_number').not('phone_number', 'is', null);
    
    if (target !== 'all') {
      query = query.eq('tier', target.toUpperCase());
    }

    const { data: users } = await query;
    if (!users || users.length === 0) return { sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;

    // 2. Send in batches (simplified loop for now)
    for (const user of users) {
      try {
        await whatsappService.sendMessage(user.phone_number, message);
        sent++;
      } catch (e) {
        failed++;
      }
    }

    return { sent, failed };
  },

  // Get Recent Messages
  getRecentMessages: async (limit = 10) => {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get Templates
  getTemplates: async () => {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .eq('status', 'active');
      
    if (error) throw error;
    return data;
  },

  // Automated Reminder (Mock)
  sendAutomatedReminder: async (userId: string, type: 'subscription' | 'prayer' | 'reading') => {
    // Logic to fetch user phone and send template message
    console.log(`Sending ${type} reminder to ${userId}`);
    return true;
  }
};
