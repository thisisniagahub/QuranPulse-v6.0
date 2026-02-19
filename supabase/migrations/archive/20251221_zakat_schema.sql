-- ==============================================================================
-- ZAKAT HUB SCHEMA
-- ==============================================================================

-- 1. ZAKAT RECORDS (History of Obligations & Payments)
CREATE TABLE IF NOT EXISTS public.zakat_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    year INTEGER NOT NULL, -- e.g., 2025
    zakat_type TEXT CHECK (zakat_type IN ('income', 'business', 'savings', 'gold', 'shares', 'epf')),
    
    -- Calculation Snapshot
    data_snapshot JSONB DEFAULT '{}'::jsonb, 
    -- e.g. { "gross_income": 60000, "deductions": 12000, "assets": 0 }
    
    amount_payable NUMERIC(12, 2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(12, 2) DEFAULT 0,
    
    status TEXT CHECK (status IN ('draft', 'payable', 'paid', 'partial')),
    payment_method TEXT, -- 'auto_debit', 'manual_fpx', 'counter'
    receipt_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ZAKAT SETTINGS (User specific defaults)
-- Usually part of user_settings, but can be separate if complex
CREATE TABLE IF NOT EXISTS public.zakat_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    
    preferred_state TEXT DEFAULT 'WLY', -- For Nisab reference (W.P., SEL, JHR)
    auto_deduct_enabled BOOLEAN DEFAULT FALSE,
    monthly_deduction_amount NUMERIC(12, 2) DEFAULT 0,
    
    family_deduction_profile JSONB DEFAULT '{"wife": 0, "children_school": 0, "children_uni": 0}'::jsonb,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES
ALTER TABLE public.zakat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zakat_settings ENABLE ROW LEVEL SECURITY;

-- Users manage their own zakat data
CREATE POLICY "Manage Own Zakat" ON public.zakat_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Manage Own Zakat Settings" ON public.zakat_settings FOR ALL USING (auth.uid() = user_id);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_zakat_user_year ON public.zakat_records(user_id, year);
