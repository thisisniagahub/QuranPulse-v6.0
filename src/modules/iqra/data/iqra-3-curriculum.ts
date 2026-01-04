import { IqraLesson, IqraUnit } from '../types';

export const IQRA_3_UNITS: IqraUnit[] = [
  {
    id: "IQ3-U1",
    title: "Asas Mad Asli (Panjang 2 Harakat)",
    description: "Pengenalan tanda Alif sebagai pemanjang bunyi.",
    lessons: ["L3-P2"]
  },
  {
    id: "IQ3-U2",
    title: "Latih Tubi Panjang & Pendek",
    description: "Memantapkan perbezaan harakat agar tidak tertukar.",
    lessons: ["L3-P3", "L3-P4", "L3-P5"]
  },
  {
    id: "IQ3-U3",
    title: "Fathah Berdiri & Alif Maqsurah",
    description: "Mengenal variasi simbol Mad dalam Mushaf.",
    lessons: ["L3-P6", "L3-P7"]
  }
];

export const IQRA_3_CURRICULUM: IqraLesson[] = [
  {
    id: "L3-P2",
    unitId: "IQ3-U1",
    unitTitle: "Asas Mad Asli",
    pageRef: 2,
    title: "Pengenalan Mad (Alif)",
    objectives: [
      {
        id: "OBJ-3.1.1",
        description: "Mengenal tanda Alif selepas huruf berbaris atas.",
        bloomLevel: "remember",
        successCriteria: ["Membaca dengan panjang 2 harakat (anggaran 2 saat)."]
      }
    ],
    teachingTips: ["Gunakan gerakan jari (angkat 2 jari) untuk bantu pelajar faham tempo 2 harakat."],
    assessment: { mode: "practice", passingScore: 85, targetPhonemes: ["maa", "haa", "zaa"], allowedMistakes: 1 }
  },
  {
    id: "L3-P3",
    unitId: "IQ3-U2",
    unitTitle: "Panjang & Pendek",
    pageRef: 3,
    title: "Beza Jelas Harakat",
    objectives: [
      {
        id: "OBJ-3.2.1",
        description: "Membezakan perkataan yang mempunyai Mad dan yang tiada.",
        bloomLevel: "analyze",
        successCriteria: ["Tidak memanjangkan yang pendek, dan tidak memendekkan yang panjang."]
      }
    ],
    teachingTips: ["Ini adalah 'Golden Rule' Iqra 3. Jika salah harakat, jangan luluskan ke muka surat seterusnya."],
    assessment: { mode: "test", passingScore: 90, targetPhonemes: ["tha", "thaa", "ba", "baa"], allowedMistakes: 1 }
  }
];
