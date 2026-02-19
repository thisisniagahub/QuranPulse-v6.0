-- Seed Data for Static Content
-- Generated automatically

-- Data for static_tajweed_rules
INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('ikhfa_haqiqi', 'الإخفاء الحقيقي', 'Ikhfa'' Haqiqi', 'True Concealment', 'nun_sakinah', 'Menyembunyikan bunyi Nun Sakinah atau Tanwin dengan dengung (ghunnah) apabila bertemu 15 huruf Ikhfa''. Dengung mestilah 2 harakat.', 'Concealing the sound of Nun Sakinah or Tanwin with a nasal sound (ghunnah) when meeting the 15 Ikhfa'' letters. The ghunnah should be 2 counts.', '[{"arabic":"مِنْ تَحْتِهَا","transliteration":"min tahtiha","surah_ayah":"Al-Baqarah: 25"},{"arabic":"أَنْثَى","transliteration":"untha","surah_ayah":"An-Nisa: 11"},{"arabic":"مَنْ ذَا","transliteration":"man dza","surah_ayah":"Al-Baqarah: 255"}]'::jsonb, '["Tidak mengeluarkan dengung","Dengung terlalu panjang atau pendek","Mengizharkan huruf dengan jelas"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('idgham_bighunnah', 'الإدغام بغنة', 'Idgham Bighunnah', 'Merging with Nasalization', 'nun_sakinah', 'Memasukkan Nun Sakinah atau Tanwin ke dalam huruf يَنْمُو (Ya, Nun, Mim, Waw) dengan dengung 2 harakat.', 'Merging Nun Sakinah or Tanwin into the letters Ya, Nun, Mim, Waw with a ghunnah of 2 counts.', '[{"arabic":"مَنْ يَعْمَلْ","transliteration":"may ya''mal","surah_ayah":"An-Nisa: 123"},{"arabic":"مِنْ وَلِيٍّ","transliteration":"miw waliyyin","surah_ayah":"Al-Baqarah: 107"}]'::jsonb, '["Tidak memasukkan huruf dengan sempurna","Lupa dengung"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('idgham_bilaghunnah', 'الإدغام بلا غنة', 'Idgham Bila Ghunnah', 'Merging without Nasalization', 'nun_sakinah', 'Memasukkan Nun Sakinah atau Tanwin ke dalam huruf Lam atau Ra tanpa dengung.', 'Merging Nun Sakinah or Tanwin into Lam or Ra without ghunnah.', '[{"arabic":"مِنْ رَبِّهِمْ","transliteration":"mir rabbihim","surah_ayah":"Al-Baqarah: 5"},{"arabic":"مِنْ لَدُنْكَ","transliteration":"mil ladunka","surah_ayah":"Al-Kahf: 65"}]'::jsonb, '["Menambah dengung","Tidak memasukkan huruf dengan sempurna"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('iqlab', 'الإقلاب', 'Iqlab', 'Conversion', 'nun_sakinah', 'Menukarkan Nun Sakinah atau Tanwin kepada Mim apabila bertemu huruf Ba dengan dengung 2 harakat.', 'Converting Nun Sakinah or Tanwin to Mim when meeting the letter Ba, with ghunnah of 2 counts.', '[{"arabic":"مِنْ بَعْدِ","transliteration":"mim ba''di","surah_ayah":"Al-Baqarah: 27"},{"arabic":"أَنْبِئْهُمْ","transliteration":"ambi''hum","surah_ayah":"Al-Baqarah: 33"}]'::jsonb, '["Tidak menukar kepada Mim","Lupa dengung"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('izhar_halqi', 'الإظهار الحلقي', 'Izhar Halqi', 'Clear Pronunciation (Throat)', 'nun_sakinah', 'Menyebut Nun Sakinah atau Tanwin dengan jelas tanpa dengung apabila bertemu 6 huruf halqi: ء ه ع ح غ خ', 'Pronouncing Nun Sakinah or Tanwin clearly without ghunnah when meeting the 6 throat letters.', '[{"arabic":"مِنْ عِنْدِ","transliteration":"min ''indi","surah_ayah":"Al-Baqarah: 79"},{"arabic":"مَنْ آمَنَ","transliteration":"man aamana","surah_ayah":"Al-Baqarah: 62"}]'::jsonb, '["Menambah dengung","Menyembunyikan bunyi Nun"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('ikhfa_syafawi', 'الإخفاء الشفوي', 'Ikhfa'' Syafawi', 'Labial Concealment', 'mim_sakinah', 'Menyembunyikan Mim Sakinah dengan dengung apabila bertemu huruf Ba.', 'Concealing Mim Sakinah with ghunnah when meeting the letter Ba.', '[{"arabic":"تَرْمِيهِمْ بِحِجَارَةٍ","transliteration":"tarmiihim bihijaaratin","surah_ayah":"Al-Fil: 4"}]'::jsonb, '["Tidak mengeluarkan dengung","Bibir tidak rapat"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('idgham_mithlain', 'الإدغام المتماثلين', 'Idgham Mithlain', 'Merging of Similar Letters', 'mim_sakinah', 'Memasukkan Mim Sakinah ke dalam Mim dengan dengung.', 'Merging Mim Sakinah into another Mim with ghunnah.', '[{"arabic":"لَهُمْ مَا","transliteration":"lahum maa","surah_ayah":"Al-Baqarah: 25"}]'::jsonb, '["Lupa dengung","Tidak memasukkan dengan sempurna"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('izhar_syafawi', 'الإظهار الشفوي', 'Izhar Syafawi', 'Labial Clear Pronunciation', 'mim_sakinah', 'Menyebut Mim Sakinah dengan jelas apabila bertemu huruf selain Ba dan Mim.', 'Pronouncing Mim Sakinah clearly when meeting letters other than Ba and Mim.', '[{"arabic":"هُمْ فِيهَا","transliteration":"hum fiihaa","surah_ayah":"Al-Baqarah: 25"}]'::jsonb, '["Menambah dengung"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('madd_asli', 'المد الأصلي', 'Mad Asli (Tabi''i)', 'Natural Prolongation', 'madd', 'Panjangkan 2 harakat dengan huruf mad (Alif, Waw, Ya) tanpa sebab.', 'Prolong for 2 counts with mad letters (Alif, Waw, Ya) without any cause.', '[{"arabic":"قَالُوا","transliteration":"qaaluu","surah_ayah":"Al-Baqarah: 11"},{"arabic":"فِيهِ","transliteration":"fiihi","surah_ayah":"Al-Baqarah: 2"}]'::jsonb, '["Mad terlalu panjang atau pendek"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('madd_wajib', 'المد الواجب المتصل', 'Mad Wajib Muttasil', 'Obligatory Connected Prolongation', 'madd', 'Panjangkan 4-5 harakat apabila huruf mad bertemu hamzah dalam satu kalimah.', 'Prolong 4-5 counts when a mad letter meets hamzah in the same word.', '[{"arabic":"جَاءَ","transliteration":"jaa-a","surah_ayah":"An-Nasr: 1"},{"arabic":"سُوءٌ","transliteration":"suu-un","surah_ayah":"Al-An''am: 31"}]'::jsonb, '["Tidak cukup panjang","Terlalu panjang melebihi 5 harakat"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('madd_jaiz', 'المد الجائز المنفصل', 'Mad Jaiz Munfasil', 'Permissible Separated Prolongation', 'madd', 'Panjangkan 2-4-5 harakat apabila huruf mad di akhir kalimah bertemu hamzah di awal kalimah seterusnya.', 'Prolong 2-4-5 counts when a mad letter at the end of a word meets hamzah at the start of the next word.', '[{"arabic":"بِمَا أُنْزِلَ","transliteration":"bimaa unzila","surah_ayah":"Al-Baqarah: 4"},{"arabic":"فِي أَنْفُسِكُمْ","transliteration":"fii anfusikum","surah_ayah":"Al-Baqarah: 235"}]'::jsonb, '["Inconsistent prolongation"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('madd_lazim', 'المد اللازم', 'Mad Lazim', 'Obligatory Prolongation', 'madd', 'Panjangkan 6 harakat apabila huruf mad bertemu sukun asli dalam satu kalimah.', 'Prolong for 6 counts when a mad letter meets an original sukun in the same word.', '[{"arabic":"الضَّالِّينَ","transliteration":"ad-daalliiin","surah_ayah":"Al-Fatihah: 7"},{"arabic":"الْحَاقَّةُ","transliteration":"al-haaqqah","surah_ayah":"Al-Haqqah: 1"}]'::jsonb, '["Tidak cukup 6 harakat"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('qalqalah', 'القلقلة', 'Qalqalah', 'Echoing/Bouncing Sound', 'special', 'Menghasilkan bunyi pantulan pada huruf ق ط ب ج د apabila berbaris mati. Qalqalah Sughra (tengah) dan Kubra (akhir/waqf).', 'Producing an echoing sound on letters Qaf, Tha, Ba, Jim, Dal when they carry sukun. Sughra (middle) and Kubra (end/stop).', '[{"arabic":"يَخْلُقْ","transliteration":"yakhluq","surah_ayah":"Al-Mulk: 3"},{"arabic":"أَحَدٌ","transliteration":"ahad","surah_ayah":"Al-Ikhlas: 1"}]'::jsonb, '["Qalqalah terlalu kuat atau lemah","Menambah huruf tambahan"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('ghunnah', 'الغنة', 'Ghunnah', 'Nasalization', 'special', 'Bunyi dengung dari hidung selama 2 harakat. Berlaku pada Nun dan Mim bertasydid, serta dalam hukum ikhfa'' dan idgham.', 'Nasal sound from the nose for 2 counts. Occurs with Nun and Mim with shaddah, and in ikhfa'' and idgham rules.', '[{"arabic":"إِنَّ","transliteration":"inna","surah_ayah":"Al-Baqarah: 6"},{"arabic":"ثُمَّ","transliteration":"thumma","surah_ayah":"Al-Baqarah: 28"}]'::jsonb, '["Dengung terlalu panjang atau pendek","Bunyi tidak keluar dari hidung"]'::jsonb, 1)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('ra_tafkhim', 'الراء المفخمة', 'Ra Tafkhim', 'Heavy Ra', 'ra', 'Ra dibaca tebal apabila berbaris fathah, dhammah, atau sukun selepas fathah/dhammah.', 'Ra is pronounced thick/heavy when it has fathah, dhammah, or sukun after fathah/dhammah.', '[{"arabic":"رَبِّ","transliteration":"rabb","surah_ayah":"Al-Fatihah: 2"},{"arabic":"الْقُرْآنَ","transliteration":"al-qur-aan","surah_ayah":"Ya-Sin: 2"}]'::jsonb, '["Ra terlalu nipis"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('ra_tarqiq', 'الراء المرققة', 'Ra Tarqiq', 'Light Ra', 'ra', 'Ra dibaca nipis apabila berbaris kasrah atau sukun selepas kasrah.', 'Ra is pronounced thin/light when it has kasrah or sukun after kasrah.', '[{"arabic":"رِجَالٌ","transliteration":"rijaal","surah_ayah":"An-Nur: 37"},{"arabic":"فِرْعَوْنَ","transliteration":"fir''awn","surah_ayah":"Al-Baqarah: 49"}]'::jsonb, '["Ra terlalu tebal"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

INSERT INTO static_tajweed_rules ("rule_id", "name_ar", "name_ms", "name_en", "category", "description_ms", "description_en", "examples", "common_mistakes", "priority") VALUES ('lam_jalalah', 'لام الجلالة', 'Lam Jalalah', 'Lam of Allah', 'special', 'Lam dalam lafaz Allah. Tebal selepas fathah/dhammah, nipis selepas kasrah.', 'The Lam in the word Allah. Thick after fathah/dhammah, thin after kasrah.', '[{"arabic":"قُلِ اللَّهُ","transliteration":"qulil-laah","surah_ayah":"Al-Ikhlas: 1"},{"arabic":"بِسْمِ اللَّهِ","transliteration":"bismil-laah","surah_ayah":"Al-Fatihah: 1"}]'::jsonb, '["Tidak membezakan tebal dan nipis"]'::jsonb, 2)
ON CONFLICT (rule_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "category" = EXCLUDED."category", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "examples" = EXCLUDED."examples", "common_mistakes" = EXCLUDED."common_mistakes", "priority" = EXCLUDED."priority";

-- Data for static_makhraj_points
INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('halq_adna', 'أدنى الحلق', 'Tenggorok Atas', 'Upper Throat', '["غ","خ"]'::jsonb, 'throat', 'Bahagian atas kerongkong, berdekatan dengan lelangit lembut. Ghain (غ) dan Kha (خ) keluar dari sini.', 'Upper part of the throat, near the soft palate. Ghain (غ) and Kha (خ) originate from here.', 'Rasakan getaran di bahagian atas tekak. Cuba kata ''ghar'' untuk Ghain.', 'Feel the vibration in the upper throat. Try saying ''ghar'' for Ghain.', 'M 80 60 Q 90 50 100 60')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('halq_wasat', 'وسط الحلق', 'Tenggorok Tengah', 'Middle Throat', '["ع","ح"]'::jsonb, 'throat', 'Bahagian tengah kerongkong. Ain (ع) dan Ha (ح) keluar dari sini.', 'Middle part of the throat. Ain (ع) and Ha (ح) originate from here.', 'Ain memerlukan tekanan dari tengah tekak. Ha adalah nafas dari sini.', 'Ain requires pressure from middle throat. Ha is a breath from here.', 'M 80 75 Q 90 70 100 75')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('halq_aqsa', 'أقصى الحلق', 'Pangkal Tenggorok', 'Deepest Throat', '["ء","ه"]'::jsonb, 'throat', 'Bahagian paling dalam kerongkong. Hamzah (ء) dan Ha (ه) keluar dari sini.', 'Deepest part of the throat. Hamzah (ء) and Ha (ه) originate from here.', 'Hamzah adalah hentian dalam tekak. Ha adalah hembusan lembut.', 'Hamzah is a glottal stop. Ha is a gentle breath.', 'M 80 90 Q 90 85 100 90')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_aqsa', 'أقصى اللسان', 'Pangkal Lidah', 'Back of Tongue', '["ق","ك"]'::jsonb, 'tongue_back', 'Pangkal lidah menyentuh langit-langit lembut. Qaf (ق) lebih belakang, Kaf (ك) sedikit ke depan.', 'Back of tongue touching soft palate. Qaf (ق) is further back, Kaf (ك) slightly forward.', 'Qaf perlu tekanan kuat di pangkal lidah. Kaf lebih ringan.', 'Qaf needs strong pressure at tongue base. Kaf is lighter.', 'M 110 70 Q 120 60 130 70')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_wasat', 'وسط اللسان', 'Tengah Lidah', 'Middle of Tongue', '["ج","ش","ي"]'::jsonb, 'tongue_middle', 'Tengah lidah menyentuh langit-langit keras. Jim (ج), Shin (ش), dan Ya (ي) keluar dari sini.', 'Middle of tongue touching hard palate. Jim (ج), Shin (ش), and Ya (ي) originate here.', 'Jim seperti ''j'' keras. Shin adalah ''sy''. Ya seperti ''y'' dalam ''ya''.', 'Jim is like hard ''j''. Shin is ''sh''. Ya is like ''y'' in ''yes''.', 'M 130 85 Q 140 75 150 85')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_haffa', 'حافة اللسان', 'Tepi Lidah', 'Edge of Tongue', '["ض"]'::jsonb, 'tongue_edge', 'Tepi lidah menyentuh geraham atas. Dhad (ض) adalah huruf unik Arab, hanya ada dalam bahasa Arab.', 'Edge of tongue touching upper molars. Dhad (ض) is unique to Arabic language.', 'Tekan tepi lidah ke geraham atas, bukan gigi depan.', 'Press tongue edge against upper molars, not front teeth.', 'M 140 95 Q 150 90 160 95')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_haffa_lam', 'حافة اللسان للام', 'Tepi Lidah (Lam)', 'Tongue Edge (Lam)', '["ل"]'::jsonb, 'tongue_edge', 'Hujung depan tepi lidah menyentuh gusi atas dari gigi taring ke gigi taring.', 'Front edge of tongue touching upper gums from canine to canine.', 'Lam keluar dari bahagian lebih depan berbanding Dhad.', 'Lam comes from further front compared to Dhad.', 'M 145 98 Q 155 93 165 98')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_adna', 'أدنى اللسان', 'Hujung Lidah + Gusi', 'Tongue Tip + Gums', '["ن","ر"]'::jsonb, 'tongue_tip', 'Hujung lidah menyentuh gusi atas. Nun (ن) pada hujung, Ra (ر) sedikit lebih belakang.', 'Tongue tip touching upper gums. Nun (ن) at the tip, Ra (ر) slightly further back.', 'Nun keluar dari hujung lidah. Ra perlu getaran ringan.', 'Nun comes from tongue tip. Ra needs light vibration.', 'M 155 100 Q 165 95 175 100')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_tarafa', 'طرف اللسان مع أصول الثنايا', 'Hujung Lidah + Pangkal Gigi', 'Tongue Tip + Tooth Roots', '["ط","د","ت"]'::jsonb, 'tongue_tip', 'Hujung lidah menyentuh pangkal gigi atas. Ta (ت), Dal (د), Tha (ط) berbeza ketebalan.', 'Tongue tip touching upper tooth roots. Ta (ت), Dal (د), Tha (ط) differ in thickness.', 'Tha adalah versi tebal Ta. Dal di antara keduanya.', 'Tha is thick version of Ta. Dal is in between.', 'M 170 105 Q 180 100 190 105')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('lisan_thana', 'طرف اللسان مع أطراف الثنايا', 'Hujung Lidah + Hujung Gigi', 'Tongue Tip + Tooth Tips', '["ظ","ذ","ث"]'::jsonb, 'tongue_tip', 'Hujung lidah keluar antara gigi atas dan bawah. Zha (ظ), Dzal (ذ), Tha (ث).', 'Tongue tip protrudes between upper and lower teeth. Zha (ظ), Dzal (ذ), Tha (ث).', 'Lidah mesti nampak keluar sedikit antara gigi.', 'Tongue must be slightly visible between teeth.', 'M 185 110 Q 195 105 205 110')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('safir', 'الصفير', 'Huruf Siulan', 'Whistling Letters', '["ص","س","ز"]'::jsonb, 'tongue_tip', 'Hujung lidah berdekatan gigi bawah, menghasilkan bunyi siulan. Sad (ص), Sin (س), Zay (ز).', 'Tongue tip near lower teeth, producing whistling sound. Sad (ص), Sin (س), Zay (ز).', 'Bunyi ''s'' dengan udara melalui celah gigi.', 'A ''s'' sound with air passing through teeth gap.', 'M 180 115 Q 190 110 200 115')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('shafa_batin', 'بطن الشفة السفلى', 'Bibir Bawah + Gigi', 'Lower Lip + Teeth', '["ف"]'::jsonb, 'lips', 'Bibir bawah dalam menyentuh hujung gigi atas. Fa (ف).', 'Inner lower lip touching upper teeth tips. Fa (ف).', 'Seperti bunyi ''f'' dalam bahasa Inggeris.', 'Like the ''f'' sound in English.', 'M 195 125 Q 205 120 215 125')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('shafatan', 'الشفتان', 'Dua Bibir', 'Both Lips', '["ب","م","و"]'::jsonb, 'lips', 'Kedua-dua bibir bertemu. Ba (ب), Mim (م), Waw (و).', 'Both lips meeting. Ba (ب), Mim (م), Waw (و).', 'Ba dan Mim bibir rapat. Waw bibir membulat.', 'Ba and Mim lips closed. Waw lips rounded.', 'M 200 120 Q 210 115 220 120')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('khayshum', 'الخيشوم', 'Rongga Hidung', 'Nasal Cavity', '["ن","م"]'::jsonb, 'nasal', 'Rongga hidung untuk bunyi dengung (ghunnah). Digunakan dalam Nun dan Mim bertasydid.', 'Nasal cavity for nasalization (ghunnah). Used in Nun and Mim with shaddah.', 'Ghunnah keluar dari hidung, bukan mulut.', 'Ghunnah comes from nose, not mouth.', 'M 150 40 Q 160 30 170 40')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

INSERT INTO static_makhraj_points ("point_id", "name_ar", "name_ms", "name_en", "letters", "position", "description_ms", "description_en", "practice_tips_ms", "practice_tips_en", "svg_path") VALUES ('jawf', 'الجوف', 'Rongga Mulut', 'Oral Cavity', '["ا","و","ي"]'::jsonb, 'cavity', 'Rongga mulut dan tekak untuk huruf mad. Alif, Waw, Ya apabila menjadi huruf mad.', 'Oral and throat cavity for prolongation letters. Alif, Waw, Ya when functioning as mad letters.', 'Bunyi keluar dari rongga tanpa halangan.', 'Sound exits from cavity without obstruction.', 'M 100 100 Q 130 80 160 100')
ON CONFLICT (point_id) DO UPDATE SET "name_ar" = EXCLUDED."name_ar", "name_ms" = EXCLUDED."name_ms", "name_en" = EXCLUDED."name_en", "letters" = EXCLUDED."letters", "position" = EXCLUDED."position", "description_ms" = EXCLUDED."description_ms", "description_en" = EXCLUDED."description_en", "practice_tips_ms" = EXCLUDED."practice_tips_ms", "practice_tips_en" = EXCLUDED."practice_tips_en", "svg_path" = EXCLUDED."svg_path";

-- Data for static_doa
INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('morning_1', 'Doa Bangun Tidur', 'Supplication Upon Waking', 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', 'Alhamdulillahil-ladzi ahyana ba''da ma amatana wa ilayhin-nushur', 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.', 'All praise is due to Allah who gave us life after death and unto Him is the resurrection.', 'Sebaik sahaja bangun dari tidur', 'Bersyukur atas nikmat kehidupan, memulakan hari dengan mengingati Allah', 'Sahih Bukhari', 'morning')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('morning_2', 'Doa Pagi (Sayyidul Istighfar)', 'Morning Supplication (Master of Forgiveness)', 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana ''abduka, wa ana ''ala ''ahdika wa wa''dika mastata''tu...', 'Ya Allah, Engkau tuhanku, tiada tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hambaMu...', 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant...', 'Waktu pagi dan petang', 'Sesiapa yang membacanya dan meninggal pada hari itu akan masuk syurga', 'Sahih Bukhari', 'morning')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('before_sleep', 'Doa Sebelum Tidur', 'Supplication Before Sleep', 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', 'Bismika Allahumma amutu wa ahya', 'Dengan namaMu ya Allah, aku mati dan aku hidup.', 'In Your name O Allah, I die and I live.', 'Sebelum tidur', 'Perlindungan semasa tidur', 'Sahih Bukhari', 'evening')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('before_eat', 'Doa Sebelum Makan', 'Supplication Before Eating', 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', 'Bismillahi wa ''ala barakatillah', 'Dengan nama Allah dan dengan berkat Allah.', 'In the name of Allah and with the blessings of Allah.', 'Sebelum makan', 'Mendapat berkat dalam makanan', 'Abu Daud', 'eating')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('after_eat', 'Doa Selepas Makan', 'Supplication After Eating', 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', 'Alhamdulillahil-ladzi at''amana wa saqana wa ja''alana muslimin', 'Segala puji bagi Allah yang telah memberi kami makan dan minum dan menjadikan kami orang Islam.', 'All praise is due to Allah who fed us and gave us drink and made us Muslims.', 'Selepas makan', 'Bersyukur atas nikmat makanan', 'Tirmidzi', 'eating')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('enter_masjid', 'Doa Masuk Masjid', 'Supplication Upon Entering Mosque', 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', 'Allahumma iftah li abwaba rahmatik', 'Ya Allah, bukakanlah untukku pintu-pintu rahmatMu.', 'O Allah, open for me the doors of Your mercy.', 'Masuk masjid dengan kaki kanan', 'Mendapat rahmat Allah', 'Sahih Muslim', 'masjid')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('exit_masjid', 'Doa Keluar Masjid', 'Supplication Upon Leaving Mosque', 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', 'Allahumma inni as''aluka min fadlik', 'Ya Allah, aku memohon kepada-Mu dari kurniaMu.', 'O Allah, I ask You from Your bounty.', 'Keluar masjid dengan kaki kiri', 'Mendapat kurnia Allah', 'Sahih Muslim', 'masjid')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('enter_toilet', 'Doa Masuk Tandas', 'Supplication Upon Entering Restroom', 'بِسْمِ اللَّهِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', 'Bismillah, Allahumma inni a''udzu bika minal khubuthi wal khaba''ith', 'Dengan nama Allah, Ya Allah aku berlindung dengan-Mu dari syaitan jantan dan betina.', 'In the name of Allah. O Allah, I seek refuge in You from male and female devils.', 'Sebelum masuk tandas', 'Perlindungan dari syaitan', 'Sahih Bukhari & Muslim', 'daily')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('exit_toilet', 'Doa Keluar Tandas', 'Supplication Upon Leaving Restroom', 'غُفْرَانَكَ', 'Ghufranaka', 'Aku memohon ampunanMu.', 'I seek Your forgiveness.', 'Selepas keluar tandas', 'Memohon ampunan', 'Abu Daud, Tirmidzi', 'daily')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('before_wudhu', 'Doa Sebelum Wudhu', 'Supplication Before Ablution', 'بِسْمِ اللَّهِ', 'Bismillah', 'Dengan nama Allah.', 'In the name of Allah.', 'Sebelum memulakan wudhu', 'Wudhu menjadi sempurna', 'Abu Daud', 'wudhu')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('after_wudhu', 'Doa Selepas Wudhu', 'Supplication After Ablution', 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', 'Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan ''abduhu wa rasuluh', 'Aku bersaksi bahawa tiada tuhan selain Allah yang Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahawa Muhammad adalah hamba dan rasul-Nya.', 'I bear witness that there is no god but Allah alone, without partner, and I bear witness that Muhammad is His servant and messenger.', 'Selepas wudhu', 'Dibukakan 8 pintu syurga', 'Sahih Muslim', 'wudhu')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('travel_start', 'Doa Memulakan Perjalanan', 'Travel Supplication', 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', 'Subhanal-ladzi sakhkhara lana hadza wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun', 'Maha Suci Allah yang memudahkan kenderaan ini untuk kami, sedangkan kami tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.', 'Glory be to Him who has subjected this to us, and we could not have subdued it. And indeed, to our Lord we will return.', 'Memulakan perjalanan', 'Perlindungan sepanjang perjalanan', 'Surah Az-Zukhruf: 13-14', 'travel')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('leaving_home', 'Doa Keluar Rumah', 'Supplication Upon Leaving Home', 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', 'Bismillahi tawakkaltu ''alallahi wa la hawla wa la quwwata illa billah', 'Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan melainkan dengan pertolongan Allah.', 'In the name of Allah, I place my trust in Allah, and there is no power or strength except with Allah.', 'Keluar rumah', 'Dipelihara, dicukupkan, dan dilindungi', 'Abu Daud, Tirmidzi', 'daily')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('entering_home', 'Doa Masuk Rumah', 'Supplication Upon Entering Home', 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا', 'Allahumma inni as''aluka khayral mawliji wa khayral makhraji, bismillahi walajnaa wa bismillahi kharajna wa ''alallahi rabbina tawakkalna', 'Ya Allah, aku memohon kepada-Mu kebaikan ketika masuk dan keluar. Dengan nama Allah kami masuk dan keluar, dan kepada Allah Tuhan kami, kami bertawakal.', 'O Allah, I ask You for the good of entering and leaving. In the name of Allah we enter and leave, and upon Allah our Lord we rely.', 'Masuk rumah', 'Keberkatan dalam rumah', 'Abu Daud', 'daily')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('istikhara', 'Doa Istikharah', 'Guidance Supplication (Istikhara)', 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ', 'Allahumma inni astakhiruka bi''ilmika wa astaqdiruka biqudratika wa as''aluka min fadlikal ''azhim...', 'Ya Allah, aku memohon pilihan terbaik daripadaMu dengan ilmuMu, dan aku memohon kekuatan dariMu dengan kekuasaanMu...', 'O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power...', 'Selepas solat 2 rakaat, ketika bingung membuat keputusan', 'Mendapat petunjuk dalam membuat keputusan', 'Sahih Bukhari', 'special')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('qunut', 'Doa Qunut', 'Qunut Supplication', 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ', 'Allahumma-hdini fiman hadayt, wa ''afini fiman ''afayt, wa tawallani fiman tawallayt, wa barik li fima a''tayt, wa qini sharra ma qadayt', 'Ya Allah, tunjukilah aku seperti orang yang Engkau tunjuki, dan sihatkanlah aku seperti orang yang Engkau sihatkan...', 'O Allah, guide me among those You have guided, pardon me among those You have pardoned...', 'Solat Subuh (lepas ruku'' rakaat kedua)', 'Memohon petunjuk, kesihatan, dan perlindungan', 'Abu Daud, Tirmidzi, Nasai', 'prayer')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('tahiyyat', 'Tahiyyat Akhir', 'Final Tashahhud', 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ', 'At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu ''alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh...', 'Segala penghormatan, solat dan kebaikan adalah untuk Allah. Salam ke atas engkau wahai Nabi, dan rahmat Allah serta berkat-Nya...', 'All greetings, prayers and good deeds are for Allah. Peace be upon you O Prophet, and the mercy of Allah and His blessings...', 'Tahiyyat akhir dalam solat', 'Rukun solat', 'Sahih Bukhari & Muslim', 'prayer')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('anxiety', 'Doa Ketika Cemas/Risau', 'Supplication for Anxiety', 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ', 'Allahumma inni a''udzu bika minal-hammi wal-hazan, wa a''udzu bika minal-''ajzi wal-kasal...', 'Ya Allah, aku berlindung dengan-Mu dari kerisauan dan kesedihan, dari kelemahan dan kemalasan, dari sifat penakut dan kedekut, dan dari bebanan hutang dan penindasan manusia.', 'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from cowardice and miserliness, and from being overwhelmed by debt and overpowered by men.', 'Ketika merasa cemas atau tertekan', 'Menenangkan hati dan minda', 'Sahih Bukhari', 'special')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('difficulty', 'Doa Ketika Kesusahan', 'Supplication for Difficulty', 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ', 'La ilaha illallahul-''azhimul-halim, la ilaha illallahu rabbul-''arshil-''azhim, la ilaha illallahu rabbus-samawati wa rabbul-ardhi wa rabbul-''arshil-karim', 'Tiada tuhan selain Allah Maha Besar lagi Maha Penyantun. Tiada tuhan selain Allah, Tuhan Arasy yang agung. Tiada tuhan selain Allah, Tuhan langit dan bumi serta Tuhan Arasy yang mulia.', 'There is no god but Allah, the Supreme, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne. There is no god but Allah, Lord of the heavens and the earth and the Noble Throne.', 'Ketika menghadapi kesukaran dan musibah', 'Memohon pertolongan Allah', 'Sahih Bukhari & Muslim', 'special')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

INSERT INTO static_doa ("doa_id", "title_ms", "title_en", "arabic", "transliteration", "translation_ms", "translation_en", "when_to_recite", "benefits", "source", "category") VALUES ('parents', 'Doa Untuk Ibu Bapa', 'Supplication for Parents', 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', 'Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira', 'Ya Tuhanku, ampunilah aku dan kedua ibu bapaku, dan sayangilah mereka sebagaimana mereka menyayangiku sejak kecil.', 'My Lord, forgive me and my parents, and have mercy on them as they raised me when I was small.', 'Bila-bila masa, terutama selepas solat', 'Berbakti kepada ibu bapa', 'Surah Al-Isra: 24', 'family')
ON CONFLICT (doa_id) DO UPDATE SET "title_ms" = EXCLUDED."title_ms", "title_en" = EXCLUDED."title_en", "arabic" = EXCLUDED."arabic", "transliteration" = EXCLUDED."transliteration", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "when_to_recite" = EXCLUDED."when_to_recite", "benefits" = EXCLUDED."benefits", "source" = EXCLUDED."source", "category" = EXCLUDED."category";

-- Data for static_islamic_faq
INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('solat_01', 'Berapa rakaat solat fardu sehari?', 'How many rakaat are in the daily obligatory prayers?', 'Solat fardu sehari berjumlah 17 rakaat:
• Subuh: 2 rakaat
• Zohor: 4 rakaat
• Asar: 4 rakaat
• Maghrib: 3 rakaat
• Isyak: 4 rakaat', 'Daily obligatory prayers total 17 rakaat:
• Fajr: 2 rakaat
• Dhuhr: 4 rakaat
• Asr: 4 rakaat
• Maghrib: 3 rakaat
• Isha: 4 rakaat', 'solat', 'Ijma'' Ulama', '["solat","fardu","rakaat","wajib","prayer"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('solat_02', 'Apakah rukun solat?', 'What are the pillars of prayer?', 'Rukun solat ada 13:
1. Niat
2. Berdiri (bagi yang mampu)
3. Takbiratul ihram
4. Membaca Al-Fatihah
5. Rukuk dengan tuma''ninah
6. I''tidal dengan tuma''ninah
7. Sujud dua kali dengan tuma''ninah
8. Duduk antara dua sujud
9. Duduk tahiyyat akhir
10. Membaca tahiyyat akhir
11. Selawat ke atas Nabi
12. Salam pertama
13. Tertib', 'There are 13 pillars of prayer:
1. Intention
2. Standing (if able)
3. Opening Takbir
4. Reciting Al-Fatihah
5. Bowing with calmness
6. Rising from bowing with calmness
7. Prostrating twice with calmness
8. Sitting between two prostrations
9. Final sitting
10. Reciting final Tashahhud
11. Salutations upon the Prophet
12. First Salam
13. Proper order', 'solat', 'Mazhab Syafi''i', '["rukun","solat","pillar","prayer"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('solat_03', 'Bolehkah solat tanpa wudhu?', 'Can I pray without wudhu?', 'Tidak boleh. Wudhu adalah syarat sah solat. Allah berfirman dalam Surah Al-Ma''idah ayat 6: "Wahai orang yang beriman, apabila kamu hendak mengerjakan solat, maka basuhlah muka kamu..." Tanpa wudhu, solat tidak sah dan perlu diulangi.', 'No. Wudhu is a condition for valid prayer. Allah says in Surah Al-Ma''idah verse 6: "O you who believe, when you rise for prayer, wash your faces..." Without wudhu, prayer is invalid and must be repeated.', 'solat', 'Al-Quran, Al-Ma''idah: 6', '["wudhu","solat","ablution","syarat"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('puasa_01', 'Apa yang membatalkan puasa?', 'What breaks the fast?', 'Perkara yang membatalkan puasa:
1. Makan dan minum dengan sengaja
2. Muntah dengan sengaja
3. Hubungan suami isteri
4. Haid dan nifas
5. Gila
6. Keluar air mani dengan sengaja
7. Berniat untuk berbuka
8. Murtad', 'Things that break the fast:
1. Eating and drinking intentionally
2. Vomiting intentionally
3. Sexual intercourse
4. Menstruation and postnatal bleeding
5. Insanity
6. Intentional ejaculation
7. Intending to break fast
8. Apostasy', 'puasa', 'Fiqh Syafi''i', '["puasa","batal","fasting","break"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('puasa_02', 'Berapa hari wajib puasa Ramadan?', 'How many days is Ramadan fasting obligatory?', 'Bulan Ramadan boleh 29 atau 30 hari bergantung kepada penglihatan anak bulan. Puasa wajib sepanjang bulan Ramadan bagi setiap Muslim yang baligh, berakal, dan mampu.', 'Ramadan can be 29 or 30 days depending on moon sighting. Fasting is obligatory throughout Ramadan for every Muslim who is mature, sane, and able.', 'puasa', 'Ijma'' Ulama', '["ramadan","puasa","hari","fasting"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('zakat_01', 'Siapa yang wajib bayar zakat?', 'Who is obligated to pay zakat?', 'Zakat wajib bagi:
1. Muslim
2. Merdeka
3. Memiliki harta yang cukup nisab
4. Harta yang dimiliki selama setahun (haul)
5. Harta yang berkembang (nama'')

Nisab emas: 85 gram
Nisab perak: 595 gram
Kadar zakat: 2.5%', 'Zakat is obligatory for:
1. Muslims
2. Free persons
3. Possessing wealth reaching nisab
4. Wealth owned for one lunar year (haul)
5. Growing wealth

Nisab for gold: 85 grams
Nisab for silver: 595 grams
Zakat rate: 2.5%', 'zakat', 'Al-Quran & Hadith', '["zakat","nisab","wajib","bayar"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('zakat_02', 'Siapa yang berhak menerima zakat?', 'Who can receive zakat?', 'Lapan golongan asnaf (penerima zakat):
1. Fakir - Tiada harta dan pendapatan
2. Miskin - Ada pendapatan tapi tidak cukup
3. Amil - Pengurus zakat
4. Muallaf - Baru memeluk Islam
5. Riqab - Memerdekakan hamba
6. Gharimin - Berhutang
7. Fisabilillah - Berjuang di jalan Allah
8. Ibnu Sabil - Musafir yang kehabisan wang', 'Eight categories of zakat recipients (asnaf):
1. Fakir - No wealth or income
2. Poor - Some income but insufficient
3. Amil - Zakat administrators
4. Muallaf - New converts
5. Riqab - Freeing slaves
6. Gharimin - Those in debt
7. Fisabilillah - Those striving in Allah''s cause
8. Ibnu Sabil - Stranded travelers', 'zakat', 'Surah At-Taubah: 60', '["asnaf","penerima","zakat","recipient"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('haji_01', 'Apa rukun haji?', 'What are the pillars of Hajj?', 'Rukun haji ada 5:
1. Ihram - Berniat mengerjakan haji
2. Wukuf di Arafah - Berada di Arafah pada 9 Zulhijjah
3. Tawaf Ifadhah - Mengelilingi Kaabah 7 kali
4. Sa''ie - Berjalan antara Safa dan Marwah 7 kali
5. Bercukur/bergunting rambut - Tahallul', 'Hajj has 5 pillars:
1. Ihram - Intention to perform Hajj
2. Wuquf at Arafah - Being at Arafah on 9th Dhul Hijjah
3. Tawaf Ifadhah - Circling Kaabah 7 times
4. Sa''ie - Walking between Safa and Marwah 7 times
5. Shaving/cutting hair - Tahallul', 'haji', 'Fiqh Syafi''i', '["haji","rukun","pillar","hajj"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('general_01', 'Apa itu rukun Islam?', 'What are the pillars of Islam?', 'Lima rukun Islam:
1. Syahadah - Mengucap dua kalimah syahadah
2. Solat - Mendirikan solat lima waktu
3. Zakat - Mengeluarkan zakat
4. Puasa - Berpuasa di bulan Ramadan
5. Haji - Mengerjakan haji jika mampu', 'Five pillars of Islam:
1. Shahada - Declaration of faith
2. Salah - Five daily prayers
3. Zakat - Obligatory charity
4. Sawm - Fasting in Ramadan
5. Hajj - Pilgrimage if able', 'general', 'Hadith Jibril', '["rukun","islam","pillar"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('general_02', 'Apa itu rukun iman?', 'What are the pillars of faith?', 'Enam rukun iman:
1. Beriman kepada Allah
2. Beriman kepada Malaikat
3. Beriman kepada Kitab
4. Beriman kepada Rasul
5. Beriman kepada Hari Akhirat
6. Beriman kepada Qada'' dan Qadar', 'Six pillars of faith:
1. Belief in Allah
2. Belief in Angels
3. Belief in Divine Books
4. Belief in Prophets
5. Belief in the Day of Judgment
6. Belief in Divine Decree', 'general', 'Hadith Jibril', '["rukun","iman","faith","pillar"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('halal_01', 'Adakah gelatin halal?', 'Is gelatin halal?', 'Gelatin bergantung kepada sumbernya:
• Gelatin dari lembu/kambing yang disembelih secara Islam: HALAL
• Gelatin dari babi: HARAM
• Gelatin dari ikan: HALAL
• Gelatin sintetik/tumbuhan: HALAL

Sentiasa semak label dan logo halal.', 'Gelatin depends on its source:
• Gelatin from Islamically slaughtered cattle/sheep: HALAL
• Gelatin from pork: HARAM
• Gelatin from fish: HALAL
• Synthetic/plant gelatin: HALAL

Always check labels and halal certification.', 'halal', 'JAKIM', '["gelatin","halal","haram","makanan"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('halal_02', 'Adakah boleh makan di restoran bukan Islam?', 'Can I eat at non-Muslim restaurants?', 'Boleh dengan syarat:
1. Makanan yang dipesan adalah halal
2. Tiada pencemaran silang dengan bahan haram
3. Peralatan masak tidak bercampur dengan masakan haram

Lebih selamat memilih restoran berlogo halal yang diiktiraf.', 'Yes, with conditions:
1. Ordered food is halal
2. No cross-contamination with haram ingredients
3. Cooking utensils not mixed with haram cooking

Safer to choose certified halal restaurants.', 'halal', 'Fatwa JAKIM', '["restoran","halal","makan","restaurant"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('wanita_01', 'Bolehkah wanita haid membaca Al-Quran?', 'Can menstruating women recite Quran?', 'Terdapat perbezaan pendapat ulama:

**Mazhab Syafi''i/Hanbali:** Tidak boleh membaca Al-Quran

**Mazhab Maliki/Hanafi:** Boleh membaca tanpa menyentuh mushaf (dari hafalan atau lihat dari jauh)

Pendapat yang membolehkan adalah untuk tujuan pembelajaran, zikir, atau takut lupa hafalan. Wallahu a''lam.', 'Scholars differ on this:

**Shafi''i/Hanbali view:** Cannot recite Quran

**Maliki/Hanafi view:** Can recite without touching mushaf (from memory or viewing from distance)

The permitting view is for learning, dhikr, or fear of forgetting memorization. Allah knows best.', 'wanita', 'Perbezaan Mazhab', '["haid","quran","wanita","menstruation"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('quran_01', 'Berapa surah dalam Al-Quran?', 'How many surahs are in the Quran?', 'Al-Quran mengandungi 114 surah, bermula dengan Surah Al-Fatihah dan berakhir dengan Surah An-Nas.

• Surah Makkiyyah: 86 surah
• Surah Madaniyyah: 28 surah
• Jumlah ayat: 6,236 ayat
• Jumlah juzuk: 30 juzuk', 'The Quran contains 114 surahs, starting with Al-Fatihah and ending with An-Nas.

• Makkan Surahs: 86 surahs
• Madinan Surahs: 28 surahs
• Total verses: 6,236 verses
• Total parts: 30 juz', 'quran', 'Al-Quran', '["surah","quran","ayat","juzuk"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('quran_02', 'Apakah kelebihan membaca Al-Quran?', 'What are the virtues of reciting Quran?', 'Kelebihan membaca Al-Quran:
1. Setiap huruf mendapat 10 pahala (Hadith Tirmidzi)
2. Al-Quran akan menjadi syafaat di hari akhirat
3. Pembaca Al-Quran bersama malaikat yang mulia
4. Hati menjadi tenang dan tenteram
5. Mendapat petunjuk dan hidayah
6. Keluarga diberkati', 'Virtues of reciting Quran:
1. Every letter earns 10 rewards (Hadith Tirmidhi)
2. Quran will intercede on Judgment Day
3. Reciters are with noble angels
4. Hearts find peace and tranquility
5. Guidance and blessing
6. Family is blessed', 'quran', 'Hadith Tirmidzi', '["quran","kelebihan","pahala","virtue"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('nabi_01', 'Siapakah para Ulul Azmi?', 'Who are the Ulul Azmi prophets?', 'Ulul Azmi adalah 5 nabi yang memiliki keteguhan dan kesabaran luar biasa:
1. Nabi Nuh AS
2. Nabi Ibrahim AS
3. Nabi Musa AS
4. Nabi Isa AS
5. Nabi Muhammad SAW

Mereka disebut dalam Surah Al-Ahzab: 7 dan Surah Asy-Syura: 13.', 'Ulul Azmi are 5 prophets of great determination and patience:
1. Prophet Nuh (Noah)
2. Prophet Ibrahim (Abraham)
3. Prophet Musa (Moses)
4. Prophet Isa (Jesus)
5. Prophet Muhammad

Mentioned in Surah Al-Ahzab: 7 and Surah Ash-Shura: 13.', 'nabi', 'Al-Quran', '["ulul azmi","nabi","rasul","prophet"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('akhirat_01', 'Apakah tanda-tanda kiamat kecil?', 'What are the minor signs of the Day of Judgment?', 'Antara tanda kiamat kecil:
1. Diutuskan Nabi Muhammad SAW
2. Banyak fitnah dan pembunuhan
3. Ilmu agama diangkat, kejahilan merata
4. Perzinaan berleluasa
5. Arak diminum secara terbuka
6. Bangunan tinggi berlumba-lumba dibina
7. Hamba melahirkan tuannya
8. Kepercayaan diberikan kepada yang tidak layak', 'Among the minor signs:
1. Sending of Prophet Muhammad
2. Much trials and killing
3. Religious knowledge lifted, ignorance spreads
4. Widespread adultery
5. Alcohol consumed openly
6. Competition in building tall buildings
7. Slave gives birth to her master
8. Trust given to the unqualified', 'akhirat', 'Hadith Bukhari & Muslim', '["kiamat","tanda","akhirat","judgment"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

INSERT INTO static_islamic_faq ("faq_id", "question_ms", "question_en", "answer_ms", "answer_en", "category", "source", "keywords") VALUES ('akhlak_01', 'Bagaimana cara berbakti kepada ibu bapa?', 'How to be dutiful to parents?', 'Cara berbakti kepada ibu bapa:
1. Berkata lemah lembut, jangan berkata ''uff''
2. Mentaati perintah yang tidak melanggar syariat
3. Mendoakan kebaikan untuk mereka
4. Membantu dari segi kewangan
5. Meluangkan masa bersama mereka
6. Memelihara nama baik keluarga
7. Menziarahi kubur dan bersedekah atas nama mereka (jika sudah meninggal)', 'Ways to be dutiful to parents:
1. Speak gently, don''t say ''uff''
2. Obey commands that don''t violate Islamic law
3. Pray for their wellbeing
4. Help financially
5. Spend quality time with them
6. Maintain family honor
7. Visit graves and give charity in their name (if deceased)', 'akhlak', 'Surah Al-Isra: 23-24', '["ibu bapa","berbakti","parent","duty"]'::jsonb)
ON CONFLICT (faq_id) DO UPDATE SET "question_ms" = EXCLUDED."question_ms", "question_en" = EXCLUDED."question_en", "answer_ms" = EXCLUDED."answer_ms", "answer_en" = EXCLUDED."answer_en", "category" = EXCLUDED."category", "source" = EXCLUDED."source", "keywords" = EXCLUDED."keywords";

-- Data for static_hadith
INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_001', 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', 'Sesungguhnya setiap amalan bergantung kepada niat, dan sesungguhnya setiap orang hanya mendapat apa yang diniatkan.', 'Actions are judged by intentions, and everyone will get what they intended.', 'Umar bin Al-Khattab', 'Bukhari', 1, 1, 'sahih', '["niat","amalan","ikhlas"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_002', 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ', 'Islam dibina atas lima perkara: Bersaksi bahawa tiada tuhan selain Allah dan Muhammad adalah utusan Allah, mendirikan solat, menunaikan zakat, mengerjakan haji, dan berpuasa di bulan Ramadan.', 'Islam is built upon five pillars: Testifying that there is no god but Allah and Muhammad is His messenger, establishing prayer, giving zakat, performing Hajj, and fasting Ramadan.', 'Abdullah bin Umar', 'Bukhari', 2, 8, 'sahih', '["rukun islam","asas"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('muslim_001', 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', 'Orang Muslim adalah orang yang Muslim lain selamat dari lidah dan tangannya.', 'A Muslim is one from whose tongue and hand other Muslims are safe.', 'Abdullah bin Amr', 'Muslim', 1, 64, 'sahih', '["akhlak","muslim"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_003', 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', 'Tidak sempurna iman seseorang sehingga dia mencintai untuk saudaranya apa yang dicintainya untuk dirinya sendiri.', 'None of you truly believes until he loves for his brother what he loves for himself.', 'Anas bin Malik', 'Bukhari', 2, 13, 'sahih', '["iman","ukhuwah","kasih sayang"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_004', 'الطُّهُورُ شَطْرُ الْإِيمَانِ', 'Kebersihan adalah separuh daripada iman.', 'Purity is half of faith.', 'Abu Malik Al-Asy''ari', 'Muslim', 1, 223, 'sahih', '["iman","kebersihan","taharah"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('tirmidzi_001', 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا', 'Sesiapa yang membaca satu huruf dari Kitab Allah, baginya satu kebaikan, dan kebaikan itu digandakan sepuluh kali.', 'Whoever recites a letter from the Book of Allah gets one good deed, and good deeds are multiplied by ten.', 'Abdullah bin Mas''ud', 'Tirmidzi', 45, 2910, 'hasan sahih', '["quran","pahala","bacaan"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_005', 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', 'Sebaik-baik kamu adalah orang yang belajar Al-Quran dan mengajarkannya.', 'The best of you are those who learn the Quran and teach it.', 'Uthman bin Affan', 'Bukhari', 66, 5027, 'sahih', '["quran","ilmu","mengajar"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('muslim_002', 'الدُّعَاءُ هُوَ الْعِبَادَةُ', 'Doa adalah ibadah.', 'Supplication is worship.', 'Nu''man bin Bashir', 'Tirmidzi', 45, 3247, 'sahih', '["doa","ibadah"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_006', 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', 'Sesiapa yang berpuasa Ramadan dengan penuh keimanan dan mengharap pahala, akan diampunkan dosa-dosanya yang lalu.', 'Whoever fasts Ramadan with faith and seeking reward, his past sins will be forgiven.', 'Abu Hurairah', 'Bukhari', 30, 1901, 'sahih', '["puasa","ramadan","ampun"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_007', 'إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ', 'Apabila seseorang meninggal, terputuslah amalannya kecuali tiga perkara: sedekah jariah, ilmu yang bermanfaat, atau anak soleh yang mendoakannya.', 'When a person dies, his deeds are cut off except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.', 'Abu Hurairah', 'Muslim', 25, 1631, 'sahih', '["kematian","sedekah","ilmu"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_008', 'لاَ تَغْضَبْ', 'Jangan marah.', 'Do not get angry.', 'Abu Hurairah', 'Bukhari', 73, 6116, 'sahih', '["akhlak","marah","sabar"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('muslim_003', 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', 'Perkataan yang baik adalah sedekah.', 'A good word is charity.', 'Abu Hurairah', 'Bukhari', 56, 2989, 'sahih', '["akhlak","sedekah","lidah"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('tirmidzi_002', 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا', 'Orang mukmin yang paling sempurna imannya adalah yang paling baik akhlaknya.', 'The most complete believers in faith are those with the best character.', 'Abu Hurairah', 'Tirmidzi', 18, 1162, 'hasan sahih', '["iman","akhlak"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_009', 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', 'Barangsiapa beriman kepada Allah dan hari akhirat, maka hendaklah dia berkata baik atau diam.', 'Whoever believes in Allah and the Last Day should speak good or remain silent.', 'Abu Hurairah', 'Bukhari', 81, 6475, 'sahih', '["iman","lidah","diam"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('muslim_004', 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ', 'Orang yang penyayang akan disayangi oleh Yang Maha Penyayang. Sayangilah yang di bumi, nescaya yang di langit akan menyayangi kamu.', 'The merciful are shown mercy by the Most Merciful. Show mercy to those on earth, and the One in heaven will show mercy to you.', 'Abdullah bin Amr', 'Tirmidzi', 27, 1924, 'sahih', '["kasih sayang","rahmat"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_010', 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', 'Sesiapa yang menempuh jalan untuk menuntut ilmu, Allah akan memudahkan baginya jalan ke syurga.', 'Whoever takes a path seeking knowledge, Allah will make easy for him a path to Paradise.', 'Abu Hurairah', 'Muslim', 35, 2699, 'sahih', '["ilmu","syurga"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_011', 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ', 'Senyumanmu kepada saudaramu adalah sedekah.', 'Your smile to your brother is charity.', 'Abu Dzar', 'Tirmidzi', 27, 1956, 'hasan', '["sedekah","senyum","akhlak"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('muslim_005', 'الْمُسْلِمُ أَخُو الْمُسْلِمِ لاَ يَظْلِمُهُ وَلاَ يَخْذُلُهُ وَلاَ يَحْقِرُهُ', 'Muslim adalah saudara Muslim yang lain. Dia tidak menzaliminya, tidak menghinanya, dan tidak merendahkannya.', 'A Muslim is the brother of another Muslim. He does not wrong him, forsake him, or look down upon him.', 'Abu Hurairah', 'Muslim', 32, 2564, 'sahih', '["ukhuwah","muslim"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('bukhari_012', 'لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ، وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ', 'Kekayaan bukanlah dari banyaknya harta, tetapi kekayaan adalah kekayaan jiwa.', 'Richness is not in having many possessions, but richness is in contentment of the soul.', 'Abu Hurairah', 'Bukhari', 81, 6446, 'sahih', '["kekayaan","qanaah","jiwa"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

INSERT INTO static_hadith ("hadith_id", "arabic", "translation_ms", "translation_en", "narrator", "source", "book_number", "hadith_number", "grade", "topics") VALUES ('tirmidzi_003', 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ', 'Dunia adalah penjara bagi orang mukmin dan syurga bagi orang kafir.', 'The world is a prison for the believer and paradise for the disbeliever.', 'Abu Hurairah', 'Muslim', 53, 2956, 'sahih', '["dunia","akhirat","zuhud"]'::jsonb)
ON CONFLICT (hadith_id) DO UPDATE SET "arabic" = EXCLUDED."arabic", "translation_ms" = EXCLUDED."translation_ms", "translation_en" = EXCLUDED."translation_en", "narrator" = EXCLUDED."narrator", "source" = EXCLUDED."source", "book_number" = EXCLUDED."book_number", "hadith_number" = EXCLUDED."hadith_number", "grade" = EXCLUDED."grade", "topics" = EXCLUDED."topics";

