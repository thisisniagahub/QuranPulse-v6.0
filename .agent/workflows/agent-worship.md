---
description: Use mcp-worship for prayer times and Qibla direction
---

# Agent Worship Workflow

Fetch prayer times for Malaysian zones via the Worship agent.

## Trigger Keywords
- `waktu`, `solat`, `azan`, `subuh`, `zohor`, `asar`, `maghrib`, `isyak`

## Zone Format
Malaysian zones: `WLP01`, `JHR01`, `SGR01`, etc.

## Example Queries

```
"Waktu solat Kuala Lumpur"
"Pukul berapa maghrib WLP01"
"Azan subuh hari ni"
```

## Direct API Call

```typescript
const { data } = await supabase.functions.invoke('mcp-worship', {
  body: { zone: 'WLP01' }
});
// Returns: { times: { subuh, zohor, asar, maghrib, isyak, ... } }
```
