import { IqraVolume } from './types';

export const IQRA_4: IqraVolume = {
    id: 'iqra-4',
    title: 'IQRA 4',
    pages: [
        {
            title: 'MUKA SURAT 1: MUKA DEPAN',
            subtitle: 'Fokus: Persediaan minda untuk bunyi vokal baru selain \'A\'.',
            rows: []
        },
        {
            title: 'MUKA SURAT 2: BARIS BAWAH (KASRAH)',
            subtitle: 'Fokus Utama: Baris di bawah huruf berbunyi \'I\'.',
            diagramFlow: '[ 3 ] <--- [ 2 ] <--- [ 1 ]',
            checklist: [
                'Bunyi \'I\' jelas (TI, DI, NI, MI).',
                'Tidak tertukar dengan bunyi \'E\' (Te, De, Ne).',
                'Bacaan pendek 1 harakat.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بِ (BI)', 'HURUF BARIS BAWAH = I', '-'], focus: 'Bunyi BI (Pendek).' },
                { label: 'Baris 1', cells: ['تَ تِ (TA TI)', 'دَ دِ (DA DI)', 'نَ نِ (NA NI)', 'مَ مِ (MA MI)'], focus: 'Latihan A vs I.' },
                { label: 'Baris 2', cells: ['بَ بِ (BA BI)', 'بَ بِ (BA BI)', 'تَ تِ (TA TI)', 'تَ تِ (TA TI)'], focus: 'Pengulangan.' },
                { label: 'Baris 3', cells: ['نَبَتَ (NABATA)', 'نَبَتِ (NABATI)', 'نَجَسَ (NAJASA)', 'نَجِسِ (NAJISI)'], focus: 'Ubah baris akhir.' },
                { label: 'Baris 4', cells: ['بَلَدَ (BALADA)', 'بَلَدِ (BALADI)', 'حَسَنَ (HASANA)', 'حَسَنِ (HASANI)'], focus: 'Latihan kelancaran.' },
                { label: 'Baris 5', cells: ['عَمِلَ (AMILA)', 'شَهِدَ (SYAHIDA)', 'فَهِمَ (FAHIMA)', 'لَزِمَ (LAZIMA)'], focus: 'Vokal I di tengah.' },
                { label: 'Baris 6', cells: ['بَ تِ جِ خِ', 'دَ دِ دِ فِ', 'فِ إِ مَ رِ', ''], focus: '(BA TI JI KHO / DA DI DI FI).' }
            ]
        },
        {
            title: 'MUKA SURAT 3: KASRAH & MAD ALIF (GABUNGAN)',
            subtitle: 'Fokus Utama: Menggabungkan baris bawah (pendek) dengan Mad Asli Alif (panjang).',
            rows: [
                { label: 'TAJUK', cells: ['ADA ALIF BACA PANJANG', '-', '-'], focus: 'Peringatan Mad.' },
                { label: 'Baris 1', cells: ['حَاضِرَاتِ (HAADHIRAATI)', 'عَابِدَاتِ (\'AABIDAATI)', 'خَاشِعَاتِ (KHAASYI\'AATI)'], focus: 'Panjang A, Pendek I.' },
                { label: 'Baris 2', cells: ['عَاقِبَهَا (\'AAQIBAHAA)', 'غَاسِقِيَا (GHAASIQIYAA)', 'لَاعِبَتِ (LAA\'IBATI)'], focus: 'Vokal I di tengah.' },
                { label: 'Baris 3', cells: ['رَافِعَاتِ (RAAFI\'AATI)', 'نَازِعَاتِ (NAAZI\'AATI)', 'نَاشِطَاتِ (NAASYITHAATI)'], focus: 'Pola sama.' },
                { label: 'Baris 4', cells: ['صَادِقَاتِ (SHAADIQAATI)', 'وَمَلِئَ (WAMALI-A)', 'فَمَلِئَ (FAMALI-A)'], focus: 'Hamzah akhir.' },
                { label: 'Baris 5', cells: ['زَكَاتِكَ (ZAKAATIKA)', 'فَوَاحِشَ (FAWAAHISYA)', 'لَوَاقِعَ (LAWAAQI\'A)'], focus: 'Huruf tebal/nipis.' },
                { label: 'Baris 6', cells: ['فَهَالِكَ (FAHAALIKA)', 'جَنَاحِكَ (JANAAHIKA)', 'جَارِيَتِ (JAARIYATI)'], focus: 'Jim/Ha.' },
                { label: 'Baris 7', cells: ['كَذَلِكَ (KADZALIKA)', 'مَغَارِبَ (MAGHAARIBA)', 'مَضَاجِعَ (MADHAAJI\'A)'], focus: 'Dzal/Ghoin/Dhod.' },
                { label: 'Baris 8', cells: ['لَهَاتِفَ (LAHAATIFA)', 'مَنَامِهَا (MANAAMIHAA)', 'مَرَاضِعَ (MARAADHI\'A)'], focus: 'Mim/Ha.' }
            ]
        },
        {
            title: 'MUKA SURAT 4: MAD ASLI YA (BARIS BAWAH JUMPA YA)',
            subtitle: 'Fokus Utama: Baris bawah diikuti Ya mati = Baca Panjang 2 Harakat (Bunyi \'II\').',
            checklist: [
                'Bunyi panjang \'II\' mesti jelas 2 harakat.',
                'Jangan terpanjangkan huruf sebelum atau selepasnya.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بِي (BII)', 'بِ ي', '-'], focus: 'Ya Mati = Pemanjang Vokal I.' },
                { label: 'Baris 1', cells: ['جِ جِي (JI JII)', 'نِ نِي (NI NII)', 'لِ لِي (LI LII)', 'فِ فِي (FI FII)'], focus: 'Pendek vs Panjang.' },
                { label: 'Baris 2', cells: ['فَاعِلَ', 'فِيعَالًا', 'قَاتَلَ', 'قِيتَالًا'], focus: "Faa-'ila vs Fii-'aalaa."
                },
                { label: 'Baris 3', cells: ['وَاعَدَ', 'مِيعَادَ', 'يَاسَرَ', 'يَيسَارَ'], focus: "Waa-'ada vs Mii-'aada."
                },
                { label: 'Baris 4', cells: ['بَاصِرَ (BAASHIRA)', 'بَصِيرِ (BASHIIRI)', 'قَادِرَ (QAADIRA)', 'قَدِيرِ (QADIIRI)'], focus: 'Tukar posisi Mad.' },
                { label: 'Baris 5', cells: ['سَامِعَ (SAAMI\'A)', 'سَمِيعِ (SAMII\'I)', 'حَاكِمَ (HAAKIMA)', 'حَكِيمِ (HAKIIMI)'], focus: 'Saa vs Mii.' },
                { label: 'Baris 6', cells: ['بَشِيرَ (BASYIIRA)', 'نَذِيرَ (NADZIIRA)', 'كَبِيرِ (KABIIRI)', 'صَغِيرَ (SHAGHIIRA)'], focus: 'Mad Ya di tengah.' }
            ]
        },
        {
            title: 'MUKA SURAT 5: BEZAKAN PANJANG & PENDEK (MAD ALIF & YA)',
            subtitle: 'Fokus Utama: Gabungan Mad Alif (A) dan Mad Ya (I). Latihan fokus mata.',
            rows: [
                { label: 'Baris 1', cells: ['خَاشِعَ', 'خَاشِعِينَ', 'خَاشِعَاتِ'], focus: 'Khaa-syi-\'a / \'ii-na / \'aa-ti.' },
                { label: 'Baris 2', cells: ['خَاضِعَ', 'خَاضِعِينَ', 'صَغِيرَكَ'], focus: 'Khaa-dhi-\'ii-na / Sha-ghii-raka.' },
                { label: 'Baris 3', cells: ['حَافِظَ', 'حَافِظِينَ', 'حَافِظَاتِ'], focus: 'Haa-fi-zhii-na.' },
                { label: 'Baris 4', cells: ['رَوَاسِيَ', 'لَأَزِيدَ', 'طَالِبِينَ'], focus: 'Rawaa-siya / La-Aziida.' },
                { label: 'Baris 5', cells: ['صَادَقَ', 'صَادِقِينَ', 'صَادِقَاتِ'], focus: 'Shaa-di-qii-na.' },
                { label: 'Baris 6', cells: ['حَاضَرَ', 'حَاضِرِينَ', 'حَاضِرَاتِ'], focus: 'Haa-dhi-rii-na.' },
                { label: 'Baris 7', cells: ['لَاعِبَ', 'لَاعِبِينَ', 'لَاعِبَاتِ'], focus: 'Laa-\'i-bii-na.' }
            ]
        },
        {
            title: 'MUKA SURAT 6: MAD KECIL (BARIS TEGAK KECIL)',
            subtitle: 'Fokus Utama: Tanda kecil menegak (bawah/atas) = Baca Panjang 2 Harakat.',
            rows: [
                { label: 'TAJUK', cells: ['هِي = هِۦ', 'هِي (HII)', '-'], focus: 'Tanda tegak kecil = Ya/Alif.' },
                { label: 'Baris 1', cells: ['لَفِيهِ (LAFIIHI)', 'هَذِهِۦ (HADZIHII)', 'هَلَكَ (HALAKA)', 'نَهَرَ (NAHARA)'], focus: '' },
                { label: 'Baris 2', cells: ['هَمَزَ', 'شَهِدَ', 'وَبِهِۦ (WABIHI)', 'فِكْرَةَ'], focus: '' },
                { label: 'Baris 3', cells: ['هَدَمَ', 'فِيهِمَا', 'أَبِيهِ (ABIIHI)', 'عِبَادِهِۦ (\'IBAADIHI)'], focus: 'Ha simpul panjang.' },
                { label: 'Baris 4', cells: ['لَأَزِيدَ', 'فِي جِيدِهَا', 'بِبَالِغِهِۦ (BIBAALIGHIHI)', ''], focus: 'Mad Ya & Mad Kecil.' },
                { label: 'Baris 5', cells: ['بِغَلِيظِ', 'بِضَنِينِ', 'وَجَسَادِهِۦ (WAJASAADIHI)', ''], focus: '' },
                { label: 'Baris 6', cells: ['وَطَاغِينَ', 'بِيَمِينِكَ', 'مِيثَاقِهِۦ (MIITSAAQIHI)', ''], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 7: LATIHAN LANJUTAN MAD',
            subtitle: 'Fokus Utama: Ayat panjang dengan pelbagai hukum Mad.',
            rows: [
                { label: 'Baris 1', cells: ['طَاهِرِينَ', 'خَالِدِينَ', 'شَهِدِهِۦ'], focus: 'Taa-hi-rii-na / Sya-hi-di-hii.' },
                { label: 'Baris 2', cells: ['ظَالِمِينَ', 'ثَاقِفِينَ', 'حِسَابِهِۦ'], focus: 'Zhoo-li-mii-na / Hi-saa-bi-hii.' },
                { label: 'Baris 3', cells: ['لَهَاتِفَ', 'زَكَاتِكَ', 'ءَاذَانِهِۦ'], focus: 'Aa-dzaa-ni-hii.' },
                { label: 'Baris 4', cells: ['حَافِظِينَ', 'سَالِكِينَ', 'مَوَاضِعِهِۦ'], focus: 'Maa-waa-dhi-\'i-hii.' },
                { label: 'Baris 5', cells: ['طَالِبِينَ', 'ذَاكِرِينَ', 'أَصَابِعِهِۦ'], focus: 'A-shaa-bi-\'i-hii.' },
                { label: 'Baris 6', cells: ['فَهَالِكَ', 'مَوَالِيَ', 'بِزِيَادِهِۦ'], focus: 'Bi-zi-yaa-da-hii.' },
                { label: 'Baris 7', cells: ['قِيَتَمَى', 'مَسَاكِينَ', 'بِنَاصِرِهِۦ'], focus: 'Bi-naa-shi-ri-hii.' }
            ]
        },
        {
            title: 'MUKA SURAT 8: TA MARBUTOH (ة)',
            subtitle: 'Fokus Utama: Huruf Ta bulat (Marbutoh). Jika berbaris, bunyinya "TI/TU/TA".',
            checklist: [
                'Kenal Ta Marbutoh (Bulat titik 2) sebagai huruf TA.',
                'Jangan tertukar dengan Ha (Bulat tanpa titik).'
            ],
            rows: [
                { label: 'TAJUK', cells: ['تِ = ةِ', 'TI', '-'], focus: 'Bentuk bulat bertitik 2 = TA.' },
                { label: 'Baris 1', cells: ['فَاتِحَةِ (FAATIHATI)', 'ءَاخِرَةِ (AAKHIRATI)', 'رَافِقَةِ (RAAFIQATI)', 'غَبَرَةِ (GHABARATI)'], focus: '' },
                { label: 'Baris 2', cells: ['عَمِلَ', 'صَالِحَ', 'ءَالِهَةِ (AALIHATI)', 'حِجَارَةِ (HIJAARATI)'], focus: '' },
                { label: 'Baris 3', cells: ['وَنَادَى', 'خَطَايَ', 'وَأَبِيهِ', 'بَصَرِهِۦ'], focus: 'Beza Ta dan Ha simpul.' },
                { label: 'Baris 4', cells: ['عَقِيمَ', 'مَحِيصَ', 'دَاحِضَةِ (DAAHIDHATI)', 'غَاشِيَةِ (GHAASYIYATI)'], focus: '' },
                { label: 'Baris 5', cells: ['مَضَاجِعَ', 'ءامِنِينَ', 'طَعَامِهِۦ', 'وَلَدِهِۦ'], focus: 'Latihan kelancaran.' },
                { label: 'Baris 6', cells: ['بِصِحَافِ', 'مَرِيضَ', 'زَبَانِيَةِ (ZABAANIYATI)', 'قَتَرَةِ (QATARATI)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 9: LATIHAN VOKAL I (YA MATI)',
            subtitle: 'Fokus Utama: Pemantapan Mad Asli Ya.',
            rows: [
                { label: 'TAJUK', cells: ['فِي = فِ ي', 'نِي = نِ ي', '-'], focus: 'Pemantapan FI & NI.' },
                { label: 'Baris 1', cells: ['سَمِيعِ', 'بَصِيرِ', 'حَامِيَةِ', 'عَصَانِي'], focus: 'Samii-\'i / Bashiiri / \'Ashaanii.' },
                { label: 'Baris 2', cells: ['لَطِيفَ', 'خَبِيرَ', 'حَفِظَتِ', 'بِبَنِي'], focus: 'Lathiifa / Khabiira.' },
                { label: 'Baris 3', cells: ['شَفَاعَةِ', 'صَغِيرِ', 'بَطِيئِهِۦ', 'مَقَامِي'], focus: 'Bathi-i-hi.' },
                { label: 'Baris 4', cells: ['عَزِيزِ', 'حَكِيمِ', 'نِعَاجِهِۦ', 'عَذَابِي'], focus: '\'Azaabii.' },
                { label: 'Baris 5', cells: ['حَلِيمِ', 'قَدِيرِ', 'نَاصِيَةِ', 'كَاذِبَةِ'], focus: 'Haliimi / Qadiiri.' },
                { label: 'Baris 6', cells: ['نَوَاصِي', 'مِيعَادَ', 'تِجَارَةِ', 'فَطَرَنِي'], focus: 'Fatharanii.' },
                { label: 'Baris 7', cells: ['شَاكِرِ', 'شَاطِئِ', 'فِي نَارِهِۦ', 'فِي عَقِبِهِۦ'], focus: "Fii 'Aqibihi."
                }
            ]
        },
        {
            title: 'MUKA SURAT 10: BARIS DEPAN (DAMMAH)',
            subtitle: 'Fokus Utama: Baris seperti Wau kecil di atas = Bunyi \'U\'.',
            checklist: [
                'Bunyi \'U\' jelas (BU, TU, DU).',
                'Jangan bunyi \'O\' (Bo, To, Do).',
                'Muncungkan bibir setiap kali jumpa baris depan.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بُ (BU)', 'HURUF DEPAN = U', '-'], focus: 'Muncung Bibir.' },
                { label: 'Baris 1', cells: ['بَ بِ بُ', 'تَ تِ تُ', 'ثَ ثِ ثُ', 'جَ جِ جُ'], focus: 'Latihan A-I-U.' },
                { label: 'Baris 2', cells: ['دَ دِ دُ', 'دَ دِ دُ', 'دَ دِ دُ', 'دُ دُ دُ'], focus: 'Pengulangan bunyi U.' },
                { label: 'Baris 3', cells: ['فَعَلَ', 'فُعِلَ (FU-\'I-LA)', 'كَتَبَ', 'كُتِبَ (KUTIBA)'], focus: 'Aktif vs Pasif.' },
                { label: 'Baris 4', cells: ['قَرَأَ', 'قُرِئَ (QURI-A)', 'ضَرَبَ', 'ضُرِبَ (DHURIBA)'], focus: 'Latihan U-I-A.' },
                { label: 'Baris 5', cells: ['حَسُنَ (HASUNA)', 'فَهُوَ (FAHUWA)', 'يَمُنُ (YAMUNU)', 'ضُحَمَ (DHUHAMA)'], focus: '' },
                { label: 'Baris 6', cells: ['كَرُمَ (KARUMA)', 'قَرُبَ (QARUBA)', 'لَأُمُ (LA-UMU)', 'لَؤُمَ (LA-UMA)'], focus: '' },
                { label: 'Baris 7', cells: ['رَجُلُ (RAJULU)', 'عَظُمَ (\'AZHUMA)', 'كَثُرَ (KATSURA)', 'رُسُلُ (RUSULU)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 11: LATIHAN DAMMAH (U)',
            subtitle: 'Fokus Utama: Kelancaran membaca perkataan dengan vokal U.',
            rows: [
                { label: 'Baris 1', cells: ['ظُلُمَتُ', 'كَوَاكِبُ', 'وَمُهِينُ'], focus: 'ZHu-lu-ma-tu / Mu-hii-nu.' },
                { label: 'Baris 2', cells: ['بِمِثْلِهِۦ', 'حُمِلَتِ', 'فَخُشِيَتِ'], focus: 'Fa-Khu-syi-yati.' },
                { label: 'Baris 3', cells: ['مَقَالِيدُ', 'سَيُصِيبُ', 'وَيَرِثُهَا'], focus: 'Wa-ya-ri-tsu-haa.' },
                { label: 'Baris 4', cells: ['صَادِقِينَ', 'مَا يَغِيظُ', 'غَاشِيَةِ'], focus: 'Ya-Ghii-zhu.' },
                { label: 'Baris 5', cells: ['بِغُلَمِ', 'وَيُمِيتُ', 'فَصَلِهِۦ'], focus: 'Wa-yu-mii-tu.' },
                { label: 'Baris 6', cells: ['سَرَابِيلَ', 'صَوَامِعُ', 'بِكَلِمَتِهِۦ'], focus: "Sha-waa-mi-'u."
                },
                { label: 'Baris 7', cells: ['سَتَجِدُنِي', 'فَتُثِيرُ', 'فِي صُحُفِ'], focus: 'Fi Shu-hu-fi.' },
                { label: 'Baris 8', cells: ['وَنُزُادَهُمَا', 'طَامِعِينَ', 'شِيعَتِهِۦ'], focus: 'Wa-Zaa-da-hu-maa.' }
            ]
        }
    ]
};
