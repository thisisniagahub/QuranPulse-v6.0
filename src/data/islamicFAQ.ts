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
    }
  ];
