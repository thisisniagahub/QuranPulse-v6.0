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

interface Iqra2Section {
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

const buildSectionPages = (section: Iqra2Section): IqraPageStrict[] => {
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

const IQRA_2_SECTIONS: Iqra2Section[] = [
  {
    start: 2,
    end: 5,
    title: 'Sambungan Ba-Ta-Nun',
    focus: 'بَتَ تَبَ نَبَ بَنَتَ',
    headerKanan: 'Latihan huruf sambung berbaris fathah',
    headerKiri: 'Baca kanan ke kiri dengan bunyi pendek',
    mainKanan: 'بَـ ... ـتَ | تَـ ... ـبَ',
    mainKiri: 'نَـ ... ـبَ | بَـ ... ـنَ',
    kananPool: ['بَتَ', 'تَبَ', 'بَنَ', 'نَبَ', 'بَنَتَ', 'نَبَتَ', 'تَنَبَ', 'نَتَبَ'],
    kiriPool: ['تَبَنَ', 'بَنَتَ', 'نَبَتَ', 'تَنَبَ', 'بَتَنَ', 'نَتَبَ', 'بَدَنَ', 'نَبَذَ'],
    revisionKanan: 'بَ تَ نَ بَتَ تَبَ',
    revisionKiri: 'نَبَتَ بَنَتَ تَنَبَ'
  },
  {
    start: 6,
    end: 10,
    title: 'Sambungan Dal-Ra-Sin-Syin-Sad-Dhad',
    focus: 'دَرَسَ شَرَحَ صَبَرَ ضَرَبَ',
    headerKanan: 'Sambungan huruf sisi lidah dan gigi',
    headerKiri: 'Jaga beza bunyi سَ شَ صَ ضَ',
    mainKanan: 'دَ ... رَ ... سَ',
    mainKiri: 'شَ ... صَ ... ضَ',
    kananPool: ['دَرَسَ', 'رَسَمَ', 'سَجَدَ', 'شَرَحَ', 'صَبَرَ', 'ضَرَبَ', 'رَصَدَ', 'سَرَدَ'],
    kiriPool: ['دَخَلَ', 'رَفَعَ', 'سَبَحَ', 'شَهَدَ', 'صَنَعَ', 'ضَبَطَ', 'رَشَدَ', 'سَطَعَ'],
    revisionKanan: 'دَ رَ سَ شَ صَ ضَ',
    revisionKiri: 'دَرَسَ شَرَحَ صَبَرَ'
  },
  {
    start: 11,
    end: 15,
    title: 'Sambungan Tho-Zho-Ain-Ghoin-Fa-Qof',
    focus: 'طَلَعَ ظَهَرَ عَبَدَ غَفَرَ فَتَحَ قَرَأَ',
    headerKanan: 'Huruf tebal dan huruf halqi',
    headerKiri: 'Pastikan makhraj عَ غَ قَ tepat',
    mainKanan: 'طَ ظَ عَ غَ',
    mainKiri: 'فَ قَ معَ الفَتْحَةِ',
    kananPool: ['طَلَعَ', 'ظَهَرَ', 'عَبَدَ', 'غَفَرَ', 'فَتَحَ', 'قَرَأَ', 'طَفَقَ', 'غَلَبَ'],
    kiriPool: ['ظَلَمَ', 'عَرَفَ', 'غَفَلَ', 'فَعَلَ', 'قَطَعَ', 'طَرَقَ', 'عَلَقَ', 'قَبَضَ'],
    revisionKanan: 'طَ ظَ عَ غَ فَ قَ',
    revisionKiri: 'عَبَدَ غَفَرَ قَرَأَ'
  },
  {
    start: 16,
    end: 20,
    title: 'Sambungan Kaf-Lam-Mim-Nun-Wau-Ha-Ya',
    focus: 'كَتَبَ لَعَبَ مَدَحَ نَظَرَ وَقَفَ هَبَطَ يَسَرَ',
    headerKanan: 'Sambungan huruf bibir dan hujung lidah',
    headerKiri: 'Perhatikan bentuk awal-tengah-akhir',
    mainKanan: 'كَ لَ مَ نَ',
    mainKiri: 'وَ هَ يَ معَ فَتْحَةٍ',
    kananPool: ['كَتَبَ', 'لَعَبَ', 'مَدَحَ', 'نَظَرَ', 'وَقَفَ', 'هَبَطَ', 'يَسَرَ', 'كَلَمَ'],
    kiriPool: ['لَفَظَ', 'مَنَعَ', 'نَقَلَ', 'وَزَنَ', 'هَجَرَ', 'يَمَنَ', 'كَبَرَ', 'لَمَعَ'],
    revisionKanan: 'كَ لَ مَ نَ وَ هَ يَ',
    revisionKiri: 'كَتَبَ نَظَرَ وَقَفَ'
  },
  {
    start: 21,
    end: 25,
    title: 'Latihan Panjang-Pendek',
    focus: 'بَتَ vs بَاتَ | تَنَ vs تَانَ',
    headerKanan: 'Bandingkan bunyi pendek dan mad asli',
    headerKiri: 'Jangan tambah harakat pada bacaan pendek',
    mainKanan: 'قَصِيرٌ وَطَوِيلٌ',
    mainKiri: 'بَتَ | بَاتَ',
    kananPool: ['بَتَ', 'بَاتَ', 'تَنَ', 'تَانَ', 'نَبَ', 'نَابَ', 'جَلَ', 'جَالَ'],
    kiriPool: ['دَرَ', 'دَارَ', 'سَمَ', 'سَامَ', 'فَقَ', 'فَاقَ', 'قَرَ', 'قَارَ'],
    revisionKanan: 'بَتَ بَاتَ تَنَ تَانَ',
    revisionKiri: 'دَرَ دَارَ سَمَ سَامَ'
  },
  {
    start: 26,
    end: 30,
    title: 'Campuran Sambungan & Ulangkaji',
    focus: 'بَشَرَ حَسَنَ خَلَقَ رَزَقَ',
    headerKanan: 'Campuran semua sambungan Iqra 2',
    headerKiri: 'Baca lancar tanpa mengeja',
    mainKanan: 'تَمْرِينٌ جَامِعٌ',
    mainKiri: 'مُرَاجَعَةٌ',
    kananPool: ['بَشَرَ', 'حَسَنَ', 'خَلَقَ', 'رَزَقَ', 'سَمَعَ', 'شَرَفَ', 'قَدَرَ', 'عَلَمَ'],
    kiriPool: ['غَلَبَ', 'فَرَحَ', 'قَرَأَ', 'كَتَبَ', 'لَعَبَ', 'مَنَعَ', 'نَفَعَ', 'وَجَدَ'],
    revisionKanan: 'بَشَرَ خَلَقَ قَدَرَ',
    revisionKiri: 'قَرَأَ كَتَبَ نَفَعَ'
  },
  {
    start: 31,
    end: 32,
    title: 'Ujian Akhir Iqra 2',
    focus: 'Kelancaran huruf sambung fathah',
    headerKanan: 'Ujian buku 2',
    headerKiri: 'Baca semua baris tanpa bantuan',
    mainKanan: 'اِقْرَأْ بِثِقَةٍ',
    mainKiri: 'التَّمْيِيزُ بَيْنَ الْأَشْكَالِ',
    kananPool: ['بَتَ ثَجَ', 'حَخَ دَذَ', 'رَزَ سَشَ', 'صَضَ طَظَ', 'عَغَ فَقَ', 'كَلَ مَنَ', 'وَهَ يَ'],
    kiriPool: ['بَنَتَ نَبَتَ', 'جَمَعَ حَمَدَ', 'خَرَجَ دَخَلَ', 'سَمَعَ شَرَحَ', 'صَدَقَ ضَرَبَ', 'طَلَعَ ظَهَرَ', 'عَبَدَ غَفَرَ'],
    revisionKanan: 'بَ تَ ثَ ... يَ',
    revisionKiri: 'لَازِمٌ إِعَادَةٌ إِنْ وُجِدَ خَطَأٌ',
    chunk: 2
  }
];

// TODO: Verify each generated line against physical Iqra 2 pages 2-32 (Rasm Uthmani source).
export const IQRA_2_STRICT: IqraPageStrict[] = IQRA_2_SECTIONS.flatMap(buildSectionPages);

