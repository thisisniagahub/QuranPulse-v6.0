import { IqraLesson, IqraUnit } from '../types';
import { IQRA_4_STRICT } from './iqra-4-strict';

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

const IQRA_4_UNIT_PLANS: UnitPlan[] = [
  {
    id: 'IQ4-U1',
    seq: 1,
    start: 2,
    end: 6,
    title: 'Kasrah Asas',
    unitTitle: 'Kasrah',
    description: 'Pengenalan bunyi i pendek pada semua huruf asas.',
    objective: 'Melafazkan kasrah dengan tepat tanpa bercampur bunyi e.',
    bloomLevel: 'remember',
    successA: 'Murid menyebut semua contoh kasrah dengan konsisten.',
    successB: 'Murid membezakan kasrah daripada fathah dan dammah.',
    tipA: 'Bimbing posisi bibir senyum ringan ketika kasrah.',
    tipB: 'Latih perbandingan langsung i-a-u setiap sesi.',
    makhraj: 'Kasrah tidak mengubah tempat keluar huruf asal.',
    mode: 'practice',
    score: 85,
    targetPhonemes: ['bi', 'ti', 'si'],
    allowedMistakes: 3
  },
  {
    id: 'IQ4-U2',
    seq: 2,
    start: 7,
    end: 12,
    title: 'Mad Ya',
    unitTitle: 'Mad Ya',
    description: 'Kasrah diikuti ya sukun sebagai mad dua harakat.',
    objective: 'Memanjangkan bunyi ii dua harakat dengan tepat.',
    bloomLevel: 'apply',
    successA: 'Murid mengekalkan tempoh dua harakat.',
    successB: 'Murid tidak memotong mad terlalu awal.',
    tipA: 'Gunakan metronom kiraan dua saat untuk latihan awal.',
    tipB: 'Ulang contoh yang melibatkan huruf tebal dan nipis.',
    makhraj: 'Mad ya keluar dari rongga mulut selepas kasrah jelas.',
    mode: 'test',
    score: 87,
    targetPhonemes: ['bii', 'tii', 'sii'],
    allowedMistakes: 2
  },
  {
    id: 'IQ4-U3',
    seq: 3,
    start: 13,
    end: 16,
    title: 'Mad Silah Ha',
    unitTitle: 'Mad Silah',
    description: 'Bacaan ha dhamir bersilah pada konteks bersambung.',
    objective: 'Mengenal dan membaca ha dhamir pendek/panjang dengan betul.',
    bloomLevel: 'understand',
    successA: 'Murid dapat kenal simbol silah pada mushaf.',
    successB: 'Murid membezakan bacaan ha silah dan ha biasa.',
    tipA: 'Tunjuk tanda kecil selepas ha sebelum membaca baris.',
    tipB: 'Pastikan murid tidak menambah dengung pada ha dhamir.',
    makhraj: 'Ha dibaca dari tenggorok paling hujung dengan nafas lembut.',
    mode: 'test',
    score: 86,
    targetPhonemes: ['hi', 'hu', 'hii'],
    allowedMistakes: 2
  },
  {
    id: 'IQ4-U4',
    seq: 4,
    start: 17,
    end: 22,
    title: 'Dammah Asas',
    unitTitle: 'Dammah',
    description: 'Pengenalan bunyi u pendek pada huruf hijaiyah.',
    objective: 'Membaca dammah dengan bibir muncung stabil.',
    bloomLevel: 'remember',
    successA: 'Murid menyebut u pendek tanpa berubah kepada o.',
    successB: 'Murid konsisten pada huruf nipis dan tebal.',
    tipA: 'Latih bibir muncung sebelum mula membaca.',
    tipB: 'Bandingkan bunyi u pendek dan uu panjang.',
    makhraj: 'Dammah perlu sokongan bibir, makhraj huruf kekal.',
    mode: 'practice',
    score: 85,
    targetPhonemes: ['bu', 'tu', 'su'],
    allowedMistakes: 3
  },
  {
    id: 'IQ4-U5',
    seq: 5,
    start: 23,
    end: 28,
    title: 'Campuran Tiga Baris',
    unitTitle: 'Campuran Baris',
    description: 'Gabungan fathah, kasrah, dan dammah dalam satu baris.',
    objective: 'Menukar bunyi baris dengan cepat tanpa salah sebut.',
    bloomLevel: 'analyze',
    successA: 'Murid mengekalkan ketepatan bunyi setiap baris.',
    successB: 'Peralihan a-i-u berlaku lancar tanpa berhenti panjang.',
    tipA: 'Gunakan pola berulang a-i-u untuk bina memori motor.',
    tipB: 'Ulang bacaan cepat selepas pusingan perlahan berjaya.',
    makhraj: 'Pantau huruf isti\'la\' agar tidak menipis berlebihan.',
    mode: 'test',
    score: 89,
    targetPhonemes: ['a-i-u-mix'],
    allowedMistakes: 2
  },
  {
    id: 'IQ4-U6',
    seq: 6,
    start: 29,
    end: 32,
    title: 'Ujian Akhir Iqra 4',
    unitTitle: 'Ujian Akhir',
    description: 'Penilaian gabungan kasrah, dammah, dan mad ya.',
    objective: 'Mencapai kelancaran penuh sebelum naik ke Iqra 5.',
    bloomLevel: 'apply',
    successA: 'Skor ujian memenuhi sasaran lulus.',
    successB: 'Murid dapat jelaskan kesalahan sendiri selepas semakan.',
    tipA: 'Jalankan ujian tanpa bantuan visual tambahan.',
    tipB: 'Jika perlu, ulang semula unit mad ya dan campuran baris.',
    makhraj: 'Ujian akhir menilai ketepatan baris dan makhraj serentak.',
    mode: 'test',
    score: 91,
    targetPhonemes: ['final-review-iqra4'],
    allowedMistakes: 1
  }
];

const makeLesson = (unit: UnitPlan, page: number): IqraLesson => {
  const pageData = IQRA_4_STRICT.find((item) => item.page === page);
  const objectiveIndex = page - unit.start + 1;

  return {
    id: `L4-P${page}`,
    unitId: unit.id,
    unitTitle: unit.unitTitle,
    pageRef: page,
    title: pageData?.title ?? `Iqra 4 Page ${page}`,
    objectives: [
      {
        id: `OBJ-4.${unit.seq}.${objectiveIndex}`,
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

// TODO: Verify curriculum sequencing for Iqra 4 against certified teaching flow.
export const IQRA_4_UNITS: IqraUnit[] = IQRA_4_UNIT_PLANS.map((unit) => ({
  id: unit.id,
  title: unit.title,
  description: unit.description,
  lessons: Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => `L4-P${unit.start + idx}`)
}));

export const IQRA_4_CURRICULUM: IqraLesson[] = IQRA_4_UNIT_PLANS.flatMap((unit) =>
  Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => makeLesson(unit, unit.start + idx))
);

