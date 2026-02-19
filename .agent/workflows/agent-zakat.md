---
description: Use mcp-zakat for Zakat calculations
---

# Agent Zakat Workflow

Calculate Zakat obligations for income, savings, or gold.

## Trigger Keywords
- `zakat`, `fitrah`, `nisab`, `bayar`, `kira`

## Example Queries

```
"Kira zakat gaji 5000"
"Zakat emas 100 gram"
"Zakat simpanan 50000"
```

## Direct API Call

```typescript
const { data } = await supabase.functions.invoke('mcp-zakat', {
  body: { type: 'income', amount: 5000, state: 'WLP' }
});
// Returns: { result: { status: 'eligible', zakat_payable_myr: 125 } }
```

## Supported Types
- `income` - Zakat pendapatan
- `savings` - Zakat simpanan
- `gold` - Zakat emas
