export interface Persona {
  id: string;
  name: string;
  role: string;
  style: string;
  color: string;
}

export const PERSONAS: Record<string, Persona> = {
  AZHAR: { id: 'AZHAR', name: 'Ustaz Azhar', role: 'Pakar Fiqh & Hukum', style: 'Tegas & Tepat', color: 'teal' },
  AISHAH: { id: 'AISHAH', name: 'Ustazah Aishah', role: 'Kaunseling Keluarga', style: 'Lembut & Penyayang', color: 'pink' },
  AIMAN: { id: 'AIMAN', name: 'Abang Aiman', role: 'Mentor Belia', style: 'Santai & Relatable', color: 'emerald' }
};

export type PersonaKey = keyof typeof PERSONAS;
