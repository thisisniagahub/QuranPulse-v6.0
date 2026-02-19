-- ==============================================================================
-- WHATSAPP CRM SCHEMA (WAWCD CLONE FEATURES)
-- ==============================================================================

-- 1. WHATSAPP CONTACTS (CRM)
-- Menyimpan data orang yang chat dengan bot, label, dan nota.
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL, -- Format: 60123456789@c.us
    name TEXT,
    profile_pic_url TEXT,
    tags TEXT[], -- ['kariah', 'donor', 'new']
    notes TEXT, -- Nota admin: "Pak Cik ni suka tanya pasal korban"
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'spam')),
    last_interaction_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MESSAGE TEMPLATES (Quick Replies)
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL, -- e.g. "Jawapan Salam", "Info Korban"
    content TEXT NOT NULL, -- e.g. "Waalaikumussalam, boleh saya bantu?"
    category TEXT, -- 'greeting', 'infaq', 'general'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BROADCAST CAMPAIGNS (Bulk Sender)
CREATE TABLE IF NOT EXISTS public.broadcast_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message_content TEXT NOT NULL,
    target_tags TEXT[], -- Target audience: ['kariah']
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'processing', 'completed', 'failed')),
    scheduled_at TIMESTAMPTZ, -- Kalau null, send immediately
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SCHEDULED MESSAGES (Individual)
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    message_content TEXT NOT NULL,
    send_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;

-- Admin Only Access (Assuming role 'admin' or authenticated for now)
CREATE POLICY "Admins manage CRM" ON public.crm_contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage templates" ON public.whatsapp_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage broadcasts" ON public.broadcast_campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage schedules" ON public.scheduled_messages FOR ALL USING (auth.role() = 'authenticated');
