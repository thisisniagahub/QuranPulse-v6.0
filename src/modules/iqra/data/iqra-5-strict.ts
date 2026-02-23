/* 
========================================================================
⚠️ AMARAN PENTING (DATA SEMENTARA / ALGORITHMIC PLACEHOLDER) ⚠️
========================================================================
Data Iqra di dalam fail ini dijana secara algoritma untuk tujuan ujilari UI/UX.
BAIT/BARIS HURUF ARAB DAN RUMI DI SINI MUNGKIN TIDAK MENGGAMBARKAN KANDUNGAN
SEBENAR BUKU IQRA FIZIKAL KELUARAN RASMI JAKIM SECARA 100% TEPAT. 

Untuk Deployment v6.0 / v7.0 Production, pasukan Tasmik/Konten WAJIB:
1. Membuka naskhah buku fizikal Iqra yang disahkan.
2. Menaip semula / menyemak padanan baris Arab dan Rumi satu persatu.
========================================================================
*/
import { IqraPageStrict } from './iqra-1-strict';

interface Iqra5Section {
  start: number;
  end: number;
  title: string;
  focus: string;
  headerKanan: string;
  headerKiri: string;
  mainKanan: string;
  mainKiri: string;
  kananPool: string[];
  kiriPool: string[];
  revisionKanan: string;
  revisionKiri: string;
  rowCount?: number;
  chunk?: number;
}

const joinRotated = (pool: string[], start: number, chunk: number): string => {
  return Array.from({ length: chunk }, (_, idx) => pool[(start + idx) % pool.length]).join(' ');
};

const buildRows = (
  kananPool: string[],
  kiriPool: string[],
  page: number,
  rowCount = 6,
  chunk = 3
) => {
  return Array.from({ length: rowCount }, (_, idx) => ({
    baris: String(idx + 1),
    kanan: joinRotated(kananPool, page + idx, chunk),
    kiri: joinRotated(kiriPool, page + idx, chunk)
  }));
};

const buildSectionPages = (section: Iqra5Section): IqraPageStrict[] => {
  const out: IqraPageStrict[] = [];
  for (let page = section.start; page <= section.end; page += 1) {
    out.push({
      page,
      title: section.title,
      focus: section.focus,
      grid: [
        { baris: 'Header', kanan: section.headerKanan, kiri: section.headerKiri },
        { baris: 'Main', kanan: section.mainKanan, kiri: section.mainKiri },
        ...buildRows(section.kananPool, section.kiriPool, page, section.rowCount ?? 6, section.chunk ?? 3),
        { baris: 'Revision', kanan: section.revisionKanan, kiri: section.revisionKiri }
      ]
    });
  }
  return out;
};

