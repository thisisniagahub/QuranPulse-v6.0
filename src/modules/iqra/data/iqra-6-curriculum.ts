import { IqraLesson, IqraUnit } from '../types';

export const IQRA_6_UNITS: IqraUnit[] = [
  {
    id: "IQ6-U1",
    title: "Tanwin (Baris Dua)",
    description: "Bunyi 'an', 'in', 'un' (N yang tersembunyi).",
    lessons: ["L6-P2", "L6-P3", "L6-P4", "L6-P5"]
  },
  {
    id: "IQ6-U2",
    title: "Sukun & Diphthong",
    description: "Tanda mati dan bunyi Lin ('ai', 'au').",
    lessons: ["L6-P6", "L6-P7", "L6-P8"]
  },
  {
    id: "IQ6-U3",
    title: "Hukum Nun & Mim Mati",
    description: "Izhar (Jelas) dan pengenalan dengung asas.",
    lessons: ["L6-P10", "L6-P11"]
  },
  {
    id: "IQ6-U4",
    title: "Qolqolah (Lantunan)",
    description: "Huruf Ba, Jim, Dal, Tho, Qof yang melantun bila mati.",
    lessons: ["L6-P12", "L6-P13"]
  }
];

export const IQRA_6_CURRICULUM: IqraLesson[] = [
  {
    id: "L6-P2",
    unitId: "IQ6-U1",
    unitTitle: "Tanwin",
    pageRef: 2,
    title: "Tanwin Fathah (An)",
    objectives: [
      {
        id: "OBJ-6.1.1",
        description: "Membunyikan Tanwin Atas sebagai 'an'.",
        bloomLevel: "remember",
        successCriteria: ["Bunyi 'N' di hujung jelas."]
      }
    ],
    teachingTips: ["Tanwin adalah Nun Mati yang 'menumpang'."],
    assessment: { mode: "practice", passingScore: 85, targetPhonemes: ["ban", "tan"], allowedMistakes: 2 }
  },
  {
    id: "L6-P12",
    unitId: "IQ6-U4",
    unitTitle: "Qolqolah",
    pageRef: 12,
    title: "Huruf Qolqolah",
    objectives: [
      {
        id: "OBJ-6.4.1",
        description: "Melantunkan bunyi huruf Qolqolah (Ba, Jim, Dal, Tho, Qof) apabila mati.",
        bloomLevel: "apply",
        successCriteria: ["Bunyi lantunan jelas, tidak terlalu kuat (seperti baris) dan tidak hilang."]
      }
    ],
    teachingTips: ["Ingat akronim 'BaJu DaH ToQor' (Baju Dah Kotor)."],
    assessment: { mode: "test", passingScore: 85, targetPhonemes: ["ab", "aj", "ad", "ath", "aq"], allowedMistakes: 2 }
  }
];
