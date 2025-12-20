import { IqraVolume } from './types';

export const IQRA_3: IqraVolume = {
    id: 'iqra-3',
    title: 'IQRA 3',
    pages: [
        {
            title: 'MUKA SURAT 1: MUKA DEPAN',
            subtitle: 'Fokus: Persediaan minda. Peralihan dari bacaan putus-putus (Iqra 1 & 2) kepada bacaan berirama (Panjang/Pendek).',
            rows: []
        },
        {
            title: 'MUKA SURAT 2: PENGENALAN MAD ASLI (ALIF)',
            subtitle: 'Fokus Utama: Formula Mad Asli = Baris Atas + Alif Mati.',
            diagramFlow: '[ 3 ] <--- [ 2 ] <--- [ 1 ]',
            checklist: [
                'Panjang mesti tepat 2 harakat (satu ayunan tangan).',
                'Mulut dibuka luas bila menyebut Mad Alif.',
                'Jangan terpanjangkan huruf yang tiada Alif.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بَا (BAA)', 'بَ (BA)', '-'], focus: 'Alif = Tanda Panjang.' },
                { label: 'Baris 1', cells: ['مَا (MAA)', 'هَا (HAA)', 'ذَا (DZAA)'], focus: 'Latihan huruf tunggal panjang.' },
                { label: 'Baris 2', cells: ['لَا (LAA)', 'كَ (KAA)', 'نَا (NAA)'], focus: '(ROO) di kiri atas.' },
                { label: 'Baris 3', cells: ['بَاتَ (BAATA)', 'تَابَ (TAABA)', 'نَارَ (NAARA)'], focus: 'Panjang di awal kalimah.' },
                { label: 'Baris 4', cells: ['تَنَ (TANA)', 'تَانَ (TAANA)', 'نَتَ (NATA)'], focus: 'Beza Tana (Pendek) vs Taana (Panjang).' },
                { label: 'Baris 5', cells: ['نَاتَ (NAATA)', 'يَ بَ (YABA)', 'يَابَ (YAABA)'], focus: 'Ya sambung Alif.' },
                { label: 'Baris 6', cells: ['بَىَ (BAYA)', 'بَاىَ (BAAYA)', 'بَيَنَ (BAYANA)'], focus: 'Latihan visual Ya dan Alif.' },
                { label: 'Baris 7', cells: ['بَايَنَ (BAAYANA)', 'بَايَنَا (BAAYANAA)', '-'], focus: 'Panjang di awal vs Panjang di awal & akhir.' },
                { label: 'Baris 8', cells: ['عَبَدَ (ABADA)', 'عَابَدَ (AABADA)', 'عَبَادَ (ABAADA)'], focus: 'Variasi kedudukan Mad.' },
                { label: 'Baris 9', cells: ['عَابِدَا (AABIDAA)', 'رَحِمَ (RAHIMA)', 'رَاحِمَ (RAAHAMA)'], focus: 'Latihan 3 serangkai.' },
                { label: 'Baris 10', cells: ['رِحَامَ (RIHAAMA)', 'رَاحِمَا (RAAHIMAA)', '-'], focus: 'Ujian akhir muka surat.' }
            ]
        },
        {
            title: 'MUKA SURAT 3: BEZAKAN PANJANG & PENDEK',
            subtitle: 'Fokus Utama: Latihan fokus mata. Jangan baca mengikut sangkaan, baca ikut tulisan.',
            checklist: [
                'Mata bergerak laju mencari "Tiang Alif".',
                'Rentak bacaan mesti jelas beza panjang dan pendeknya.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['تَابَتَ (TAABATA)', 'ثَبَاتَ (TSABAATA)', 'ثَابِتَا (TSAABITAA)'], focus: 'Bezakan posisi Alif.' },
                { label: 'Baris 1', cells: ['زَابِدَ (ZAABIDA)', 'زَبَادَا (ZABAADAA)', 'زَابِدًا (ZAABIDAN)'], focus: 'Za panjang vs Ba/Dal panjang.' },
                { label: 'Baris 2', cells: ['تَاوَبَ (TAAWABA)', 'تَوَابًا (TAWAABAA)', 'تَاوِبَا (TAAWIBAA)'], focus: 'Ta panjang vs Wa panjang.' },
                { label: 'Baris 3', cells: ['جَاهَدَ (JAAHADA)', 'فَاعَلَ (FAA\'ALA)', 'ثَاقَلَ (TSAAQALA)'], focus: 'Pola: Panjang-Pendek-Pendek.' },
                { label: 'Baris 4', cells: ['كَاتَبَ (KAATABA)', 'نَاسَأَ (NAASA-A)', 'طَالَبَ (THAALABA)'], focus: 'Kaf/Nun/Tho panjang.' },
                { label: 'Baris 5', cells: ['غَازَوَ (GHAAZAWA)', 'عَالَمَ (AALAMA)', 'حَاسَدَ (HAASADA)'], focus: 'Latihan huruf \'Ain/Ghoin/Ha.' },
                { label: 'Baris 6', cells: ['نَاعَمَ (NAA\'AMA)', 'لَاهَبَ (LAAHABA)', 'ضَالَلَ (DHAALALA)'], focus: 'Huruf tebal panjang.' },
                { label: 'Baris 7', cells: ['نَانَنَا (NANANA)', 'نَنَانَا (NANAANAA)', 'نَا (NAA)'], focus: 'Ujian NUN (Titik satu atas).' }
            ]
        },
        {
            title: 'MUKA SURAT 4: LATIHAN POLA AYAT',
            subtitle: 'Fokus Utama: Membaca perkataan 4 huruf dengan variasi Mad.',
            rows: [
                { label: 'Baris 1', cells: ['قَاتَلَ (QAATALA)', 'قَتَلَتَا (QATALATAA)', 'فَقَتَلَا (FAQATALAA)'], focus: 'Qa panjang vs Ta/La panjang.' },
                { label: 'Baris 2', cells: ['هَالِكَ (HAALIKA)', 'هَلَكَتَا (HALAKATAA)', 'فَهَلَكَ (FAHALAKA)'], focus: 'Ha Simpul.' },
                { label: 'Baris 3', cells: ['ضَارَبَ (DHAARABA)', 'ضَرَبَتَا (DHARABATAA)', 'فَضَرَبَا (FADHARABAA)'], focus: 'Dho tebal.' },
                { label: 'Baris 4', cells: ['هَادَمَ (HAADAMA)', 'هَدَمَتَا (HADAMATAA)', 'فَهَدَمَا (FAHADAMAA)'], focus: 'Ha dada.' },
                { label: 'Baris 5', cells: ['صَارَعَ (SHAARA\'A)', 'صَرَعَتَا (SHARA\'ATAA)', 'فَصَرَعَا (FASHARA\'A)'], focus: 'Sod tebal.' },
                { label: 'Baris 6', cells: ['هَاجَمَ (HAAJAMA)', 'هَجَمَتَا (HAJAMATAA)', 'فَهَجَمَا (FAHAJAMAA)'], focus: 'Jim panjang.' },
                { label: 'Baris 7', cells: ['قَاوَمَ (QAAWAMA)', 'قَوَمَتَا (QAWAMATAA)', 'فَقَوَمَا (FAQAWAMAA)'], focus: 'Qof panjang.' },
                { label: 'Baris 8', cells: ['رَاذَلَ (RAADZALA)', 'رَذَلَتَا (RADZALATAA)', 'فَرَذَلَا (FARADZALAA)'], focus: 'Ro panjang.' }
            ]
        },
        {
            title: 'MUKA SURAT 5: PERINGATAN PENTING (BILA ADA ALIF)',
            subtitle: 'Fokus: Teks Merah "BILA ADA ALIF PANJANG, BILA TIADA ALIF PENDEK".',
            rows: [
                { label: 'Baris 1', cells: ['مَفَازَهَا', 'لَنَظَرَا', 'وَلَالَنَا'], focus: '(MAFAAZAHAA) - (LANAZHARAA).' },
                { label: 'Baris 2', cells: ['أَقَامَهَا', 'تَنَازَعَا', 'طَعَامَهَا'], focus: 'Hamzah/Qof/Ta/Ain/To panjang.' },
                { label: 'Baris 3', cells: ['فَهَلَكَ', 'لَبَعَثَ', 'وَهَمَشَ'], focus: 'Tiada Mad (Semua pendek).' },
                { label: 'Baris 4', cells: ['فَقَتَلَا', 'مَلَكَتَا', 'فَصَحَهَا'], focus: 'Mad di hujung (Dual).' },
                { label: 'Baris 5', cells: ['لَأَخَذَ', 'ظَهَرَهَا', 'صَوَابَهَا'], focus: 'Mad di tengah & akhir.' },
                { label: 'Baris 6', cells: ['لَحَرَامَ', 'لَمَعَاشَ', 'فَتَمَارَ'], focus: 'Mad di tengah.' },
                { label: 'Baris 7', cells: ['مَاسَكَنَ', 'لَاغَضَبَ', 'لَأَسَعَدَ'], focus: 'Mim/LamAlif panjang.' }
            ]
        },
        {
            title: 'MUKA SURAT 6: MAD PADA HAMZAH & HA',
            subtitle: 'Fokus: Hamzah berdiri (A) dan Ha Simpul (HAA).',
            checklist: [
                'Hamzah di atas Alif atau baris tegak dibaca panjang 2 harakat.',
                'Ha simpul dibaca panjang jika ada Alif.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['هَا = هَا', 'ءَ = ءَا = آ', '-'], focus: 'HAA & AA (Mad Badal).' },
                { label: 'Baris 1', cells: ['ءادَمَ (AADAMA)', 'ءامَنَ (AAMANA)', 'وَهَذَا (WAHAADZAA)', 'بَنَهَا (BANA-HAA)'], focus: '' },
                { label: 'Baris 2', cells: ['وَذَاكَ', 'نَاعَمَ', 'غَسَالَ', 'ءايَتَ (AAYATA)'], focus: '' },
                { label: 'Baris 3', cells: ['نَابَتَ', 'جَاوَزَ', 'كَسَبَا', 'فَارَضَ'], focus: '' },
                { label: 'Baris 4', cells: ['جَامَعَ', 'خَاطَبَ', 'طَحَهَا', 'بَنَهَا'], focus: '' },
                { label: 'Baris 5', cells: ['وَذَاتَ', 'مَقَامَ', 'أَثَابَ', 'مَئَابَ'], focus: '' },
                { label: 'Baris 6', cells: ['يَدَانَا', 'شَهَادَ', 'وَكَانَا', 'تَلَهَا'], focus: '' },
                { label: 'Baris 7', cells: ['سَمَوَاتَ', 'وَخَطَأً', 'صَلَاتَهَا', '-'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 7: ALIF MAQSURAH (ALIF BENGKOK)',
            subtitle: 'Fokus: Huruf Ya tanpa titik di hujung kalimah, didahului baris atas = BACA PANJANG (A).',
            diagramFlow: '[ 3 ] <--- [ 2 ] <--- [ 1 ]',
            rows: [
                { label: 'TAJUK', cells: ['سَجَى (SAJAA)', '-', '-'], focus: 'Ya tanpa titik = Alif.' },
                { label: 'Baris 1', cells: ['وَءاتَى (WA-AATAA)', 'فَتَاوَى (FATAAWAA)', 'يَتَامَى (YATAAMAA)', 'فَنَادَى (FANAADAA)'], focus: '' },
                { label: 'Baris 2', cells: ['فَهَدَى', 'وَعَصَى', 'لَعَلَى', 'فَقَضَى'], focus: '' },
                { label: 'Baris 3', cells: ['تَمَارَى', 'خَطَايَا', 'فَتَاوَى', 'دَحَهَا'], focus: '' },
                { label: 'Baris 4', cells: ['خَالَطَ', 'صَوَابَ', 'فَطَاوَلَ', 'تَبَارَكَ'], focus: '' },
                { label: 'Baris 5', cells: ['مَكَانَ', 'وَخَافَ', 'غَمَامَ', 'شَهَادَ'], focus: '' },
                { label: 'Baris 6', cells: ['مَالَهَا', 'تَعَالَى', 'عَصَايَ', 'نَصَرَى'], focus: '' },
                { label: 'Baris 7', cells: ['أَتَهَا', 'بَنَهَا', 'تَلَهَا', '-'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 8: LATIHAN AYAT (LAM-ALIF)',
            subtitle: 'Fokus: Sambungan Lam-Alif (لا) dan bacaan panjang.',
            rows: [
                { label: 'TAJUK', cells: ['لَمَا = لَمَا', 'BILA ADA ALIF MESTI PANJANG', '-'], focus: '' },
                { label: 'Baris 1', cells: ['وَمَانَهَا', 'وَلَمَكَ', 'فَجَزَهَا'], focus: '(WA-MAA-NAHAA).' },
                { label: 'Baris 2', cells: ['ضَرَبَتَا', 'فَحَفَظَ', 'جَمَعَمَا'], focus: 'Latihan tanpa mad banyak.' },
                { label: 'Baris 3', cells: ['سَقَى لَهَا', 'وَلَمَقَ', 'فَأَفَلَا'], focus: 'Alif Maqsurah + LamAlif.' },
                { label: 'Baris 4', cells: ['فَرَاشَهَا', 'وَلَمَطَ', 'لَطَلَعَا'], focus: 'Mad di tengah & akhir.' },
                { label: 'Baris 5', cells: ['تَنَازَعَا', 'فَخَفَفَ', 'نَذَرَكَا'], focus: 'Ta-Naa-Za-\'Aa.' },
                { label: 'Baris 6', cells: ['وَمَابَنَى', 'وَلَمَحَ', 'ذَنَبَهَا'], focus: 'Wa-Maa-Banaa.' },
                { label: 'Baris 7', cells: ['وَثَاقَهَا', 'وَشَفَقَ', 'نَبَذَهَا'], focus: 'Watsaa-qahaa.' }
            ]
        },
        {
            title: 'MUKA SURAT 9: LATIHAN KELANCARAN',
            subtitle: 'Fokus: Gabungan pelbagai huruf dan hukum Mad Asli.',
            rows: [
                { label: 'Baris 1', cells: ['يَدَهَا', 'شَهَادَتَا', 'فَتَعَالَى'], focus: 'Yada-haa / Fata-\'aalaa.' },
                { label: 'Baris 2', cells: ['لَمَاطَا', 'لَفَارِغَا', 'وَمَتَاعَا'], focus: '(Wamataa-\'aa).' },
                { label: 'Baris 3', cells: ['أَثَاثَا', 'لَأُذُنَ', 'فَمَقَامَا'], focus: 'Hamzah & Mad.' },
                { label: 'Baris 4', cells: ['لَكَانَا', 'حَيَاتَهَا', 'لَأَعَاذَا'], focus: 'Hayaa-tahaa.' },
                { label: 'Baris 5', cells: ['لَمَاقَا', 'وَءَاثَرَا', 'فَصَوَابَا'], focus: 'Wa-Aatsaraa.' },
                { label: 'Baris 6', cells: ['فَنَادَى', 'طَهَارَهَا', 'وَكَظَامَا'], focus: 'Fanaadaa (Alif Bengkok).' },
                { label: 'Baris 7', cells: ['وَكَانَا', 'زَكَتَهَا', 'لِيَدَاهَا'], focus: 'Li-Yadaahaa.' },
                { label: 'Baris 8', cells: ['لَخَافَا', 'لَأَشَرَ', 'لَضَلَالَا'], focus: 'La-Dhol-laa-laa.' }
            ]
        },
        {
            title: 'MUKA SURAT 10: MAD & HURUF TEBAL',
            subtitle: 'Fokus: Kekalkan sifat tebal huruf walaupun dibaca panjang.',
            checklist: [
                '**Syathothoo:** Tho panjang bunyi tebal.',
                '**La-Amarodho:** Dhod tidak menjadi Dal. Pipi kembung.'
            ],
            rows: [
                { label: 'Baris 1', cells: ['لَامَعَكَ', 'عَجَبَا', 'وَصَعَدَا'], focus: 'Laa-Ma\'aka.' },
                { label: 'Baris 2', cells: ['لَأَصَبَرَ', 'شَطَطَا', 'لَغَسَلَا'], focus: '**Syathothoo** (Tho Tebal).' },
                { label: 'Baris 3', cells: ['مَا فَضَلَا', 'حَرَسَا', 'فَغَدَقَا'], focus: 'Maa-Fadho-laa.' },
                { label: 'Baris 4', cells: ['مَاحَسَنَ', 'قَعَدَا', 'وَأَمَدَا'], focus: 'Maa-Hasana.' },
                { label: 'Baris 5', cells: ['لَأَرَهَقَ', 'رَصَدَا', 'فَهَرَبَا'], focus: 'La-Aro-Haqa (Ro Tebal).' },
                { label: 'Baris 6', cells: ['مَا عَظَمَ', 'شَهَدَا', 'وَثَقَلَا'], focus: 'Watsa-qolaa.' },
                { label: 'Baris 7', cells: ['لَأَمَرَضَ', 'رَهَقَا', 'فَهَجَرَ'], focus: '**La-Amarodho** (Dhod Tebal).' },
                { label: 'Baris 8', cells: ['مَا غَدَقَ', 'خَطَبَ', 'فَسَجَدَا'], focus: 'Fasajadaa.' }
            ]
        }
    ]
};
