---
description: ASR Engine multi-agent system for Quran recitation learning
---

# Agent ASR Workflow

The ASR (Automatic Speech Recognition) Engine uses a Multi-Agent System for acoustic Quran learning.

## The Squad (4 Agents)

| Agent | Code Name | Role |
|-------|-----------|------|
| Acoustic | Al-Musami | Signal processing ("The Ears") |
| Evaluator | Al-Hakam | Q-WER scoring ("The Judge") |
| Profiler | Al-Hafiz | User history ("The Memory") |
| Pedagogy | Al-Mu'allim | Feedback ("The Teacher") |

## Q-WER Error Weights

- **Makhraj (3.0x)** - Articulation errors (Critical)
- **Tajweed (2.5x)** - Rule violations
- **Harakat (2.0x)** - Vowel timing
- **Rhythm (1.0x)** - Fluency

## Trigger Keywords
- `iqra`, `belajar`, `mengaji`, `makhraj`, `tajwid`, `bacaan`

## Module Location
```
modules/asr_engine/
├── core_engine/acoustic/
├── intelligence/metrics/
├── intelligence/memory/
└── intelligence/pedagogy/
```

## Integration Point

```typescript
// Currently routes to Iqra UI guidance
const result = await UstazOrchestrator.detectAndCall('belajar tajwid');
// Future: Direct voice processing integration
```
