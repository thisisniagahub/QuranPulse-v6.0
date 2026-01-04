import { IqraLesson, IqraUnit } from '../types';

export const IQRA_1_UNITS: IqraUnit[] = [
  {
    id: "UNIT-1",
    title: "Asas Huruf Tunggal (Alif - Tsa)",
    description: "Pengenalan kepada huruf asas Alif, Ba, Ta, dan Tsa serta baris Fathah.",
    lessons: ["L1-P3", "L1-P4", "L1-P5"]
  },
  {
    id: "UNIT-2",
    title: "Kumpulan Jim, Ha, Kho",
    description: "Mengenal bentuk 'Perut' dan membezakan titik bagi Jim, Ha, dan Kho.",
    lessons: ["L1-P6", "L1-P7"]
  },
  {
    id: "UNIT-3",
    title: "Kumpulan Dal & Ro",
    description: "Membezakan huruf lengkung dan siku (Dal, Dzal, Ro, Zai).",
    lessons: ["L1-P8", "L1-P9", "L1-P10", "L1-P11"]
  },
  {
    id: "UNIT-4",
    title: "Gigi & Mangkuk Besar",
    description: "Huruf Sin, Syin, Sod, dan Dhod.",
    lessons: ["L1-P12", "L1-P13", "L1-P14", "L1-P15"]
  },
  {
    id: "UNIT-5",
    title: "Huruf Bertiang & Kepala Burung",
    description: "Kumpulan Tho, Zho, 'Ain, dan Ghoin.",
    lessons: ["L1-P16", "L1-P17", "L1-P18", "L1-P19"]
  }
];

