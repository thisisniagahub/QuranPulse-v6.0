import { IqraVolume } from './types';

export const IQRA_5: IqraVolume = {
    id: 'iqra-5',
    title: 'IQRA 5',
    pages: [
        {
            title: 'MUKA SURAT 1: MUKA DEPAN',
            subtitle: 'Fokus: Masuk ke fasa ayat-ayat yang lebih panjang dan struktur ayat sebenar Al-Quran.',
            rows: []
        },
        {
            title: 'MUKA SURAT 2: MAD ASLI WAU (BARIS DEPAN JUMPA WAU)',
            subtitle: 'Fokus Utama: Baris Depan (Dammah) diikuti Wau Mati = Baca Panjang 2 Harakat (Bunyi \'UU\').',
            diagramFlow: '[ 3 ] <--- [ 2 ] <--- [ 1 ]',
            checklist: [
                'Muncungkan bibir sepenuhnya untuk bunyi \'UU\'.',
                'Pastikan panjang 2 harakat, jangan lebih.',
                'Bezakan \'Muqiimiina\' (I panjang) dan \'Yuqiimuuna\' (U panjang).'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بُو (BUU)', 'HURUF WAU', '-'], focus: 'Wau Mati = Pemanjang Vokal U.' },
                { label: 'Baris 1', cells: ['تَابَ (TAABA)', 'يَتُOBُ (YATUUBU)', 'قَالَ (QAALA)', 'يَقُولُ (YAQUULU)'], focus: 'A vs U.' },
                { label: 'Baris 2', cells: ['عَادَ (\'AADA)', 'يَعُODُ (YA\'UUDU)', 'كَانَ (KAANA)', 'يَكُONُ (YAKUUNU)'], focus: 'Perubahan bunyi.' },
                { label: 'Baris 3', cells: ['يُرِيدُونَ (YURIIDUUNA)', 'يُقِيمُونَ (YUQIIMUUNA)', 'مُقِيمِينَ (MUQIIMIINA)', ''], focus: 'Mad Ya vs Mad Wau.' },
                { label: 'Baris 4', cells: ['يَتْلُONُونَ (YATLUMUUNA)', 'يَتَخَAFATUUNA (YATAKHAAFATUUNA)', 'بِنَصْرِهِ (BINASHRIHI)', ''], focus: 'Ayat panjang.' },
                { label: 'Baris 5', cells: ['يُفِيضُونَ (YUFII-DHUUNA)', 'يُغِيثُونَ (YUGHII-TSUUNA)', 'نِعَاجِهِ (NI-\'AA-JIHI)', ''], focus: 'Dho/Tsa tebal.' },
                { label: 'Baris 6', cells: ['سَامِدُونَ (SAAMIDUUNA)', 'رَاغِبُونَ (RAAGHIBUUNA)', 'يَرِثُنِي (YARITSUNII)', ''], focus: 'Mad Wau di hujung.' },
                { label: 'Baris 7', cells: ['هُنَالِكَ (HUNAALIKA)', 'فَعَقَرُوهَا (FA-\'AQA-RUUHAA)', 'تَلُOMُONِي (TALUUMUUNII)', ''], focus: '3 Mad dalam 1 perkataan.' }
            ]
        },
        {
            title: 'MUKA SURAT 3: ALIF ZAIDAH (ALIF YANG TIDAK DIBACA)',
            subtitle: 'Fokus Utama: Alif dengan tanda bulat kecil (Sifir) di hujung perkataan. \"Ada pada tulisan, TIADA pada bacaan\".',
            checklist: [
                'Jangan terhenti atau memanjangkan bacaan lebih dari 2 harakat disebabkan Alif Zaidah.',
                'Baca \'Qooluu\' (2 harakat), bukan \'Qooluu-a\'.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['قَالُواْ (QOOLUU)', 'أ (BULAT KECIL)', '-'], focus: 'Alif hujung abaikan.' },
                { label: 'Baris 1', cells: ['قَالُواْ بَلَى', 'فَإِذَا رَكِبُواْ', 'لَا تَخُونُواْ'], focus: 'Qooluu / Rakibuu / Takhuunuu.' },
                { label: 'Baris 2', cells: ['كَانُواْ لَنَا عَابِدِينَ', 'ءَامَنُواْ وَعَمِلُواْ', ''], focus: 'Latihan ayat penuh.' },
                { label: 'Baris 3', cells: ['صَابِرُواْ وَرَابِطُواْ', 'هَاجَرُواْ وَجَاهَدُواْ', ''], focus: 'Ramai orang (Jamak).' },
                { label: 'Baris 4', cells: ['وَجَدُواْ مَا عَمِلُواْ', 'صَدَقُواْ مَا عَAHADUU', ''], focus: "Wajaduu / 'Amiluu." },
                { label: 'Baris 5', cells: ['فَيَكِيدُواْ لَكَ', 'وَكَانُواْ لَنَا خَASHII\'IINA', ''], focus: 'Mad Ya & Mad Wau.' },
                { label: 'Baris 6', cells: ['فَلَا تَلُOMُونِي وَلُOMُواْ', 'قَالَ مَا نَهَاكُمَا', ''], focus: 'Taluumuunii Waluumuu.' }
            ]
        },
        {
            title: 'MUKA SURAT 4: HA DHOMIR (HU/HI PANJANG)',
            subtitle: 'Fokus Utama: Huruf Ha Simpul dengan tanda Dammah Terbalik (seperti nombor 6) atau Kasrah Tegak. Baca Panjang 2 Harakat.',
            rows: [
                { label: 'TAJUK', cells: ['هُو = ...ـهُۥ = ...ـهُ', 'HUU', '-'], focus: 'Simbol 6 kecil = HUU.' },
                { label: 'Baris 1', cells: ['مَعَهُۥ (MA-\'AHUU)', 'يَدَهُۥ (YADAHUU)', 'وَلَهُۥ (WALAHUU)', 'يَرَهُۥ (YARAHUU)'], focus: '' },
                { label: 'Baris 2', cells: ['إِذَا سَجَى', 'فِيمَا كَانُواْ', 'مَوَازِينُهُۥ', ''], focus: 'Mawaaziinuhuu (Huu panjang).' },
                { label: 'Baris 3', cells: ['يَنبَغِي', 'وَعَجِبُواْ', 'حَافِظِينَ', ''], focus: 'Selingan Mad biasa.' },
                { label: 'Baris 4', cells: ['وَنُسُكِي', 'مُتَقَبِلِينَ', 'فِي جِيدِهَا', ''], focus: 'Mad Ya.' },
                { label: 'Baris 5', cells: ['لَقَضَى', 'تَظَاهَرُونَ', 'جُنُودُهُۥ', ''], focus: 'Junuuduhuu.' },
                { label: 'Baris 6', cells: ['أُوتِيتُهُۥ', 'وَأُOTُواْ بِهِۦ', 'فَمِثْلُهُۥ', ''], focus: 'Uutiituhuu / Bihii (Hi panjang).' },
                { label: 'Baris 7', cells: ['وَلَا يُوثِقُ', 'وَثَاقَهُۥ', 'فَسَلَكَهُۥ', ''], focus: 'Watsaaqahuu / Fasalakahuu.' }
            ]
        },
        {
            title: 'MUKA SURAT 5: LATIHAN BACAAN (PUTUS-PUTUS)',
            subtitle: 'Fokus: Membaca satu per satu perkataan dengan teliti.',
            rows: [
                { label: 'Baris 1', cells: ['وَإِذَا سَأَلَكَ عِبَادِي', 'لِيُOSُFَ وَأَخُOHُ'], focus: 'Mad Wau (Akhuuhu).' },
                { label: 'Baris 2', cells: ['نَسِيَا حُOTَهُمَا', 'وَخَرَقُواْ لَهُۥ بَنِينَ'], focus: 'Tanda 6 kecil pada Ha.' },
                { label: 'Baris 3', cells: ['أَرُونِي مَاذَا خَلَقُواْ', 'وَكَفَى بِنَا حَASIBIINA'], focus: 'Mad Ya & Alif.' },
                { label: 'Baris 4', cells: ['هَذِهِۦ بِضَACATUNAA', 'وَثُلُثَ وَرُبُعَ'], focus: 'Hadzihii (Hii panjang).' },
                { label: 'Baris 5', cells: ['قَالُواْ تَقَاسَمُواْ', 'بِمَا كَسَبُواْ أَمَاتَرَكَ'], focus: 'Bacaan panjang 2 harakat.' },
                { label: 'Baris 6', cells: ['قَالَ مَا نَهَاكُمَا', 'لِبَASUHUMAA LIYURIYAHUMAA'], focus: 'Libaasuhumaa.' },
                { label: 'Baris 7', cells: ['صَلَاتَكَ', 'عَلَى شَاكِلَتِهِۦ'], focus: 'Syaakilatihii (Panjang).' }
            ]
        },
        {
            title: 'MUKA SURAT 6: LATIHAN KELANCARAN AYAT',
            subtitle: 'Fokus Utama: Menggabungkan semua hukum Mad (Alif, Wau, Ya, Ha Dhomir).',
            rows: [
                { label: 'Baris 1', cells: ['صَدَقُواْ مَا عَAHADUU', 'حَدِيثُ مُOSَى'], focus: 'Haadiitsu Muusaa.' },
                { label: 'Baris 2', cells: ['كَفَرُواْ بِئَايَاتِي', 'كَانَ عِقَابِ'], focus: "Mad Badal ('Aa-yaa-tii)." },
                { label: 'Baris 3', cells: ['بِمَا خَلَقَ وَلَعَلَا', 'قَالَ لَا تَخَافَا'], focus: 'Laa Takhaafaa.' },
                { label: 'Baris 4', cells: ['فَمَا يَكُونُ لَكَ', 'مَتَاعَنَا فَأَكَلَهُۥ'], focus: 'Fa-akalahuu.' },
                { label: 'Baris 5', cells: ['وَهُوَ يَعِظُهُۥ', 'وَهُمْ وَقُORُونَ'], focus: "Ya'izhuhuu (Panjang)." },
                { label: 'Baris 6', cells: ['فِيهَا فَوَاكِهُ', 'هَارُونَ وَمُOSَى'], focus: 'Fawaakihu (Pendek).' },
                { label: 'Baris 7', cells: ['لَهَا مَالِكُونَ', 'وَلَعَنُواْ بِمَا قَالُواْ'], focus: "La'anuu / Qaaluu." }
            ]
        },
        {
            title: 'MUKA SURAT 7: AYAT-AYAT PILIHAN',
            subtitle: 'Fokus Utama: Kelancaran membaca ayat yang menyerupai ayat Al-Quran sebenar.',
            rows: [
                { label: 'Baris 1', cells: ['فِي صُحُفِ مُOSَى', 'قَالَ لَا غَالِبَ'], focus: 'Shu-hu-fi (Semua pendek).' },
                { label: 'Baris 2', cells: ['هَاهُنَا قَاعِدُونَ', 'وَلَعَنُواْ بِمَا قَالُواْ'], focus: "Qaa-'i-duu-na." },
                { label: 'Baris 3', cells: ['وَكَفَى bِنَا حَASIBIINA', 'وَلِيَ فِيهَا مَشَارِبُ'], focus: 'Masyaa-ribu.' },
                { label: 'Baris 4', cells: ['كَفَرُواْ وَسَبَقُواْ', 'يُرِيدُ وَخِيَانَتَكَ'], focus: 'Khiyaa-nataka.' },
                { label: 'Baris 5', cells: ['صَدَقُواْ مَا عَAHADUU', 'وَكَانُواْ لَنَا خَASHII\'IINA'], focus: 'Mad penuh.' },
                { label: 'Baris 6', cells: ['جَاهَدُواْ وَصَبَرُواْ', 'أَحَدَنَا مَكَانَهُۥ'], focus: 'Makaa-nahuu.' },
                { label: 'Baris 7', cells: ['وَنَأَى بِجَانِبِهِۦ', 'كَانُواْ يُسَارِعُونَ'], focus: 'Bi-jaa-ni-bi-hii.' },
                { label: 'Baris 8', cells: ['مَا كَادَ يَزِيغُ', 'وَمَا كَانُواْ سَابِقِينَ'], focus: 'Yaziighu / Saabiqiina.' }
            ]
        },
        {
            title: 'MUKA SURAT 8: LATIHAN VOKAL BERGANDA',
            subtitle: 'Fokus Utama: Latihan fokus mata pada titik dan bentuk Mad yang pelbagai.',
            rows: [
                { label: 'Baris 1', cells: ['تُرَاوِدُ فَتَاهَا', 'كَانُواْ فِيهَا فَاكِهِينَ'], focus: 'Faakihiina.' },
                { label: 'Baris 2', cells: ['وَحِينَ تَضَعُونَ', 'وَيَقُولُونَ مَتَى'], focus: "Tadha-'uu-na." },
                { label: 'Baris 3', cells: ['هَدَانَا سُبُلَنَا', 'تَابَ وَءَامَنَ وَعَمِلَ'], focus: 'Aa-mana (Mad Badal).' },
                { label: 'Baris 4', cells: ['فِيهَا مَعَايِشُ', 'بِئَايَاتِنَا يُوقِنُونَ'], focus: 'Yuu-qi-nuu-na.' },
                { label: 'Baris 5', cells: ['صَابِرُواْ وَرَابِطُواْ', 'وَجَاهِدُواْ فِي سَبِيلِ ٱللَّهِ'], focus: 'Sabiili-llahi.' },
                { label: 'Baris 6', cells: ['وَأُوذُواْ فِي سَبِيلِي', 'وَكُتُبِهِۦ وَرُسُلِهِۦ'], focus: 'Kutubihii / Rusulihii.' },
                { label: 'Baris 7', cells: ['فَقَعُواْ لَهُۥ سَاجِدِينَ', 'وَطُORِ سِينِينَ'], focus: 'Thuu-ri Sii-nii-na.' },
                { label: 'Baris 8', cells: ['لَسَAHIRĀNI YURĪDĀNI', 'وَخَرَقُواْ لَهُۥ وَبَنِينَ'], focus: 'Dua orang (Ani).' }
            ]
        },
        {
            title: 'MUKA SURAT 9: PENGENALAN AYAT KOMPLEKS',
            subtitle: 'Fokus Utama: Ayat dengan kombinasi huruf tebal, nipis, and mad yang berturut-turut.',
            rows: [
                { label: 'Baris 1', cells: ['وَيَذَرُكَ وَءَالِهَتَكَ', 'وَجَعَلَ fِيهَا رَوَاسِيَ'], focus: 'Aa-li-ha-taka.' },
                { label: 'Baris 2', cells: ['هَارُOTَ وَمَارُOTَ', 'فَعَلَ هَذَا بِئَايَاتِنَا'], focus: 'Haa-ruu-ta.' },
                { label: 'Baris 3', cells: ['قَالُواْ تَقَاسَمُواْ', 'فَتَعَاطَى فَعَقَرَ'], focus: "Ta-'aa-thoo (Tebal)." },
                { label: 'Baris 4', cells: ['كَانَ قَمِيصَهُۥ', 'كَانُواْ fِيهَا فَاكِهِينَ'], focus: 'Qamii-shahuu.' },
                { label: 'Baris 5', cells: ['وَإِذَا سَأَلَكَ عِبَادِي', 'وَكَفَى bِنَا حَASIBIINA'], focus: '\'Ibaa-dii.' },
                { label: 'Baris 6', cells: ['فَكَانَ عَاقِبَتَهُمَا', 'وَصَاحِبَتِهِۦ وَبَنِيهِ'], focus: 'Hii-hi (Panjang).' },
                { label: 'Baris 7', cells: ['فَلَا تَلُOMُونِي وَلُOMُواْ', 'يَخَافُونَ عَذَابَهُۥ'], focus: 'Waluumuu (Alif senyap).' }
            ]
        },
        {
            title: 'MUKA SURAT 10: UJIAN BEZA PANJANG PENDEK (PENTING)',
            subtitle: 'Fokus: Teks Merah: \"BEZAKAN ANTARA BARIS ATAS, BAWAH DAN DEPAN. BEZAKAN ANTARA PANJANG DAN PENDEK\". Ini adalah halaman penentu.',
            checklist: [
                'Bacaan lancar tanpa tersekat-sekat.',
                'Tiada kesalahan panjang/pendek (ini kesalahan fatal dalam Al-Quran).',
                'Kenal semua jenis Mad (Alif, Wau, Ya, Ha Dhomir).'
            ],
            rows: [
                { label: 'Baris 1', cells: ['فَإِذَا رَكِبُواْ', 'أُOTِيَ كِتَابَهُۥ bِيَمِينِهِۦ fَيَقُولُ'], focus: 'Ayat panjang tanpa henti.' },
                { label: 'Baris 2', cells: ['إِلَAHَهُۥ هَوَاهُ', 'وَلَا يَكَادُ يُسِيغُهُۥ'], focus: 'Ilaa-hahuu / Yusii-ghuhuu.' },
                { label: 'Baris 3', cells: ['مَالُهُۥ وَوَلَدُهُۥ', 'وَفُOMِهَا وَعَدَسِهَا وَبَصَلِهَا'], focus: 'Wa-la-du-huu.' },
                { label: 'Baris 4', cells: ['كَفَرُواْ وَسَبَقُواْ', 'فَذُOQُواْ عَذَابِي وَنُذُرِ'], focus: 'Nudzuri (Pendek).' },
                { label: 'Baris 5', cells: ['فَكَانَ عَاقِبَتَهُمَا', 'fِيهَا مَنَافِعُ وَمَشَارِبُ'], focus: 'Ma-syaa-ribu.' },
                { label: 'Baris 6', cells: ['وَبَارَكَ fِيهَا', 'خَAFَ مَقَامِي وَخَAFَ وَعِيدِ'], focus: "Wa-'ii-di." },
                { label: 'Baris 7', cells: ['وَهَAMANA WAJUNUUDUHUMAA', 'كَانُواْ خَATHI\'IINA'], focus: 'Khaa-thi-ii-na.' }
            ]
        },
        {
            title: 'MUKA SURAT 11: UJIAN AKHIR IQRA 5',
            subtitle: 'Fokus Utama: Kelayakan ke Iqra 6. Bacaan mestilah bertajwid asas (Mad Asli tepat).',
            rows: [
                { label: 'Baris 1', cells: ['بِمَا تُفِيضُونَ fِيهِ', 'لَا تَقُولُواْ رَاعِنَا وَقُولُواْ'], focus: "Raa-'i-naa." },
                { label: 'Baris 2', cells: ['وَلَا يَكَادُ يُبِينُ', 'فَقَالَ lِصَاحِبِهِۦ وَهُوَ يُحَاوِرُهُۥ'], focus: 'Yuhaa-wiruhuu.' },
                { label: 'Baris 3', cells: ['فَغَلَبُواْ هُنَالِكَ', 'تَرَكَ ءَ الَ مُOSَى وَءَالَ هَارُونَ'], focus: 'Aa-la Muusaa.' },
                { label: 'Baris 4', cells: ['كَلِمَتَنَا لِعِبَادِنَا', 'وَرُSُLِهِۦ وَكُTُBِهِۦ مَقْتًا'], focus: 'Maq-tan (Qalqalah).' },
                { label: 'Baris 5', cells: ['كَانُواْ لَنَا عَابِدِينَ', 'يُقَاتِلُونَ fِي سَبِيلِ ٱللَّهِ'], focus: 'Yuqaa-tiluuna.' },
                { label: 'Baris 6', cells: ['لَهُۥ وَbِرَازِقِينَ', 'أَلْقُواْ fِيهَا سَمِعُواْ لَهَا'], focus: "Sami-'uu." }
            ]
        }
    ]
};
