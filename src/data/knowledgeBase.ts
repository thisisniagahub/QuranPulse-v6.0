export interface QAItem {
    question: string;
    answer: string;
    keywords: string[];
    category: 'Fiqh' | 'Aqidah' | 'Akhlaq' | 'Umum' | 'Isu Semasa';
}

export const knowledgeBase: QAItem[] = [
    // --- FIQH: SOLAT (Start) ---
    {
        question: "Apa itu solat jamak?",
        answer: "Solat jamak bermaksud menghimpunkan dua solat fardu dalam satu waktu. Ia terbahagi kepada Jamak Takdim (himpun dalam waktu pertama) dan Jamak Takhir (himpun dalam waktu kedua). Ia dibenarkan bagi musafir yang melebih 2 marhalah (kurang lebih 81km).",
        keywords: ["solat", "jamak", "musafir"],
        category: "Fiqh"
    },
    {
        question: "Apa itu solat qasar?",
        answer: "Solat qasar bermaksud memendekkan solat fardu 4 rakaat (Zohor, Asar, Isyak) menjadi 2 rakaat. Ia adalah rukhsah (keringanan) bagi musafir.",
        keywords: ["solat", "qasar", "pendek"],
        category: "Fiqh"
    },
    {
        question: "Bolehkah solat jamak kerana hujan?",
        answer: "Ya, menurut Mazhab Syafi'i, dibenarkan solat jamak (Takdim sahaja) di masjid bagi jemaah jika hujan lebat yang menyukarkan perjalanan berulang ke masjid. Namun tidak boleh qasar.",
        keywords: ["hujan", "jamak", "masjid"],
        category: "Fiqh"
    },
    {
        question: "Apakah rukun solat?",
        answer: "Rukun solat ada 13 perkara: 1. Niat 2. Berdiri tegak 3. Takbiratul Ihram 4. Membaca Al-Fatihah 5. Rukuk 6. Ikhidal 7. Sujud 8. Duduk antara dua sujud 9. Duduk Tahiyat Akhir 10. Membaca Tahiyat Akhir 11. Selawat Nabi 12. Salam pertama 13. Tertib.",
        keywords: ["rukun", "solat", "13"],
        category: "Fiqh"
    },
    {
        question: "Adakah sah solat jika terkena najis kering?",
        answer: "Tidak sah solat jika terdapat najis pada badan, pakaian, atau tempat solat, sama ada kering atau basah, kecuali najis yang dimaafkan (seperti darah nyamuk yang sedikit).",
        keywords: ["najis", "sah", "batal"],
        category: "Fiqh"
    },
    {
        question: "Apa hukum solat pakai baju bergambar?",
        answer: "Makruh solat memakai pakaian yang mempunyai gambar makhluk bernyawa kerana ia boleh mengganggu khusyuk, tetapi solatnya tetap sah jika menutup aurat.",
        keywords: ["baju", "gambar", "makruh"],
        category: "Fiqh"
    },
    // ... (Adding more items to simulate 200 items logic pattern)
    // --- FIQH: PUASA ---
    {
        question: "Apakah niat puasa Ramadan?",
        answer: "Lafaz niat puasa harian: 'Nawaitu sauma ghadin 'an ada'i fardhi syahri ramadhana hazihis sanati lillahi ta'ala'. Niat di hati adalah wajib pada malam hari.",
        keywords: ["niat", "puasa", "ramadan"],
        category: "Fiqh"
    },
    {
        question: "Adakah batal puasa jika korek telinga?",
        answer: "Batal puasa jika memasukkan sesuatu ke dalam rongga terbuka (seperti  telinga) melepasi had batasnya dengan sengaja.",
        keywords: ["korek", "telinga", "batal"],
        category: "Fiqh"
    },
    {
        question: "Hukum gosok gigi ketika puasa?",
        answer: "Harus gosok gigi sebelum gelincir matahari (Zohor). Selepas Zohor, hukumnya Makruh menurut pendapat masyhur dalam Mazhab Syafi'i kerana menghilangkan bau mulut orang berpuasa yang disukai Allah.",
        keywords: ["gosok", "gigi", "siwak"],
        category: "Fiqh"
    },
    // --- FIQH: ZAKAT ---
    {
        question: "Berapa kadar zakat fitrah?",
        answer: "Kadar zakat fitrah ialah satu gantang Baghdad (kira-kira 2.7kg beras) atau nilainya dalam matawang yang ditetapkan oleh Majlis Agama Islam negeri masing-masing setiap tahun.",
        keywords: ["zakat", "fitrah", "kadar"],
        category: "Fiqh"
    },
    {
        question: "Siapa penerima zakat (Asnaf)?",
        answer: "Terdapat 8 golongan Asnaf: 1. Fakir 2. Miskin 3. Amil 4. Mualaf 5. Riqab 6. Gharimin (Berhutang) 7. Fisabilillah 8. Ibnu Sabil.",
        keywords: ["asnaf", "penerima", "zakat"],
        category: "Fiqh"
    },
    // --- AQIDAH ---
    {
        question: "Apa itu Rukun Iman?",
        answer: "Rukun Iman ada 6: 1. Beriman kepada Allah 2. Malaikat 3. Kitab 4. Rasul 5. Hari Kiamat 6. Qada' dan Qadar.",
        keywords: ["rukun", "iman", "6"],
        category: "Aqidah"
    },
    {
        question: "Di mana Allah?",
        answer: "Allah wujud tanpa bertempat. Allah tidak menyerupai makhluk (Laisa kamitslihi syai'un). Kita tidak boleh menyamakan Allah dengan ruang dan masa yang diciptakan-Nya.",
        keywords: ["allah", "tempat", "dimana"],
        category: "Aqidah"
    },
    // --- ISU SEMASA ---
    {
        question: "Apa hukum Forex?",
        answer: "Hukum Forex (pertukaran mata wang asing) secara dalam talian (online trading) kebanyakannya diputuskan HARAM oleh Muzakarah Jawatankuasa Fatwa MKI kerana terdapat unsur riba, gharar (ketidakpastian), dan qimar (perjudian), serta ketiadaan serah terima (qabadh) secara hakiki.",
        keywords: ["forex", "trading", "haram"],
        category: "Isu Semasa"
    },
    {
        question: "Hukum Bitcoin dan Kriptowang?",
        answer: "Hukumnya adalah HARUS jika ia patuh syariah (tiada riba/judi) dan diiktiraf sebagai aset digital yang sah (Al-Mal). Namun perlu berhati-hati dengan spekulasi melampau. Sila rujuk Penasihat Syariah Suruhanjaya Sekuriti.",
        keywords: ["bitcoin", "crypto", "kripto"],
        category: "Isu Semasa"
    },
    {
        question: "Hukum vape dan rokok?",
        answer: "Muzakarah Jawatankuasa Fatwa MKI telah memutuskan bahawa merokok dan penggunaan rokok elektronik (Vape) adalah HARAM kerana memudaratkan kesihatan dan membazir.",
        keywords: ["vape", "rokok", "haram"],
        category: "Isu Semasa"
    },
     {
        question: "Hukum ASB (Amanah Saham Bumiputera)?",
        answer: "Jawatankuasa Fatwa MKI dan Selangor memutuskan pelaburan PNB (termasuk ASB) adalah HARUS.",
        keywords: ["asb", "pelaburan", "dividen"],
        category: "Isu Semasa"
    },
    // --- AKHLAQ / UMUM ---
    {
        question: "Cara hilangkan marah?",
        answer: "Nabi SAW mengajar: 1. Ucap A'uzubillah 2. Diam 3. Ubah posisi (duduk jika berdiri) 4. Ambil wuduk.",
        keywords: ["marah", "emosi", "sabar"],
        category: "Akhlaq"
    },
    {
        question: "Doa sebelum tidur?",
        answer: "Bismika Allahumma ahya wa amut (Dengan nama-Mu ya Allah, aku hidup dan aku mati).",
        keywords: ["doa", "tidur"],
        category: "Umum"
    },
     {
        question: "Doa makan?",
        answer: "Allahumma barik lana fima razaqtana waqina azabannar (Ya Allah berkatilah rezeki kami dan peliharalah kami dari azab neraka).",
        keywords: ["doa", "makan"],
        category: "Umum"
    },
    {
        question: "Bolehkah sambut birthday?",
        answer: "Harus menyambut hari lahir sebagai tanda kesyukuran umur, asalkan tiada unsur maksiat, pembaziran, atau menyerupai upacara keagamaan lain.",
        keywords: ["birthday", "hari jadi", "sambut"],
        category: "Umum"
    },
     {
        question: "Adakah wajib pakai purdah?",
        answer: "Dalam Mazhab Syafi'i, pendapat muktamad mengatakan muka dan tapak tangan bukan aurat, maka purdah tidak wajib. Namun ia adalah sunat dan satu kemuliaan bagi yang ingin memakainya.",
        keywords: ["purdah", "niqab", "muka"],
        category: "Fiqh"
    },
    {
        question: "Hukum warnakan rambut?",
        answer: "Harus mewarnakan rambut dengan bahan suci (inai, pewarna telus air) selain warna hitam. Mewarnakan hitam adalah haram melainkan untuk tujuan jihad.",
        keywords: ["warna", "rambut", "hitam"],
        category: "Fiqh"
    },
    // --- MUNAKAHAT (PERKAHWINAN) ---
    {
        question: "Hukum nikah online?",
        answer: "Harus jika memenuhi rukun dan syarat nikah, tiada penipuan, dan diluluskan oleh Jabatan Agama Islam negeri. Saksi mesti nampak dan dengar dengan jelas.",
        keywords: ["nikah", "online", "kahwin"],
        category: "Fiqh"
    },
    {
        question: "Rukun nikah?",
        answer: "5 Rukun Nikah: 1. Pengantin Lelaki 2. Pengantin Perempuan 3. Wali 4. Dua orang Saksi 5. Ijab dan Qabul (Akad).",
        keywords: ["rukun", "nikah", "kahwin"],
        category: "Fiqh"
    },
    {
        question: "Apa itu Talak?",
        answer: "Talak ialah pelepasan ikatan perkahwinan dengan lafaz cerai. Talak ada raj'i (boleh rujuk) dan bain (tidak boleh rujuk tanpa akad baru).",
        keywords: ["talak", "cerai", "pisah"],
        category: "Fiqh"
    },
    // --- ADAB & DOA ---
    {
        question: "Doa masuk tandas?",
        answer: "Allahumma inni a'uzubika minal khubuthi wal khaba'ith.",
        keywords: ["doa", "tandas", "jamban"],
        category: "Umum"
    },
    {
        question: "Doa keluar tandas?",
        answer: "Ghufranaka. Alhamdu lillahil lazi azhaba 'annil aza wa 'afani.",
        keywords: ["doa", "tandas", "keluar"],
        category: "Umum"
    },
    {
        question: "Doa naik kenderaan?",
        answer: "Subhanallazi sakhara lana haza wama kunna lahu muqrini wa inna ila rabbina lamunqalibun.",
        keywords: ["doa", "kenderaan", "kereta"],
        category: "Umum"
    },
    {
        question: "Doa belajar?",
        answer: "Allahumma aftah 'alaina hikmataka wansyur 'alaina min khaza'ini rahmatika ya arhamar rahimin.",
        keywords: ["doa", "belajar", "ilmu"],
        category: "Umum"
    },
    // --- PUASA TAMBAHAN ---
    {
        question: "Niat puasa ganti (qada)?",
        answer: "Nawaitu sauma ghadin 'an qada'i fardhi ramadhana lillahi ta'ala.",
        keywords: ["niat", "qada", "ganti"],
        category: "Fiqh"
    },
    {
        question: "Niat puasa enam syawal?",
        answer: "Nawaitu sauma ghadin 'an ada'i sunnati sittatin min syawwalin lillahi ta'ala.",
        keywords: ["niat", "enam", "syawal"],
        category: "Fiqh"
    },
    // --- SOLAT SUNAT ---
    {
        question: "Cara solat Dhuha?",
        answer: "Solat sunat Dhuha dilakukan sekurang-kurangnya 2 rakaat. Waktunya bermula selepas matahari naik (syuruk) sehingga sebelum gelincir matahari (Zohor). Niat: Sahaja aku solat sunat Dhuha 2 rakaat kerana Allah Taala.",
        keywords: ["dhuha", "solat", "duha"],
        category: "Fiqh"
    },
    {
        question: "Cara solat Tahajjud?",
        answer: "Solat sunat Tahajjud dilakukan pada waktu malam selepas tidur, walaupun tidur sebentar. Sebaiknya di sepertiga malam terakhir. Minimum 2 rakaat.",
        keywords: ["tahajjud", "malam", "qiamullail"],
        category: "Fiqh"
    },
    {
        question: "Cara solat Hajat?",
        answer: "Solat sunat Hajat dilakukan untuk memohon sesuatu hajat dari Allah. Biasanya 2 rakaat atau sehingga 12 rakaat.",
        keywords: ["hajat", "solat", "minta"],
        category: "Fiqh"
    },
    // --- BANYAK LAGI ITEM DATA (Placeholder for remaining bulk items to simulate 200++) ---
    
];

// Helper to expand keywords
export const getAnswerFromKnowledgeBase = (query: string): string | null => {
    const normalize = (s: string) => s.toLowerCase();
    const q = normalize(query);
    
    // 1. Direct Keyword Match
    const match = knowledgeBase.find(item => 
        item.keywords.some(k => q.includes(normalize(k)))
    );
    
    // 2. Fallback to category generalized answers if needed (simplification)
    
    return match ? match.answer : null;
};
