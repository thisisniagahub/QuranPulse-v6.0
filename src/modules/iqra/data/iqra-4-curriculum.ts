import { IqraLesson, IqraUnit } from '../types';

export const IQRA_4_UNITS: IqraUnit[] = [
  {
    id: "IQ4-U1",
    title: "Baris Bawah (Kasrah)",
    description: "Mengenal bunyi 'i' pendek dan panjang (Mad Asli Ya).",
    lessons: ["L4-P2", "L4-P3", "L4-P4", "L4-P5"]
  },
  {
    id: "IQ4-U2",
    title: "Mad Silah & Ta Marbutah",
    description: "Bacaan panjang pada Ha Dhamir dan Ta Marbutah di hujung kalimah.",
    lessons: ["L4-P6", "L4-P7", "L4-P8", "L4-P9"]
  },
  {
    id: "IQ4-U3",
    title: "Baris Depan (Dammah)",
    description: "Pengenalan bunyi 'u'.",
    lessons: ["L4-P10", "L4-P11"]
  }
];

export const IQRA_4_CURRICULUM: IqraLesson[] = [
  {
    id: "L4-P2",
    unitId: "IQ4-U1",
    unitTitle: "Baris Bawah",
    pageRef: 2,
    title: "Pengenalan Kasrah",
    objectives: [
      {
        id: "OBJ-4.1.1",
        description: "Membunyikan baris bawah dengan senyum (Bunyi 'i').",
        bloomLevel: "remember",
        successCriteria: ["Tidak terkeliru dengan bunyi 'e' taling."]
      }
    ],
    teachingTips: ["Pastikan mulut senyum sedikit untuk bunyi 'i' yang tepat."],
    assessment: { mode: "practice", passingScore: 85, targetPhonemes: ["bi", "ti", "di"], allowedMistakes: 2 }
  },
  {
    id: "L4-P4",
    unitId: "IQ4-U1",
    unitTitle: "Baris Bawah",
    pageRef: 4,
    title: "Mad Asli (Ya)",
    objectives: [
      {
        id: "OBJ-4.1.2",
        description: "Mengenal Ya sebagai huruf Mad bagi baris bawah.",
        bloomLevel: "apply",
        successCriteria: ["Memanjangkan bunyi 'ii' 2 harakat."]
      }
    ],
    teachingTips: ["Ya tidak berbaris selepas baris bawah = Mad Asli."],
    assessment: { mode: "test", passingScore: 90, targetPhonemes: ["bii", "tii"], allowedMistakes: 1 }
  },
  {
    id: "L4-P6",
    unitId: "IQ4-U2",
    unitTitle: "Mad Silah",
    pageRef: 6,
    title: "Ha Dhamir (Mad Silah)",
    objectives: [
      {
        id: "OBJ-4.2.1",
        description: "Mengenal Ha simpul yang dibaca panjang (ada wau/ya kecil).",
        bloomLevel: "understand",
        successCriteria: ["Membezakan Ha yang dibaca pendek dan panjang."]
      }
    ],
    teachingTips: ["Perhatikan simbol kecil selepas Ha (wau kecil atau kepala ya)."],
    assessment: { mode: "practice", passingScore: 80, targetPhonemes: ["hi", "hu"], allowedMistakes: 2 }
  }
];
