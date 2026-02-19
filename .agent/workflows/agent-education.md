---
description: Use mcp-education for Hadith and Tafsir lookups
---

# Agent Education Workflow

Query Islamic knowledge sources (Hadith, Tafsir) via the Education agent.

## Trigger Keywords
- `hadis`, `hadith`, `riwayat`, `tafsir`

## Example Queries

```
"Hadis tentang solat"
"Tafsir surah Al-Asr"
"Riwayat Bukhari tentang puasa"
```

## Direct API Call

```typescript
const { data } = await supabase.functions.invoke('mcp-education', {
  body: { intent: 'hadith', query: 'solat' }
});
```
