export interface FAQItem {
  id: string;
  category: 'SOLAT' | 'PUASA' | 'WUDHU' | 'AL-QURAN' | 'UMUM' | 'DOA';
  keywords: string[]; // Kata kunci untuk trigger
  question: string;
  answer: string;
  source?: string; // Dalil ringkas
}

export const ISLAMIC_FAQ: FAQItem[] = [
  // --- SOLAT ---
  {
    id: 'solat-jamak-syarat',
    category: 'SOLAT',
    keywords: ['syarat jamak', 'syarat qasar', 'solat musafir', 'berapa km', 'jarak jamak'],
    question: "Apa syarat sah Solat Jamak & Qasar?",
    answer: "Untuk solat Jamak & Qasar (Mazhab Syafi'i), syaratnya ialah:\n1. Perjalanan melebihi 2 marhalah (kira-kira 81KM).\n2. Tujuan perjalanan yang baik (bukan maksiat).\n3. Berniat qasar dalam takbiratul ihram.\n4. Masih dalam keadaan musafir ketika solat.",
    source: "Surah An-Nisa: 101"
  },
  {
    id: 'niat-solat-jamak',
    category: 'SOLAT',
    keywords: ['niat jamak takdim', 'niat jamak takhir', 'lafaz jamak'],
    question: "Bagaimana lafaz niat solat Jamak?",
    answer: "Contoh Jamak Takdim (Zohor + Asar):\n'Sahaja aku solat fardu Zohor 2 rakaat diqasarkan, dihimpunkan kepadanya Asar, Jamak Takdim kerana Allah Taala.'",
  },
  {
    id: 'lupa-rakaat',
    category: 'SOLAT',
    keywords: ['lupa rakaat', 'ragu rakaat', '3 atau 4'],
    question: "Apa perlu buat jika terlupa bilangan rakaat?",
    answer: "Jika ragu-ragu (contoh: 3 atau 4?), ambil bilangan yang **yakin** (iaitu yang sedikit: 3). Tambah satu rakaat lagi, dan lakukan **Sujud Sahwi** sebelum salam.",
    source: "Hadis Riwayat Muslim"
  },
  {
    id: 'sujud-sahwi',
    category: 'SOLAT',
    keywords: ['sujud sahwi', 'cara sujud sahwi', 'bacaan sujud sahwi'],
    question: "Bagaimana cara dan bacaan Sujud Sahwi?",
    answer: "Sujud Sahwi dilakukan dua kali sujud sebelum memberi salam. Bacaannya:\n'Subhana man la yanamu wala yashu' (Maha Suci Allah yang tidak tidur dan tidak lupa).",
  },
  {
    id: 'solat-dhuha',
    category: 'SOLAT',
    keywords: ['solat dhuha', 'waktu dhuha', 'cara dhuha'],
    question: "Panduan ringkas Solat Dhuha?",
    answer: "Waktu: 20 minit selepas Syuruk hingga 15 minit sebelum Zohor.\nRakaat: Minimum 2, Maksimum 12 (biasa buat 2 atau 4).\nKelebihan: Membuka pintu rezeki dan sedekah bagi setiap sendi badan.",
  },

  // --- WUDHU ---
  {
    id: 'batal-wudhu',
    category: 'WUDHU',
    keywords: ['batal wudhu', 'batal air sembahyang', 'sentuh isteri', 'kentut'],
    question: "Perkara yang membatalkan wudhu?",
    answer: "1. Keluar sesuatu dari kubul/dubur (angin, najis).\n2. Hilang akal (tidur tak tetap punggung, mabuk).\n3. Bersentuhan kulit lelaki & wanita ajnabi tanpa lapik (Mazhab Syafi'i).\n4. Menyentuh kemaluan dengan tapak tangan.",
  },
  {
    id: 'wudhu-luka',
    category: 'WUDHU',
    keywords: ['wudhu ada luka', 'balutan', 'simen', 'tayammum'],
    question: "Macam mana wudhu jika ada luka atau balutan (simen)?",
    answer: "Basuh anggota yang sihat seperti biasa. Untuk anggota yang berbalut, cukup sekadar menyapu air (masah) di atas balutan tersebut. Jika balutan itu di anggota wudhu, disunatkan bertayammum sebagai ganti bahagian yang tidak kena air.",
  },

  // --- PUASA ---
  {
    id: 'niat-puasa',
    category: 'PUASA',
    keywords: ['niat puasa', 'doa puasa', 'sahur'],
    question: "Lafaz niat Puasa Ramadan?",
    answer: "Nawaitu sauma ghadin 'an ada'i fardhi syahri Ramadhana hazihis sanati lillahi ta'ala.\n(Sahaja aku berpuasa esok hari untuk menunaikan fardu Ramadan tahun ini kerana Allah Taala).",
  },
  {
    id: 'batal-puasa',
    category: 'PUASA',
    keywords: ['batal puasa', 'korek telinga', 'ubat titis', 'muntah'],
    question: "Apakah perkara yang membatalkan puasa?",
    answer: "1. Makan/minum dengan sengaja.\n2. Muntah dengan sengaja.\n3. Jimak di siang hari.\n4. Memasukkan sesuatu ke dalam rongga terbuka (telinga/hidung) hingga melepasi had batasan.\n5. Haid/Nifas/Gila.",
  },
  {
    id: 'ganti-puasa',
    category: 'PUASA',
    keywords: ['ganti puasa', 'qada puasa', 'fidyah'],
    question: "Cara niat Ganti (Qada') Puasa?",
    answer: "Nawaitu sauma ghadin 'an qada'i fardhi Ramadhana lillahi ta'ala.\n(Sahaja aku berpuasa esok hari untuk qada' fardu Ramadan kerana Allah Taala).",
  },

  // --- AL-QURAN ---
  {
    id: 'baca-quran-haid',
    category: 'AL-QURAN',
    keywords: ['baca quran haid', 'pegang quran haid', 'period'],
    question: "Bolehkan wanita haid membaca Al-Quran?",
    answer: "Wanita haid DILARANG memegang mushaf Al-Quran. Namun, untuk MEMBACA (tanpa sentuh) bagi tujuan zikir, ulang kaji hafalan, atau perlindungan diri, ia DIBENARKAN menurut pendapat yang rajih, asalkan tidak berniat tilawah semata-mata.",
  },
  {
    id: 'sujud-tilawah',
    category: 'AL-QURAN',
    keywords: ['sujud tilawah', 'ayat sajadah', 'sajadah'],
    question: "Apa itu Sujud Tilawah?",
    answer: "Sujud yang disunatkan apabila membaca atau mendengar ayat-ayat Sajadah dalam Al-Quran (tanda kubah masjid). Boleh dilakukan dalam atau luar solat. Bacaan: 'Sajada wajhiya lillazi khalaqahu...'",
  },

  // --- UMUM & DOA ---
  {
    id: 'doa-qunut',
    category: 'DOA',
    keywords: ['doa qunut', 'bacaan qunut', 'qunut subuh'],
    question: "Bacaan Doa Qunut Subuh?",
    answer: "Allahummah dinii fi man hadait, wa 'aafinii fi man 'aafait, wa tawallanii fi man tawallait, wa baarik lii fiima a'thait... (Disunatkan baca semasa i'tidal rakaat kedua Subuh).",
  },
  {
    id: 'doa-makan',
    category: 'DOA',
    keywords: ['doa makan', 'bacaan makan'],
    question: "Doa sebelum makan?",
    answer: "Allahumma barik lana fiima razaqtana waqina 'azabannar. (Ya Allah, berkatilah rezeki yang Engkau kurniakan kepada kami dan peliharalah kami dari azab neraka).",
  },
  {
    id: 'mandi-wajib',
    category: 'UMUM',
    keywords: ['mandi wajib', 'mandi junub', 'cara mandi wajib', 'haid kering'],
    question: "Cara Mandi Wajib yang sah?",
    answer: "Rukun Mandi Wajib ada 3:\n1. Niat ('Sahaja aku mengangkat hadas besar...').\n2. Menghilangkan najis di badan.\n3. Meratakan air ke SELURUH anggota badan (termasuk celah rambut dan lipatan kulit).",
  },
  {
    id: 'hukum-forex',
    category: 'UMUM',
    keywords: ['forex', 'main saham', 'bitcoin', 'kripto'],
    question: "Hukum Forex dan Saham?",
    answer: "Hukum asal Forex (pertukaran mata wang asing) secara individu dalam platform online kebanyakannya adalah **HARAM** menurut Muzakarah Fatwa Kebangsaan kerana mengandungi unsur riba, gharar (ketidakpastian), dan perjudian. Saham yang patuh Syariah (bursa tempatan) adalah HARUS.",
    source: "Muzakarah Jawatankuasa Fatwa MKI"
  },
  // --- NEW ENTRIES ---
  {
    id: 'tayammum',
    category: 'WUDHU',
    keywords: ['tayammum', 'tanpa air', 'debu', 'pasir'],
    question: "Bagaimana cara Tayammum yang betul?",
    answer: "Tayammum ialah bersuci menggunakan tanah/debu apabila tiada air atau tidak mampu menggunakan air.\n\n**Rukun Tayammum:**\n1. Niat ('Sahaja aku bertayammum untuk mengharuskan solat...')\n2. Menyapu muka sekali sapuan\n3. Menyapu kedua-dua tangan hingga siku sekali sapuan\n4. Tertib (ikut turutan)\n\n**Syarat:** Debu yang suci dan berdebu.",
    source: "Surah Al-Maidah: 6"
  },
  {
    id: 'solat-jenazah',
    category: 'SOLAT',
    keywords: ['solat jenazah', 'solat mayat', 'takbir empat'],
    question: "Panduan ringkas Solat Jenazah?",
    answer: "Solat Jenazah terdiri daripada **4 Takbir**:\n\n1. **Takbir 1:** Baca Al-Fatihah\n2. **Takbir 2:** Baca Selawat ke atas Nabi ﷺ\n3. **Takbir 3:** Baca Doa untuk si mati\n4. **Takbir 4:** Baca Doa 'Allahumma la tahrimna ajrahu...'\n\nKemudian beri salam.",
    source: "Hadis Riwayat Bukhari & Muslim"
  },
  {
    id: 'solat-tarawih',
    category: 'SOLAT',
    keywords: ['tarawih', 'terawih', 'rakaat tarawih', 'witir'],
    question: "Berapa rakaat Solat Tarawih?",
    answer: "Terdapat khilaf ulama:\n\n• **8 Rakaat + 3 Witir** - Mengikut hadith riwayat Ibn Abbas\n• **20 Rakaat + 3 Witir** - Amalan zaman Saidina Umar\n\nKedua-duanya SAH. Yang penting solat dengan khusyuk dan istiqamah sepanjang Ramadan.",
    source: "Hadis Riwayat Bukhari"
  },
  {
    id: 'nikah-rukun',
    category: 'UMUM',
    keywords: ['nikah', 'kahwin', 'rukun nikah', 'wali', 'mas kahwin'],
    question: "Apa rukun-rukun Nikah?",
    answer: "**5 Rukun Nikah:**\n\n1. **Pengantin Lelaki** - Sah dan layak berkahwin\n2. **Pengantin Perempuan** - Bukan mahram, tiada halangan\n3. **Wali** - Bapa atau wakil sah (tertib)\n4. **2 Orang Saksi** - Lelaki Islam yang adil\n5. **Ijab dan Qabul** - Lafaz akad nikah",
  },
  {
    id: 'haji-umrah',
    category: 'UMUM',
    keywords: ['haji', 'umrah', 'beza haji', 'rukun haji'],
    question: "Apa beza Haji dan Umrah?",
    answer: "**HAJI:**\n• Wajib sekali seumur hidup (bagi yang mampu)\n• Waktu tertentu (8-13 Zulhijjah)\n• Ada wukuf di Arafah, mabit di Muzdalifah & Mina\n\n**UMRAH:**\n• Sunat bila-bila masa\n• Tiada wukuf\n• Lebih singkat (Ihram, Tawaf, Sa'i, Tahallul)",
    source: "Surah Al-Baqarah: 196"
  },
  {
    id: 'qurban',
    category: 'UMUM',
    keywords: ['korban', 'qurban', 'aqiqah', 'lembu', 'kambing'],
    question: "Hukum dan cara Ibadah Qurban?",
    answer: "Qurban adalah **Sunat Muakkad** bagi yang mampu.\n\n**Jenis Haiwan:**\n• Kambing/Biri-biri: 1 ekor = 1 orang\n• Lembu/Kerbau/Unta: 1 ekor = 7 orang\n\n**Waktu Sembelih:** 10-13 Zulhijjah (selepas solat Eid)\n\n**Pembahagian:** 1/3 untuk diri, 1/3 untuk sedekah, 1/3 untuk hadiah.",
    source: "Surah Al-Hajj: 34"
  },
  {
    id: 'bulan-islam',
    category: 'UMUM',
    keywords: ['bulan islam', 'hijrah', 'hijriah', 'muharram', 'ramadan'],
    question: "Senarai 12 Bulan dalam Kalendar Islam?",
    answer: "1. **Muharram** - Bulan haram, puasa sunat Asyura\n2. **Safar**\n3. **Rabiulawal** - Bulan kelahiran Nabi ﷺ\n4. **Rabiulakhir**\n5. **Jamadilawal**\n6. **Jamadilakhir**\n7. **Rejab** - Bulan Israk Mikraj\n8. **Syaaban** - Nisfu Syaaban\n9. **Ramadan** - Bulan puasa wajib\n10. **Syawal** - Hari Raya Eid Fitri\n11. **Zulkaedah**\n12. **Zulhijjah** - Haji, Eid Adha",
  },
  {
    id: 'doa-tidur',
    category: 'DOA',
    keywords: ['doa tidur', 'sebelum tidur', 'bangun tidur'],
    question: "Doa sebelum dan selepas tidur?",
    answer: "**Sebelum Tidur:**\nبِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا\n_'Bismika Allahumma amutu wa ahya'_\n(Dengan nama-Mu Ya Allah aku mati dan hidup)\n\n**Bangun Tidur:**\nاَلْحَمْدُ لِلَّهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ\n_'Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin nushur'_",
    source: "Hadis Riwayat Bukhari"
  },
  {
    id: 'zikir-pagi-petang',
    category: 'DOA',
    keywords: ['zikir pagi', 'zikir petang', 'wirid', 'istighfar'],
    question: "Panduan ringkas Zikir Pagi dan Petang?",
    answer: "**Zikir Pagi (Selepas Subuh) & Petang (Selepas Asar):**\n\n1. Ayatul Kursi (1x)\n2. Al-Ikhlas, Al-Falaq, An-Nas (3x setiap satu)\n3. Sayyidul Istighfar (1x)\n4. Selawat ke atas Nabi ﷺ (10x)\n5. Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x)\n\n**Fadilat:** Perlindungan dari gangguan syaitan dan musibah.",
  },
  {
    id: 'solat-hajat',
    category: 'SOLAT',
    keywords: ['solat hajat', 'doa hajat', 'permintaan'],
    question: "Cara Solat Hajat untuk memohon sesuatu?",
    answer: "Solat Hajat adalah solat sunat untuk memohon hajat kepada Allah.\n\n**Cara:**\n1. Niat: 'Sahaja aku solat sunat hajat 2 rakaat kerana Allah'\n2. Selepas Fatihah, baca surah apa sahaja\n3. Selepas salam, baca doa hajat dengan penuh khusyuk\n4. Boleh dilakukan pada 1/3 malam terakhir (waktu mustajab)",
  },
  {
    id: 'istikharah',
    category: 'SOLAT',
    keywords: ['istikharah', 'solat pilihan', 'buat keputusan'],
    question: "Bila dan bagaimana Solat Istikharah?",
    answer: "Solat Istikharah dilakukan untuk memohon petunjuk dalam membuat keputusan.\n\n**Cara:**\n1. Solat 2 rakaat seperti biasa\n2. Selepas salam, baca Doa Istikharah (Allahumma inni astakhiruka bi'ilmika...)\n3. Sebutkan hajat dalam hati\n4. Laksanakan keputusan dengan tawakal\n\n**Nota:** Jawapan bukan menerusi mimpi, tetapi kemudahan atau halangan dalam melaksanakan hajat tersebut.",
  },
  {
    id: 'sedekah',
    category: 'UMUM',
    keywords: ['sedekah', 'infaq', 'derma', 'pahala'],
    question: "Kelebihan dan adab bersedekah?",
    answer: "**Kelebihan Sedekah:**\n• Menambah rezeki (Surah Al-Baqarah: 261)\n• Menghapus dosa\n• Memadamkan kemurkaan Allah\n• Pelindung dari api neraka\n\n**Adab:**\n1. Ikhlas kerana Allah\n2. Rahsiakan (tangan kanan tidak tahu apa yang diberi tangan kiri)\n3. Dari harta yang halal\n4. Jangan menyebut-nyebut pemberian",
    source: "Surah Al-Baqarah: 264"
  }
];

