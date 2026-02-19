// New Structured Types
// AI-Ready Segment Structure
export interface IqraSegment {
    id: string;             // Unique ID for tracking stats
    text: string;           // The Arabic display text (e.g., "بَ")
    transliteration?: string; // Phonetic guide (hidden by default) e.g., "ba"
    audioSrc?: string;      // Reference audio file (optional)

    // AI Validation Rules
    acceptedPhonemes?: string[]; // e.g., ["b", "ae"]
    difficulty?: number;      // 1-10 scale
}

export interface IqraRow {
    id?: string;
    label: string; // e.g. "Baris 1", "TAJUK", "Review"
    cells: string[]; // LEGACY: Simple string content
    segments?: IqraSegment[]; // NEW: Structured content (Preferred)
    focus?: string; // The "Fokus Latihan" or "Fokus & Teknik" column
}

export interface IqraSection {
    id?: string;
    title: string; // e.g. "MUKA SURAT 2: HURUF HIJAIYAH TUNGGAL"
    subtitle?: string; // e.g. "**Fokus:** Mengenal 28 Huruf Asal dan Bentuknya."
    focus?: string; // NEW: Specific learning focus for the Hub
    diagramFlow?: string; // e.g. "[ Kotak Kanan ] ---> [ Kotak Kiri ]"
    rows: IqraRow[];
    checklist?: string[]; // Checklist items if any
    notes?: string[]; // Any extra notes or diagram descriptions
    image?: string; // URL to the page image
}

export interface IqraVolume {
    id: string; // 'iqra-1'
    title: string; // 'IQRA 1'
    objective?: string; // NEW: Volume-level objective
    pages: IqraSection[];
}

// Legacy Data Types (migrated from old data.ts)
export interface IqraBook {
    id: string;
    title: string;
    file: string;
    color: string;
    shadow: string;
    icon: string;
}

export interface TajweedTutorial {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    prompt: string;
    poster?: string;
}