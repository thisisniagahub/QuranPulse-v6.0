# 🚀 Supabase Realtime Setup Guide

> QuranPulse v6.0 - Real-time Chat & Notifications

## Overview

QuranPulse uses Supabase Realtime to power real-time chat features. This document covers the setup, usage, and testing of the realtime system.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React App)                             │
│  ┌─────────────────────┐    ┌─────────────────────────────────────────┐ │
│  │   useRealtimeChat   │◄───│  supabase.channel().subscribe()         │ │
│  └─────────────────────┘    └─────────────────────────────────────────┘ │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │ WebSocket (Private Channel)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE REALTIME                                │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  realtime.messages (with RLS)                                       ││
│  │  - allow_select_whatsapp_user_or_phone                              ││
│  │  - allow_insert_whatsapp_user_or_phone                              ││
│  └─────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │ Trigger Event
                                        ▲
┌───────────────────────────────────────┴─────────────────────────────────┐
│                          PostgreSQL Database                             │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  public.whatsapp_messages                                           ││
│  │      │                                                              ││
│  │      ▼                                                              ││
│  │  TRIGGER: whatsapp_messages_broadcast_trigger                       ││
│  │      │                                                              ││
│  │      ├── realtime.broadcast_changes('room:whatsapp:+60xxx')         ││
│  │      ├── realtime.broadcast_changes('room:user:uuid')               ││
│  │      └── INSERT INTO broadcast_logs (for debugging)                 ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Components

### 1. Trigger Function

**Location:** `public.whatsapp_messages_broadcast_trigger()`

Features:
- ✅ Error handling with try-catch blocks
- ✅ NULL value validation (skips broadcast if no valid topic)
- ✅ Logs all broadcast events to `broadcast_logs`
- ✅ Performance monitoring (execution time)
- ✅ Supports both phone-based and user-based topics

### 2. Broadcast Logs Table

```sql
public.broadcast_logs
├── id (UUID, PK)
├── created_at (TIMESTAMPTZ)
├── event_type (TEXT) -- INSERT, UPDATE, DELETE
├── table_name (TEXT)
├── topic (TEXT)
├── new_data (JSONB)
├── old_data (JSONB)
├── status (TEXT) -- SUCCESS, FAILED, SKIPPED
├── error_message (TEXT)
├── triggered_by (UUID)
└── execution_time_ms (INTEGER)
```

### 3. RLS Policies

| Policy Name | Action | Description |
|-------------|--------|-------------|
| `allow_select_whatsapp_user_or_phone` | SELECT | User can read messages for their own topics |
| `allow_insert_whatsapp_user_or_phone` | INSERT | User can send to their own topics |

---

## Frontend Usage

### Basic Usage

```typescript
import { useRealtimeChat } from '@/hooks/useRealtimeChat';

function ChatComponent() {
  const {
    messages,
    status,
    error,
    sendMessage,
    refreshMessages,
  } = useRealtimeChat({
    topicType: 'phone',
    identifier: '+60123456789',
    debug: true,
    onNewMessage: (msg) => {
      console.log('New message:', msg);
      // Play notification sound, scroll to bottom, etc.
    },
  });

  if (status === 'connecting') return <Spinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div>
      {messages.map(msg => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      
      <ChatInput onSend={(text) => sendMessage(text)} />
    </div>
  );
}
```

### User-Based Chat (DMs)

```typescript
const { messages, sendMessage } = useRealtimeChat({
  topicType: 'user',
  identifier: 'user-uuid-here',
});
```

### Notifications Hook

```typescript
import { useRealtimeNotifications } from '@/hooks/useRealtimeChat';

function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useRealtimeNotifications(userId);

  return (
    <Badge count={unreadCount}>
      <BellIcon onClick={() => {
        showNotifications(notifications);
        markAllRead();
      }} />
    </Badge>
  );
}
```

---

## Topic Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| WhatsApp | `room:whatsapp:<phone>` | `room:whatsapp:+60123456789` |
| User DM | `room:user:<uuid>` | `room:user:a1b2c3d4-...` |
| Notifications | `room:user:<uuid>:notifications` | `room:user:a1b2c3d4-...:notifications` |

---

## Monitoring & Debugging

### View Recent Broadcast Logs

```sql
SELECT 
  created_at,
  event_type,
  topic,
  status,
  execution_time_ms,
  error_message
FROM public.broadcast_logs
ORDER BY created_at DESC
LIMIT 20;
```

### View Hourly Statistics

```sql
SELECT * FROM public.broadcast_stats;
```

### Clean Old Logs (7 days)

```sql
SELECT public.cleanup_broadcast_logs(7);
```

### Realtime Inspector

Use **Supabase Dashboard → Database → Realtime Inspector** to:
- See active channels
- Monitor message flow
- Debug connection issues

---

## Testing RLS

Run the test queries in `supabase/migrations/20260104_rls_test_queries.sql` to validate:

1. ✅ RLS is enabled on `realtime.messages`
2. ✅ Policies exist and are correctly configured
3. ✅ Trigger function logs events properly
4. ✅ Multi-user isolation works correctly

---

## Deployment Checklist

- [ ] Run SQL migration: `20260104_realtime_improvements.sql`
- [ ] Verify `broadcast_logs` table created
- [ ] Verify trigger function updated with error handling
- [ ] Test with Supabase Realtime Inspector
- [ ] Deploy frontend with `useRealtimeChat` hook
- [ ] Set up pg_cron job for log cleanup (optional)

---

## Troubleshooting

### Messages not receiving

1. Check connection status in hook: `status === 'connected'`
2. Verify RLS policies allow your user to access the topic
3. Check `broadcast_logs` for FAILED or SKIPPED events
4. Ensure `profiles.phone` matches the phone topic pattern

### High latency

1. Check `broadcast_stats` for avg execution time
2. Verify indexes exist on query columns
3. Consider reducing broadcast log verbosity

### Authentication errors

1. Ensure user is authenticated before subscribing
2. Verify `auth.uid()` returns valid UUID
3. Check Supabase Realtime is enabled in project settings

---

## Files Reference

| File | Description |
|------|-------------|
| `supabase/migrations/20260104_realtime_improvements.sql` | Database migration |
| `supabase/migrations/20260104_rls_test_queries.sql` | Test queries |
| `src/hooks/useRealtimeChat.ts` | React hook for realtime |
| `DOCS_VAULT/SUPABASE_REALTIME_SETUP.md` | This documentation |

---

*Last updated: 2026-01-04*
