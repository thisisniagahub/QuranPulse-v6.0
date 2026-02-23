import { IqraPageStrict } from './iqra-1-strict';

interface Iqra3Section {
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

const buildSectionPages = (section: Iqra3Section): IqraPageStrict[] => {
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

const IQRA_3_SECTIONS: Iqra3Section[] = [
  {
    start: 2,
    end: 8,
    title: 'Mad Asli Alif (2 Harakat)',
    focus: 'بَا تَا ثَا جَا حَا خَا',
    headerKanan: 'Mad asli dengan alif selepas fathah',
    headerKiri: 'Panjang tepat dua harakat',
    mainKanan: 'بَ + ا = بَا',
    mainKiri: 'تَ + ا = تَا',
    kananPool: ['بَا', 'تَا', 'ثَا', 'جَا', 'حَا', 'خَا', 'دَا', 'ذَا'],
    kiriPool: ['رَا', 'زَا', 'سَا', 'شَا', 'صَا', 'ضَا', 'طَا', 'ظَا'],
    revisionKanan: 'بَا تَا ثَا جَا حَا',
    revisionKiri: 'خَا دَا ذَا رَا زَا'
  },
  {
    start: 9,
    end: 14,
    title: 'Perbezaan Panjang & Pendek',
    focus: 'بَتَ / بَاتَ | تَنَ / تَانَ',
    headerKanan: 'Bezakan 1 harakat dan 2 harakat',
    headerKiri: 'Jangan tukar makna kerana mad',
    mainKanan: 'قَصِيرٌ: بَتَ',
    mainKiri: 'طَوِيلٌ: بَاتَ',
    kananPool: ['بَتَ', 'بَاتَ', 'تَنَ', 'تَانَ', 'دَرَ', 'دَارَ', 'رَسَ', 'رَاسَ'],
    kiriPool: ['سَمَ', 'سَامَ', 'قَرَ', 'قَارَ', 'فَعَ', 'فَاعَ', 'نَزَ', 'نَازَ'],
    revisionKanan: 'بَتَ بَاتَ تَنَ تَانَ',
    revisionKiri: 'سَمَ سَامَ قَرَ قَارَ'
  },
  {
    start: 15,
    end: 20,
    title: 'Latih Tubi Mad Campuran',
    focus: 'قَالَ سَارَ جَاءَ حَانَ',
    headerKanan: 'Latihan perkataan bersambung dengan mad',
    headerKiri: 'Kekal dua harakat secara konsisten',
    mainKanan: 'قَالَ سَارَ',
    mainKiri: 'جَاءَ حَانَ',
    kananPool: ['قَالَ', 'سَارَ', 'جَاءَ', 'حَانَ', 'طَابَ', 'رَاقَ', 'فَازَ', 'نَامَ'],
    kiriPool: ['بَابَ', 'تَابَ', 'ثَابَ', 'جَادَ', 'خَافَ', 'شَاءَ', 'صَامَ', 'ضَاقَ'],
    revisionKanan: 'قَالَ جَاءَ فَازَ',
    revisionKiri: 'بَابَ تَابَ صَامَ'
  },
  {
    start: 21,
    end: 25,
    title: 'Perkataan Lengkap Dengan Mad',
    focus: 'كَلَامٌ سَلَامٌ حَلَالٌ حَرَامٌ',
    headerKanan: 'Bacaan perkataan lengkap bertanwin',
    headerKiri: 'Perhatikan baris akhir pada setiap kalimah',
    mainKanan: 'مُفْرَدَاتٌ',
    mainKiri: 'مَعَ مَدٍّ أَصْلِيٍّ',
    kananPool: ['كَلَامٌ', 'سَلَامٌ', 'حَلَالٌ', 'حَرَامٌ', 'دُعَاءٌ', 'نِدَاءٌ', 'سَمَاءٌ', 'جَزَاءٌ'],
    kiriPool: ['رَجَاءٌ', 'ثَوَابٌ', 'عِقَابٌ', 'حِسَابٌ', 'مَتَاعٌ', 'ضِيَاءٌ', 'قَضَاءٌ', 'بَلَاءٌ'],
    revisionKanan: 'دُعَاءٌ نِدَاءٌ سَمَاءٌ',
    revisionKiri: 'ثَوَابٌ عِقَابٌ حِسَابٌ'
  },
  {
    start: 26,
    end: 30,
    title: 'Campuran Huruf Sambung + Mad',
    focus: 'نَادَىٰ هَادَىٰ لَاقَىٰ سَارَا',
    headerKanan: 'Mad alif bersama sambungan kompleks',
    headerKiri: 'Kawal kelajuan supaya mad kekal 2 harakat',
    mainKanan: 'تَرْكِيبٌ مُخْتَلِطٌ',
    mainKiri: 'حُرُوفٌ مُتَّصِلَةٌ',
    kananPool: ['نَادَىٰ', 'هَادَىٰ', 'لَاقَىٰ', 'سَارَا', 'قَالَا', 'نَالَا', 'جَاوَزَا', 'دَاوَىٰ'],
    kiriPool: ['رَامَا', 'طَافَا', 'غَابَا', 'شَاهَدَا', 'فَازَا', 'حَاوَلَا', 'عَالَجَا', 'كَافَحَا'],
    revisionKanan: 'نَادَىٰ لَاقَىٰ قَالَا',
    revisionKiri: 'رَامَا فَازَا حَاوَلَا'
  },
  {
    start: 31,
    end: 32,
    title: 'Ujian Akhir Iqra 3',
    focus: 'Peneguhan mad asli 2 harakat',
    headerKanan: 'Ujian buku 3',
    headerKiri: 'Pastikan beza panjang-pendek jelas',
    mainKanan: 'مُرَاجَعَةٌ نِهَائِيَّةٌ',
    mainKiri: 'اِخْتِبَارُ الْمَدِّ',
    kananPool: ['بَا تَا ثَا جَا', 'حَا خَا دَا ذَا', 'رَا زَا سَا شَا', 'صَا ضَا طَا ظَا', 'عَا غَا فَا قَا', 'كَا لَا مَا نَا'],
    kiriPool: ['بَتَ بَاتَ', 'تَنَ تَانَ', 'دَرَ دَارَ', 'سَمَ سَامَ', 'قَرَ قَارَ', 'نَزَ نَازَ'],
    revisionKanan: 'ثَبِّتْ مَدَّكَ دَائِمًا',
    revisionKiri: 'أَعِدِ الصَّفْحَةَ إِنْ ضَعُفَ الْمِقْدَارُ',
    chunk: 2
  }
];

// TODO: Verify each generated line against physical Iqra 3 pages 2-32 (Rasm Uthmani source).
export const IQRA_3_STRICT: IqraPageStrict[] = IQRA_3_SECTIONS.flatMap(buildSectionPages);

