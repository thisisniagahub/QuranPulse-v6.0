-- ============================================================================
-- REALTIME BROADCAST IMPROVEMENTS
-- QuranPulse v6.0 - Supabase Realtime Enhancement
-- Date: 2026-01-04
-- ============================================================================

-- ============================================================================
-- 0. CREATE WHATSAPP_MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    phone_number TEXT, -- Format: 60123456789@c.us
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('incoming', 'outgoing')),
    content TEXT NOT NULL,
    media_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON public.whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON public.whatsapp_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON public.whatsapp_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
-- Allow users to see messages linked to their user_id
CREATE POLICY "Users can view their own messages" ON public.whatsapp_messages
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own outgoing messages
CREATE POLICY "Users can insert their own outgoing messages" ON public.whatsapp_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id AND message_type = 'outgoing');

-- ============================================================================
-- 1. CREATE BROADCAST_LOGS TABLE FOR DEBUGGING
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.broadcast_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Event info
    event_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    table_name TEXT NOT NULL,
    table_schema TEXT DEFAULT 'public',
    -- Topic info
    topic TEXT NOT NULL,
    -- Row data (JSONB for flexibility)
    new_data JSONB,
    old_data JSONB,
    -- Status
    status TEXT DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED', 'SKIPPED'
    error_message TEXT,
    -- Metadata
    triggered_by UUID,
    execution_time_ms INTEGER
);

-- Add index for querying logs
CREATE INDEX IF NOT EXISTS idx_broadcast_logs_created_at ON public.broadcast_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broadcast_logs_topic ON public.broadcast_logs(topic);

-- Enable RLS (only admins and service_role can read logs)
ALTER TABLE public.broadcast_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow trigger function to insert logs
CREATE POLICY "allow_trigger_insert" ON public.broadcast_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- 2. IMPROVED TRIGGER FUNCTION WITH ERROR HANDLING & LOGGING
-- ============================================================================
CREATE OR REPLACE FUNCTION public.whatsapp_messages_broadcast_trigger() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    phone_topic TEXT;
    user_topic TEXT;
    start_time TIMESTAMPTZ;
    execution_ms INTEGER;
    current_user_id UUID;
BEGIN
    -- Record start time for performance monitoring
    start_time := clock_timestamp();
    
    -- Get current user (may be NULL for service_role operations)
    BEGIN
        current_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        current_user_id := NULL;
    END;

    -- ========================================
    -- HANDLE DELETE OPERATION
    -- ========================================
    IF TG_OP = 'DELETE' THEN
        -- Build topics only if values exist (NULL handling)
        IF OLD.phone_number IS NOT NULL AND OLD.phone_number <> '' THEN
            phone_topic := 'room:whatsapp:' || OLD.phone_number;
            
            BEGIN
                PERFORM realtime.broadcast_changes(
                    phone_topic,
                    TG_OP,
                    TG_OP,
                    TG_TABLE_NAME,
                    TG_TABLE_SCHEMA,
                    NULL,
                    OLD
                );
                
                -- Log success
                execution_ms := EXTRACT(MILLISECONDS FROM (clock_timestamp() - start_time))::INTEGER;
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, old_data, status, triggered_by, execution_time_ms)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, phone_topic, to_jsonb(OLD), 'SUCCESS', current_user_id, execution_ms);
                
            EXCEPTION WHEN OTHERS THEN
                -- Log failure but don't stop the operation
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, old_data, status, error_message, triggered_by)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, phone_topic, to_jsonb(OLD), 'FAILED', SQLERRM, current_user_id);
            END;
        END IF;

        IF OLD.user_id IS NOT NULL THEN
            user_topic := 'room:user:' || OLD.user_id::TEXT;
            
            BEGIN
                PERFORM realtime.broadcast_changes(
                    user_topic,
                    TG_OP,
                    TG_OP,
                    TG_TABLE_NAME,
                    TG_TABLE_SCHEMA,
                    NULL,
                    OLD
                );
                
                execution_ms := EXTRACT(MILLISECONDS FROM (clock_timestamp() - start_time))::INTEGER;
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, old_data, status, triggered_by, execution_time_ms)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, user_topic, to_jsonb(OLD), 'SUCCESS', current_user_id, execution_ms);
                
            EXCEPTION WHEN OTHERS THEN
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, old_data, status, error_message, triggered_by)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, user_topic, to_jsonb(OLD), 'FAILED', SQLERRM, current_user_id);
            END;
        END IF;

        RETURN OLD;

    -- ========================================
    -- HANDLE INSERT / UPDATE OPERATIONS
    -- ========================================
    ELSE
        -- Build topics only if values exist (NULL handling)
        IF NEW.phone_number IS NOT NULL AND NEW.phone_number <> '' THEN
            phone_topic := 'room:whatsapp:' || NEW.phone_number;
            
            BEGIN
                PERFORM realtime.broadcast_changes(
                    phone_topic,
                    TG_OP,
                    TG_OP,
                    TG_TABLE_NAME,
                    TG_TABLE_SCHEMA,
                    NEW,
                    OLD
                );
                
                execution_ms := EXTRACT(MILLISECONDS FROM (clock_timestamp() - start_time))::INTEGER;
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, new_data, old_data, status, triggered_by, execution_time_ms)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, phone_topic, to_jsonb(NEW), to_jsonb(OLD), 'SUCCESS', current_user_id, execution_ms);
                
            EXCEPTION WHEN OTHERS THEN
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, new_data, old_data, status, error_message, triggered_by)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, phone_topic, to_jsonb(NEW), to_jsonb(OLD), 'FAILED', SQLERRM, current_user_id);
            END;
        END IF;

        IF NEW.user_id IS NOT NULL THEN
            user_topic := 'room:user:' || NEW.user_id::TEXT;
            
            BEGIN
                PERFORM realtime.broadcast_changes(
                    user_topic,
                    TG_OP,
                    TG_OP,
                    TG_TABLE_NAME,
                    TG_TABLE_SCHEMA,
                    NEW,
                    OLD
                );
                
                execution_ms := EXTRACT(MILLISECONDS FROM (clock_timestamp() - start_time))::INTEGER;
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, new_data, old_data, status, triggered_by, execution_time_ms)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, user_topic, to_jsonb(NEW), to_jsonb(OLD), 'SUCCESS', current_user_id, execution_ms);
                
            EXCEPTION WHEN OTHERS THEN
                INSERT INTO public.broadcast_logs (event_type, table_name, table_schema, topic, new_data, old_data, status, error_message, triggered_by)
                VALUES (TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, user_topic, to_jsonb(NEW), to_jsonb(OLD), 'FAILED', SQLERRM, current_user_id);
            END;
        END IF;

        RETURN NEW;
    END IF;
END;
$$;

-- ============================================================================
-- 3. ATTACH TRIGGER TO WHATSAPP_MESSAGES
-- ============================================================================
DROP TRIGGER IF EXISTS trg_whatsapp_messages_broadcast ON public.whatsapp_messages;
CREATE TRIGGER trg_whatsapp_messages_broadcast
AFTER INSERT OR UPDATE OR DELETE ON public.whatsapp_messages
FOR EACH ROW EXECUTE PROCEDURE public.whatsapp_messages_broadcast_trigger();

-- ============================================================================
-- 4. HELPER FUNCTION TO CLEAN OLD LOGS (Run periodically)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_broadcast_logs(days_to_keep INTEGER DEFAULT 7) 
RETURNS INTEGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.broadcast_logs
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;