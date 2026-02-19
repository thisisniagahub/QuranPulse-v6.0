-- ============================================================================
-- RLS VALIDATION TEST QUERIES
-- QuranPulse v6.0 - Run these to validate RLS policies work correctly
-- ============================================================================
-- ============================================================================
-- TEST 1: Check RLS is enabled on realtime.messages
-- ============================================================================
SELECT schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'realtime'
    AND tablename = 'messages';
-- Expected: rowsecurity = true
-- ============================================================================
-- TEST 2: List all policies on realtime.messages
-- ============================================================================
SELECT policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'realtime'
    AND tablename = 'messages';
-- Expected: Should see 'allow_select_whatsapp_user_or_phone' and 'allow_insert_whatsapp_user_or_phone'
-- ============================================================================
-- TEST 3: Simulate User A trying to read their own messages
-- (Run this as authenticated user)
-- ============================================================================
-- First, get your test user's UUID
-- SELECT id, email FROM auth.users WHERE email = 'testuser@example.com';
-- Then test with that user's context:
-- SET LOCAL role = 'authenticated';
-- SET LOCAL request.jwt.claim.sub = 'USER_UUID_HERE';
-- SELECT * FROM realtime.messages WHERE topic LIKE 'room:user:%';
-- ============================================================================
-- TEST 4: Validate broadcast_logs table exists and is working
-- ============================================================================
-- Check table exists
SELECT EXISTS (
        SELECT
        FROM pg_tables
        WHERE schemaname = 'public'
            AND tablename = 'broadcast_logs'
    ) AS broadcast_logs_exists;
-- Check recent logs
SELECT id,
    created_at,
    event_type,
    topic,
    status,
    execution_time_ms,
    error_message
FROM public.broadcast_logs
ORDER BY created_at DESC
LIMIT 10;
-- ============================================================================
-- TEST 5: Test trigger by inserting a test message
-- ============================================================================
-- Insert test message (will trigger broadcast)
INSERT INTO public.whatsapp_messages (
        phone_number,
        message_type,
        content,
        status
    )
VALUES (
        '+60123456789',
        'incoming',
        'Test message for realtime trigger validation',
        'pending'
    )
RETURNING id;
-- Check if broadcast log was created
SELECT *
FROM public.broadcast_logs
WHERE created_at > NOW() - INTERVAL '1 minute'
ORDER BY created_at DESC;
-- Clean up test message
-- DELETE FROM public.whatsapp_messages WHERE content = 'Test message for realtime trigger validation';
-- ============================================================================
-- TEST 6: Check indexes exist
-- ============================================================================
SELECT indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'whatsapp_messages'
    AND indexname IN (
        'idx_whatsapp_messages_phone_number',
        'idx_whatsapp_messages_user_id'
    );
SELECT indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'broadcast_logs';
-- ============================================================================
-- TEST 7: Broadcast stats view
-- ============================================================================
SELECT *
FROM public.broadcast_stats;
-- ============================================================================
-- MULTI-USER RLS TEST SCENARIO
-- ============================================================================
/*
 To properly test RLS with multiple users:
 
 1. Create two test users in Supabase Auth:
 - User A: usera@test.com (UUID: aaa-111-...)
 - User B: userb@test.com (UUID: bbb-222-...)
 
 2. Create profile entries for each:
 INSERT INTO public.profiles (id, phone) VALUES 
 ('aaa-111-...', '+60111111111'),
 ('bbb-222-...', '+60222222222');
 
 3. Insert messages for each user:
 INSERT INTO public.whatsapp_messages (phone_number, user_id, content, status) VALUES
 ('+60111111111', 'aaa-111-...', 'Message for User A', 'sent'),
 ('+60222222222', 'bbb-222-...', 'Message for User B', 'sent');
 
 4. Subscribe from frontend as User A:
 - Should receive messages for room:user:aaa-111-... and room:whatsapp:+60111111111
 - Should NOT receive messages for User B's topics
 
 5. Use Supabase Dashboard > Realtime Inspector to monitor channels
 
 6. Validate in broadcast_logs that events were broadcast correctly
 */
-- ============================================================================
-- CLEANUP TEST DATA (Optional)
-- ============================================================================
-- DELETE FROM public.broadcast_logs WHERE created_at > NOW() - INTERVAL '1 hour';
-- DELETE FROM public.whatsapp_messages WHERE content LIKE 'Test message%';
-- ============================================================================
-- END OF TEST QUERIES
-- ============================================================================