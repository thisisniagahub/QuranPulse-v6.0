import { IqraPageStrict } from './iqra-1-strict';

interface Iqra4Section {
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

const buildSectionPages = (section: Iqra4Section): IqraPageStrict[] => {
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

const IQRA_4_SECTIONS: Iqra4Section[] = [
  {
    start: 2,
    end: 6,
    title: 'Kasrah (Baris Bawah)',
    focus: 'إِ بِ تِ ثِ جِ حِ',
    headerKanan: 'Latihan kasrah bunyi i pendek',
    headerKiri: 'Senyum ringan, jangan jadi bunyi e',
    mainKanan: 'بِ تِ ثِ جِ',
    mainKiri: 'حِ خِ دِ ذِ',
    kananPool: ['بِ', 'تِ', 'ثِ', 'جِ', 'حِ', 'خِ', 'دِ', 'ذِ'],
    kiriPool: ['رِ', 'زِ', 'سِ', 'شِ', 'صِ', 'ضِ', 'طِ', 'ظِ'],
    revisionKanan: 'بِ تِ ثِ جِ حِ',
    revisionKiri: 'خِ دِ ذِ رِ زِ'
  },
  {
    start: 7,
    end: 12,
    title: 'Mad Ya (Panjang 2 Harakat)',
    focus: 'بِيْ تِيْ ثِيْ جِيْ',
    headerKanan: 'Kasrah + ya sukun = mad asli',
    headerKiri: 'Panjang dua harakat sahaja',
    mainKanan: 'بِيْ تِيْ ثِيْ',
    mainKiri: 'جِيْ حِيْ خِيْ',
    kananPool: ['بِيْ', 'تِيْ', 'ثِيْ', 'جِيْ', 'حِيْ', 'خِيْ', 'دِيْ', 'ذِيْ'],
    kiriPool: ['رِيْ', 'زِيْ', 'سِيْ', 'شِيْ', 'صِيْ', 'ضِيْ', 'طِيْ', 'ظِيْ'],
    revisionKanan: 'بِيْ تِيْ ثِيْ جِيْ',
    revisionKiri: 'رِيْ سِيْ شِيْ صِيْ'
  },
  {
    start: 13,
    end: 16,
    title: 'Mad Silah Ha',
    focus: 'بِهِۦ لَهُۥ فِيهِۦ عَلَيْهِۦ',
    headerKanan: 'Ha dhamir dibaca silah bila bersambung',
    headerKiri: 'Perhatikan simbol kecil wau/ya',
    mainKanan: 'بِهِۦ لَهُۥ',
    mainKiri: 'فِيهِۦ عَلَيْهِۦ',
    kananPool: ['بِهِۦ', 'لَهُۥ', 'فِيهِۦ', 'عَلَيْهِۦ', 'إِلَيْهِۦ', 'عِلْمِهِۦ', 'رَبُّهُۥ', 'نُورُهُۥ'],
    kiriPool: ['بِهِمْ', 'لَهُمْ', 'فِيهَا', 'عَلَيْهَا', 'إِلَيْهَا', 'عِبَادِهِۦ', 'كِتَابُهُۥ', 'وَجْهُهُۥ'],
    revisionKanan: 'بِهِۦ لَهُۥ فِيهِۦ',
    revisionKiri: 'عَلَيْهِۦ إِلَيْهِۦ'
  },
  {
    start: 17,
    end: 22,
    title: 'Dammah (Baris Depan)',
    focus: 'أُ بُ تُ ثُ جُ حُ',
    headerKanan: 'Latihan dammah bunyi u pendek',
    headerKiri: 'Muncungkan bibir secara stabil',
    mainKanan: 'بُ تُ ثُ جُ',
    mainKiri: 'حُ خُ دُ ذُ',
    kananPool: ['بُ', 'تُ', 'ثُ', 'جُ', 'حُ', 'خُ', 'دُ', 'ذُ'],
    kiriPool: ['رُ', 'زُ', 'سُ', 'شُ', 'صُ', 'ضُ', 'طُ', 'ظُ'],
    revisionKanan: 'بُ تُ ثُ جُ حُ',
    revisionKiri: 'خُ دُ ذُ رُ زُ'
  },
  {
    start: 23,
    end: 28,
    title: 'Campuran Fathah-Kasrah-Dammah',
    focus: 'بَ بِ بُ | تَ تِ تُ | ثَ ثِ ثُ',
    headerKanan: 'Gabungkan tiga baris tanpa keliru',
    headerKiri: 'Kekalkan ritma dan ketepatan bunyi',
    mainKanan: 'بَ بِ بُ  تَ تِ تُ',
    mainKiri: 'ثَ ثِ ثُ  جَ جِ جُ',
    kananPool: ['بَ بِ بُ', 'تَ تِ تُ', 'ثَ ثِ ثُ', 'جَ جِ جُ', 'حَ حِ حُ', 'خَ خِ خُ', 'دَ دِ دُ', 'ذَ ذِ ذُ'],
    kiriPool: ['رَ رِ رُ', 'زَ زِ زُ', 'سَ سِ سُ', 'شَ شِ شُ', 'صَ صِ صُ', 'ضَ ضِ ضُ', 'طَ طِ طُ', 'ظَ ظِ ظُ'],
    revisionKanan: 'بَ بِ بُ | تَ تِ تُ | ثَ ثِ ثُ',
    revisionKiri: 'جَ جِ جُ | حَ حِ حُ | خَ خِ خُ',
    chunk: 2
  },
  {
    start: 29,
    end: 32,
    title: 'Ujian Akhir Iqra 4',
    focus: 'Kasrah, dammah, mad ya, dan campuran',
    headerKanan: 'Ujian buku 4',
    headerKiri: 'Semak ketepatan baris dan mad',
    mainKanan: 'اِخْتِبَارُ الْحَرَكَاتِ',
    mainKiri: 'قِرَاءَةٌ مُنْضَبِطَةٌ',
    kananPool: ['بَ بِ بُ بِيْ بُوْ', 'تَ تِ تُ تِيْ تُوْ', 'ثَ ثِ ثُ ثِيْ ثُوْ', 'جَ جِ جُ جِيْ جُوْ', 'حَ حِ حُ حِيْ حُوْ', 'خَ خِ خُ خِيْ خُوْ'],
    kiriPool: ['دَ دِ دُ دِيْ دُوْ', 'ذَ ذِ ذُ ذِيْ ذُوْ', 'رَ رِ رُ رِيْ رُوْ', 'زَ زِ زُ زِيْ زُوْ', 'سَ سِ سُ سِيْ سُوْ', 'شَ شِ شُ شِيْ شُوْ'],
    revisionKanan: 'تَثْبِيتُ جَمِيعِ الْحَرَكَاتِ',
    revisionKiri: 'أَعِدْ مَا صَعُبَ عَلَيْكَ',
    chunk: 2
  }
];

// TODO: Verify each generated line against physical Iqra 4 pages 2-32 (Rasm Uthmani source).
export const IQRA_4_STRICT: IqraPageStrict[] = IQRA_4_SECTIONS.flatMap(buildSectionPages);

