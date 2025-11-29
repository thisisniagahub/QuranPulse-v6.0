-- Admin Dashboard Tables

-- 1. WhatsApp Messages Log
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    phone_number TEXT NOT NULL,
    message_body TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- text, template, image
    status TEXT DEFAULT 'sent', -- sent, delivered, read, failed
    direction TEXT DEFAULT 'outbound', -- inbound, outbound
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WhatsApp Templates
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Support Ticket Responses
CREATE TABLE IF NOT EXISTS support_ticket_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- responder
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, warning, success, error
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Admin Audit Logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_resource TEXT,
    target_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. System Health Logs
CREATE TABLE IF NOT EXISTS system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    status TEXT NOT NULL, -- healthy, degraded, down
    latency_ms INTEGER,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. System Metrics
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT,
    tags JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Payments (Extending existing or new if not exists)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'MYR',
    status TEXT DEFAULT 'pending', -- pending, success, failed, refunded
    provider TEXT, -- stripe, billplz
    provider_ref TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Subscription History
CREATE TABLE IF NOT EXISTS subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    tier TEXT NOT NULL, -- FREE, PRO
    action TEXT NOT NULL, -- upgrade, downgrade, cancel, renew
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    amount_paid NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Content Moderation Queue
CREATE TABLE IF NOT EXISTS content_moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL, -- moment, comment, review
    content_id UUID NOT NULL,
    reporter_id UUID REFERENCES auth.users(id),
    reason TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    moderated_by UUID REFERENCES auth.users(id),
    moderated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. User Events (Analytics)
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    event_name TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_user ON whatsapp_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_created ON whatsapp_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_name ON user_events(event_name);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events(created_at);

-- RLS Policies (Simplified for now - Admin access to be handled via app logic or custom claims)
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own data
CREATE POLICY "Users can view own whatsapp messages" ON whatsapp_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Admin policies (This assumes an is_admin function or similar mechanism exists, or we use service role key)
-- For now, we'll allow public read for some tables for development, but in prod should be restricted.
-- Ideally, we create a secure function `is_admin()`

-- Seed Data for Templates
INSERT INTO whatsapp_templates (name, content, category) VALUES
('Welcome Message', 'Assalamualaikum! Welcome to QuranPulse 🌙\nYour journey to strengthen your connection with Al-Quran begins here.\nStart exploring now!', 'onboarding'),
('Subscription Reminder', 'Assalamualaikum! Your QuranPulse PRO subscription will expire in 3 days.\nRenew now to continue enjoying unlimited features.', 'retention'),
('Payment Confirmation', 'Alhamdulillah! Your payment has been received successfully.\nYour PRO subscription is now active. JazakAllah khair!', 'transactional'),
('Ramadan Greeting', 'Ramadan Mubarak! 🌙\nMay this blessed month bring you closer to Allah.\nUse QuranPulse to complete your Quran reading this Ramadan!', 'seasonal'),
('Support Response', 'Assalamualaikum! Thank you for contacting QuranPulse support.\nOur team will respond to your query within 24 hours.\nJazakAllah khair for your patience.', 'support')
ON CONFLICT (name) DO NOTHING;
