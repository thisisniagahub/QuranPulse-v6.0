import { IqraLesson, IqraUnit } from '../types';
import { IQRA_6_STRICT } from './iqra-6-strict';

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

const IQRA_6_UNIT_PLANS: UnitPlan[] = [
  {
    id: 'IQ6-U1',
    seq: 1,
    start: 2,
    end: 6,
    title: 'Tanwin',
    unitTitle: 'Tanwin',
    description: 'Pengenalan bunyi an/in/un dalam bacaan.',
    objective: 'Membaca semua jenis tanwin dengan bunyi nun tersembunyi yang tepat.',
    bloomLevel: 'remember',
    successA: 'Murid dapat beza tanwin fathah, kasrah, dan dammah.',
    successB: 'Bunyi nun akhir konsisten tanpa berlebihan.',
    tipA: 'Latih bacaan hujung kata secara berulang.',
    tipB: 'Tumpu pada tanwin kasrah yang sering dipendekkan.',
    makhraj: 'Tanwin bergantung pada makhraj nun dengan kadar dengung ringan.',
    mode: 'practice',
    score: 86,
    targetPhonemes: ['an', 'in', 'un'],
    allowedMistakes: 3
  },
  {
    id: 'IQ6-U2',
    seq: 2,
    start: 7,
    end: 10,
    title: 'Nun Sukun & Mim Sukun',
    unitTitle: 'Nun/Mim Sukun',
    description: 'Asas hukum nun mati dan mim mati pada bacaan mudah.',
    objective: 'Mengenal konteks izhar dan dengung asas nun/mim sukun.',
    bloomLevel: 'understand',
    successA: 'Murid tidak menghilangkan bunyi nun/mim sukun.',
    successB: 'Murid mengekalkan kelancaran semasa bertemu huruf selepasnya.',
    tipA: 'Gariskan huruf selepas nun/mim untuk bantu hukum bacaan.',
    tipB: 'Ulang contoh yang melibatkan peralihan makhraj jauh.',
    makhraj: 'Mim dari dua bibir, nun dari hujung lidah dengan ghunnah terkawal.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['nun-sukun', 'mim-sukun'],
    allowedMistakes: 2
  },
  {
    id: 'IQ6-U3',
    seq: 3,
    start: 11,
    end: 14,
    title: 'Qolqolah',
    unitTitle: 'Qolqolah',
    description: 'Lantunan huruf ب ج د ط ق ketika sukun.',
    objective: 'Melantunkan huruf qalqalah secara sederhana dan jelas.',
    bloomLevel: 'apply',
    successA: 'Bunyi lantunan muncul jelas pada huruf qalqalah.',
    successB: 'Murid tidak membuka baris baru ketika melantun.',
    tipA: 'Latih huruf tunggal sebelum masuk ke perkataan.',
    tipB: 'Semak rakaman agar lantunan tidak terlalu kuat.',
    makhraj: 'Qalqalah tetap pada makhraj asal huruf tanpa berpindah vokal.',
    mode: 'test',
    score: 88,
    targetPhonemes: ['ab', 'aj', 'ad', 'ath', 'aq'],
    allowedMistakes: 2
  },
  {
    id: 'IQ6-U4',
    seq: 4,
    start: 15,
    end: 18,
    title: 'Alif Lam Syamsiah & Qamariah',
    unitTitle: 'Alif Lam',
    description: 'Pembezaan lam dibaca dan lam diidghamkan.',
    objective: 'Mengenal serta membaca contoh syamsiah dan qamariah dengan tepat.',
    bloomLevel: 'analyze',
    successA: 'Murid betul pada sekurang-kurangnya 8 daripada 10 contoh.',
    successB: 'Lam qamariah dibaca jelas tanpa tertelan.',
    tipA: 'Kelompokkan contoh syamsiah dan qamariah semasa latihan.',
    tipB: 'Baca perlahan dahulu untuk menegaskan lam qamariah.',
    makhraj: 'Lam qamariah keluar dari hujung lidah menyentuh gusi atas.',
    mode: 'test',
    score: 89,
    targetPhonemes: ['al-shamsiyyah', 'al-qamariyyah'],
    allowedMistakes: 2
  },
  {
    id: 'IQ6-U5',
    seq: 5,
    start: 19,
    end: 24,
    title: 'Waqaf',
    unitTitle: 'Waqaf',
    description: 'Membaca tanda waqaf utama dalam mushaf.',
    objective: 'Berhenti dan menyambung bacaan mengikut tanda waqaf.',
    bloomLevel: 'understand',
    successA: 'Murid mengenali fungsi tanda waqaf utama.',
    successB: 'Murid berhenti pada tempat sesuai tanpa merosakkan makna.',
    tipA: 'Terangkan setiap simbol waqaf sebelum bacaan.',
    tipB: 'Gunakan latihan berulang pada ayat yang sama.',
    makhraj: 'Semasa waqaf, pastikan huruf akhir tetap jelas walau berhenti.',
    mode: 'test',
    score: 90,
    targetPhonemes: ['waqaf-rules'],
    allowedMistakes: 2
  },
  {
    id: 'IQ6-U6',
    seq: 6,
    start: 25,
    end: 30,
    title: 'Potongan Ayat Al-Quran',
    unitTitle: 'Bacaan Ayat',
    description: 'Latihan ayat pendek dengan gabungan hukum tajwid asas.',
    objective: 'Membaca potongan ayat dengan tartil, mad, dan waqaf terjaga.',
    bloomLevel: 'apply',
    successA: 'Murid membaca potongan ayat tanpa terhenti lama.',
    successB: 'Kesalahan tajwid asas tidak melebihi had yang dibenarkan.',
    tipA: 'Mulakan dengan ayat paling pendek sebelum gabungan panjang.',
    tipB: 'Dengar semula bacaan contoh sebelum ujian.',
    makhraj: 'Kawal huruf halki dan qalqalah dalam ayat Quranik.',
    mode: 'test',
    score: 91,
    targetPhonemes: ['quran-fragments'],
    allowedMistakes: 2
  },
  {
    id: 'IQ6-U7',
    seq: 7,
    start: 31,
    end: 32,
    title: 'Ujian Akhir Al-Fatihah',
    unitTitle: 'Ujian Al-Fatihah',
    description: 'Penilaian akhir bacaan Surah Al-Fatihah secara lengkap.',
    objective: 'Membaca Al-Fatihah dengan tajwid asas yang sahih.',
    bloomLevel: 'apply',
    successA: 'Murid membaca tujuh ayat dengan tertib dan lancar.',
    successB: 'Mad, ghunnah, dan waqaf utama dipraktikkan dengan betul.',
    tipA: 'Lakukan semakan ayat demi ayat sebelum bacaan penuh.',
    tipB: 'Ulang ayat yang lemah sehingga stabil.',
    makhraj: 'Fokus huruf tebal: ص، ض، ط serta huruf halki: ح، ع، غ.',
    mode: 'test',
    score: 93,
    targetPhonemes: ['al-fatihah-complete'],
    allowedMistakes: 1
  }
];

const makeLesson = (unit: UnitPlan, page: number): IqraLesson => {
  const pageData = IQRA_6_STRICT.find((item) => item.page === page);
  const objectiveIndex = page - unit.start + 1;

  return {
    id: `L6-P${page}`,
    unitId: unit.id,
    unitTitle: unit.unitTitle,
    pageRef: page,
    title: pageData?.title ?? `Iqra 6 Page ${page}`,
    objectives: [
      {
        id: `OBJ-6.${unit.seq}.${objectiveIndex}`,
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

// TODO: Verify curriculum sequencing for Iqra 6 against certified teaching flow.
// TODO: Verify Al-Fatihah rubric with qualified tajwid teacher before production lock.
export const IQRA_6_UNITS: IqraUnit[] = IQRA_6_UNIT_PLANS.map((unit) => ({
  id: unit.id,
  title: unit.title,
  description: unit.description,
  lessons: Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => `L6-P${unit.start + idx}`)
}));

export const IQRA_6_CURRICULUM: IqraLesson[] = IQRA_6_UNIT_PLANS.flatMap((unit) =>
  Array.from({ length: unit.end - unit.start + 1 }, (_, idx) => makeLesson(unit, unit.start + idx))
);

