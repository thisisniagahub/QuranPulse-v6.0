-- Admin security foundation
-- Adds missing admin audit and AI oversight tables,
-- and introduces an explicit profile status for moderation actions.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
CHECK (status IN ('active', 'banned'));

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_resource TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id
ON public.admin_audit_logs(admin_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.ai_flagged_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snippet TEXT NOT NULL,
    trigger TEXT NOT NULL DEFAULT 'manual',
    severity TEXT NOT NULL DEFAULT 'medium'
        CHECK (severity IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'trained')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_flagged_conversations_status
ON public.ai_flagged_conversations(status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.ai_training_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input TEXT NOT NULL,
    expected_output TEXT,
    source TEXT NOT NULL,
    source_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_flagged_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_queue ENABLE ROW LEVEL SECURITY;
