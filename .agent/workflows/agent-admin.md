---
description: Trigger mcp-admin Edge Function for system stats and analytics
---

# Agent Admin Workflow

Use this workflow to query QuranPulse system statistics via the Ustaz AI Admin agent.

## Prerequisites
- Supabase Edge Functions running (`supabase functions serve`)
- Admin authentication (Service Role access)

## Available Commands

### 1. User Statistics
```
Ask about: "how many users", "user stats", "new users today"
```

### 2. Content Statistics
```
Ask about: "content stats", "how many quran verses", "hadith count"
```

### 3. System Health
```
Ask about: "system health", "cache status", "system check"
```

## Example Usage

```typescript
// Via UstazOrchestrator
const result = await UstazOrchestrator.detectAndCall('show user stats for this week');
console.log(result.summary);
// Output: 🛡️ **Admin Report**
//         📊 Total: 1234 users | New (week): 56
```

## Direct Edge Function Call

```bash
curl -X POST https://your-project.supabase.co/functions/v1/mcp-admin \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"intent": "user_stats", "timeframe": "today"}'
```

## Security Notes

> [!CAUTION]
> This agent uses Service Role access. Never expose the service key to client-side code.

- Access is restricted to admin users only
- All queries are logged for audit purposes
