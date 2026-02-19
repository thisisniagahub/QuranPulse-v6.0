import { IQRA_1_STRICT, IqraPageStrict } from './iqra-1-strict';
import { IQRA_2_STRICT } from './iqra-2-strict';
import { IQRA_3_STRICT } from './iqra-3-strict';
import { IQRA_4_STRICT } from './iqra-4-strict';
import { IQRA_5_STRICT } from './iqra-5-strict';
import { IQRA_6_STRICT } from './iqra-6-strict';

// Placeholder generator for volumes that don't have full text data yet
const generatePlaceholderPage = (vol: number, page: number): IqraPageStrict => ({
  page,
  title: `Jilid ${vol} - Muka Surat ${page}`,
  focus: "Placeholder Data",
  grid: [
    { baris: "1", kanan: "لَمْ يَلِدْ", kiri: "وَلَمْ يُولَدْ" },
    { baris: "2", kanan: "وَلَمْ يَكُن", kiri: "لَّهُۥ كُفُوًا" },
    { baris: "3", kanan: "أَحَدٌ", kiri: "DATA BELUM ADA" }
  ]
});

export const getStrictPageData = (vol: number, pageRef: number): IqraPageStrict => {
  if (vol === 1) {
    return IQRA_1_STRICT.find(p => p.page === pageRef) || generatePlaceholderPage(1, pageRef);
  }
  if (vol === 2) {
    return IQRA_2_STRICT.find(p => p.page === pageRef) || generatePlaceholderPage(2, pageRef);
  }
  if (vol === 3) {
    return IQRA_3_STRICT.find(p => p.page === pageRef) || generatePlaceholderPage(3, pageRef);
  }
  if (vol === 4) {
    return IQRA_4_STRICT.find(p => p.page === pageRef) || generatePlaceholderPage(4, pageRef);
  }
  if (vol === 5) {
    return IQRA_5_STRICT.find(p => p.page === pageRef) || generatePlaceholderPage(5, pageRef);
  }
  if (vol === 6) {
    return IQRA_6_STRICT.find(p => p.page === pageRef) || generatePlaceholderPage(6, pageRef);
  }

  return generatePlaceholderPage(vol, pageRef);
};
