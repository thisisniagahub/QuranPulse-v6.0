import { IqraLesson, IqraUnit } from '../types';
import { IQRA_2_STRICT } from './iqra-2-strict';

interface UnitPlan {
  id: string;
  seq: number;
  start: number;
  end: number;
  title: string;
  unitTitle: string;
  description: string;
  objective: string;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze';
  successA: string;
  successB: string;
  tipA: string;
  tipB: string;
  makhraj: string;
  mode: 'practice' | 'test';
  score: number;
  targetPhonemes: string[];
  allowedMistakes: number;
}

const IQRA_2_UNIT_PLANS: UnitPlan[] = [
  {
    id: 'IQ2-U1',
    seq: 1,
    start: 2,
    end: 10,
    title: 'Huruf Sambung Fathah Asas',
    unitTitle: 'Sambungan Asas',
    description: 'Penguasaan bentuk awal/tengah/akhir huruf sambung dengan baris fathah.',
    objective: 'Mengenal bentuk sambungan huruf asas dan membaca tanpa mengeja.',
    bloomLevel: 'remember',
    successA: 'Murid menyebut setiap rangkai huruf dengan bunyi pendek dan tepat.',
    successB: 'Murid membezakan bentuk huruf bertitik ketika bersambung.',
    tipA: 'Bimbing pelajar mengikut arah bacaan kanan ke kiri.',
    tipB: 'Ulang baris sukar sekurang-kurangnya tiga kali.',
    makhraj: 'Tekankan beza hujung lidah untuk تَ/دَ dan sisi lidah untuk ضَ.',
    mode: 'practice',
    score: 82,
    targetPhonemes: ['ba', 'ta', 'na', 'da', 'sa', 'sha'],
    allowedMistakes: 3
  },
  {
    id: 'IQ2-U2',
    seq: 2,
    start: 11,
    end: 20,
    title: 'Sambungan Lanjutan Huruf Tebal & Halqi',
    unitTitle: 'Sambungan Lanjutan',
    description: 'Latihan sambungan huruf tebal, halqi, dan huruf bibir.',
    objective: 'Membaca gabungan huruf lanjutan dengan ketepatan makhraj.',
    bloomLevel: 'understand',
    successA: 'Murid tidak menukar bunyi huruf tebal dengan huruf nipis.',
    successB: 'Murid melafazkan ع dan غ dengan jelas dari halkum.',
    tipA: 'Bandingkan pasangan huruf hampir sama sebelum membaca baris penuh.',
    tipB: 'Gunakan tempo perlahan untuk huruf halqi sebelum percepat bacaan.',
    makhraj: 'ف dari bibir bawah ke gigi atas, ق dari pangkal lidah.',
    mode: 'test',
    score: 84,
    targetPhonemes: ['tho', 'zho', 'ain', 'ghain', 'fa', 'qaf', 'kaf', 'lam'],
    allowedMistakes: 3
  },
  {
    id: 'IQ2-U3',
    seq: 3,
    start: 21,
    end: 25,
    title: 'Latihan Panjang Pendek',
    unitTitle: 'Panjang Pendek',
    description: 'Membezakan bacaan pendek dan bacaan panjang asas.',
    objective: 'Mengecam perbezaan satu harakat dan dua harakat secara konsisten.',
    bloomLevel: 'analyze',
    successA: 'Murid tidak memanjangkan bacaan yang pendek.',
    successB: 'Murid mengekalkan panjang dua harakat pada bacaan mad.',
    tipA: 'Gunakan kiraan jari untuk stabilkan tempo dua harakat.',
    tipB: 'Hentikan dan betulkan serta-merta jika panjang pendek tertukar.',
    makhraj: 'Pastikan mad tidak mengubah makhraj asal huruf sebelum alif.',
    mode: 'test',
    score: 86,
    targetPhonemes: ['ba', 'baa', 'ta', 'taa', 'na', 'naa'],
    allowedMistakes: 2
  },
  {
    id: 'IQ2-U4',
    seq: 4,
    start: 26,
    end: 30,
    title: 'Campuran & Ulangkaji',
    unitTitle: 'Campuran',
    description: 'Campuran sambungan seluruh huruf untuk kelancaran bacaan.',
    objective: 'Membaca rangkai kata sambung secara lancar dan tepat.',
    bloomLevel: 'apply',
    successA: 'Murid dapat membaca satu halaman tanpa mengeja.',
    successB: 'Kesalahan titik huruf berkurang kepada minimum.',
    tipA: 'Ulang halaman campuran dengan gaya talaqqi satu-satu baris.',
    tipB: 'Minta pelajar menanda huruf yang kerap tertukar untuk fokus semula.',
    makhraj: 'Pantau huruf yang sering tertukar: س/ش, ص/س, ض/ظ.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['mixed-fathah'],
    allowedMistakes: 2
  },
  {
    id: 'IQ2-U5',
    seq: 5,
    start: 31,
    end: 32,
    title: 'Ujian Akhir Iqra 2',
    unitTitle: 'Ujian Akhir',
    description: 'Penilaian akhir kelancaran huruf sambung berbaris fathah.',
    objective: 'Mencapai bacaan sambung yang lancar sebagai syarat naik buku 3.',
    bloomLevel: 'apply',
    successA: 'Skor penilaian mencapai had lulus yang ditetapkan.',
    successB: 'Murid membetulkan sendiri kesalahan selepas teguran ringan.',
    tipA: 'Nilai bacaan tanpa bantuan selepas satu pusingan latihan.',
    tipB: 'Jika belum lulus, ulang unit sukar sebelum ulang ujian.',
    makhraj: 'Ujian akhir fokus ketepatan makhraj dan kesinambungan bacaan.',
    mode: 'test',
    score: 90,
    targetPhonemes: ['final-review-iqra2'],
    allowedMistakes: 1
  }
];

const makeLesson = (unit: UnitPlan, page: number): IqraLesson => {
  const pageData = IQRA_2_STRICT.find((item) => item.page === page);
  const objectiveIndex = page - unit.start + 1;

  return {
    id: `L2-P${page}`,
    unitId: unit.id,
    unitTitle: unit.unitTitle,
    pageRef: page,
    title: pageData?.title ?? `Iqra 2 Page ${page}`,
    objectives: [
      {
        id: `OBJ-2.${unit.seq}.${objectiveIndex}`,
        description: `${unit.objective} Fokus: ${pageData?.focus ?? '-'}`,
        bloomLevel: unit.bloomLevel,
        successCriteria: [unit.successA, unit.successB]
      }
    ],
    teachingTips: [unit.tipA, unit.tipB, `Makhraj: ${unit.makhraj}`],
    assessment: {
      mode: unit.mode,
      passingScore: unit.score,
      targetPhonemes: unit.targetPhonemes,
      allowedMistakes: unit.allowedMistakes
    }
  };
};

// TODO: Verify curriculum sequencing for Iqra 2 against certified teaching flow.
export const IQRA_2_UNITS: IqraUnit[] = IQRA_2_UNIT_PLANS.map((unit) => ({
  id: unit.id,
  title: unit.title,
  description: unit.description,
  lessons: Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => `L2-P${unit.start + idx}`)
}));

export const IQRA_2_CURRICULUM: IqraLesson[] = IQRA_2_UNIT_PLANS.flatMap((unit) =>
  Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => makeLesson(unit, unit.start + idx))
);

