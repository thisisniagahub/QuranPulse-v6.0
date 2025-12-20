import { IqraVolume } from './types';

export const IQRA_1: IqraVolume = {
    id: 'iqra-1',
    title: 'IQRA 1',
    pages: [
        {
            title: 'MUKA SURAT 2: HURUF HIJAIYAH TUNGGAL',
            subtitle: 'Fokus: Mengenal 28 Huruf Asal dan Bentuknya.',
            rows: [
                { label: 'Baris 1', cells: ['ا (ALIF)', 'ب (BA)', 'ت (TA)', 'ث (TSA)', 'ج (JIM)'], focus: 'Bentuk Tiang & Mangkuk.' },
                { label: 'Baris 2', cells: ['ح (HA)', 'خ (KHO)', 'د (DAL)', 'ذ (DZAL)', 'ر (RO)'], focus: 'Kerongkong & Siku.' },
                { label: 'Baris 3', cells: ['ز (ZAI)', 'س (SIN)', 'ش (SYIN)', 'ص (SOD)', 'ض (DHOD)'], focus: 'Lengkung & Gigi.' },
                { label: 'Baris 4', cells: ['ط (THO)', 'ظ (ZHO)', 'ع (AIN)', 'غ (GHOIN)', 'ف (FA)'], focus: 'Tiang Tebal & Kepala Burung.' },
                { label: 'Baris 5', cells: ['ق (QOF)', 'ك (KAF)', 'ل (LAM)', 'م (MIM)', 'ن (NUN)'], focus: 'Mangkuk Dalam & Mata Kail.' },
                { label: 'Baris 6', cells: ['و (WAU)', 'هـ (HA)', 'لا (LAMALIF)', 'ء (HAMZAH)', 'ي (YA)'], focus: 'Penutup.' }
            ]
        },
        {
            title: 'MUKA SURAT 3: HURUF ALIF & BA',
            subtitle: "Fokus: Bunyi 'A' dan 'BA'. Membezakan Tiang (A) dan Mangkuk 1 Titik (Ba).",
            diagramFlow: '[ Kotak Kanan ] ---> [ Kotak Kiri ]',
            rows: [
                { label: 'TAJUK', cells: ['بَ (BA)', 'اَ (A)'], focus: 'Tajuk Utama.' },
                { label: 'Baris 1', cells: ['بَ - اَ - بَ', 'اَ - بَ - اَ'], focus: 'Selang-seli asas. Jangan tertukar.' },
                { label: 'Baris 2', cells: ['بَ - اَ - اَ', 'اَ - اَ - بَ'], focus: 'Ujian pengulangan A dua kali.' },
                { label: 'Baris 3', cells: ['بَ - بَ - اَ', 'اَ - بَ - بَ'], focus: 'Ujian pengulangan BA dua kali.' },
                { label: 'Baris 4', cells: ['بَ - اَ - بَ', 'اَ - بَ - اَ'], focus: 'Ulang semula pola baris 1 (Pengukuhan).' },
                { label: 'Baris 5', cells: ['اَ - اَ - اَ', 'بَ - بَ - بَ'], focus: 'Ketahanan: Bunyi sama 3 kali berturut.' },
                { label: 'Baris 6', cells: ['اَ - بَ - اَ - بَ', '(Gabungan)'], focus: 'Ujian kepantasan akhir.' }
            ]
        },
        {
            title: 'MUKA SURAT 4: HURUF TA (تَ)',
            subtitle: 'Fokus: Huruf TA ada 2 titik di atas. Bunyi tajam "TA".',
            rows: [
                { label: 'TAJUK', cells: ['تَ (TA)', 'بَ (BA)'], focus: 'Perbezaan Titik: Atas vs Bawah.' },
                { label: 'Baris 1', cells: ['اَ - تَ - بَ', 'بَ - تَ - اَ'], focus: 'Memperkenalkan TA di tengah kombinasi.' },
                { label: 'Baris 2', cells: ['تَ - اَ - تَ', 'تَ - اَ - تَ'], focus: 'Fokus TA di awal dan akhir kotak.' },
                { label: 'Baris 3', cells: ['بَ - تَ - اَ', 'بَ - تَ - بَ'], focus: 'Hati-hati jangan tertukar TA dan BA.' },
                { label: 'Baris 4', cells: ['تَ - اَ - تَ', 'بَ - اَ - تَ'], focus: 'Pola rawak yang mengelirukan titik.' },
                { label: 'Baris 5', cells: ['اَ - تَ - بَ', 'تَ - تَ - اَ'], focus: 'Gabungan Alif di awal dan akhir.' },
                { label: 'Baris 6', cells: ['اَ - بَ - تَ', 'اَ - بَ - تَ'], focus: 'Susunan urutan Hijaiyah sebenar.' }
            ]
        },
        {
            title: 'MUKA SURAT 5: HURUF TSA (ثَ)',
            subtitle: 'Fokus: Huruf TSA ada 3 titik. Bunyi lembut, hujung lidah di gigi.',
            rows: [
                { label: 'TAJUK', cells: ['ثَ (TSA)', 'تَ (TA) - بَ (BA)'], focus: '3 Beradik Mangkuk.' },
                { label: 'Baris 1', cells: ['ثَ - اَ - بَ', 'ثَ - بَ - تَ'], focus: 'TSA dimulakan dahulu.' },
                { label: 'Baris 2', cells: ['بَ - اَ - ثَ', 'تَ - ثَ - بَ'], focus: 'TSA berada di hujung dan tengah.' },
                { label: 'Baris 3', cells: ['اَ - تَ - بَ', 'ثَ - بَ - ثَ'], focus: 'Awas! Tsa - Ba - Tsa (Tukar 3-1-3 titik).' },
                { label: 'Baris 4', cells: ['تَ - بَ - ثَ', 'تَ - ثَ - ثَ'], focus: 'Pengulangan TSA di akhir baris kiri.' },
                { label: 'Baris 5', cells: ['ثَ - تَ - ثَ', 'بَ - ثَ - تَ'], focus: 'Latihan lidah: Lembut (Tsa) ke Keras (Ta).' },
                { label: 'Baris 6', cells: ['اَ - بَ - تَ - ثَ', 'اَ - بَ - تَ - ثَ'], focus: 'Hafalan urutan 4 huruf pertama.' }
            ]
        },
        {
            title: 'MUKA SURAT 6: HURUF JA, HA, KHO (ج ح خ)',
            subtitle: 'Fokus: Kelompok Perut Buncit. JA (Titik tengah), HA (Kosong), KHO (Titik atas).',
            rows: [
                { label: 'TAJUK', cells: ['خَ (KHO) حَ (HA)', 'جَ (JA)'], focus: 'Pengenalan 3 huruf serentak.' },
                { label: 'Baris 1', cells: ['جَ - اَ - خَ', 'خَ - اَ - جَ'], focus: 'JA (Kuat) lawan KHO (Serak).' },
                { label: 'Baris 2', cells: ['جَ - تَ - خَ', 'ثَ - اَ - خَ'], focus: 'Gabungan dengan huruf Mangkuk (Ta/Tsa).' },
                { label: 'Baris 3', cells: ['تَ - حَ - ثَ', 'بَ - اَ - خَ'], focus: 'HA pedas diperkenalkan di tengah.' },
                { label: 'Baris 4', cells: ['بَ - حَ - ثَ', 'جَ - اَ - خَ'], focus: 'Latihan mata melihat titik perut vs atas.' },
                { label: 'Baris 5', cells: ['تَ - حَ - جَ', 'تَ - اَ - خَ'], focus: 'Kombinasi sukar: Ta(Mangkuk)-Ha(Perut)-Ja(Perut).' },
                { label: 'Baris 6', cells: ['اَ - خَ - خَ', 'جَ - حَ - خَ'], focus: 'Ja-Ha-Kho adalah ujian kerongkong utama.' },
                { label: 'Baris 7', cells: ['اَ - بَ - تَ', 'ثَ - جَ - حَ - خَ'], focus: 'Baris tambahan urutan (Review).' }
            ]
        },
        {
            title: 'MUKA SURAT 7: HURUF DA & DZA (د ذ)',
            subtitle: 'Fokus: Bentuk Siku. DA (Kosong/Kuat), DZA (Titik/Lembut).',
            rows: [
                { label: 'TAJUK', cells: ['ذَ (DZA)', 'دَ (DA)'], focus: 'Bentuk mudah, beza titik.' },
                { label: 'Baris 1', cells: ['خَ - دَ - ذَ', 'دَ - اَ - ذَ'], focus: 'Kho (Serak) diikuti Da/Dza.' },
                { label: 'Baris 2', cells: ['ذَ - حَ - جَ', 'اَ - حَ - دَ'], focus: 'Awas tertukar titik Dza dan Jim.' },
                { label: 'Baris 3', cells: ['ثَ - اَ - ذَ', 'خَ - تَ - دَ'], focus: 'Bandingkan Tsa dan Dza (Sama lembut, beza bentuk).' },
                { label: 'Baris 4', cells: ['ذَ - بَ - حَ', 'خَ - حَ - جَ'], focus: 'Gabungan pelbagai huruf sebelumnya.' },
                { label: 'Baris 5', cells: ['اَ - خَ - دَ', 'حَ - دَ - ثَ'], focus: 'Latihan kelajuan mata.' },
                { label: 'Baris 6', cells: ['خَ - دَ - ذَ', 'دَ - اَ - ذَ'], focus: 'Ulang semula kombinasi baris 1.' },
                { label: 'Baris 7', cells: ['اَ - بَ - تَ - ثَ', 'جَ - حَ - خَ - دَ - ذَ'], focus: 'Review Urutan 1-9.' }
            ]
        },
        {
            title: 'MUKA SURAT 8: HURUF RO & ZA (ر ز)',
            subtitle: 'Fokus: Bentuk Melengkung (Pisang). RO (Tebal/Getar), ZA (Tajam/Desing).',
            rows: [
                { label: 'TAJUK', cells: ['زَ (ZA)', 'رَ (RO)'], focus: 'ZA ada titik, RO kosong.' },
                { label: 'Baris 1', cells: ['رَ - اَ - زَ', 'ذَ - رَ - زَ'], focus: 'Awas! Dza (Lembut) vs Za (Kasar/Desing).' },
                { label: 'Baris 2', cells: ['ذَ - خَ - ذَ', 'زَ - دَ - رَ'], focus: 'Latihan melihat titik di tengah ayat.' },
                { label: 'Baris 3', cells: ['ثَ - رَ - زَ', 'ذَ - حَ - دَ'], focus: '3 jenis bunyi lidah yang berbeza.' },
                { label: 'Baris 4', cells: ['تَ - زَ - دَ', 'خَ - رَ - جَ'], focus: 'Gabungan Rawak. Ro (Tebal) jumpa Ja.' },
                { label: 'Baris 5', cells: ['ذَ - حَ - ثَ', 'بَ - زَ - رَ'], focus: 'Kombinasi sukar sebutan.' },
                { label: 'Baris 6', cells: ['جَ - اَ - زَ', 'خَ - اَ - جَ'], focus: 'Semakan akhir.' },
                { label: 'Baris 7', cells: ['... دَ - ذَ - رَ - زَ', '(Urutan Bawah)'], focus: 'Hafalan susunan baru.' }
            ]
        },
        {
            title: 'MUKA SURAT 9: HURUF SA & SYA (س ش)',
            subtitle: 'Fokus: Gigi 3. SA (Senyum/Nipis), SYA (Muncung/Hambur).',
            rows: [
                { label: 'TAJUK', cells: ['شَ (SYA)', 'سَ (SA)'], focus: 'Sya ada 3 titik.' },
                { label: 'Baris 1', cells: ['سَ - اَ - شَ', 'سَ - شَ - سَ - شَ'], focus: 'Selang-seli bunyi Ular(S) dan Diam(Sh).' },
                { label: 'Baris 2', cells: ['شَ - ذَ - ثَ', 'شَ - تَ - دَ'], focus: 'Awas makhraj: Sya vs Tsa (Jauh beza).' },
                { label: 'Baris 3', cells: ['سَ - دَ - رَ', 'دَ - رَ - سَ'], focus: 'Pembinaan perkataan dasar "Darasa".' },
                { label: 'Baris 4', cells: ['ذَ - خَ - زَ', 'اَ - سَ - شَ'], focus: 'Zai (Desing) vs Sya (Hambur).' },
                { label: 'Baris 5', cells: ['زَ - حَ - ثَ', 'شَ - جَ - زَ'], focus: 'Jim (Kuat) diapit Sya dan Za.' },
                { label: 'Baris 6', cells: ['خَ - سَ - دَ', 'شَ - زَ - جَ'], focus: 'Ujian kombinasi rawak.' },
                { label: 'Baris 7', cells: ['... زَ - سَ - شَ', '(Urutan Bawah)'], focus: 'Review susunan.' }
            ]
        },
        {
            title: 'MUKA SURAT 10: HURUF SO & DHO (ص ض)',
            subtitle: 'Fokus: Mangkuk Bujur (Istila\'). Huruf Tebal. Mulut Kembung.',
            rows: [
                { label: 'TAJUK', cells: ['ضَ (DHO)', 'صَ (SO)'], focus: 'Dho ada titik.' },
                { label: 'Baris 1', cells: ['صَ - اَ - ضَ', 'حَ - ضَ - رَ'], focus: 'SO (Tebal) lawan A (Nipis).' },
                { label: 'Baris 2', cells: ['صَ - اَ - ضَ', 'شَ - خَ - زَ'], focus: 'Perbandingan 3 huruf titik banyak di kiri.' },
                { label: 'Baris 3', cells: ['شَ - بَ - رَ', 'ضَ - رَ - بَ'], focus: '"Dhoraba" (Perkataan sebenar).' },
                { label: 'Baris 4', cells: ['صَ - حَ - ثَ', 'صَ - دَ - زَ'], focus: 'Sad jumpa Ha (Dua-dua tebal/pedas).' },
                { label: 'Baris 5', cells: ['ضَ - شَ - دَ', 'صَ - دَ - ضَ'], focus: 'Dho vs Da (Tebal vs Nipis).' },
                { label: 'Baris 6', cells: ['سَ - حَ - ذَ', 'رَ - صَ - دَ'], focus: 'Ujian telinga: Sa vs So.' },
                { label: 'Baris 7', cells: ['ثَ - خَ - زَ', 'ضَ - جَ - ذَ'], focus: 'Kombinasi sukar.' },
                { label: 'Baris 8', cells: ['صَ - رَ - ضَ', 'اَ - بَ - تَ ...'], focus: 'Latihan akhir.' }
            ]
        },
        {
            title: 'MUKA SURAT 11: HURUF THO & ZHO (ط ظ)',
            subtitle: 'Fokus: Ada Tiang & Tebal. THO (Kuat), ZHO (Lidah Keluar).',
            rows: [
                { label: 'TAJUK', cells: ['ظَ (ZHO)', 'طَ (THO)'], focus: 'Bentuk sama, ZHO ada titik.' },
                { label: 'Baris 1', cells: ['طَ - اَ - طَ', 'بَ - طَ - ظَ'], focus: 'Tho - A - Tho (Tebal-Nipis-Tebal).' },
                { label: 'Baris 2', cells: ['طَ - اَ - حَ - ظَ', '(Gabungan Panjang)'], focus: 'Rentak 4 huruf.' },
                { label: 'Baris 3', cells: ['سَ - ضَ - طَ', 'صَ - دَ - صَ'], focus: 'Membezakan Sod, Dhod, Tho.' },
                { label: 'Baris 4', cells: ['شَ - اَ - ظَ', 'سَ - رَ - صَ'], focus: 'Sya vs Sa. Zho vs So.' },
                { label: 'Baris 5', cells: ['ثَ - رَ - ضَ', 'زَ - خَ - زَ'], focus: 'Latihan campuran.' },
                { label: 'Baris 6', cells: ['تَ - ضَ - طَ', 'ظَ - حَ - ذَ'], focus: 'Ta (Nipis) lawan Tho (Tebal).' },
                { label: 'Baris 7', cells: ['صَ - دَ - شَ', 'شَ - جَ - طَ'], focus: 'Kombinasi rawak.' },
                { label: 'Baris 8', cells: ['رَ - زَ - سَ - شَ - صَ - ضَ - طَ - ظَ', '(Review Urutan)'], focus: 'Hafal kumpulan baris ini.' }
            ]
        },
        {
            title: "MUKA SURAT 12: HURUF 'AIN & GHOIN (ع غ)",
            subtitle: "Fokus: Kepala Burung. 'AIN (Kerongkong Tengah/Nyaring), GHOIN (Atas/Serak).",
            rows: [
                { label: 'TAJUK', cells: ['غَ (GHO)', "عَ ('AIN)"], focus: 'GHO ada titik atas.' },
                { label: 'Baris 1', cells: ['غَ - اَ - عَ', 'دَ - غَ - ظَ'], focus: "'Ain tidak boleh bunyi \"NGA\". Mesti 'A." },
                { label: 'Baris 2', cells: ['عَ - اَ - طَ', 'غَ - اَ - عَ'], focus: 'Latihan huruf Istila\' (Tebal).' },
                { label: 'Baris 3', cells: ['ثَ - عَ - ظَ', 'جَ - غَ - ظَ'], focus: "Tsa (Lidah) jumpa 'Ain (Kerongkong)." },
                { label: 'Baris 4', cells: ['سَ - طَ - عَ', 'طَ - غَ - غَ'], focus: 'Sin nipis, lain tebal.' },
                { label: 'Baris 5', cells: ['حَ - رَ - ظَ', 'شَ - غَ - ضَ'], focus: 'Ha (Pedas) vs Ghoin (Serak).' },
                { label: 'Baris 6', cells: ['صَ - رَ - عَ', 'ضَ - رَ - غَ'], focus: 'Bunyi Ro diapit huruf lain.' },
                { label: 'Baris 7', cells: ['زَ - خَ - ظَ', 'ضَ - عَ - دَ'], focus: 'Awas Za vs Zho vs Dzal.' },
                { label: 'Baris 8', cells: ['شَ - رَ - طَ', 'طَ - عَ - ظَ'], focus: 'Semakan akhir.' },
                { label: 'Baris 9', cells: ['... طَ - ظَ - عَ - غَ', '(Urutan)'], focus: 'Tambahan urutan baru.' }
            ]
        },
        {
            title: 'MUKA SURAT 13: HURUF FA & QOF (ف ق)',
            subtitle: 'Fokus: Kepala Bulat. FA (Bibir/Angin/1 Titik), QOF (Pangkal Lidah/Tebal/2 Titik).',
            rows: [
                { label: 'TAJUK', cells: ['قَ (QO)', 'فَ (FA)'], focus: 'Bentuk sama, titik & bunyi beza.' },
                { label: 'Baris 1', cells: ['قَ - بَ - ضَ', 'قَ - طَ - فَ'], focus: 'Qo (Tebal) di kiri kanan baris.' },
                { label: 'Baris 2', cells: ['قَ - اَ - رَ', 'فَ - قَ - رَ'], focus: 'Latihan pangkal lidah QO.' },
                { label: 'Baris 3', cells: ['ثَ - غَ - ظَ', 'فَ - قَ - فَ'], focus: 'Tsa (Lembut) vs Qo (Kasar).' },
                { label: 'Baris 4', cells: ['سَ - عَ - فَ', 'خَ - لَ - قَ'], focus: '"Khalaqa" - Penciptaan.' },
                { label: 'Baris 5', cells: ['حَ - ذَ - خَ', 'قَ - فَ - صَ'], focus: 'Latihan Halqi dan Syafawi.' },
                { label: 'Baris 6', cells: ['دَ - اَ - قَ', 'صَ - قَ - رَ'], focus: 'Perhatian makhraj Qo di tengah.' },
                { label: 'Baris 7', cells: ['ضَ - غَ - طَ', 'شَ - فَ - عَ'], focus: 'Dho-Gho-Tho (Semua tebal).' },
                { label: 'Baris 8', cells: ['زَ - رَ - قَ', 'فَ - تَ - حَ'], focus: 'Latihan akhir perkataan mudah.' },
                { label: 'Baris 9', cells: ['... غَ - فَ - قَ', '(Urutan)'], focus: 'Penutup.' }
            ]
        },
        {
            title: 'MUKA SURAT 14: HURUF KAF (ك)',
            subtitle: 'Fokus: Bentuk seperti L tapi ada hamzah kecil. Bunyi NIPIS & ADA ANGIN (Hams).',
            rows: [
                { label: 'TAJUK', cells: ['كَ (KA)', '-'], focus: 'Bunyi KA, bukan QO.' },
                { label: 'Baris 1', cells: ['كَ - حَ - قَ', 'كَ - قَ - خَ'], focus: 'Ujian: KA (Nipis) vs QO (Tebal).' },
                { label: 'Baris 2', cells: ['ضَ - حَ - كَ', 'دَ - حَ - كَ'], focus: 'Perhatikan beza Dho dan Da.' },
                { label: 'Baris 3', cells: ['جَ - كَ - تَ', 'عَ - طَ - فَ'], focus: 'KA bunyi ada \'skit\' angin.' },
                { label: 'Baris 4', cells: ['شَ - كَ - رَ', 'زَ - كَ - رَ'], focus: 'Syakara vs Zakara.' },
                { label: 'Baris 5', cells: ['صَ - دَ - ثَ', 'قَ - كَ - فَ'], focus: 'Susunan makhraj melompat.' },
                { label: 'Baris 6', cells: ['دَ - غَ - سَ', 'صَ - دَ - قَ'], focus: 'Sad-Da-Qo vs Ka.' },
                { label: 'Baris 7', cells: ['غَ - فَ - كَ', 'زَ - كَ - طَ'], focus: 'KAF diapit huruf tebal.' },
                { label: 'Baris 8', cells: ['... فَ - قَ - كَ', '(Urutan)'], focus: 'Review.' }
            ]
        },
        {
            title: 'MUKA SURAT 15: HURUF LAM (ل)',
            subtitle: 'Fokus: Mata Kail. Hujung lidah tekan lelangit. Bunyi Ringan.',
            rows: [
                { label: 'TAJUK', cells: ['لَ (LA)', '-'], focus: 'Jangan panggil ALIF. Ini LAM.' },
                { label: 'Baris 1', cells: ['قَ - بَ - لَ', 'جَ - عَ - لَ'], focus: "LA di hujung (Qobala, Ja'ala)." },
                { label: 'Baris 2', cells: ['خَ - لَ - طَ', 'قَ - بَ - لَ'], focus: 'LA di tengah.' },
                { label: 'Baris 3', cells: ['دَ - كَ - رَ', 'غَ - لَ - ظَ'], focus: 'Da-Ka-Ro (Semua nipis).' },
                { label: 'Baris 4', cells: ['صَ - فَ - قَ', 'فَ - صَ - لَ'], focus: 'Perhatikan Sad dan Fa.' },
                { label: 'Baris 5', cells: ['حَ - لَ - فَ', 'دَ - غَ - سَ'], focus: 'Ha-La-Fa (Sumpah).' },
                { label: 'Baris 6', cells: ['شَ - كَ - لَ', 'دَ - خَ - لَ'], focus: 'Syin besar jumpa Lam.' },
                { label: 'Baris 7', cells: ['ضَ - رَ - عَ', 'زَ - تَ - ظَ'], focus: 'Kombinasi rawak.' },
                { label: 'Baris 8', cells: ['كَ - لَ - لَ', 'لَ - اَ - لَ'], focus: 'LA boleh disambung bunyi.' },
                { label: 'Baris 9', cells: ['... كَ - لَ', '(Urutan)'], focus: 'Review.' }
            ]
        },
        {
            title: 'MUKA SURAT 16: HURUF MIM (م)',
            subtitle: 'Fokus: Kepala Bulat Ekor Bawah. Bibir Rapat. Bunyi "Maa".',
            rows: [
                { label: 'TAJUK', cells: ['مَ (MA)', '-'], focus: 'Huruf Bibir (Syafawi).' },
                { label: 'Baris 1', cells: ['غَ - مَ - ضَ', 'لَ - مَ - سَ'], focus: 'MA di tengah.' },
                { label: 'Baris 2', cells: ['جَ - مَ - عَ', 'حَ - كَ - مَ'], focus: 'MA di akhir dan awal kombinasi.' },
                { label: 'Baris 3', cells: ['فَ - رَ - ضَ', 'كَ - رَ - مَ'], focus: 'MA selepas RO tebal.' },
                { label: 'Baris 4', cells: ['خَ - لَ - طَ', 'قَ - مَ - رَ'], focus: 'Kho (Serak) - La - Tho (Tebal).' },
                { label: 'Baris 5', cells: ['صَ - دَ - مَ', 'ظَ - تَ - ذَ'], focus: 'Sod - Da (Tebal/Nipis).' },
                { label: 'Baris 6', cells: ['مَ - زَ - قَ', 'زَ - عَ - مَ'], focus: 'Zai bunyi desing jumpa Mim.' },
                { label: 'Baris 7', cells: ['شَ - مَ - لَ', 'فَ - كَ - حَ'], focus: 'Huruf bibir banyak disini.' },
                { label: 'Baris 8', cells: ['غَ - مَ - مَ', 'مَ - لَ - كَ'], focus: 'MA dua kali ulang.' },
                { label: 'Baris 9', cells: ['... لَ - مَ', '(Urutan)'], focus: 'Review.' }
            ]
        },
        {
            title: 'MUKA SURAT 17: HURUF NUN (ن)',
            subtitle: 'Fokus: Mangkuk 1 Titik ATAS. Bunyi Pangkal Hidung.',
            rows: [
                { label: 'TAJUK', cells: ['نَ (NA)', '-'], focus: 'Jangan tukar dengan BA (Bawah).' },
                { label: 'Baris 1', cells: ['نَ - ظَ - فَ', 'نَ - غَ - شَ'], focus: 'NA di permulaan.' },
                { label: 'Baris 2', cells: ['طَ - عَ - نَ', 'مَ - نَ - عَ'], focus: 'NA di hujung ayat.' },
                { label: 'Baris 3', cells: ['صَ - مَ - ضَ', 'قَ - رَ - نَ'], focus: 'Beza NA dan Dhod.' },
                { label: 'Baris 4', cells: ['خَ - لَ - قَ', 'ذَ - هَ - بَ'], focus: 'Selingan huruf lain.' },
                { label: 'Baris 5', cells: ['زَ - مَ - نَ', 'كَ - ذَ - بَ'], focus: 'Jaga titik Zal dan Ba.' },
                { label: 'Baris 6', cells: ['جَ - نَ - دَ', 'حَ - سَ - نَ'], focus: 'Ja-Na-Da vs Ha-Sa-Na.' },
                { label: 'Baris 7', cells: ['كَ - نَ - سَ', 'لَ - حَ - ظَ'], focus: 'Perkataan "Kanas".' },
                { label: 'Baris 8', cells: ['مَ - نَ - نَ', 'شَ - فَ - قَ'], focus: 'Ujian double Nun.' },
                { label: 'Baris 9', cells: ['... مَ - نَ', '(Urutan)'], focus: 'Review.' }
            ]
        },
        {
            title: 'MUKA SURAT 18: HURUF WAU (و)',
            subtitle: 'Fokus: Bibir Muncung Bulat. Bunyi "WA". Jangan gigit bibir (V).',
            rows: [
                { label: 'TAJUK', cells: ['وَ (WA)', '-'], focus: 'Wajib Muncung Sempurna.' },
                { label: 'Baris 1', cells: ['وَ - زَ - رَ', 'وَ - لَ - غَ'], focus: 'WA jumpa RO tebal.' },
                { label: 'Baris 2', cells: ['دَ - وَ - مَ', 'قَ - وَ - دَ'], focus: 'Bunyi WA kekal muncung ditengah.' },
                { label: 'Baris 3', cells: ['فَ - طَ - نَ', 'قَ - وَ - مَ'], focus: 'Fa (Gigi) vs WA (Muncung).' },
                { label: 'Baris 4', cells: ['ظَ - جَ - عَ', 'كَ - وَ - نَ'], focus: 'Zho tebal jumpa Ja kuat.' },
                { label: 'Baris 5', cells: ['سَ - كَ - تَ', 'خَ - وَ - صَ'], focus: 'SAKATA (Diam).' },
                { label: 'Baris 6', cells: ['شَ - وَ - لَ', 'ذَ - حَ - ضَ'], focus: 'Awas Dza nipis, Dhod tebal.' },
                { label: 'Baris 7', cells: ['وَ - نَ - وَ', 'ي - دَ - عَ'], focus: 'WA dua kali selang-seli.' },
                { label: 'Baris 8', cells: ['... نَ - وَ', '(Urutan)'], focus: 'Review.' }
            ]
        },
        {
            title: 'MUKA SURAT 19: HURUF HA (هـ)',
            subtitle: 'Fokus: Simpul. Bunyi Dalam Dada/Pangkal Kerongkong.',
            rows: [
                { label: 'TAJUK', cells: ['هَ (HA)', '-'], focus: 'Suara Besar/Berat.' },
                { label: 'Baris 1', cells: ['هَ - مَ - شَ', 'جَ - هَ - دَ'], focus: 'Hamasa & Jahada.' },
                { label: 'Baris 2', cells: ['دَ - وَ - هَ', 'زَ - هَ - قَ'], focus: 'Akhir ayat bunyi HA berat.' },
                { label: 'Baris 3', cells: ['فَ - خَ - عَ', 'طَ - هَ - رَ'], focus: 'Tho-Ha-Ro (Surah Taha).' },
                { label: 'Baris 4', cells: ['وَ - ضَ - حَ', 'كَ - مَ - نَ'], focus: 'Awas beza Ha Pedas dan Ha Dada.' },
                { label: 'Baris 5', cells: ['وَ - هَ - ظَ', 'جَ - هَ - هَ'], focus: 'Ujian HA berganda.' },
                { label: 'Baris 6', cells: ['سَ - هَ - لَ', 'ذَ - غَ - صَ'], focus: 'SAHALA (Mudah).' },
                { label: 'Baris 7', cells: ['شَ - هَ - دَ', 'غَ - فَ - رَ'], focus: 'Syahada (Syahadah).' },
                { label: 'Baris 8', cells: ['... وَ - هَ', '(Urutan)'], focus: 'Review.' }
            ]
        },
        {
            title: 'MUKA SURAT 20: HURUF YA (ي)',
            subtitle: 'Fokus: Huruf Terakhir. Bentuk Itik, 2 Titik Bawah. Bunyi "YA".',
            rows: [
                { label: 'TAJUK', cells: ['يَ (YA)', '-'], focus: 'Tajam & Bersih.' },
                { label: 'Baris 1', cells: ['ضَ - يَ - رَ', 'ضَ - حَ - يَ'], focus: 'Dho tebal vs Ya nipis.' },
                { label: 'Baris 2', cells: ['زَ - ي - نَ', 'ي - سَ - رَ'], focus: 'Ya di tengah & awal.' },
                { label: 'Baris 3', cells: ['سَ - يَ - غَ', 'وَ - كَ - لَ'], focus: 'Ya bergaul dengan Ghain tebal.' },
                { label: 'Baris 4', cells: ['هَ - يَ - حَ', 'مَ - رَ - ضَ'], focus: 'Hayaa (Malu).' },
                { label: 'Baris 5', cells: ['طَ - هَ - ظَ', 'شَ - يَ - عَ'], focus: 'Kombinasi sukar: Sya-Ya-\'Ain.' },
                { label: 'Baris 6', cells: ['وَ - قَ - فَ', 'هَ - ى - مَ'], focus: 'Penutup huruf asas.' },
                { label: 'Baris 7', cells: ['جَ - ذَ - ثَ', 'ي - دَ - ى'], focus: 'YA bunyi biasa walaupun rupa lain.' },
                { label: 'Review', cells: ['KHO - HA - JA', 'TSA - TA - BA - ALIF'], focus: 'Ulangkaji Baris 1-2 Iqra.' },
                { label: 'Review', cells: ['GHO - \'AIN', 'ZHO - THO - DHO - SOD - SYA - SA'], focus: 'Ulangkaji huruf susah.' },
                { label: 'Review', cells: ['YA - HA - WA - NA - MIM - LAM - KAF - QOF - FA'], focus: 'Pecutan akhir.' }
            ]
        },
        {
            title: 'MUKA SURAT 21: UJIAN KOMPREHENSIF',
            subtitle: 'Fokus: Semakan kelancaran penuh 28 huruf. Wajib lulus untuk ke Iqra 2.',
            notes: ['(Membaca secara terus Kanan ke Kiri tanpa mengeja)'],
            checklist: [
                'Boleh baca Baris 6 (Terbalik) selancar Baris 1?',
                'Tiada bunyi panjang walaupun sedikit?',
                'Titik tidak tertukar?'
            ],
            rows: [
                { label: '1', cells: ['أ - ب - ت - ث - ج - ح - خ - د - ذ - ر - ز'], focus: 'Asas A hingga Zai.' },
                { label: '2', cells: ['س - ش - ص - ض - ط - ظ - ع - غ'], focus: 'Kelompok Gigi & Tebal.' },
                { label: '3', cells: ['ف - ق - ك - ل - م - ن - و - هـ - ء - ى'], focus: 'Kelompok Ekor & Penutup.' },
                { label: '4', cells: ['ى - ء - هـ - و - ن - م - ل - ك - ق - ف'], focus: 'BACAAN TERBALIK! (Ujian Mata).' },
                { label: '5', cells: ['غ - ع - ظ - ط - ض - ص - ش - س'], focus: 'Bacaan Terbalik Kumpulan 2.' },
                { label: '6', cells: ['ز - ر - ذ - د - خ - ح - ج - ث - ت - ب - أ'], focus: 'Bacaan Terbalik Kumpulan 1.' }
            ]
        }
    ]
};
