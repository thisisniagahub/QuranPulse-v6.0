// Quran Module Shared Types & Constants
import { QuranChapter, QuranVerse, Reciter } from '../../types';

export interface QuranSettings {
  fontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  autoScroll: boolean;
  playbackSpeed: number;
  selectedReciterId: number;
  selectedTranslationId: number;
}

export const DEFAULT_SETTINGS: QuranSettings = {
  fontSize: 32,
  showTranslation: true,
  showTransliteration: true,
  showWordByWord: true,
  autoScroll: true,
  playbackSpeed: 1,
  selectedReciterId: 7,
  selectedTranslationId: 131,
};

export const FEATURED_RECITERS: Reciter[] = [
  { id: 7, name: "Mishary Rashid Alafasy", style: "Murattal", recitation_style: "Beautiful and Clear" },
  { id: 3, name: "Abdul Rahman Al-Sudais", style: "Murattal", recitation_style: "Imam of Masjid al-Haram" },
  { id: 4, name: "Abu Bakr Al-Shatri", style: "Murattal", recitation_style: "Heartfelt Recitation" },
  { id: 6, name: "Mahmoud Khalil Al-Hussary", style: "Murattal", recitation_style: "Classical Egyptian Style" },
];
