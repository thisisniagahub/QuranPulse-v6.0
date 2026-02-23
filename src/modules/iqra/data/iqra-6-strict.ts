import { IqraPageStrict } from './iqra-1-strict';

interface Iqra6Section {
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

const buildSectionPages = (section: Iqra6Section): IqraPageStrict[] => {
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

const IQRA_6_SECTIONS: Iqra6Section[] = [
  {
    start: 2,
    end: 6,
    title: 'Tanwin (Fathah, Kasrah, Dammah)',
    focus: 'أَحَدًا عَمَلًا حَكِيمٍ عَلِيمٌ',
    headerKanan: 'Latihan baris dua: an/in/un',
    headerKiri: 'Dengung nun mati ringan di hujung',
    mainKanan: 'تَنْوِينٌ: ً ٍ ٌ',
    mainKiri: 'أَحَدًا - عَلِيمٍ - نُورٌ',
    kananPool: ['أَحَدًا', 'عَمَلًا', 'صِرَاطًا', 'كِتَابًا', 'سَمِيعٌ', 'بَصِيرٌ', 'حَكِيمٍ', 'عَلِيمٍ'],
    kiriPool: ['غَفُورًا', 'رَحِيمًا', 'هُدًى', 'شَيْءٍ', 'قَوْمٌ', 'نُورٌ', 'فَضْلٍ', 'أَجْرٍ'],
    revisionKanan: 'ً = أَنْ | ٍ = إِنْ | ٌ = أُنْ',
    revisionKiri: 'أَحَدًا حَكِيمٍ نُورٌ'
  },
  {
    start: 7,
    end: 10,
    title: 'Nun Sukun & Mim Sukun',
    focus: 'مِنْ بَعْدِ | أَنْعَمْتَ | هُمْ فِيهَا',
    headerKanan: 'Latihan nun/mim mati asas tajwid',
    headerKiri: 'Bezakan dengung dan izhar',
    mainKanan: 'نْ / مْ',
    mainKiri: 'مِنْ - عَنْ - هُمْ',
    kananPool: ['مِنْ بَعْدِ', 'مِنْ تَحْتِ', 'مِنْ دُونِ', 'مِنْهُمْ', 'عَنْهُمْ', 'أَنْعَمْتَ', 'يَنْصُرُ', 'مَنْ يَعْمَلْ'],
    kiriPool: ['هُمْ فِيهَا', 'عَلَيْهِمْ', 'كَمْ أَهْلَكْنَا', 'أَمْسَىٰ', 'لَمْ يَلِدْ', 'لَمْ يُولَدْ', 'مِنْ قَبْلُ', 'مِنْ فَضْلِهِۦ'],
    revisionKanan: 'مِنْ عَنْ هُمْ أَمْ',
    revisionKiri: 'ثَبِّتْ إِظْهَارَ النُّونِ وَالْمِيمِ'
  },
  {
    start: 11,
    end: 14,
    title: 'Qolqolah',
    focus: 'بْ جْ دْ طْ قْ',
    headerKanan: 'Huruf qalqalah bila sukun',
    headerKiri: 'Lantunan sederhana, bukan baris penuh',
    mainKanan: 'قُطْبُ جَدٍّ',
    mainKiri: 'بْ جْ دْ طْ قْ',
    kananPool: ['أَبْ', 'أَجْ', 'أَدْ', 'أَطْ', 'أَقْ', 'يَقْطَعْ', 'مَجْدٌ', 'وَعْدٌ'],
    kiriPool: ['يَكْتُبْ', 'يَخْرُجْ', 'قَدْ أَفْلَحَ', 'بَطْشٌ', 'حَقٌّ', 'مُقْتَدِرٌ', 'مَسْجِدٌ', 'يُوقِنْ'],
    revisionKanan: 'بْ جْ دْ طْ قْ',
    revisionKiri: 'أَبْ أَجْ أَدْ أَطْ أَقْ'
  },
  {
    start: 15,
    end: 18,
    title: 'Alif Lam Syamsiah & Qamariah',
    focus: 'ٱلشَّمْسُ vs ٱلْقَمَرُ',
    headerKanan: 'Syamsiah: lam tidak dibunyikan',
    headerKiri: 'Qamariah: lam dibaca jelas',
    mainKanan: 'ٱلشَّمْسُ ٱلنَّاسُ',
    mainKiri: 'ٱلْقَمَرُ ٱلْكِتَابُ',
    kananPool: ['ٱلشَّمْسُ', 'ٱلنَّاسُ', 'ٱلرَّحْمَٰنُ', 'ٱلطَّارِقُ', 'ٱلدِّينُ', 'ٱلزَّيْتُونِ', 'ٱلسَّمَاءُ', 'ٱلضُّحَىٰ'],
    kiriPool: ['ٱلْقَمَرُ', 'ٱلْكِتَابُ', 'ٱلْحَمْدُ', 'ٱلْفَلَقُ', 'ٱلْمَلِكُ', 'ٱلْيَوْمُ', 'ٱلْجَنَّةُ', 'ٱلْبَحْرُ'],
    revisionKanan: 'شَمْسِيَّةٌ: ٱلشَّمْسُ ٱلنَّاسُ',
    revisionKiri: 'قَمَرِيَّةٌ: ٱلْقَمَرُ ٱلْفَلَقُ'
  },
  {
    start: 19,
    end: 24,
    title: 'Waqaf & Tanda Waqaf',
    focus: 'ۚ ۖ ۗ ۙ ۛ ۜ',
    headerKanan: 'Belajar tempat berhenti yang sesuai',
    headerKiri: 'Ikut tanda waqaf dalam mushaf',
    mainKanan: 'تَعَلَّمِ الْوَقْفَ',
    mainKiri: 'حُسْنُ الاِبْتِدَاءِ بَعْدَ الْوَقْفِ',
    kananPool: ['إِنَّ ٱللَّهَ غَفُورٌ رَحِيمٌۚ', 'وَٱللَّهُ عَلِيمٌ حَكِيمٌۖ', 'وَكَانَ ٱللَّهُ سَمِيعًا بَصِيرًاۗ', 'ٱتَّقُوا ٱللَّهَۚ', 'لَعَلَّكُمْ تُفْلِحُونَۙ', 'سَوَآءٌ عَلَيْهِمْۛ', 'كَلَّاۖ', 'بَلَىٰۚ'],
    kiriPool: ['لَا رَيْبَۛ فِيهِ', 'هُدًى لِّلْمُتَّقِينَۚ', 'قَدْ أَفْلَحَ مَنْ زَكَّىٰۖ', 'وَٱللَّهُ خَبِيرٌۢ بِمَا تَعْمَلُونَۚ', 'إِنَّ رَبَّكَ لَرَءُوفٌ رَّحِيمٌۙ', 'فَٱذْكُرُوا ٱللَّهَۚ', 'نَعَمْۜ', 'صَدَقَ ٱللَّهُ ٱلْعَظِيمُۗ'],
    revisionKanan: 'ۚ جَائِزٌ | ۖ أَوْلَى | ۗ وَصْلٌ',
    revisionKiri: 'تَوَقَّفْ بِأَدَبٍ وَفَهْمٍ',
    chunk: 2
  },
  {
    start: 25,
    end: 30,
    title: 'Bacaan Potongan Ayat Al-Quran',
    focus: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    headerKanan: 'Latihan ayat pendek dengan tajwid asas',
    headerKiri: 'Baca tartil dan jelas makhraj',
    mainKanan: 'تِلَاوَةُ نُصُوصٍ قُرْآنِيَّةٍ',
    mainKiri: 'لَا تَسْرَعْ فِي الْقِرَاءَةِ',
    kananPool: ['قُلْ هُوَ ٱللَّهُ أَحَدٌ', 'ٱللَّهُ ٱلصَّمَدُ', 'لَمْ يَلِدْ وَلَمْ يُولَدْ', 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ', 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ', 'مِن شَرِّ مَا خَلَقَ', 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', 'مَلِكِ ٱلنَّاسِ'],
    kiriPool: ['إِلَٰهِ ٱلنَّاسِ', 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ', 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ', 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ', 'إِنَّا أَعْطَيْنَٰكَ ٱلْكَوْثَرَ', 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ', 'وَٱلْعَصْرِ'],
    revisionKanan: 'ثَبِّتِ التَّجْوِيدَ فِي النُّصُوصِ',
    revisionKiri: 'قَدِّمِ الصِّحَّةَ عَلَى السُّرْعَةِ',
    chunk: 2
  }
];

const IQRA_6_GENERATED: IqraPageStrict[] = IQRA_6_SECTIONS.flatMap(buildSectionPages);

const IQRA_6_FINAL_PAGES: IqraPageStrict[] = [
  {
    page: 31,
    title: 'Ujian Akhir - Al-Fatihah (Bahagian 1)',
    focus: 'سُورَةُ ٱلْفَاتِحَةِ: ١-٤',
    grid: [
      { baris: 'Header', kanan: 'Baca Al-Fatihah dengan tartil', kiri: 'Mula dengan isti\'azah dan basmalah' },
      { baris: 'Main', kanan: 'سُورَةُ ٱلْفَاتِحَةِ', kiri: 'تَحْقِيقُ الْحَرَكَاتِ وَالْمَدِّ' },
      { baris: '1', kanan: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', kiri: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ' },
      { baris: '2', kanan: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', kiri: 'مَٰلِكِ يَوْمِ ٱلدِّينِ' },
      { baris: '3', kanan: 'ثَبِّتْ غُنَّةَ النُّونِ فِي ٱلْعَٰلَمِينَ', kiri: 'وَضِّحْ كَسْرَةَ كَافِ مَٰلِكِ' },
      { baris: 'Revision', kanan: 'مُرَاجَعَةٌ قَبْلَ الْآيَاتِ ٥-٧', kiri: 'لَا تَنْتَقِلْ قَبْلَ الإِتْقَانِ' }
    ]
  },
  {
    page: 32,
    title: 'Ujian Akhir - Al-Fatihah (Bahagian 2)',
    focus: 'سُورَةُ ٱلْفَاتِحَةِ: ٥-٧',
    grid: [
      { baris: 'Header', kanan: 'Penilaian akhir Iqra 6', kiri: 'Baca ayat terakhir dengan waqaf yang betul' },
      { baris: 'Main', kanan: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', kiri: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ' },
      { baris: '1', kanan: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', kiri: 'غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ' },
      { baris: '2', kanan: 'وَلَا ٱلضَّآلِّينَ', kiri: 'ءَامِينَ' },
      { baris: '3', kanan: 'Ulang jika tajwid belum stabil', kiri: 'Pastikan mad dan waqaf tepat' },
      { baris: 'Footer', kanan: 'Tamat Iqra 6 - bersedia ke mushaf Al-Quran', kiri: 'Semoga Allah mudahkan istiqamah tilawah' }
    ]
  }
];

// TODO: Verify pages 2-32 against physical Iqra 6 copy with certified Rasm Uthmani.
// TODO: Verify all Quranic fragments and Al-Fatihah script (pages 25-32) with certified mushaf source.
export const IQRA_6_STRICT: IqraPageStrict[] = [...IQRA_6_GENERATED, ...IQRA_6_FINAL_PAGES];

