import { IqraLesson, IqraUnit } from '../types';

export const IQRA_5_UNITS: IqraUnit[] = [
  {
    id: "IQ5-U1",
    title: "Mad Asli Wau & Alif Ziyadah",
    description: "Bunyi panjang 'uu' dan huruf tambahan yang tidak dibaca.",
    lessons: ["L5-P2", "L5-P3"]
  },
  {
    id: "IQ5-U2",
    title: "Ha Dhamir Lanjutan",
    description: "Variasi bacaan Ha Dhamir.",
    lessons: ["L5-P4"]
  },
  {
    id: "IQ5-U3",
    title: "Latihan Pemantapan",
    description: "Gabungan semua hukum Mad yang telah dipelajari.",
    lessons: ["L5-P5", "L5-P6", "L5-P7", "L5-P8", "L5-P9", "L5-P10", "L5-P11"]
  }
];

export const IQRA_5_CURRICULUM: IqraLesson[] = [
  {
    id: "L5-P2",
    unitId: "IQ5-U1",
    unitTitle: "Mad Asli Wau",
    pageRef: 2,
    title: "Mad Asli (Wau)",
    objectives: [
      {
        id: "OBJ-5.1.1",
        description: "Mengenal Wau sebagai huruf Mad bagi baris depan.",
        bloomLevel: "apply",
        successCriteria: ["Memanjangkan bunyi 'uu' 2 harakat dengan muncung mulut."]
      }
    ],
    teachingTips: ["Mulut mesti muncung penuh untuk bunyi 'U' yang sempurna."],
    assessment: { mode: "practice", passingScore: 85, targetPhonemes: ["buu", "tuu"], allowedMistakes: 2 }
  },
  {
    id: "L5-P3",
    unitId: "IQ5-U1",
    unitTitle: "Alif Ziyadah",
    pageRef: 3,
    title: "Huruf Tambahan (Silent Letters)",
    objectives: [
      {
        id: "OBJ-5.1.2",
        description: "Mengenal Alif yang ada pada tulisan tetapi tiada pada bacaan.",
        bloomLevel: "analyze",
        successCriteria: ["Tidak memanjangkan bacaan pada Alif Ziyadah (bertanda bulat/lonjong)."]
      }
    ],
    teachingTips: ["Alif selepas Wau Jamak (ramai) biasanya tidak dibaca."],
    assessment: { mode: "test", passingScore: 90, targetPhonemes: ["qalu", "kary"], allowedMistakes: 1 }
  }
];
