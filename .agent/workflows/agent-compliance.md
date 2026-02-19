---
description: Use mcp-compliance for Fatwa and Halal status checks
---

# Agent Compliance Workflow

Check Islamic rulings (Fatwa) and Halal certification status.

## Trigger Keywords
- `hukum`, `fatwa`, `halal`, `haram`, `boleh ke`, `status`

## Example Queries

```
"Hukum forex"
"Status halal McDonald's"
"Boleh ke makan seafood"
```

## Direct API Call

```typescript
const { data } = await supabase.functions.invoke('mcp-compliance', {
  body: { type: 'fatwa', query: 'forex' }
});
// Returns: { status: 'found', data: { title, ruling, reference_url } }
```
