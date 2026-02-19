---
description: Use mcp-quran for Quran verse search and navigation
---

# Agent Quran Workflow

Search Quran verses by theme or navigate to specific surahs.

## Trigger Keywords
- `ayat`, `surah`, `quran`, `firman`

## Example Queries

```
"Ayat tentang sabar"
"Surah Al-Mulk"
"Cari ayat mengenai rezeki"
```

## Direct API Call

```typescript
const { data } = await supabase.functions.invoke('mcp-quran', {
  body: { intent: 'search', query: 'sabar', lang: 'ms' }
});
// Returns: { results: [{ ref: 'Al-Baqarah 2:153', text: '...' }] }
```

## Random Verse

```typescript
const { data } = await supabase.functions.invoke('mcp-quran', {
  body: { intent: 'random' }
});
```
