-- ==============================================================================
-- MIGRATION: Fix Missing Admin/E-commerce Tables
-- Date: 2026-01-07
-- Author: Gemini CLI
-- Description: Creates tables required by the Admin Dashboard and Main App
--              that were causing 404 errors (products, announcements, etc.)
-- ==============================================================================

-- 1. PRODUCTS (Souq / E-commerce)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'MYR',
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    category TEXT, -- 'book', 'clothing', 'digital', 'donation'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ANNOUNCEMENTS (Broadcasts)
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    action_url TEXT,
    active BOOLEAN DEFAULT true,
    priority INT DEFAULT 1, -- Higher = Show first
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS (Souq Transactions)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'completed', 'cancelled'
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'MYR',
    items JSONB DEFAULT '[]', -- Array of {productId, quantity, price}
    shipping_address JSONB,
    payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SYSTEM LOGS (Audit/Debug)
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT DEFAULT 'info', -- 'info', 'warn', 'error'
    message TEXT NOT NULL,
    metadata JSONB,
    source TEXT, -- 'frontend', 'edge_function', 'admin'
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APP CONFIG (Remote Config)
CREATE TABLE IF NOT EXISTS app_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL, -- e.g., 'maintenance_mode', 'min_version'
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Products: Public Read, Admin Write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON products FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE email LIKE '%@admin.com') -- Adjust logic as needed
);

-- Announcements: Public Read, Admin Write
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin write announcements" ON announcements FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE email LIKE '%@admin.com')
);

-- Orders: Users view own, Admin view all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- System Logs: Service Role Only (or Admin view)
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view logs" ON system_logs FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE email LIKE '%@admin.com')
);
CREATE POLICY "Insert logs" ON system_logs FOR INSERT WITH CHECK (true); -- Allow app to log

-- App Config: Public Read, Admin Write
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read config" ON app_config FOR SELECT USING (true);
CREATE POLICY "Admin write config" ON app_config FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE email LIKE '%@admin.com')
);

-- ==============================================================================
-- SEED DATA (Optional Initial Config)
-- ==============================================================================

INSERT INTO app_config (key, value, description)
VALUES 
('maintenance_mode', 'false'::jsonb, 'Global app maintenance switch'),
('min_version', '"6.0.0"'::jsonb, 'Minimum supported app version')
ON CONFLICT (key) DO NOTHING;
