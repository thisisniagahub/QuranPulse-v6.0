-- ==============================================================================
-- BARAKAH ENGINE SCHEMA (Financial & Digital Waqf)
-- ==============================================================================

-- 1. EXTEND MASJID FUNDS (Support for Asnaf/Waqf types)
ALTER TABLE public.masjid_funds
ADD COLUMN IF NOT EXISTS fund_type TEXT CHECK (fund_type IN ('construction', 'event', 'asnaf', 'education', 'waqf_digital')),
ADD COLUMN IF NOT EXISTS beneficiary_id UUID REFERENCES public.profiles(id); -- Link to specific Asnaf profile if applicable

-- 2. VIRTUAL ACCOUNTS (E-Wallet System for Asnaf/Mosques)
CREATE TABLE IF NOT EXISTS public.virtual_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE, -- One account per user
    balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
    is_frozen BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Virtual Accounts
ALTER TABLE public.virtual_accounts ENABLE ROW LEVEL SECURITY;
-- Users view own balance
CREATE POLICY "View Own Balance" ON public.virtual_accounts 
FOR SELECT USING (auth.uid() = owner_id);
-- System updates balance (No direct user update allowed via API - use RPC)

-- 3. API KEYS POOL (Wakaf Token System)
CREATE TABLE IF NOT EXISTS public.api_keys_pool (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_value TEXT NOT NULL,          -- Encrypted API Key
    provider TEXT DEFAULT 'gemini',   -- 'gemini', 'openai'
    donor_id UUID REFERENCES public.profiles(id), -- Who donated this key?
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    daily_limit INTEGER DEFAULT 1000, -- Max requests per day
    last_used_at TIMESTAMPTZ,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Keys Pool
ALTER TABLE public.api_keys_pool ENABLE ROW LEVEL SECURITY;
-- Only System can read keys (Edge Functions)
-- Donors can see their own key stats
CREATE POLICY "Donors view stats" ON public.api_keys_pool
FOR SELECT USING (auth.uid() = donor_id);

-- 4. FUNCTION: Transfer Funds (Secure RPC)
-- This function moves money from Transaction -> Virtual Account safely
CREATE OR REPLACE FUNCTION process_donation(
    p_transaction_id UUID,
    p_beneficiary_id UUID,
    p_amount NUMERIC
) RETURNS VOID AS $$
BEGIN
    -- 1. Verify Transaction is SUCCESS
    IF NOT EXISTS (SELECT 1 FROM transactions WHERE id = p_transaction_id AND status = 'success') THEN
        RAISE EXCEPTION 'Invalid or pending transaction';
    END IF;

    -- 2. Credit Virtual Account (Create if not exists)
    INSERT INTO virtual_accounts (owner_id, balance)
    VALUES (p_beneficiary_id, p_amount)
    ON CONFLICT (owner_id) 
    DO UPDATE SET 
        balance = virtual_accounts.balance + EXCLUDED.balance,
        last_updated = NOW();
        
    -- 3. Mark transaction as processed (Optional logic flag)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
