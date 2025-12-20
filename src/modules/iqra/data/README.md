# Iqra Digital Data Implementation

This directory contains the fully structured data for Iqra volumes 1 through 6, transcribed from the verified source material.

## Improvement Strategy

The previous data structure was limited to simple lists of strings. The new implementation introduces a structured `IqraVolume` type that better represents the pedagogical design of the Iqra method:

1.  **Structured Rows & Cells**: Data is organized by `rows` and `cells` (Right-to-Left), matching the physical book layout exactly.
2.  **Focus Areas**: Each row now includes a `focus` field (e.g., "Bentuk Tiang & Mangkuk"), allowing the UI to display specific learning objectives for that line.
3.  **Checklists**: Key pages include `checklist` items for self-assessment (e.g., "Bunyi 'N' jelas di hujung").
4.  **Diagram Flows**: Visual flow instructions (e.g., `[ Kotak Kanan ] ---> [ Kotak Kiri ]`) are preserved to guide the user's reading direction.
5.  **Notes & Subtitles**: Additional context is captured in `subtitle` and `notes` fields.

## Data Structure (`types.ts`)

```typescript
export interface IqraRow {
    label: string;
    cells: string[];
    focus?: string;
}

export interface IqraSection {
    title: string;
    subtitle?: string;
    rows: IqraRow[];
    checklist?: string[];
    // ...
}
```

## How to Use

Import the data directly from the index:

```typescript
import { IQRA_1, IQRA_2, IQRA_3, IQRA_4, IQRA_5, IQRA_6 } from './data';

// Example: Accessing Page 2 of Iqra 1
const pageData = IQRA_1.pages[0];
console.log(pageData.title); // "MUKA SURAT 2: HURUF HIJAIYAH TUNGGAL"
```

This data is ready to be consumed by an updated `IqraDigitalReader` component that can render these rich tables and metadata.
