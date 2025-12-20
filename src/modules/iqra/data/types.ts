// New Structured Types
export interface IqraRow {
    label: string; // e.g. "Baris 1", "TAJUK", "Review"
    cells: string[]; // The content of the boxes. Right to Left.
    focus?: string; // The "Fokus Latihan" or "Fokus & Teknik" column
}

export interface IqraSection {
    title: string; // e.g. "MUKA SURAT 2: HURUF HIJAIYAH TUNGGAL"
    subtitle?: string; // e.g. "**Fokus:** Mengenal 28 Huruf Asal dan Bentuknya."
    diagramFlow?: string; // e.g. "[ Kotak Kanan ] ---> [ Kotak Kiri ]"
    rows: IqraRow[];
    checklist?: string[]; // Checklist items if any
    notes?: string[]; // Any extra notes or diagram descriptions
}

export interface IqraVolume {
    id: string; // 'iqra-1'
    title: string; // 'IQRA 1'
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
}