import { IqraLesson, IqraUnit } from '../types';
import { IQRA_3_STRICT } from './iqra-3-strict';

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

const IQRA_3_UNIT_PLANS: UnitPlan[] = [
  {
    id: 'IQ3-U1',
    seq: 1,
    start: 2,
    end: 8,
    title: 'Mad Asli Alif',
    unitTitle: 'Mad Alif',
    description: 'Pengenalan alif sebagai huruf mad dua harakat.',
    objective: 'Membaca mad asli alif secara stabil pada semua huruf.',
    bloomLevel: 'remember',
    successA: 'Murid memanjangkan bunyi tepat dua harakat.',
    successB: 'Murid tidak menambah harakat pada huruf selepas mad.',
    tipA: 'Latih dengan ketukan tempo tetap (dua kiraan).',
    tipB: 'Pastikan suara tidak turun naik berlebihan semasa mad.',
    makhraj: 'Mad mesti keluar dari rongga mulut tanpa menekan makhraj baru.',
    mode: 'practice',
    score: 84,
    targetPhonemes: ['maa', 'taa', 'saa'],
    allowedMistakes: 3
  },
  {
    id: 'IQ3-U2',
    seq: 2,
    start: 9,
    end: 14,
    title: 'Beza Panjang & Pendek',
    unitTitle: 'Panjang Pendek',
    description: 'Perbandingan langsung antara harakat pendek dan mad.',
    objective: 'Membezakan bunyi pendek dan panjang pada pasangan kata.',
    bloomLevel: 'analyze',
    successA: 'Murid membezakan setiap pasangan tanpa ragu.',
    successB: 'Kadar salah panjang-pendek kurang daripada dua kali.',
    tipA: 'Baca pasangan pendek dahulu, kemudian versi panjang.',
    tipB: 'Gunakan tanda visual untuk menandai alif mad.',
    makhraj: 'Jangan ubah makhraj huruf asas ketika memanjangkan bunyi.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['short-vs-mad'],
    allowedMistakes: 2
  },
  {
    id: 'IQ3-U3',
    seq: 3,
    start: 15,
    end: 20,
    title: 'Latih Tubi Mad Campuran',
    unitTitle: 'Latih Tubi Mad',
    description: 'Pengukuhan mad alif dalam rangkai kata lebih panjang.',
    objective: 'Membaca perkataan campuran mad dengan kelancaran meningkat.',
    bloomLevel: 'apply',
    successA: 'Murid boleh membaca satu baris panjang tanpa henti.',
    successB: 'Mad kekal dua harakat pada semua contoh.',
    tipA: 'Ulang satu baris sehingga stabil sebelum berpindah.',
    tipB: 'Gabungkan semakan guru dan bacaan kendiri.',
    makhraj: 'Perjelas hamzah pada جَاءَ dan huruf halki lain.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['mad-mixed'],
    allowedMistakes: 2
  },
  {
    id: 'IQ3-U4',
    seq: 4,
    start: 21,
    end: 30,
    title: 'Perkataan Lengkap & Campuran',
    unitTitle: 'Perkataan Mad',
    description: 'Membaca perkataan lengkap bertanwin dan sambungan mad.',
    objective: 'Mengaplikasi mad alif dalam konteks perkataan dan frasa.',
    bloomLevel: 'understand',
    successA: 'Murid mengekalkan ketepatan baris akhir perkataan.',
    successB: 'Murid dapat membaca frasa sambung dengan ritma baik.',
    tipA: 'Beri perhatian pada tanwin di akhir kalimah.',
    tipB: 'Tandakan perkataan yang mempunyai alif maqsurah.',
    makhraj: 'Seimbangkan bunyi mad dengan dengung tanwin jika hadir.',
    mode: 'test',
    score: 89,
    targetPhonemes: ['mad-words', 'tanwin-light'],
    allowedMistakes: 2
  },
  {
    id: 'IQ3-U5',
    seq: 5,
    start: 31,
    end: 32,
    title: 'Ujian Akhir Iqra 3',
    unitTitle: 'Ujian Akhir',
    description: 'Penilaian akhir mad asli sebelum masuk Iqra 4.',
    objective: 'Membuktikan penguasaan mad asli alif secara menyeluruh.',
    bloomLevel: 'apply',
    successA: 'Skor bacaan melepasi ambang kelulusan.',
    successB: 'Bacaan konsisten tanpa bimbingan langsung.',
    tipA: 'Mulakan ujian dengan pemanasan pasangan pendek-panjang.',
    tipB: 'Jika gagal, ulang halaman 9-14 sebelum ujian semula.',
    makhraj: 'Kualiti mad dan makhraj mesti stabil sepanjang ujian.',
    mode: 'test',
    score: 91,
    targetPhonemes: ['final-review-iqra3'],
    allowedMistakes: 1
  }
];

const makeLesson = (unit: UnitPlan, page: number): IqraLesson => {
  const pageData = IQRA_3_STRICT.find((item) => item.page === page);
  const objectiveIndex = page - unit.start + 1;

  return {
    id: `L3-P${page}`,
    unitId: unit.id,
    unitTitle: unit.unitTitle,
    pageRef: page,
    title: pageData?.title ?? `Iqra 3 Page ${page}`,
    objectives: [
      {
        id: `OBJ-3.${unit.seq}.${objectiveIndex}`,
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

// TODO: Verify curriculum sequencing for Iqra 3 against certified teaching flow.
export const IQRA_3_UNITS: IqraUnit[] = IQRA_3_UNIT_PLANS.map((unit) => ({
  id: unit.id,
  title: unit.title,
  description: unit.description,
  lessons: Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => `L3-P${unit.start + idx}`)
}));

export const IQRA_3_CURRICULUM: IqraLesson[] = IQRA_3_UNIT_PLANS.flatMap((unit) =>
  Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => makeLesson(unit, unit.start + idx))
);

