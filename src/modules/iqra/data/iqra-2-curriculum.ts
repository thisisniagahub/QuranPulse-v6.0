import { IqraLesson, IqraUnit } from '../types';

export const IQRA_2_UNITS: IqraUnit[] = [
  {
    id: "IQ2-U1",
    title: "Sambungan Kumpulan Mangkuk & Gigi",
    description: "Mengenal bentuk Ba, Ta, Nun, Ya, dan Sa apabila bersambung.",
    lessons: ["L2-P2", "L2-P3", "L2-P4"]
  },
  {
    id: "IQ2-U2",
    title: "Sambungan Kumpulan Perut & Kepala",
    description: "Mengenal sambungan huruf Jim, Ha, Kho, 'Ain, dan Ghoin.",
    lessons: ["L2-P5", "L2-P6"]
  },
  {
    id: "IQ2-U3",
    title: "Sambungan Kumpulan Bulat & Tiang",
    description: "Mengenal sambungan Fa, Qof, Kaf, dan Lam.",
    lessons: ["L2-P7", "L2-P8", "L2-P9"]
  }
];

export const IQRA_2_CURRICULUM: IqraLesson[] = [
  {
    id: "L2-P2",
    unitId: "IQ2-U1",
    unitTitle: "Sambungan Mangkuk & Gigi",
    pageRef: 2,
    title: "Sambungan Ba & Ta",
    objectives: [
      {
        id: "OBJ-2.1.1",
        description: "Mengenal rupa huruf Ba dan Ta di awal kalimah.",
        bloomLevel: "remember",
        successCriteria: ["Dapat mengecam Ba/Ta walaupun bentuk mangkuknya berubah."]
      }
    ],
    teachingTips: ["Tekankan bahawa titik tetap sama (Ba di bawah, Ta di atas) walaupun badan huruf berubah."],
    assessment: { mode: "practice", passingScore: 80, targetPhonemes: ["ba", "ta"], allowedMistakes: 2 }
  },
  {
    id: "L2-P3",
    unitId: "IQ2-U1",
    unitTitle: "Sambungan Mangkuk & Gigi",
    pageRef: 3,
    title: "Sambungan Nun",
    objectives: [
      {
        id: "OBJ-2.1.2",
        description: "Mengenal Nun di awal dan tengah kalimah.",
        bloomLevel: "understand",
        successCriteria: ["Dapat beza Nun (1 titik atas) dengan Ta (2 titik atas) dalam sambungan."]
      }
    ],
    teachingTips: ["Nun sering dikelirukan dengan Ta. Fokus pada bilangan titik."],
    assessment: { mode: "test", passingScore: 85, targetPhonemes: ["na"], allowedMistakes: 2 }
  },
  {
    id: "L2-P5",
    unitId: "IQ2-U2",
    unitTitle: "Sambungan Perut & Kepala",
    pageRef: 5,
    title: "Sambungan Jim, Ha, Kho",
    objectives: [
      {
        id: "OBJ-2.2.1",
        description: "Mengenal bentuk kepala Jim/Ha/Kho tanpa perut.",
        bloomLevel: "apply",
        successCriteria: ["Dapat baca sambungan yang melibatkan Jim, Ha, atau Kho dengan makhraj yang betul."]
      }
    ],
    teachingTips: ["Perut huruf hilang bila bersambung di awal/tengah. Hanya kepala yang tinggal."],
    assessment: { mode: "test", passingScore: 80, targetPhonemes: ["ja", "ha", "kho"], allowedMistakes: 3 }
  }
];
