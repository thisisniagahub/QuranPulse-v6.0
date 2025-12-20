import { IqraVolume } from './types';

export const IQRA_6: IqraVolume = {
    id: 'iqra-6',
    title: 'IQRA 6',
    pages: [
        {
            title: 'MUKA SURAT 1: MUKA DEPAN',
            subtitle: 'Fokus: Persediaan akhir sebelum Khatam Iqra.',
            rows: []
        },
        {
            title: 'MUKA SURAT 2: TANWIN BARIS ATAS (BAN)',
            subtitle: 'Fokus Utama: Dua baris di atas = Bunyi \'AN\' (Ada bunyi \'N\' di hujung).',
            diagramFlow: '[ 3 ] <--- [ 2 ] <--- [ 1 ]',
            checklist: [
                'Bunyi \'N\' jelas di hujung (BAN, TAN, SAN).',
                'Bacaan pendek, jangan panjangkan (bukan BAAAN).',
                'Alif selepas baris dua adalah hiasan (kecuali waqaf), jangan baca panjang.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بًا (BAN)', '= بَ + نْ', 'DIBACA PENDEK'], focus: 'Bunyi N Mati.' },
                { label: 'Baris 1', cells: ['بَ بًا (BA BAN)', 'تَ تًا (TA TAN)', 'ثَ ثًا (TSA TSAN)', 'جَ جًا (JA JAN)'], focus: '' },
                { label: 'Baris 2', cells: ['ذَ ذًا (DZA DZAN)', 'رَ رًا (RA RAN)', 'زَ زًا (ZA ZAN)', 'فَا فًا (FA FAN)'], focus: '' },
                { label: 'Baris 3', cells: ['غَ غًا (GHO GHON)', 'ظَ ظًا (ZHO ZHON)', 'ىَ يًا (YA YAN)', 'لَ لًا (LA LAN)'], focus: '' },
                { label: 'Baris 4', cells: ['أَحَدَ (AHADA)', 'أَحَدًا (AHADAN)', 'عَمِلَ (\'AMILA)', 'عَمَلًا (\'AMALAN)'], focus: '' },
                { label: 'Baris 5', cells: ['حَسَنَ (HASANA)', 'حَسَنًا (HASANAN)', 'صَلَحَ (SHALAHA)', 'صَلِحًا (SHALIHAN)'], focus: '' },
                { label: 'Baris 6', cells: ['نَذِيرًا (NADZIIRAN)', 'بَشِيرًا (BASYIIRAN)', 'جُوعًا (JUU-\'AN)', 'نُوحًا (NUUHAN)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 3: TANWIN BARIS BAWAH (BIN)',
            subtitle: 'Fokus Utama: Dua baris di bawah = Bunyi \'IN\'.',
            rows: [
                { label: 'TAJUK', cells: ['بٍ (BIN)', '= بِ + نْ', '-'], focus: 'Bunyi IN.' },
                { label: 'Baris 1', cells: ['تَ تٍ (TA TIN)', 'تِ تٍ (TI TIN)', 'دَ دٍ (DA DIN)', 'دِ دٍ (DI DIN)'], focus: '' },
                { label: 'Baris 2', cells: ['مَ مًّا (MA MAN)', 'مِ مٍ (MI MIN)', 'وَ وًا (WA WAN)', 'وِ وٍ (WI WIN)'], focus: '' },
                { label: 'Baris 3', cells: ['حَسَدًا (HASADAN)', 'حَسَدٍ (HASADIN)', 'غَاسِقًا (GHAASIQAN)', 'غَاسِقٍ (GHAASIQIN)'], focus: '' },
                { label: 'Baris 4', cells: ['ذَلِكَ (DZALIKA)', 'لَهَبٍ (LAHABIN)', 'وَإِلَى عَادٍ', 'حِجَارَةٍ (HIJAARATIN)'], focus: '' },
                { label: 'Baris 5', cells: ['مَرَضٍ (MARODHIN)', 'كُفُوًا (KUFUWAN)', 'مَفَازًا (MAFAAZAN)', 'لِسَانِي (LISAANII)'], focus: '' },
                { label: 'Baris 6', cells: ['عِيشَةٍ (\'IISYATIN)', 'فِي دِينِ', 'مِيزَانِ (MIZAA-NI)', 'أَلِيمًا (ALIIMAN)'], focus: '' },
                { label: 'Baris 7', cells: ['نَاصِيَةٍ (NAASIYATIN)', 'كَاذِبَةٍ (KAAZIBATIN)', 'خَاطِئَةٍ (KHAATI-\'ATIN)', 'جَحِيمًا (JAHIIMAN)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 4: TANWIN BARIS DEPAN (BUN)',
            subtitle: 'Fokus Utama: Dua baris di depan (bentuk 69 atau 99) = Bunyi \'UN\'.',
            checklist: [
                'Muncung bibir untuk bunyi \'UN\'.',
                'Bezakan \'UN\' (pendek) dan \'UU\' (panjang).'
            ],
            rows: [
                { label: 'TAJUK', cells: ['بٌ (BUN)', '= بُ + نْ', '-'], focus: 'Bunyi UN.' },
                { label: 'Baris 1', cells: ['بَ بِ بُ', 'بًا بٍ بٌ', 'تٌ تٍ تًا', '-'], focus: '' },
                { label: 'Baris 2', cells: ['سَ سِ سُ', 'سًا سٍ سٌ', 'شٌ شٍ شًا', '-'], focus: '' },
                { label: 'Baris 3', cells: ['عَامِلُ (\'AAMILU)', 'عَامِلٌ (\'AAMILUN)', 'سَابِقُ (SAABIQU)', 'سَابِقٌ (SAABIQUN)'], focus: '' },
                { label: 'Baris 4', cells: ['قَادِرُ (QAADIRU)', 'قَادِرٌ (QAADIRUN)', 'نَاصِحُ (NAASIHU)', 'نَاصِحٌ (NAASIHUN)'], focus: '' },
                { label: 'Baris 5', cells: ['رَحِيمًا (RAHIIMAN)', 'رَحِيمٌ (RAHIIMUN)', 'غَفُورًا (GHAFUURAN)', 'غَفُورٌ (GHAFUURUN)'], focus: '' },
                { label: 'Baris 6', cells: ['ذَهَابِ', 'فُرَاتٌ', 'ظُلُمَتِ', 'صَلَوةٌ (SHOLAWATUN)'], focus: '' },
                { label: 'Baris 7', cells: ['عَلَقَةٍ', 'هُمَزَةٍ', 'غِشَوَةٌ', 'شَفَاعَةٌ (SYAFA-\'ATUN)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 5: BEZAKAN PANJANG & PENDEK (TANWIN)',
            subtitle: 'Fokus Utama: Latihan kelancaran membaca ayat dengan pelbagai jenis Tanwin.',
            rows: [
                { label: 'Baris 1', cells: ['حَدِيثُ مُوسَى', 'قِرَدَةً خَاسِئِينَ'], focus: 'Khaa-si-iina.' },
                { label: 'Baris 2', cells: ['تِجَارَةً حَاضِرَةً', 'عَلِيمًا حَكِيمًا'], focus: 'Hakiiman (Mad \'Iwad).' },
                { label: 'Baris 3', cells: ['فَقَالَ لِصَاحِبِهِۦ', 'وَعَذَابٍ عَظِيمٍ'], focus: '\'Azhiimin.' },
                { label: 'Baris 4', cells: ['عَذَابٌ غَلِيظٌ', 'سَمِيعٌ عَلِيمٌ'], focus: "Samii-\'un \'Aliimun." },
                { label: 'Baris 5', cells: ['لَطِيفًا خَبِيرًا', 'غَفُورٌ حَلِيمٌ'], focus: 'Haliimun.' },
                { label: 'Baris 6', cells: ['عَلَى ذَلِكَ لَشَهِيدٌ', 'إِلَى عَذَابٍ غَلِيظٍ'], focus: 'Ghalii-zhin.' },
                { label: 'Baris 7', cells: ['قَانِتَاتٌ حَافِظَاتٌ', 'وَكُتُبِهِۦ وَرُسُلِهِۦ'], focus: 'Rusulihii.' }
            ]
        },
        {
            title: 'MUKA SURAT 6: NUN WIQAYAH (NUN KECIL) & IQLAB (MIM KECIL)',
            subtitle: 'Nota: Muka surat ini sebenarnya memaparkan DAI NUN / DII NUN dan TANWIN BERTEMU HURUF SAKINAH (bukan Iqlab seperti lazim, tetapi bentuk asas bacaan).',
            rows: [
                { label: 'TAJUK', cells: ['دَيْنٌ (DAI-NUN)', 'دِينٌ (DII-NUN)', '-'], focus: 'Bunyi Lin & Mad.' },
                { label: 'Baris 1', cells: ['دِينِ (DIINI)', 'دَيْنِ (DAINI)', 'عَيْنِ (\'AINI)', 'عَيْنَ (\'AINA)'], focus: '' },
                { label: 'Baris 2', cells: ['رِيحُ (RIIHU)', 'رَيْحُ (RAIHU)', 'حِينُ (HIINU)', 'حَيْثُ (HAITSU)'], focus: '' },
                { label: 'Baris 3', cells: ['لِينُ (LIINU)', 'لَيْسَ (LAISA)', 'فِيلُ (FIILU)', 'غَيْرُ (GHAIRU)'], focus: '' },
                { label: 'Baris 4', cells: ['سِيقَ (SIIQA)', 'سَيْفُ (SAIFU)', 'غِيبُ (GHIIBU)', 'غَيْبُ (GHAIBU)'], focus: '' },
                { label: 'Baris 5', cells: ['وَرَأَيْتَ', 'غَيْظُ (GHAIZHU)', 'مَيْمَنَةُ (MAIMANATU)', ''], focus: '' },
                { label: 'Baris 6', cells: ['لَهُۥ شَيْءٌ', 'زَيْتُونِ (ZAITUUNI)', 'عَيْنَاكَ', '-'], focus: '' },
                { label: 'Baris 7', cells: ['جَزَيْنَا', 'بِمُصَيْطِرٍ', 'فَدَيْنَهُۥ', '-'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 7: AYAT-AYAT PENDEK',
            subtitle: 'Fokus Utama: Bacaan perlahan dan putus-putus. Jaga dengung dan panjang pendek.',
            rows: [
                { label: 'Baris 1', cells: ['لِآدَمَ فَسَجَدُواْ', 'لِغُلَامَيْنِ يَتِيمَيْنِ'], focus: 'Yatiimaini.' },
                { label: 'Baris 2', cells: ['فَجَمَعَ كَيْدَهُۥ', 'لَا تَرَى فِيهَا عِوَجًا'], focus: '\'Iwajan.' },
                { label: 'Baris 3', cells: ['بَيْنَهُمَا لَاعِبِينَ', 'يَكِيدُونَ كَيْدًا'], focus: 'Kaidan.' },
                { label: 'Baris 4', cells: ['بِمَا تُفِيضُونَ فِيهِ', 'بِأَيْدِي سَفَرَةٍ'], focus: 'Safaratin.' },
                { label: 'Baris 5', cells: ['لِإِيلَافِ قُرَيْشٍ', 'قَالُواْ يَاوَيْلَنَا'], focus: 'Yaa-Wailanaa.' },
                { label: 'Baris 6', cells: ['يَقُولُ يَالَيْتَنِي', 'طَيْرًا أَبَابِيلَ'], focus: 'Abaabiila.' },
                { label: 'Baris 7', cells: ['فَكَيْفَ كَانَ نَكِيرِ', 'لَا رَيْبَ فِيهِ هُدًى'], focus: 'Hudzn.' }
            ]
        },
        {
            title: 'MUKA SURAT 8: BUNYI LIN WAU (AU) & MAD WAU (UU)',
            subtitle: 'Fokus Utama: Beza bunyi AU (Baris Atas + Wau Mati) dan UU (Baris Depan + Wau Mati).',
            rows: [
                { label: 'TAJUK', cells: ['بُو (BUU)', 'بَوْ (BAU)', '-'], focus: 'UU vs AU.' },
                { label: 'Baris 1', cells: ['تُوبُواْ (TUUBUU)', 'تَوْبَةً (TAUBATAN)', 'يُوسُفَ (YUUSUFA)', 'يَوْمَ (YAUMA)'], focus: '' },
                { label: 'Baris 2', cells: ['جُوعٍ (JUU-\'IN)', 'جَوْفَ (JAUFA)', 'لُوطُ (LUUTHU)', 'لَوْحٌ (LAUHUN)'], focus: '' },
                { label: 'Baris 3', cells: ['صَامَ (SHAAMA)', 'صَوْمَ (SHOUMA)', 'قُولُواْ (QUULUU)', 'قَوْلًا (QOULAN)'], focus: '' },
                { label: 'Baris 4', cells: ['مَاتَ (MAATA)', 'مَوْتَ (MAUTA)', 'لِينُ (LIINU)', 'لَيْلٌ (LAILUN)'], focus: '' },
                { label: 'Baris 5', cells: ['عَادَ (\'AADA)', 'عَوْنَ (\'AUNA)', 'عِينُ (\'IINU)', 'عَيْنَ (\'AINA)'], focus: '' },
                { label: 'Baris 6', cells: ['مَوْعِظَةٌ', 'لِزَوْجِكَ', 'أَوْحَى لَهَا', '-'], focus: '' },
                { label: 'Baris 7', cells: ['مَشَوْا فِيهِ', 'وَلِأَبَوَيْهِ', 'مَوْءُودَةُ', '-'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 9: PERINGATAN 4 PERKARA',
            subtitle: 'Fokus Visual: "PERHATIKAN 4 PERKARA SEBELUM NAK MEMBACA: HURUF, BARIS, BUNYI, PANJANG PENDEK".',
            rows: [
                { label: 'Baris 1', cells: ['فَقَالَ لِصَاحِبِهِۦ', 'سَمِيعٌ عَلِيمٌ'], focus: "Sami-\'un \'Aliim." },
                { label: 'Baris 2', cells: ['فِيهَا خَالِدُونَ', 'مَا بَيْنَ أَيْدِينَا'], focus: 'Aidii-naa.' },
                { label: 'Baris 3', cells: ['وَكَانُواْ قَوْمًا عَالِينَ', 'وَكَفَى بِنَا حَاسِبِينَ'], focus: '\'Aaliina.' },
                { label: 'Baris 4', cells: ['لِشَيْءٍ عَجِيبٍ', 'مَتَاعَا إِلَى حِينٍ'], focus: 'Ilaa Hiin.' },
                { label: 'Baris 5', cells: ['أُوتِيَ مُوسَى وَعِيسَى', 'أَوْلَى لَكَ فَأَوْلَى'], focus: 'Fa-aulaa.' },
                { label: 'Baris 6', cells: ['كَانَ عَلِيمًا خَبِيرًا', 'يَوْمَئِذٍ خَاشِعَةٌ'], focus: 'Khaa-syi-\'atun.' },
                { label: 'Baris 7', cells: ['وَصَاحِبَتِهِۦ وَبَنِيهِ', 'وَرَضِيَ لَهُۥ قَوْلًا'], focus: 'Qoulan.' }
            ]
        },
        {
            title: 'MUKA SURAT 10: MIM SAKINAH (MIM MATI)',
            subtitle: 'Fokus Utama: Tanda mati (Sukun) pada Mim. Bibir rapat, bunyi "M" jelas (Izhar Syafawi).',
            checklist: [
                'Bibir mesti rapat sepenuhnya bila jumpa Mim mati.',
                'Jangan dengung terlalu lama (kecuali jumpa Mim/Ba - akan belajar nanti). Di sini fokus Izhar (Jelas).'
            ],
            rows: [
                { label: 'TAJUK', cells: ['مْ (M)', 'لَ + مْ = لَمْ', '-'], focus: 'Bibir Rapat.' },
                { label: 'Baris 1', cells: ['أَمْ إِمْ أُمْ', 'لَمْ لِمْ لُمْ', '-'], focus: 'AM IM UM.' },
                { label: 'Baris 2', cells: ['كَمْ كِمْ كُمْ', 'هُمْ هِمْ هُمْ', '-'], focus: 'HUM HIM HUM.' },
                { label: 'Baris 3', cells: ['أَوَلَمْ', 'أَمْرُهُۥ', 'عَلَيْكُمْ', 'عَلَيْهِمْ (ALAIHIM)'], focus: '' },
                { label: 'Baris 4', cells: ['ذَلِكُمْ', 'رَأَوْهُمْ', 'هَمْسًا (HAMSAN)', 'جَمْعًا (JAM-\'AN)'], focus: '' },
                { label: 'Baris 5', cells: ['غَضَبِي', 'فَوْقَكُمْ', 'حَمْلًا (HAMLAN)', 'كَيْدَهُمْ (KAIDAHUM)'], focus: '' },
                { label: 'Baris 6', cells: ['خَمْسَةٌ', 'بَيْنَكُمْ', 'عَظِيمُ', 'فَلَهُمْ (FALAHUM)'], focus: '' },
                { label: 'Baris 7', cells: ['سُورَةٌ', 'حَوْلَكُمْ', 'حَيَوَةٌ', 'أَمْوَالِهِمْ (AMWAALIHIM)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 11: NUN SAKINAH (NUN MATI)',
            subtitle: 'Fokus Utama: Tanda mati pada Nun. Bunyi "N" jelas (Izhar Halqi).',
            rows: [
                { label: 'TAJUK', cells: ['نْ (N)', 'مَ + نْ = مَنْ', '-'], focus: 'Hujung lidah ke gusi.' },
                { label: 'Baris 1', cells: ['أَنْ إِنْ أُنْ', 'هَنْ هِنْ هُنْ', 'عَنْ عِنْ عُنْ'], focus: 'AN IN UN.' },
                { label: 'Baris 2', cells: ['إِنْ هُوَ', 'مَنْ ءَامَنَ', 'عَنْ عِبَادِ'], focus: '\'An \'Ibaadi (Jelas).' },
                { label: 'Baris 3', cells: ['إِنْ أَصَابَ', 'مَنْ خَشِيَ', 'أَنْهَارَا'], focus: 'An-haara.' },
                { label: 'Baris 4', cells: ['وَمِنْهُ', 'مَنْ أُوتِيَ', 'مِنْ خَيْرٍ'], focus: 'Min Khairin.' },
                { label: 'Baris 5', cells: ['إِنْ هَذَا', 'أَنْعَمْتَ', 'أَنْ هَدَاكُمْ'], focus: 'An-hadaakum.' },
                { label: 'Baris 6', cells: ['مِنْ غَيْرِ', 'مِنْ حَيْثُ', 'عَنْهُمَا'], focus: '\'An-humaa.' },
                { label: 'Baris 7', cells: ['بَنِينَ', 'دُنْيَا', 'صِنْوَانٌ', 'قِنْوَانٌ (Izhar Mutlaq)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 12: QALQALAH (LANTUNAN)',
            subtitle: 'Fokus Utama: 5 Huruf Qalqalah (BA, JIM, DAL, THO, QOF) bila mati, mesti melantun. "BAJU DI TOKO".',
            checklist: [
                'Lantunan jelas kedengaran (seperti bola melantun).',
                'Jangan tambah baris baru (bukan A-Ba-Qa, tapi Ab-Qa).',
                'Qof dan Tho lantunannya tebal.'
            ],
            rows: [
                { label: 'TAJUK', cells: ['أَبْ (ABBE)', 'أَجْ (AJJE)', 'أَدْ (ADDE)', 'أَطْ (ATTO) - أَقْ (AQQO)'], focus: '' },
                { label: 'Baris 1', cells: ['أَبْ (BA)', 'وَعَبْقَى', 'تَبْدُوا', 'حَسِبْتُمْ (Hasib-tum)'], focus: '' },
                { label: 'Baris 2', cells: ['أَجْ (JIM)', 'يَجْعَلُ', 'تَجْزُونَ', 'وَجْهِهِۦ (Waj-hihi)'], focus: '' },
                { label: 'Baris 3', cells: ['أَدْ (DAL)', 'تَدْخُلُوا', 'قَدْحًا', 'وَجَدْنَا (Wajad-naa)'], focus: '' },
                { label: 'Baris 4', cells: ['أَطْ (THO)', 'أَطْعَمَهُمْ', 'لَيَطْغَى', 'مَطْلَعِ (Math-la-\'i)'], focus: '' },
                { label: 'Baris 5', cells: ['أَقْ (QOF)', 'أَقْلَامِ', 'يَقْرَأُ', 'مُقْتَحِمٌ (Muq-tahimun)'], focus: '' },
                { label: 'Baris 6', cells: ['يَبْعَثُكَ', 'أَجْمَعِينَ', 'يَمْدُدْكُمْ', 'خَلَقْنَا (Khalaq-naa)'], focus: '' }
            ]
        },
        {
            title: 'MUKA SURAT 13: LATIHAN AKHIR (QALQALAH & HUKUM LAIN)',
            subtitle: 'Fokus Utama: Menggabungkan Qalqalah, Mad, dan Tanda Mati.',
            rows: [
                { label: 'Baris 1', cells: ['أَجْرٌ غَيْرُ مَمْنُونٍ', 'إِلَى يَوْمِ يُبْعَثُونَ'], focus: 'Mam-nuun (Mim mati).' },
                { label: 'Baris 2', cells: ['فِي جِيدِهَا حَبْلٌ', 'فَمَالَهُۥ مِنْ هَادٍ'], focus: 'Hab-lun (Ba Qalqalah).' },
                { label: 'Baris 3', cells: ['يَمْشِي عَلَى بَطْنِهِۦ', 'هَذَا لَشَيْءٌ عُجَابٌ'], focus: 'Bath-nihi (Tho Qalqalah).' },
                { label: 'Baris 4', cells: ['يَخْطَفُ أَبْصَارَهُمْ', 'لَلَبِثَ فِي بَطْنِهِۦ'], focus: 'Ab-shaa-rahum.' },
                { label: 'Baris 5', cells: ['وَأَقْبَلَ بَعْضُهُمْ', 'بِعِجْلٍ حَنِيذٍ'], focus: "Aq-bala / \'Ij-lin." },
                { label: 'Baris 6', cells: ['فَوَسَطْنَ بِهِۦ جَمْعًا', 'وَلَا يَخَافُ عُقْبَاهَا'], focus: '\'Uq-baahaa.' },
                { label: 'Baris 7', cells: ['خَلَقَكُمْ أَطْوَارًا', 'لَمْ يَلِدْ وَلَمْ يُولَدْ'], focus: 'Ya-lid (Dal Qalqalah).' }
            ]
        }
    ]
};
