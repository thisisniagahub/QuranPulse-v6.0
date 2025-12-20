import { IqraVolume } from './types';

export const IQRA_2: IqraVolume = {
    id: 'iqra-2',
    title: 'IQRA 2',
    pages: [
        {
            title: 'MUKA SURAT 1: KULIT BUKU (COVER)',
            subtitle: 'Fokus: Persediaan mental. Huruf yang dipelajari di Iqra 1 kini akan "berubah wajah".',
            rows: []
        },
        {
            title: 'MUKA SURAT 2: ASAS SAMBUNGAN (BA, TA, DA, RO, WAU)',
            subtitle: 'Fokus: Konsep "Potong Ekor" (Ba/Ta) vs "Ego/Pemutus" (Da/Ro/Wau).',
            diagramFlow: '[ 4 ] <--- [ 3 ] <--- [ 2 ] <--- [ 1 ]',
            rows: [
                { label: 'TAJUK', cells: ['بَ تَا = بَتَا', 'بَ دَا = بَدَا', '-', '-'], focus: 'Ba (Sambung) vs Ba-Da (Putus).' },
                { label: 'TAJUK', cells: ['تَ رَ = تَرَ', 'تَ وَ = تَوَ', '-', '-'], focus: 'Ro & Wau menolak huruf kiri.' },
                { label: 'Baris 1', cells: ['تَ تَا (TATA)', 'تَ دَا (TADA)', 'بَ رَا (BARO)', 'بَ وَ (BAWA)'], focus: 'Latihan sambung vs putus.' },
                { label: 'Baris 2', cells: ['بَ بَ (BABA)', 'بَ ذَ (BADZA)', 'تَ رَ (TARO)', 'تَ زَ (TAZA)'], focus: 'Titik huruf hujung (Dzal/Ro/Zai).' },
                { label: 'Baris 3', cells: ['بَ ثَ (BATSA)', 'تَ ذَ (TADZA)', 'ثَ ثَ (TSATSA)', 'زَ ثَ (ZATSA)'], focus: 'Zai tidak boleh sambung Tsa.' },
                { label: 'Baris 4', cells: ['بَ أَ (BA-A)', 'بَ أَ تَ (BA\'ATA)', 'تَ أ (TA-A)', 'تَ أ تَ (TA\'ATA)'], focus: 'Hamzah di atas Alif.' },
                { label: 'Baris 5', cells: ['ثَ بَ (TSABA)', 'ثَ رَ (TSARO)', 'بَ رَ (BARO)', 'تَ وَ (TAWA)'], focus: 'Ulangkaji titik 3, 1, 2.' },
                { label: 'Baris 6', cells: ['طَ هَ (THOHA)', 'جَ مَ (JAMA)', 'كَ نَ (KANA)', 'سَ عَ (SA\'A)'], focus: 'Intro bentuk kepala huruf lain.' }
            ]
        },
        {
            title: 'MUKA SURAT 3: HURUF NUN (ن)',
            subtitle: 'Fokus: Titik 1 ATAS. Di awal/tengah berbentuk "Gigi" dengan titik di atas.',
            checklist: [
                'Mata pantas beza titik ATAS (Nun) dan BAWAH (Ba).',
                'Kenal Nun di tengah sebagai "gigi".'
            ],
            rows: [
                { label: 'TAJUK', cells: ['نَ ... = نَبَ', 'نَ بَ = نَبَ', '-', '-'], focus: 'Nun Awal = Gigi 1 Titik Atas.' },
                { label: 'Baris 1', cells: ['نَ نَ نَ', 'نَ تَ نَ', '-', '-'], focus: '(NANANA) vs (NATANA).' },
                { label: 'Baris 2', cells: ['نَ بَ تَ', 'تَ بَ نَ', 'بَ نَ تَ', 'نَ تَبَ'], focus: 'Posisi Nun (Awal/Tengah/Akhir).' },
                { label: 'Baris 3', cells: ['رَ بَ نَ', 'بَ نَ رَ', 'نَ بَ ذَ', 'بَ ذَ نَ'], focus: 'Ro pemutus vs Nun penyambung.' },
                { label: 'Baris 4', cells: ['بَ دَ رَ', 'نَ ذَ رَ', 'ذَ هَ بَ', 'وَ نَ ذَ'], focus: 'Beza Ba/Nun (Titik) & Da/Dza.' },
                { label: 'Baris 5', cells: ['ذَ رَ حَ', 'نَ زَ عَ', 'نَ بَ أ', 'نَ بَ أ'], focus: "'Ain & Ha di akhir."
 },
                { label: 'Baris 6', cells: ['ثَ بَ تَ', 'تَ بَ تَ', 'وَ نَ أ', 'نَ وَ فَ'], focus: '(WANA-A) Hamzah di akhir.' },
                { label: 'Baris 7', cells: ['بَ دَ نَ', 'دَ نَ تَ', 'نَ وَ نَ', 'بَ دَ نَ'], focus: 'Nun di hujung (Mangkuk Dalam).' }
            ]
        },
        {
            title: 'MUKA SURAT 4: HURUF YA (ي)',
            subtitle: 'Fokus: Titik 2 BAWAH. Bentuk "Gigi/Ombak" di awal dan tengah.',
            rows: [
                { label: 'TAJUK', cells: ['يَ ... = يَ تَ', 'رَ نَ يَ', 'رَ نَىَ', '-'], focus: '2 Titik Bawah = YA.' },
                { label: 'Baris 1', cells: ['رَ بَ يَ', 'يَبَرَ', 'رَنَىَ', 'يَ نَ رَ'], focus: '(ROBAYA) vs (YANARO).' },
                { label: 'Baris 2', cells: ['بَ يَنَ', 'نَبَىَ', 'يَدَنَ', 'دَ نَىَ'], focus: 'Ya di tengah vs Alif Maqsurah.' },
                { label: 'Baris 3', cells: ['ذَ هَ بَ', 'نَ زَ لَ', 'نَ ذَ رَ', 'يَ دَ ى'], focus: '(YADA) Ya di hujung.' },
                { label: 'Baris 4', cells: ['أَ زَ غَ', 'بَ تَ رَ', 'زَ يَنَ', 'زَ نَىَ'], focus: 'Ya di tengah (ZAYANA).' },
                { label: 'Baris 5', cells: ['أَ ثَ تَ', 'ثَ نَ أ', 'يَ أَبَ', 'أَ يَتَ'], focus: 'Ya jumpa Hamzah/Alif.' },
                { label: 'Baris 6', cells: ['رَ زَ قَ', 'نَ ظَ رَ', 'أَ تَىَ', 'وَ نَ دَ'], focus: '(ATA) Ya tanpa titik = A.' },
                { label: 'Baris 7', cells: ['يَ بَىَ', 'فَتَىَ', 'سَيَلَ', 'يَ سَرَ'], focus: '(YABAYA) vs (YASARA).' }
            ]
        },
        {
            title: 'MUKA SURAT 5: HURUF JIM, HA, KHO (ج ح خ)',
            subtitle: 'Fokus: Kepala Tajam (Paruh Burung). Perut Buncit DIBUANG bila bersambung.',
            checklist: [
                'Perut Hilang: Bila sambung, perut Ha/Jim/Kho hilang.',
                'Titik: Kho (Atas), Jim (Bawah), Ha (Kosong).'
            ],
            rows: [
                { label: 'TAJUK', cells: ['حَ جَ رَ', 'جَ رَ = جَرَ', '-', '-'], focus: 'Kepala sahaja diambil.' },
                { label: 'Baris 1', cells: ['بَ جَ', 'جَبَ', 'خَ دَ', 'نَ دَ'], focus: 'Jim Akhir (Perut) vs Awal.' },
                { label: 'Baris 2', cells: ['ثَ جَ', 'هُ وَ', 'خَ زَ', 'يَ تَ'], focus: 'Tsa-Ja vs Kho-Za.' },
                { label: 'Baris 3', cells: ['نَ جَ', 'حَ ى', 'جَسَ', 'يَ شَ'], focus: 'Jim-Sin (Kepala tajam + Gigi).' },
                { label: 'Baris 4', cells: ['مَ ثَ', 'رَ صَ', 'يَ ضَ', 'نَ فَ'], focus: 'Latihan bentuk kepala huruf.' },
                { label: 'Baris 5', cells: ['ظَ نَ', 'دَ عَ', 'غَ زَ', 'خَ طَ'], focus: 'Kho-Tho (Titik atas).' },
                { label: 'Baris 6', cells: ['يَ قَ', 'جَ كَ', 'خَ لَ', 'يَ ى'], focus: 'Jim-Kaf vs Kho-Lam.' },
                { label: 'Baris 7', cells: ['هَ ذَ', 'يَ تَمَ', 'نَ جَحَ', 'جَىَ'], focus: '(NAJAHA) 3 serangkai.' }
            ]
        },
        {
            title: "MUKA SURAT 6: HURUF 'AIN & GHOIN (ع غ)",
            subtitle: 'Fokus: Awal (Mulut Terbuka), Tengah (Simpul Segitiga Hitam), Akhir (Berekor).',
            rows: [
                { label: 'TAJUK', cells: ['عَ دَ = عَدَ', 'بَ عَ = بَعَ', '-', '-'], focus: "Konsep 'Ain Awal vs Tengah." },
                { label: 'TAJUK 2', cells: ['بَ عَ دَ = بَعَدَ', '-', '-', '-'], focus: "'Ain Tengah bersimpul." },
                { label: 'Baris 1', cells: ['رَ عَتَ', 'تَ عَرَ', 'عَتَرَ', 'رَتَعَ'], focus: "(ATA) vs (A'A)." },
                { label: 'Baris 2', cells: ['عَ بَ صَ', 'صَ عَ بَ', 'يَ غَ ضَ', 'غَ يَ ضَ'], focus: 'Ghain titik atas (Serak).' },
                { label: 'Baris 3', cells: ['حَ ذَ رَ', 'جَ عَ لَ', 'شَ طَ كَ', 'نَ بَ غَ'], focus: '(NABAGHA) Ghain akhir.' },
                { label: 'Baris 4', cells: ['غَ يَ رَ', 'ثَ قَ فَ', 'عَ تَ قَ', 'مَ نَ عَ'], focus: "'Ain akhir berekor." },
                { label: 'Baris 5', cells: ['ثَ قَ لَ', 'نَ ظَ مَ', 'رَ هَ قَ', 'وَ سَ عَ'], focus: "('Ain mangkuk." },
                { label: 'Baris 6', cells: ['عَ زَ لَ', 'نَ عَ سَ', 'غَ وَ ضَ', 'يَ غَ ضَ'], focus: '(YA-GHO-DHO).' }
            ]
        },
        {
            title: 'MUKA SURAT 7: HURUF FA & QOF (ف ق)',
            subtitle: 'Fokus: Kepala Bulat Berleher. Fa (1 Titik), Qof (2 Titik).',
            rows: [
                { label: 'TAJUK', cells: ['نَ فَ قَ = نَفَقَ', '-', '-', '-'], focus: 'Kepala bulat ada leher.' },
                { label: 'TAJUK 2', cells: ['فَ قَ مَ = فَقَمَ', 'قَ فَ لَ = قَفَلَ', '-', '-'], focus: 'Fa vs Qof.' },
                { label: 'Baris 1', cells: ['فَ رَ غَ', 'نَ فَ لَ', 'قَ بَ حَ', 'وَ قَ عَ'], focus: 'Fa (Nipis) vs Qof (Tebal).' },
                { label: 'Baris 2', cells: ['فَ صَ حَ', 'جَ رَ مَ', 'وَ زَ كَ', 'تَ ذَ رَ'], focus: 'Fa-Sod-Ha.' },
                { label: 'Baris 3', cells: ['هَ يَ جَ', 'يَ خَ ضَ', 'شَ رَ عَ', 'نَ ظَ فَ'], focus: 'Fa akhir (Mangkuk leper).' },
                { label: 'Baris 4', cells: ['يَ دَ كَ', 'ضَ غَ طَ', 'ثَ قَ لَ', 'شَ فَ عَ'], focus: "'Ain akhir vs Fa tengah." },
                { label: 'Baris 5', cells: ['عَ ظَ مَ', 'يَ سَ رَ', 'طَ بَ قَ', 'نَ فَ رَ'], focus: 'Qof akhir (Mangkuk dalam).' },
                { label: 'Baris 6', cells: ['عَ قَ مَ', 'فَ رَ دَ', 'فَ رَ شَ', 'بَ غَ ى'], focus: "Beza kepala 'Ain & Fa." }
            ]
        },
        {
            title: 'MUKA SURAT 8: HURUF KAF (ك)',
            subtitle: 'Fokus: Transformasi bentuk. Awal/Tengah jadi bentuk "S Sendeng".',
            rows: [
                { label: 'TAJUK', cells: ['كَ تَ بَ = كَتَبَ', '-', '-', '-'], focus: 'Kaf berubah bentuk.' },
                { label: 'TAJUK 2', cells: ['سَ كَ تَ = سَكَتَ', '-', '-', '-'], focus: 'Kaf Tengah = S Sendeng.' },
                { label: 'Baris 1', cells: ['كَ ذَ بَ', 'أَ كَ لَ', 'حَ كَ مَ', 'تَ رَ كَ'], focus: 'Kaf Awal, Tengah, Akhir.' },
                { label: 'Baris 2', cells: ['كَ فَ رَ', 'نَ قَ صَ', 'نَ كَ حَ', 'فَتَى'], focus: 'Kaf vs Fa.' },
                { label: 'Baris 3', cells: ['كَ دَ رَ', 'حَ فَ ظَ', 'زَ كَا', 'خَ طَى'], focus: 'Ka-Alif.' },
                { label: 'Baris 4', cells: ['كَ تَ مَ', 'ضَ رَ بَ', 'ثَ نَ أ', 'مَ عَ كَ'], focus: 'Kaf akhir kembali asal.' },
                { label: 'Baris 5', cells: ['كَ شَ فَ', 'غَ سَ قَ', 'وَ تَ رَ', 'فَ صَ لَ'], focus: 'Latihan kelancaran.' },
                { label: 'Baris 6', cells: ['كَ ظَ مَ', 'خَ دَ كَ', 'هَ كَ ذَ', 'يَ دَ كَ'], focus: 'Kaf-Zho-Mim.' }
            ]
        },
        {
            title: 'MUKA SURAT 9: HURUF LAM (ل)',
            subtitle: 'Fokus: Beza Lam dan Alif. Lam sambung kiri, Alif TIDAK.',
            checklist: [
                'Sambung Kiri = **LAM**.',
                'Putus Kiri = **ALIF**.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['لَ', 'لَ نَ أ', 'أ'], focus: 'Lam vs Alif.' },
                { label: 'TAJUK 2', cells: ['لَ بَ دَ = لَبَدَ', 'لَ أ = لَأ = لَا', '-'], focus: 'Lam sambung kiri.' },
                { label: 'Baris 1', cells: ['لَ أَ جَ لَ', 'جَ لَ لَ', 'جَ لَ لَ'], focus: 'Lam berganda.' },
                { label: 'Baris 2', cells: ['لَ سَ أَ لَ', 'لَ ضَ لَ لَ', 'لَ نَ بَ أ'], focus: 'Lam awal kalimah.' },
                { label: 'Baris 3', cells: ['وَ مَ لَ أ', 'لَ أَ كَ لَ', 'فَ بَ لَ غَ'], focus: 'Lam-Alif vs Alif-Kaf.' },
                { label: 'Baris 4', cells: ['لَ سَ لَ كَ', 'وَ خَ طَ أ', 'وَ كَ لَا'], focus: 'Wa-Ka-La-Alif.' },
                { label: 'Baris 5', cells: ['سَ أَ لَ كَ', 'لَ لْ أَ مَ', 'وَ حَ لَ لَ'], focus: 'Lam-Lam (Lal).' }
            ]
        },
        {
            title: 'MUKA SURAT 10: HURUF MIM (م)',
            subtitle: 'Fokus: Kepala Bulat Kecil (Bawah Garisan). Tiada Leher.',
            rows: [
                { label: 'TAJUK', cells: ['جَ مَ عَ = جَمَعَ', '-', '-', '-'], focus: 'Mim = Simpul Bawah.' },
                { label: 'Baris 1', cells: ['عَمَدَ', 'صَمَدَ', 'ظَلَمَ', 'لَأَخَذَ'], focus: 'Mim di tengah.' },
                { label: 'Baris 2', cells: ['هَمَزَ', 'نَفَحَ', 'غَنَمَ', 'لَأَسَدَ'], focus: 'Mim akhir berekor.' },
                { label: 'Baris 3', cells: ['يَمَنَ', 'بَلَغَ', 'ظَمَأ', 'لَأَمَرَ'], focus: 'Ya-Mim-Na.' },
                { label: 'Baris 4', cells: ['كَمَدَ', 'طَمَعَ', 'ضَوَى', 'لَأَقَمَ'], focus: 'Ka-Mim-Da.' },
                { label: 'Baris 5', cells: ['زَمَلَ', 'صَنَعَ', 'مَلَكَ', 'لَأَذَنَ'], focus: 'Mim Awal.' },
                { label: 'Baris 6', cells: ['هَجَمَ', 'كَذَبَ', 'هَشَمَ', 'لَأَجَلَ'], focus: 'Ha-Mim vs Syin-Mim.' },
                { label: 'Baris 7', cells: ['ضَحَمَ', 'لَثَمَ', 'قَلَمَ', 'لَأَكَلَ'], focus: 'Lam-Alif-Kal.' }
            ]
        }
    ]
};