const IQRA_5_SECTIONS: Iqra5Section[] = [
  {
    start: 2,
    end: 6,
    title: 'Mad Wau (Panjang 2 Harakat)',
    focus: 'بُوْ تُوْ ثُوْ جُوْ',
    headerKanan: 'Dammah + wau sukun = mad asli',
    headerKiri: 'Bibir muncung dengan tempo 2 harakat',
    mainKanan: 'بُوْ تُوْ ثُوْ',
    mainKiri: 'جُوْ حُوْ خُوْ',
    kananPool: ['بُوْ', 'تُوْ', 'ثُوْ', 'جُوْ', 'حُوْ', 'خُوْ', 'دُوْ', 'ذُوْ'],
    kiriPool: ['رُوْ', 'زُوْ', 'سُوْ', 'شُوْ', 'صُوْ', 'ضُوْ', 'طُوْ', 'ظُوْ'],
    revisionKanan: 'بُوْ تُوْ ثُوْ جُوْ',
    revisionKiri: 'رُوْ سُوْ شُوْ صُوْ'
  },
  {
    start: 7,
    end: 10,
    title: 'Alif Ziyadah (واو الجماعة)',
    focus: 'قَالُوْا ءَامَنُوْا كَفَرُوْا',
    headerKanan: 'Perhatikan alif tambahan selepas wau jamak',
    headerKiri: 'Bacaan kekal pada wau, bukan alif tambahan',
    mainKanan: 'قَالُوْا ءَامَنُوْا',
    mainKiri: 'هَاجَرُوْا جَاهَدُوْا',
    kananPool: ['قَالُوْا', 'ءَامَنُوْا', 'كَفَرُوْا', 'رَجَعُوْا', 'عَلِمُوْا', 'قَاتَلُوْا', 'ذَهَبُوْا', 'وَجَدُوْا'],
    kiriPool: ['صَبَرُوْا', 'هَاجَرُوْا', 'جَاهَدُوْا', 'عَمِلُوْا', 'فَازُوْا', 'نَصَرُوْا', 'ظَلَمُوْا', 'تَرَكُوْا'],
    revisionKanan: 'وَاوُ الْجَمَاعَةِ + أَلِفٌ زَائِدَةٌ',
    revisionKiri: 'اقْرَأْ: قَالُوْا / ءَامَنُوْا'
  },
  {
    start: 11,
    end: 18,
    title: 'Sukun (Huruf Mati)',
    focus: 'أَبْ أَتْ أَثْ أَجْ أَحْ',
    headerKanan: 'Huruf mati dibaca berhenti sekejap',
    headerKiri: 'Jangan tambah fathah selepas sukun',
    mainKanan: 'سُكُونٌ: ْ',
    mainKiri: 'أَبْ أَتْ أَجْ',
    kananPool: ['أَبْ', 'أَتْ', 'أَثْ', 'أَجْ', 'أَحْ', 'أَخْ', 'أَدْ', 'أَذْ'],
    kiriPool: ['أَرْ', 'أَزْ', 'أَسْ', 'أَشْ', 'أَصْ', 'أَضْ', 'أَطْ', 'أَظْ'],
    revisionKanan: 'أَبْ أَتْ أَثْ أَجْ أَحْ',
    revisionKiri: 'أَخْ أَدْ أَذْ أَرْ أَزْ'
  },
  {
    start: 19,
    end: 24,
    title: 'Tasydid (Sabdu)',
    focus: 'أَبَّ أَتَّ أَثَّ أَجَّ أَحَّ',
    headerKanan: 'Tasydid = huruf diganda dan ditahan',
    headerKiri: 'Tekan bunyi pertama sebelum dilepas',
    mainKanan: 'شَدَّةٌ: ّ',
    mainKiri: 'أَبَّ أَتَّ أَجَّ',
    kananPool: ['أَبَّ', 'أَتَّ', 'أَثَّ', 'أَجَّ', 'أَحَّ', 'أَخَّ', 'أَدَّ', 'أَذَّ'],
    kiriPool: ['أَرَّ', 'أَزَّ', 'أَسَّ', 'أَشَّ', 'أَصَّ', 'أَضَّ', 'أَطَّ', 'أَظَّ'],
    revisionKanan: 'إِنَّ أَمَّ رَبَّ حَقٌّ',
    revisionKiri: 'تَشْدِيدٌ وَاضِحٌ بِلَا مُبَالَغَةٍ'
  },
  {
    start: 25,
    end: 30,
    title: 'Campuran Mad, Sukun, Tasydid',
    focus: 'نُوْرٌ قَلْبٌ رَبٌّ حُبٌّ',
    headerKanan: 'Gabung semua hukum utama Iqra 5',
    headerKiri: 'Kawal mad, waqf pendek, dan sabdu',
    mainKanan: 'تَمْرِينٌ مُرَكَّبٌ',
    mainKiri: 'مَدٌّ + سُكُونٌ + شَدَّةٌ',
    kananPool: ['نُوْرٌ', 'قَلْبٌ', 'رَبٌّ', 'حُبٌّ', 'قَوْمٌ', 'بَرْدٌ', 'مَدٌّ', 'جَدٌّ'],
    kiriPool: ['دَرْسٌ', 'شَمْسٌ', 'بَيْتٌ', 'سَوْطٌ', 'حَقٌّ', 'نَصٌّ', 'صَفٌّ', 'فَكٌّ'],
    revisionKanan: 'نُوْرٌ قَلْبٌ رَبٌّ حُبٌّ',
    revisionKiri: 'دَرْسٌ بَيْتٌ حَقٌّ صَفٌّ'
  },
  {
    start: 31,
    end: 32,
    title: 'Ujian Akhir Iqra 5',
    focus: 'Penguasaan mad wau, sukun, tasydid',
    headerKanan: 'Ujian buku 5',
    headerKiri: 'Nilai ketepatan hukum bacaan',
    mainKanan: 'اِقْرَأْ بِتَدَبُّرٍ',
    mainKiri: 'ثَبِّتِ الْقَوَاعِدَ كُلَّهَا',
    kananPool: ['قَالُوْا رَبَّنَا', 'ءَامَنَّا وَصَدَّقْنَا', 'أَبْتَ أَتْتَ', 'أَدْرَكْتَ أَقْبَلْتَ', 'رَبٌّ حَقٌّ', 'شَدَّ جَدَّ'],
    kiriPool: ['يُؤْمِنُوْنَ وَيَعْمَلُوْنَ', 'هَاجَرُوْا وَجَاهَدُوْا', 'أَحْسَنْتَ أَجْزَلْتَ', 'أَطْلَعْتَ أَظْهَرْتَ', 'نُوْرٌ قَلْبٌ', 'مَدٌّ صَفٌّ'],
    revisionKanan: 'إِنْ أَخْطَأْتَ فَأَعِدِ الْمُرَاجَعَةَ',
    revisionKiri: 'بَلُوغُ ١٠٠٪؜ قَبْلَ الاِنْتِقَالِ',
    chunk: 2
  }
];

// TODO: Verify each generated line against physical Iqra 5 pages 2-32 (Rasm Uthmani source).
export const IQRA_5_STRICT: IqraPageStrict[] = IQRA_5_SECTIONS.flatMap(buildSectionPages);

