-- Migration: Add PDF Content to Ustaz AI Reference
-- Source: packages/reference-content extracted PDFs
-- Date: 2026-01-11
-- ============================================
-- TABLE 1: static_social_media_adab
-- Source: Social_Media__ICT_dalam_Islam_1.pdf
-- ============================================
CREATE TABLE IF NOT EXISTS static_social_media_adab (
    id SERIAL PRIMARY KEY,
    adab_id TEXT UNIQUE NOT NULL,
    title_ar TEXT NOT NULL,
    title_ms TEXT NOT NULL,
    title_en TEXT NOT NULL,
    surah_reference TEXT,
    ayat_number INTEGER,
    description_ms TEXT NOT NULL,
    description_en TEXT NOT NULL,
    practical_tips JSONB DEFAULT '[]',
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Insert 9 Adab Social Media from Surah Al-Hujurat
INSERT INTO static_social_media_adab (
        adab_id,
        title_ar,
        title_ms,
        title_en,
        surah_reference,
        ayat_number,
        description_ms,
        description_en,
        practical_tips,
        priority
    )
VALUES (
        'adab_01',
        'التقوى',
        'Bertaqwa',
        'God-Consciousness',
        'Al-Hujurat',
        1,
        'Bertaqwalah kepada Allah dalam setiap interaksi media sosial. Ingat bahawa Allah Maha Mendengar dan Maha Mengetahui setiap post dan komen kita.',
        'Be conscious of Allah in every social media interaction. Remember that Allah hears and knows every post and comment we make.',
        '["Baca Bismillah sebelum post", "Fikir: Adakah Allah redha?", "Jangan post ketika marah"]'::jsonb,
        1
    ),
    (
        'adab_02',
        'لَا تُقَدِّمُوا',
        'Jangan Memandai-mandai',
        'Do Not Presume',
        'Al-Hujurat',
        1,
        'Jangan terburu-buru mendahului orang yang lebih berautoriti dalam hal agama. Rujuk ulama sebelum berkongsi fatwa atau hukum.',
        'Do not rush ahead of those with more authority in religious matters. Consult scholars before sharing fatwas or rulings.',
        '["Verify sumber sebelum share", "Tag ulama untuk pengesahan", "Jangan jadi ustaz keyboard"]'::jsonb,
        2
    ),
    (
        'adab_03',
        'لَا تَرْفَعُوا أَصْوَاتَكُمْ',
        'Jangan Tinggi Suara',
        'Do Not Raise Your Voice',
        'Al-Hujurat',
        2,
        'Jangan meninggikan suara melebihi suara Nabi atau ulama. Dalam konteks digital, ini bermaksud jangan capitalize semua huruf atau gunakan bahasa kasar.',
        'Do not raise your voice above the Prophet or scholars. In digital context, do not use ALL CAPS or harsh language.',
        '["Elakkan CAPS LOCK", "Guna bahasa sopan", "Hormati pendapat berbeza"]'::jsonb,
        3
    ),
    (
        'adab_04',
        'لَا تَجْهَرُوا',
        'Jangan Menyaring Suara',
        'Do Not Be Loud',
        'Al-Hujurat',
        2,
        'Jangan berkata dengan suara keras seperti kerasnya suara kepada orang biasa. Hormati adab berkomunikasi.',
        'Do not speak loudly as you would to ordinary people. Maintain respectful communication etiquette.',
        '["Kurangkan emoji berlebihan", "Jangan spam komen", "Quality over quantity"]'::jsonb,
        4
    ),
    (
        'adab_05',
        'صَبَرُوا',
        'Bersabar',
        'Be Patient',
        'Al-Hujurat',
        5,
        'Sabar dalam berinteraksi di media sosial. Jangan mengikut emosi dan sentimen. Berfikir sebelum bertindak balas.',
        'Be patient in social media interactions. Do not follow emotions and sentiments. Think before reacting.',
        '["Tunggu 24 jam sebelum reply", "Tarik nafas, baca semula", "Jangan engage trolls"]'::jsonb,
        5
    ),
    (
        'adab_06',
        'فَتَبَيَّنُوا',
        'Selidik (Tabayyun)',
        'Verify Information',
        'Al-Hujurat',
        6,
        'PALING PENTING: Selidik dahulu sebelum menyebarkan berita. Fake news tersebar 6x lebih laju dari berita benar (MIT Study).',
        'MOST IMPORTANT: Verify before spreading news. Fake news spreads 6x faster than true news (MIT Study).',
        '["Check sumber asal", "Guna fact-checker", "Jangan forward tanpa baca", "Minta bukti"]'::jsonb,
        1
    ),
    (
        'adab_07',
        'فَأَصْلِحُوا',
        'Damaikan',
        'Reconcile',
        'Al-Hujurat',
        9,
        'Jika ada perselisihan faham antara saudara di media sosial, cuba damaikan. Jadi peacemaker, bukan provocateur.',
        'If there is conflict between believers on social media, try to reconcile. Be a peacemaker, not a provocateur.',
        '["Private message untuk nasihat", "Jangan fan flames", "Fokus pada common ground"]'::jsonb,
        6
    ),
    (
        'adab_08',
        'أَقْسِطُوا',
        'Berlaku Adil',
        'Be Just',
        'Al-Hujurat',
        9,
        'Bertindak dengan adil setiap kali ada perselisihan. Cuba mencari penyelesaian yang adil untuk kedua-dua pihak.',
        'Act justly in every dispute. Try to find fair solutions for both parties.',
        '["Dengar kedua-dua pihak", "Jangan bias", "Akui kesilapan sendiri"]'::jsonb,
        7
    ),
    (
        'adab_09',
        'لَا يَسْخَرْ',
        'Jangan Mencemuh',
        'Do Not Mock',
        'Al-Hujurat',
        11,
        'Jangan mempersenda atau merendah-rendahkan orang lain. Mungkin mereka lebih baik di sisi Allah.',
        'Do not mock or belittle others. Perhaps they are better in the sight of Allah.',
        '["Elakkan meme menghina", "Jangan body-shame", "Hormati semua golongan"]'::jsonb,
        8
    ) ON CONFLICT (adab_id) DO
UPDATE
SET title_ar = EXCLUDED.title_ar,
    title_ms = EXCLUDED.title_ms,
    title_en = EXCLUDED.title_en,
    description_ms = EXCLUDED.description_ms,
    description_en = EXCLUDED.description_en,
    practical_tips = EXCLUDED.practical_tips;
-- ============================================
-- TABLE 2: static_maqasid_syariah
-- Source: GP_Perhotelan__Perlancongan.pdf
-- ============================================
CREATE TABLE IF NOT EXISTS static_maqasid_syariah (
    id SERIAL PRIMARY KEY,
    maqasid_id TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_ms TEXT NOT NULL,
    name_en TEXT NOT NULL,
    level INTEGER NOT NULL,
    -- 1=Dharuriyyat, 2=Hajiyyat, 3=Tahsiniyyat
    description_ms TEXT NOT NULL,
    description_en TEXT NOT NULL,
    examples JSONB DEFAULT '[]',
    digital_application TEXT,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Insert 5 Maqasid Syariah (Dharuriyyat level)
INSERT INTO static_maqasid_syariah (
        maqasid_id,
        name_ar,
        name_ms,
        name_en,
        level,
        description_ms,
        description_en,
        examples,
        digital_application,
        priority
    )
VALUES (
        'hifz_din',
        'حِفْظ الدِّين',
        'Penjagaan Agama',
        'Preservation of Religion',
        1,
        'Menjaga agama Islam melalui pengurusan organisasi, pentadbiran, dan kepimpinan berteraskan minda maqasid serta sistem pengurusan Islami.',
        'Preserving Islam through organizational management, administration, and leadership based on maqasid mindset and Islamic management systems.',
        '["Solat 5 waktu", "Puasa Ramadan", "Zakat", "Haji", "Ilmu agama"]'::jsonb,
        'Aplikasi solat, reminder zikir, pembelajaran Al-Quran digital, Ustaz AI',
        1
    ),
    (
        'hifz_nafs',
        'حِفْظ النَّفْس',
        'Penjagaan Nyawa',
        'Preservation of Life',
        1,
        'Menjaga nyawa melalui pengawasan keselamatan prasarana, kebajikan para pekerja, dan penyediaan makanan yang selamat.',
        'Preserving life through infrastructure safety supervision, worker welfare, and safe food provision.',
        '["Makanan halal", "Kesihatan", "Keselamatan", "Perlindungan"]'::jsonb,
        'Health tracking, emergency features, halal scanner, wellness reminders',
        2
    ),
    (
        'hifz_aql',
        'حِفْظ العَقْل',
        'Penjagaan Akal',
        'Preservation of Intellect',
        1,
        'Memelihara akal melalui penjanaan pemikiran secara optimum dalam pengurusan perkhidmatan dan penilaian kualiti secara berterusan.',
        'Preserving intellect through optimal thinking in service management and continuous quality assessment.',
        '["Ilmu bermanfaat", "Elak mabuk", "Pendidikan", "Kajian"]'::jsonb,
        'Tapis fake news, critical thinking prompts, educational content, Tabayyun tools',
        3
    ),
    (
        'hifz_nasl',
        'حِفْظ النَّسْل',
        'Penjagaan Keturunan',
        'Preservation of Lineage',
        1,
        'Memelihara keturunan melalui penjagaan kesihatan dan pemakanan yang baik serta etika tingkah laku di kalangan masyarakat.',
        'Preserving lineage through health care, good nutrition, and ethical behavior in society.',
        '["Perkahwinan sah", "Didik anak", "Elak zina", "Keluarga harmoni"]'::jsonb,
        'Family features, parental controls, safe content filtering, marriage guidance',
        4
    ),
    (
        'hifz_mal',
        'حِفْظ المَال',
        'Penjagaan Harta',
        'Preservation of Wealth',
        1,
        'Menjaga harta melibatkan pengurusan kewangan berteraskan syarak dan pemeliharaan serta pemuliharaan aset.',
        'Preserving wealth through Shariah-compliant financial management and asset preservation.',
        '["Zakat", "Elak riba", "Amanah", "Tiada penipuan"]'::jsonb,
        'Zakat calculator, halal investment tracker, riba-free financial tools',
        5
    ) ON CONFLICT (maqasid_id) DO
UPDATE
SET description_ms = EXCLUDED.description_ms,
    description_en = EXCLUDED.description_en,
    digital_application = EXCLUDED.digital_application;
-- ============================================
-- TABLE 3: static_fatwa_guidelines
-- Source: GARIS PANDUAN PENGELUARAN FATWA.pdf
-- ============================================
CREATE TABLE IF NOT EXISTS static_fatwa_guidelines (
    id SERIAL PRIMARY KEY,
    guideline_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    -- 'methodology', 'mazhab', 'source', 'process'
    title_ms TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ms TEXT NOT NULL,
    description_en TEXT NOT NULL,
    reference_books JSONB DEFAULT '[]',
    priority_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Insert Fatwa Guidelines
INSERT INTO static_fatwa_guidelines (
        guideline_id,
        category,
        title_ms,
        title_en,
        description_ms,
        description_en,
        reference_books,
        priority_order
    )
VALUES -- Sources
    (
        'source_quran',
        'source',
        'Al-Quran',
        'The Quran',
        'Sumber utama rujukan hukum',
        'Primary source of Islamic law',
        '[]'::jsonb,
        1
    ),
    (
        'source_sunnah',
        'source',
        'Al-Sunnah',
        'The Sunnah',
        'Perkataan, perbuatan, dan pengakuan Nabi SAW',
        'Sayings, actions, and approvals of Prophet SAW',
        '[]'::jsonb,
        2
    ),
    (
        'source_ijmak',
        'source',
        'Al-Ijmak',
        'Scholarly Consensus',
        'Kesepakatan ulama mujtahid',
        'Consensus of qualified scholars',
        '[]'::jsonb,
        3
    ),
    (
        'source_qiyas',
        'source',
        'Al-Qiyas',
        'Analogical Reasoning',
        'Penentuan hukum berdasarkan persamaan illah',
        'Determining rulings based on similar effective cause',
        '[]'::jsonb,
        4
    ),
    -- Mazhab Priority (Malaysia follows Shafi'i primarily)
    (
        'mazhab_shafii',
        'mazhab',
        'Mazhab Syafi''i',
        'Shafi''i School',
        'Mazhab utama di Malaysia. Qawl muktamad mengikut tertib: 1) Sepakat al-Rafii & al-Nawawi, 2) Pendapat al-Nawawi, 3) Sepakat Ibn Hajar & al-Ramli',
        'Primary school in Malaysia. Authoritative opinion follows: 1) Agreement of al-Rafii & al-Nawawi, 2) Opinion of al-Nawawi, 3) Agreement of Ibn Hajar & al-Ramli',
        '["Al-Majmu''", "Rawdat al-Talibin", "Minhaj al-Talibin", "Tuhfat al-Muhtaj", "Nihayat al-Muhtaj"]'::jsonb,
        1
    ),
    (
        'mazhab_hanafi',
        'mazhab',
        'Mazhab Hanafi',
        'Hanafi School',
        'Dirujuk jika qawl Syafi''i berlawanan dengan kepentingan awam. Sumber: Zahir al-Riwayah, al-Nawadir, al-Fatawa',
        'Referenced if Shafi''i opinion conflicts with public interest. Sources: Zahir al-Riwayah, al-Nawadir, al-Fatawa',
        '["Al-Mabsut al-Sarakhsi", "Bada''i al-Sana''i", "Al-Hidayah", "Radd al-Muhtar"]'::jsonb,
        2
    ),
    (
        'mazhab_maliki',
        'mazhab',
        'Mazhab Maliki',
        'Maliki School',
        'Induk rujukan: al-Mudawwanah al-Kubra. Pendapat Ibn Qasim diutamakan dari riwayat lain',
        'Primary reference: al-Mudawwanah al-Kubra. Ibn Qasim''s opinion prioritized over others',
        '["Al-Mudawwanah", "Mukhtasar Khalil", "Mawahib al-Jalil"]'::jsonb,
        3
    ),
    (
        'mazhab_hanbali',
        'mazhab',
        'Mazhab Hanbali',
        'Hanbali School',
        'Rujukan: Sepakat al-Hijawi & Ibn al-Najjar. Kitab al-Iqna'' dan Muntaha al-Iradat',
        'Reference: Agreement of al-Hijawi & Ibn al-Najjar. Books: al-Iqna'' and Muntaha al-Iradat',
        '["Al-Iqna''", "Muntaha al-Iradat", "Al-Insaf"]'::jsonb,
        4
    ),
    -- Process
    (
        'process_research',
        'process',
        'Kajian & Penyelidikan',
        'Research & Investigation',
        'Sebelum fatwa dikeluarkan, kajian menyeluruh mesti dilakukan termasuk: Tujuan, Latar Belakang, Masalah, Metodologi, Hujah & Dalil, Analisis, Tarjih, Syor',
        'Before issuing fatwa, comprehensive research must include: Purpose, Background, Problem, Methodology, Evidence, Analysis, Weighing, Recommendation',
        '[]'::jsonb,
        1
    ),
    (
        'process_maslahah',
        'process',
        'Kepentingan Awam (Maslahah)',
        'Public Interest',
        'Fatwa boleh menyimpang dari qawl muktamad jika bertentangan dengan kepentingan awam yang selaras dengan maqasid syariah',
        'Fatwa may deviate from established opinion if it conflicts with public interest aligned with maqasid shariah',
        '[]'::jsonb,
        2
    ),
    (
        'process_ijtihad',
        'process',
        'Ijtihad',
        'Independent Reasoning',
        'Jika tiada qawl muktamad dari empat mazhab, Jawatankuasa Fatwa boleh berijtihad menggunakan: Istihsan, Masalih Mursalah, Urf, Sadd al-Dharai''',
        'If no established opinion from four schools, Fatwa Committee may use: Istihsan, Public Interest, Custom, Blocking Harm',
        '[]'::jsonb,
        3
    ) ON CONFLICT (guideline_id) DO
UPDATE
SET description_ms = EXCLUDED.description_ms,
    description_en = EXCLUDED.description_en,
    reference_books = EXCLUDED.reference_books;
-- ============================================
-- TABLE 4: static_kafa_curriculum
-- Source: PROGRAM_KAFA.pdf
-- ============================================
CREATE TABLE IF NOT EXISTS static_kafa_curriculum (
    id SERIAL PRIMARY KEY,
    subject_id TEXT UNIQUE NOT NULL,
    name_ar TEXT,
    name_ms TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ms TEXT NOT NULL,
    description_en TEXT NOT NULL,
    year_levels TEXT [],
    -- ['Tahun 1', 'Tahun 2', etc.]
    learning_outcomes JSONB DEFAULT '[]',
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Insert KAFA Curriculum (8 subjects)
INSERT INTO static_kafa_curriculum (
        subject_id,
        name_ar,
        name_ms,
        name_en,
        description_ms,
        description_en,
        year_levels,
        learning_outcomes,
        priority
    )
VALUES (
        'kafa_quran',
        'القرآن',
        'Al-Quran',
        'Quran Studies',
        'Pembelajaran bacaan Al-Quran dengan tajwid yang betul. Fokus kepada penguasaan makhraj, sifat huruf, dan hukum tajwid.',
        'Learning Quran recitation with correct tajwid. Focus on makhraj mastery, letter characteristics, and tajwid rules.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Boleh membaca Al-Quran dengan lancar", "Mengenal hukum tajwid asas", "Mampu menyebut makhraj dengan betul"]'::jsonb,
        1
    ),
    (
        'kafa_akidah',
        'العقيدة',
        'Akidah',
        'Islamic Creed',
        'Pembentukan akidah yang kukuh berdasarkan Ahli Sunnah Wal Jamaah. Mengenal Allah, Malaikat, Kitab, Rasul, Hari Akhirat, Qada dan Qadar.',
        'Building strong creed based on Ahlus Sunnah Wal Jamaah. Knowing Allah, Angels, Books, Messengers, Day of Judgment, Divine Decree.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Menghafal Rukun Iman", "Memahami sifat 20", "Menolak perkara syirik"]'::jsonb,
        2
    ),
    (
        'kafa_ibadah',
        'العبادة',
        'Ibadah',
        'Worship',
        'Bimbingan amali fardu ain. Wudhu, solat, puasa, dan ibadah asas yang wajib dikuasai setiap Muslim.',
        'Practical guidance for individual obligations. Ablution, prayer, fasting, and basic worship every Muslim must master.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Menguasai wudhu dan solat", "Mengetahui syarat dan rukun puasa", "Mengamalkan doa harian"]'::jsonb,
        3
    ),
    (
        'kafa_sirah',
        'السيرة',
        'Sirah',
        'Prophetic Biography',
        'Kisah sejarah Nabi Muhammad SAW dan para sahabat. Pengajaran dan teladan dari peristiwa dalam Islam.',
        'History of Prophet Muhammad SAW and companions. Lessons and examples from events in Islamic history.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Mengenali Nabi Muhammad SAW", "Menghafal nama Khulafa al-Rasyidin", "Mengambil iktibar dari sirah"]'::jsonb,
        4
    ),
    (
        'kafa_adab',
        'الأدب',
        'Adab',
        'Islamic Etiquette',
        'Amalan adab Islamiah yang baik. Adab dengan Allah, ibu bapa, guru, rakan, dan masyarakat.',
        'Good Islamic etiquette practices. Etiquette with Allah, parents, teachers, friends, and society.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Mengamalkan adab makan minum", "Menghormati ibu bapa", "Menjaga adab bermasyarakat"]'::jsonb,
        5
    ),
    (
        'kafa_arabic',
        'اللغة العربية',
        'Bahasa Arab',
        'Arabic Language',
        'Asas bahasa Arab untuk pemahaman Al-Quran. Kosa kata, ungkapan mudah, dan pengenalan nahu.',
        'Basic Arabic for understanding Quran. Vocabulary, simple expressions, and introduction to grammar.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Mengenal huruf hijaiyah", "Membaca perkataan Arab mudah", "Memahami kosa kata asas"]'::jsonb,
        6
    ),
    (
        'kafa_jawi',
        'الجاوي والخط',
        'Jawi dan Khat',
        'Jawi Script and Calligraphy',
        'Penulisan dan pembacaan tulisan Jawi. Seni khat Islam untuk mengindahkan tulisan.',
        'Reading and writing Jawi script. Islamic calligraphy art to beautify writing.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Menulis Jawi dengan betul", "Membaca teks Jawi", "Menghias tulisan dengan khat"]'::jsonb,
        7
    ),
    (
        'kafa_tahfiz',
        'تحفيظ القرآن',
        'Tahfiz Al-Quran',
        'Quran Memorization',
        'Penghafalan surah-surah pilihan Al-Quran. Bermula dengan surah pendek dan beransur ke surah panjang.',
        'Memorization of selected Quran chapters. Starting with short chapters progressing to longer ones.',
        ARRAY ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'],
        '["Menghafal Juz Amma", "Murajaah harian", "Tajwid dalam hafalan"]'::jsonb,
        8
    ) ON CONFLICT (subject_id) DO
UPDATE
SET description_ms = EXCLUDED.description_ms,
    description_en = EXCLUDED.description_en,
    learning_outcomes = EXCLUDED.learning_outcomes;
-- ============================================
-- ADD MORE FAQ FROM PDFs to existing table
-- ============================================
INSERT INTO static_islamic_faq (
        faq_id,
        question_ms,
        question_en,
        answer_ms,
        answer_en,
        category,
        source,
        keywords
    )
VALUES -- Social Media Adab
    (
        'social_01',
        'Apakah adab utama menggunakan media sosial menurut Islam?',
        'What is the main etiquette for using social media according to Islam?',
        'Adab utama adalah TABAYYUN (فَتَبَيَّنُوا) dari Surah Al-Hujurat ayat 6: Selidiki terlebih dahulu sebelum menyebarkan sebarang berita. Kajian MIT mendapati berita palsu tersebar 6 kali lebih pantas dari berita benar.',
        'The main etiquette is TABAYYUN (Verification) from Surah Al-Hujurat verse 6: Verify before spreading any news. MIT research found fake news spreads 6 times faster than true news.',
        'social_media',
        'Al-Quran Al-Hujurat: 6, MIT Study',
        '["tabayyun", "media sosial", "fake news", "verify"]'::jsonb
    ),
    (
        'social_02',
        'Bolehkah menggunakan ALL CAPS dalam komen media sosial?',
        'Can I use ALL CAPS in social media comments?',
        'Tidak digalakkan. Dalam Surah Al-Hujurat ayat 2, Allah melarang meninggikan suara melebihi suara Nabi. ALL CAPS dianggap seperti menjerit secara digital dan kurang beradab.',
        'Not recommended. In Surah Al-Hujurat verse 2, Allah forbids raising voice above the Prophet. ALL CAPS is considered digital shouting and lacks etiquette.',
        'social_media',
        'Al-Quran Al-Hujurat: 2',
        '["caps", "etika", "adab", "komen"]'::jsonb
    ),
    -- Maqasid Syariah
    (
        'maqasid_01',
        'Apakah 5 Maqasid Syariah?',
        'What are the 5 Maqasid Shariah?',
        'Lima Maqasid Syariah (Objektif Syariat) adalah:
1. Hifz al-Din (Penjagaan Agama)
2. Hifz al-Nafs (Penjagaan Nyawa)
3. Hifz al-''Aql (Penjagaan Akal)
4. Hifz al-Nasl (Penjagaan Keturunan)
5. Hifz al-Mal (Penjagaan Harta)

Ini adalah asas kepada semua hukum Islam.',
        'The five Maqasid Shariah (Objectives of Islamic Law) are:
1. Hifz al-Din (Preservation of Religion)
2. Hifz al-Nafs (Preservation of Life)
3. Hifz al-''Aql (Preservation of Intellect)
4. Hifz al-Nasl (Preservation of Lineage)
5. Hifz al-Mal (Preservation of Wealth)

These are the foundation of all Islamic rulings.',
        'maqasid',
        'Usul al-Fiqh',
        '["maqasid", "syariah", "objektif"]'::jsonb
    ),
    -- Fatwa Process
    (
        'fatwa_01',
        'Bagaimana fatwa dikeluarkan di Malaysia?',
        'How are fatwas issued in Malaysia?',
        'Proses pengeluaran fatwa di Malaysia:
1. Kajian dan penyelidikan oleh penyelidik
2. Rujukan kepada qawl muktamad Mazhab Syafi''i (utama)
3. Jika berlawanan kepentingan awam, rujuk mazhab lain
4. Pembentangan dalam Jawatankuasa Fatwa
5. Keputusan berdasarkan dalil dan maslahah
6. Pewartaan dalam Warta Kerajaan',
        'Fatwa issuance process in Malaysia:
1. Research and investigation by researchers
2. Reference to authoritative opinion of Shafi''i school (primary)
3. If against public interest, consult other schools
4. Presentation in Fatwa Committee
5. Decision based on evidence and public benefit
6. Gazette in Government Gazette',
        'fatwa',
        'Garis Panduan Pengeluaran Fatwa JAKIM',
        '["fatwa", "proses", "malaysia"]'::jsonb
    ),
    -- KAFA
    (
        'kafa_01',
        'Apakah program KAFA?',
        'What is the KAFA program?',
        'KAFA (Kelas Al-Quran dan Fardu Ain) adalah program pengukuhan asas Pendidikan Islam untuk kanak-kanak 7-12 tahun, dilaksanakan sejak 1990.

Statistik (2021):
- 1.2 juta murid
- 35,000 guru
- 5,943 premis
- 8 subjek: Al-Quran, Akidah, Ibadah, Sirah, Adab, Bahasa Arab, Jawi & Khat, Tahfiz',
        'KAFA (Quran and Fardu Ain Classes) is an Islamic education enhancement program for children aged 7-12, implemented since 1990.

Statistics (2021):
- 1.2 million students
- 35,000 teachers
- 5,943 premises
- 8 subjects: Quran, Creed, Worship, Prophetic Biography, Etiquette, Arabic, Jawi & Calligraphy, Memorization',
        'kafa',
        'JAKIM',
        '["kafa", "pendidikan", "al-quran", "fardu ain"]'::jsonb
    ) ON CONFLICT (faq_id) DO
UPDATE
SET answer_ms = EXCLUDED.answer_ms,
    answer_en = EXCLUDED.answer_en;
-- ============================================
-- Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_social_media_adab_priority ON static_social_media_adab(priority);
CREATE INDEX IF NOT EXISTS idx_maqasid_level ON static_maqasid_syariah(level);
CREATE INDEX IF NOT EXISTS idx_fatwa_category ON static_fatwa_guidelines(category);
CREATE INDEX IF NOT EXISTS idx_kafa_subject ON static_kafa_curriculum(subject_id);
-- Grant permissions
GRANT SELECT ON static_social_media_adab TO authenticated,
    anon;
GRANT SELECT ON static_maqasid_syariah TO authenticated,
    anon;
GRANT SELECT ON static_fatwa_guidelines TO authenticated,
    anon;
GRANT SELECT ON static_kafa_curriculum TO authenticated,
    anon;
COMMENT ON TABLE static_social_media_adab IS 'Social media etiquette based on Surah Al-Hujurat';
COMMENT ON TABLE static_maqasid_syariah IS 'Five objectives of Islamic law (Maqasid Shariah)';
COMMENT ON TABLE static_fatwa_guidelines IS 'Guidelines for fatwa issuance in Malaysia';
COMMENT ON TABLE static_kafa_curriculum IS 'KAFA curriculum subjects and learning outcomes';