export const IQRA_1_CURRICULUM: IqraLesson[] = [
  // UNIT 1: Alif - Tsa
  {
    id: "L1-P3",
    unitId: "UNIT-1",
    unitTitle: "Asas Huruf Tunggal",
    pageRef: 3,
    title: "Huruf Alif & Ba",
    objectives: [
      {
        id: "OBJ-1.1",
        description: "Mengenal bentuk Huruf Alif (Tiang) dan Ba (Mangkuk 1 Titik).",
        bloomLevel: "remember",
        successCriteria: [
          "Dapat beza bunyi 'A' (buka mulut) dan 'BA' (bibir rapat).",
          "Bacaan pendek 1 harakat sahaja."
        ]
      }
    ],
    teachingTips: [
      "Jangan panjangkan bacaan. Bunyi 'A', bukan 'Aaa'.",
      "Pastikan murid kenal titik Ba ada di bawah."
    ],
    assessment: {
      mode: "test",
      passingScore: 80,
      targetPhonemes: ["a", "ba"],
      allowedMistakes: 2
    }
  },
  {
    id: "L1-P4",
    unitId: "UNIT-1",
    unitTitle: "Asas Huruf Tunggal",
    pageRef: 4,
    title: "Huruf Ta",
    objectives: [
      {
        id: "OBJ-1.2",
        description: "Mengenal Huruf Ta (2 Titik di atas).",
        bloomLevel: "remember",
        successCriteria: [
          "Dapat beza Ba (titik bawah) dan Ta (titik atas).",
          "Bunyi Ta adalah tajam."
        ]
      }
    ],
    teachingTips: [
      "Ingatkan murid: 2 mata di atas = Ta.",
      "Latih tubi beza Ba dan Ta secara rawak."
    ],
    assessment: {
      mode: "test",
      passingScore: 85,
      targetPhonemes: ["ta", "ba", "a"],
      allowedMistakes: 2
    }
  },
  {
    id: "L1-P5",
    unitId: "UNIT-1",
    unitTitle: "Asas Huruf Tunggal",
    pageRef: 5,
    title: "Huruf Tsa",
    objectives: [
      {
        id: "OBJ-1.3",
        description: "Mengenal Huruf Tsa (3 Titik di atas).",
        bloomLevel: "apply",
        successCriteria: [
          "Hujung lidah dikeluarkan sedikit (antara gigi).",
          "Bunyi lembut 'TSA', bukan 'SA'."
        ]
      }
    ],
    teachingTips: [
      "Penting: Pastikan lidah murid keluar sedikit.",
      "Jangan bunyi berdesing seperti Sin."
    ],
    assessment: {
      mode: "test",
      passingScore: 85,
      targetPhonemes: ["tsa", "ta", "ba"],
      allowedMistakes: 2
    }
  },

  // UNIT 2: Jim, Ha, Kho
  {
    id: "L1-P6",
    unitId: "UNIT-2",
    unitTitle: "Kumpulan Jim, Ha, Kho",
    pageRef: 6,
    title: "Huruf Jim & Ha",
    objectives: [
      {
        id: "OBJ-2.1",
        description: "Membezakan Jim (Titik Tengah) dan Ha (Kosong).",
        bloomLevel: "analyze",
        successCriteria: [
          "Jim = Bunyi kuat 'J'.",
          "Ha = Bunyi pedas/bersih dari tengah kerongkong."
        ]
      }
    ],
    teachingTips: [
      "Ha adalah 'Ha Pedas' (seperti makan cili).",
      "Pastikan Jim tidak bunyi seperti 'Che'."
    ],
    assessment: {
      mode: "test",
      passingScore: 80,
      targetPhonemes: ["ja", "ha"],
      allowedMistakes: 3
    }
  },
  {
    id: "L1-P7",
    unitId: "UNIT-2",
    unitTitle: "Kumpulan Jim, Ha, Kho",
    pageRef: 7,
    title: "Huruf Kho",
    objectives: [
      {
        id: "OBJ-2.2",
        description: "Mengenal Huruf Kho (Titik Atas).",
        bloomLevel: "apply",
        successCriteria: [
          "Bunyi serak/basah di pangkal kerongkong.",
          "Seperti bunyi berdengkur sedikit."
        ]
      }
    ],
    teachingTips: [
      "Kho mesti ada bunyi getaran di langit-langit lembut.",
      "Beza jelas antara Ha (bersih) dan Kho (serak)."
    ],
    assessment: {
      mode: "test",
      passingScore: 80,
      targetPhonemes: ["kho", "ha", "ja"],
      allowedMistakes: 3
    }
  },

  // UNIT 3: Dal, Dzal, Ro, Zai
  {
    id: "L1-P8",
    unitId: "UNIT-3",
    unitTitle: "Kumpulan Dal & Ro",
    pageRef: 8,
    title: "Huruf Dal",
    objectives: [
      {
        id: "OBJ-3.1",
        description: "Mengenal Huruf Dal (Bentuk Siku).",
        bloomLevel: "remember",
        successCriteria: [
          "Bunyi 'DA' jelas.",
          "Jangan tertukar dengan Dzal."
        ]
      }
    ],
    teachingTips: [
      "Bentuk Dal seperti siku tangan.",
      "Baca pendek."
    ],
    assessment: {
      mode: "test",
      passingScore: 90,
      targetPhonemes: ["da"],
      allowedMistakes: 1
    }
  },
  {
    id: "L1-P9",
    unitId: "UNIT-3",
    unitTitle: "Kumpulan Dal & Ro",
    pageRef: 9,
    title: "Huruf Dzal",
    objectives: [
      {
        id: "OBJ-3.2",
        description: "Mengenal Huruf Dzal (Ada Titik).",
        bloomLevel: "apply",
        successCriteria: [
          "Lidah keluar sedikit (macam Tsa).",
          "Bunyi lembut 'DZA'."
        ]
      }
    ],
    teachingTips: [
      "Sama makhraj dengan Tsa, tapi ada suara (Jahar).",
      "Bezakan jelas dengan 'ZA' (Desing)."
    ],
    assessment: {
      mode: "test",
      passingScore: 85,
      targetPhonemes: ["dza", "da"],
      allowedMistakes: 2
    }
  },
  {
    id: "L1-P10",
    unitId: "UNIT-3",
    unitTitle: "Kumpulan Dal & Ro",
    pageRef: 10,
    title: "Huruf Ro",
    objectives: [
      {
        id: "OBJ-3.3",
        description: "Mengenal Huruf Ro (Lengkung).",
        bloomLevel: "apply",
        successCriteria: [
          "Bunyi tebal 'RO' (mulut muncung sikit).",
          "Hujung lidah bergetar."
        ]
      }
    ],
    teachingTips: [
      "Ro baris atas dibaca tebal (Tafkhim).",
      "Jangan getar terlalu banyak (Rrr)."
    ],
    assessment: {
      mode: "test",
      passingScore: 85,
      targetPhonemes: ["ro", "da", "dza"],
      allowedMistakes: 2
    }
  },
  {
    id: "L1-P11",
    unitId: "UNIT-3",
    unitTitle: "Kumpulan Dal & Ro",
    pageRef: 11,
    title: "Huruf Zai",
    objectives: [
      {
        id: "OBJ-3.4",
        description: "Mengenal Huruf Zai (Ada Titik).",
        bloomLevel: "remember",
        successCriteria: [
          "Bunyi berdesing kuat (seperti lebah).",
          "Gigi rapat."
        ]
      }
    ],
    teachingTips: [
      "Bezakan Dzal (Lidah keluar) dan Zai (Gigi rapat/Desing).",
      "Ini kesalahan biasa pelajar."
    ],
    assessment: {
      mode: "test",
      passingScore: 80,
      targetPhonemes: ["zai", "ro", "dza"],
      allowedMistakes: 2
    }
  }
];
