-- ==============================================================================
-- MASJID ECOSYSTEM & PAYMENT GATEWAY SCHEMA
-- ==============================================================================

-- 1. MASJID EXTENSIONS (Menambah info pada official_mosques)
ALTER TABLE public.official_mosques 
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'::jsonb, -- { "whatsapp": "+601...", "email": "..." }
ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT '{}'::jsonb, -- { "bank_name": "Maybank", "acc_no": "...", "qr_code": "..." }
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- 2. MASJID EVENTS (Kuliah, Kenduri, Kursus)
CREATE TABLE IF NOT EXISTS public.masjid_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mosque_id UUID REFERENCES public.official_mosques(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN ('kuliah', 'kursus', 'kenduri', 'gotong-royong', 'khutbah', 'special')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    speaker_name TEXT, -- Ustaz jemputan
    is_online BOOLEAN DEFAULT FALSE, -- Ada live stream?
    stream_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MASJID FUNDS (Tabung Khusus)
CREATE TABLE IF NOT EXISTS public.masjid_funds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mosque_id UUID REFERENCES public.official_mosques(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., "Tabung Bumbung Baru"
    description TEXT,
    target_amount NUMERIC(12, 2), -- Sasaran RM
    collected_amount NUMERIC(12, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSACTIONS (Payment Hub)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- User mungkin guest
    mosque_id UUID REFERENCES public.official_mosques(id), -- Penerima (jika Infaq)
    fund_id UUID REFERENCES public.masjid_funds(id), -- Tabung spesifik (Optional)
    
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'MYR',
    
    status TEXT CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    gateway TEXT CHECK (gateway IN ('billplz', 'toyyibpay', 'stripe', 'tng', 'manual')),
    gateway_ref_id TEXT, -- ID transaksi dari payment provider
    
    payment_method TEXT, -- 'fpx', 'card', 'wallet'
    receipt_url TEXT, -- Link gambar resit (jika manual)
    
    metadata JSONB DEFAULT '{}'::jsonb, -- Simpan data tambahan
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS POLICIES
ALTER TABLE public.masjid_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masjid_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Public Read (Events & Funds)
CREATE POLICY "Public Read Events" ON public.masjid_events FOR SELECT USING (true);
CREATE POLICY "Public Read Funds" ON public.masjid_funds FOR SELECT USING (true);

-- Transaction Security
-- User boleh tengok transaksi sendiri
CREATE POLICY "User View Own Tx" ON public.transactions 
FOR SELECT USING (auth.uid() = user_id);

-- User boleh create transaksi (Initiate payment)
CREATE POLICY "User Create Tx" ON public.transactions 
FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_events_mosque ON public.masjid_events(mosque_id);
CREATE INDEX IF NOT EXISTS idx_funds_mosque ON public.masjid_funds(mosque_id);
CREATE INDEX IF NOT EXISTS idx_tx_user ON public.transactions(user_id);
