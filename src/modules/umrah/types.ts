// Umrah Module Types

export interface DamViolation {
    id: string;
    category: 'tartib' | 'takhyir';
    name: string;
    nameAr: string;
    description: string;
    penalty: DamPenalty[];
}

export interface DamPenalty {
    type: 'kambing' | 'puasa' | 'fidyah' | 'mud';
    description: string;
    descriptionAr: string;
    amount?: number;
}

export interface TawafRound {
    round: number;
    doaAr: string;
    doaMy: string;
    audioSrc?: string;
}

export interface SaiLap {
    lap: number;
    from: 'safa' | 'marwah';
    to: 'safa' | 'marwah';
    doaAr: string;
    doaMy: string;
    audioSrc?: string;
}

export interface ChecklistItem {
    id: string;
    category: 'dokumen' | 'pakaian_lelaki' | 'pakaian_wanita' | 'umum' | 'kesihatan';
    name: string;
    description?: string;
    required: boolean;
    checked: boolean;
}

export interface IhramProhibition {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    gender: 'lelaki' | 'wanita' | 'semua';
    damType: 'tartib' | 'takhyir';
    penalty: string;
}

export interface EmergencyInfo {
    hotelName: string;
    hotelAddress: string;
    gateNumber: string;
    passportNumber: string;
    visaNumber: string;
    emergencyContact: string;
    bloodType: string;
}

export interface MiqatInfo {
    name: string;
    nameAr: string;
    forCountries: string[];
    coordinates: { lat: number; lng: number };
}

export type UmrahTab = 'mutawwif' | 'dam' | 'checklist' | 'ihram' | 'sos' | 'miqat' | 'raudhah' | 'tawaf';
