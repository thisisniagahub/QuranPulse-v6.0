import { IqraLesson, IqraUnit } from '../types';
import { IQRA_5_STRICT } from './iqra-5-strict';

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

const IQRA_5_UNIT_PLANS: UnitPlan[] = [
  {
    id: 'IQ5-U1',
    seq: 1,
    start: 2,
    end: 6,
    title: 'Mad Wau',
    unitTitle: 'Mad Wau',
    description: 'Bunyi uu dua harakat dengan wau sukun.',
    objective: 'Memanjangkan bacaan dammah + wau secara konsisten.',
    bloomLevel: 'apply',
    successA: 'Murid mengekalkan tempoh dua harakat.',
    successB: 'Murid tidak menukar bunyi uu kepada o panjang.',
    tipA: 'Latih bibir muncung dari awal hingga akhir mad.',
    tipB: 'Baca perlahan dahulu sebelum menaikkan kelajuan.',
    makhraj: 'Mad wau keluar dari rongga mulut selepas dammah sempurna.',
    mode: 'practice',
    score: 86,
    targetPhonemes: ['buu', 'tuu', 'suu'],
    allowedMistakes: 3
  },
  {
    id: 'IQ5-U2',
    seq: 2,
    start: 7,
    end: 10,
    title: 'Alif Ziyadah',
    unitTitle: 'Alif Ziyadah',
    description: 'Mengenal alif tambahan selepas wau jamak.',
    objective: 'Membaca kalimah wau jamak tanpa menambah bunyi alif.',
    bloomLevel: 'understand',
    successA: 'Murid tidak memanjangkan bacaan pada alif ziyadah.',
    successB: 'Murid dapat kenal pola وا الجماعة dalam teks.',
    tipA: 'Tanda alif tambahan dengan warna semasa latihan awal.',
    tipB: 'Ulang contoh Quranik yang sering muncul.',
    makhraj: 'Fokus makhraj huruf akhir sebelum wau jamak.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['qalu', 'amanu', 'jahadu'],
    allowedMistakes: 2
  },
  {
    id: 'IQ5-U3',
    seq: 3,
    start: 11,
    end: 18,
    title: 'Sukun',
    unitTitle: 'Sukun',
    description: 'Huruf mati asas pada pelbagai titik makhraj.',
    objective: 'Membaca huruf sukun tanpa menambah vokal.',
    bloomLevel: 'apply',
    successA: 'Murid berhenti tepat pada huruf sukun.',
    successB: 'Murid mengekalkan kejelasan huruf sebelum sukun.',
    tipA: 'Gunakan teknik potong suara pada huruf sukun.',
    tipB: 'Latih pasangan huruf sukun yang hampir sama.',
    makhraj: 'Sukun perlu ketukan makhraj jelas tanpa bunyi tambahan.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['ab', 'at', 'aj', 'ad', 'aq'],
    allowedMistakes: 2
  },
  {
    id: 'IQ5-U4',
    seq: 4,
    start: 19,
    end: 24,
    title: 'Tasydid',
    unitTitle: 'Tasydid',
    description: 'Huruf sabdu dengan tahanan bunyi terukur.',
    objective: 'Melaksanakan tasydid dengan tekanan huruf yang betul.',
    bloomLevel: 'analyze',
    successA: 'Murid menahan bunyi pertama sebelum lepasan kedua.',
    successB: 'Murid tidak memanjangkan tasydid melebihi keperluan.',
    tipA: 'Gunakan kiraan dua tahap: tahan dan lepas.',
    tipB: 'Bandingkan bacaan tanpa tasydid dan dengan tasydid.',
    makhraj: 'Tasydid menuntut penguncian makhraj huruf lebih kemas.',
    mode: 'test',
    score: 89,
    targetPhonemes: ['bb', 'tt', 'ss', 'qq'],
    allowedMistakes: 2
  },
  {
    id: 'IQ5-U5',
    seq: 5,
    start: 25,
    end: 30,
    title: 'Campuran Mad-Sukun-Tasydid',
    unitTitle: 'Campuran Hukum',
    description: 'Integrasi hukum utama sebelum ujian akhir.',
    objective: 'Membaca teks campuran hukum dengan kawalan penuh.',
    bloomLevel: 'apply',
    successA: 'Murid mengekalkan ketepatan sekurang-kurangnya 90%.',
    successB: 'Kesalahan berulang dapat dikesan dan diperbaiki sendiri.',
    tipA: 'Rekod bacaan murid untuk semakan kendiri selepas sesi.',
    tipB: 'Fokus pada baris yang menggabung tiga hukum serentak.',
    makhraj: 'Perhatikan perpindahan cepat antara sukun dan tasydid.',
    mode: 'test',
    score: 90,
    targetPhonemes: ['mixed-rules-iqra5'],
    allowedMistakes: 2
  },
  {
    id: 'IQ5-U6',
    seq: 6,
    start: 31,
    end: 32,
    title: 'Ujian Akhir Iqra 5',
    unitTitle: 'Ujian Akhir',
    description: 'Penilaian komprehensif sebelum memasuki Iqra 6.',
    objective: 'Membuktikan penguasaan hukum mad wau, sukun, dan tasydid.',
    bloomLevel: 'apply',
    successA: 'Murid lulus ujian dengan kesalahan minimum.',
    successB: 'Murid mengekalkan disiplin tajwid pada setiap baris.',
    tipA: 'Jalankan dua pusingan: latihan ringkas dan ujian rasmi.',
    tipB: 'Rujuk semula halaman sukar jika markah belum mencapai sasaran.',
    makhraj: 'Ujian menilai ketepatan hukum bersama kestabilan makhraj.',
    mode: 'test',
    score: 92,
    targetPhonemes: ['final-review-iqra5'],
    allowedMistakes: 1
  }
];

const makeLesson = (unit: UnitPlan, page: number): IqraLesson => {
  const pageData = IQRA_5_STRICT.find((item) => item.page === page);
  const objectiveIndex = page - unit.start + 1;

  return {
    id: `L5-P${page}`,
    unitId: unit.id,
    unitTitle: unit.unitTitle,
    pageRef: page,
    title: pageData?.title ?? `Iqra 5 Page ${page}`,
    objectives: [
      {
        id: `OBJ-5.${unit.seq}.${objectiveIndex}`,
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

// TODO: Verify curriculum sequencing for Iqra 5 against certified teaching flow.
export const IQRA_5_UNITS: IqraUnit[] = IQRA_5_UNIT_PLANS.map((unit) => ({
  id: unit.id,
  title: unit.title,
  description: unit.description,
  lessons: Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => `L5-P${unit.start + idx}`)
}));

export const IQRA_5_CURRICULUM: IqraLesson[] = IQRA_5_UNIT_PLANS.flatMap((unit) =>
  Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => makeLesson(unit, unit.start + idx))
);

