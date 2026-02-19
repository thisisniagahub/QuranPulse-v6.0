export interface JakimZone {
  code: string;
  state: string;
  description: string;
}

export const JAKIM_ZONES: JakimZone[] = [
  // WILAYAH PERSEKUTUAN
  { code: 'WLY01', state: 'Wilayah Persekutuan', description: 'Kuala Lumpur, Putrajaya' },
  { code: 'WLY02', state: 'Wilayah Persekutuan', description: 'Labuan' },
  
  // SELANGOR
  { code: 'SGR01', state: 'Selangor', description: 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam' },
  { code: 'SGR02', state: 'Selangor', description: 'Kuala Selangor, Sabak Bernam' },
  { code: 'SGR03', state: 'Selangor', description: 'Klang, Kuala Langat' },

  // JOHOR
  { code: 'JHR01', state: 'Johor', description: 'Pulau Aur dan Pulau Pemanggil' },
  { code: 'JHR02', state: 'Johor', description: 'Johor Bahru, Kota Tinggi, Mersing' },
  { code: 'JHR03', state: 'Johor', description: 'Kluang, Pontian' },
  { code: 'JHR04', state: 'Johor', description: 'Batu Pahat, Muar, Segamat, Gemas Johor' },

  // KEDAH
  { code: 'KDH01', state: 'Kedah', description: 'Kota Setar, Kubang Pasu, Pokok Sena (Daerah Kecil)' },
  { code: 'KDH02', state: 'Kedah', description: 'Kuala Muda, Yan, Pendang' },
  { code: 'KDH03', state: 'Kedah', description: 'Padang Terap, Sik' },
  { code: 'KDH04', state: 'Kedah', description: 'Baling' },
  { code: 'KDH05', state: 'Kedah', description: 'Bandar Baharu, Kulim' },
  { code: 'KDH06', state: 'Kedah', description: 'Langkawi' },
  { code: 'KDH07', state: 'Kedah', description: 'Gunung Jerai' },

  // KELANTAN
  { code: 'KTN01', state: 'Kelantan', description: 'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku' },
  { code: 'KTN03', state: 'Kelantan', description: 'Gua Musang (Daerah Galas Dan Bertam), Jeli' },
  
  // MELAKA
  { code: 'MLK01', state: 'Melaka', description: 'Seluruh Negeri Melaka' },

  // NEGERI SEMBILAN
  { code: 'NGS01', state: 'Negeri Sembilan', description: 'Tampin, Jempol' },
  { code: 'NGS02', state: 'Negeri Sembilan', description: 'Jelebu, Kuala Pilah, Port Dickson, Rembau, Seremban' },

  // PAHANG
  { code: 'PHG01', state: 'Pahang', description: 'Pulau Tioman' },
  { code: 'PHG02', state: 'Pahang', description: 'Kuantan, Pekan, Rompin, Muadzam Shah' },
  { code: 'PHG03', state: 'Pahang', description: 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka' },
  { code: 'PHG04', state: 'Pahang', description: 'Bentong, Lipis, Raub' },
  { code: 'PHG05', state: 'Pahang', description: 'Genting Sempah, Janda Baik, Bukit Tinggi' },
  { code: 'PHG06', state: 'Pahang', description: 'Cameron Highlands, Genting Highlands, Bukit Fraser' },

  // PERAK
  { code: 'PRK01', state: 'Perak', description: 'Tapah, Slim River, Tanjung Malim' },
  { code: 'PRK02', state: 'Perak', description: 'Kuala Kangsar, Sg. Siput (Daerah Kecil), Ipoh, Batu Gajah, Kampar' },
  { code: 'PRK03', state: 'Perak', description: 'Lenggong, Pengkalan Hulu, Grik' },
  { code: 'PRK04', state: 'Perak', description: 'Temengor, Belum' },
  { code: 'PRK05', state: 'Perak', description: 'Kampung Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor' },
  { code: 'PRK06', state: 'Perak', description: 'Selama, Taiping, Bagan Serai, Parit Buntar' },
  { code: 'PRK07', state: 'Perak', description: 'Bukit Larut' },

  // PERLIS
  { code: 'PLS01', state: 'Perlis', description: 'Seluruh Negeri Perlis' },

  // PULAU PINANG
  { code: 'PNG01', state: 'Pulau Pinang', description: 'Seluruh Negeri Pulau Pinang' },

  // SABAH
  { code: 'SBH01', state: 'Sabah', description: 'Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan, Bandar Sandakan, Sukau' },
  { code: 'SBH02', state: 'Sabah', description: 'Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)' },
  { code: 'SBH03', state: 'Sabah', description: 'Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku, Bahagian Tawau (Timur)' },
  { code: 'SBH04', state: 'Sabah', description: 'Bandar Tawau, Balung, Merotai, Kalabakan, Bahagian Tawau (Barat)' },
  { code: 'SBH05', state: 'Sabah', description: 'Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat' },
  { code: 'SBH06', state: 'Sabah', description: 'Gunung Kinabalu' },
  { code: 'SBH07', state: 'Sabah', description: 'Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat' },
  { code: 'SBH08', state: 'Sabah', description: 'Pensiangan, Keningau, Tambunan, Nabawan, Bahagian Pendalaman (Atas)' },
  { code: 'SBH09', state: 'Sabah', description: 'Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pa Sia, Membakut, Weston, Bahagian Pendalaman (Bawah)' },

  // SARAWAK
  { code: 'SWK01', state: 'Sarawak', description: 'Limbang, Lawas, Sundar, Trusan' },
  { code: 'SWK02', state: 'Sarawak', description: 'Miri, Niah, Bekenu, Sibuti, Marudi' },
  { code: 'SWK03', state: 'Sarawak', description: 'Pandaruan, Belaga, Suai, Tatau, Sebauh, Bintulu' },
  { code: 'SWK04', state: 'Sarawak', description: 'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit' },
  { code: 'SWK05', state: 'Sarawak', description: 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai' },
  { code: 'SWK06', state: 'Sarawak', description: 'Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok' },
  { code: 'SWK07', state: 'Sarawak', description: 'Serian, Simunjan, Samarahan, Sebuyau, Meludam' },
  { code: 'SWK08', state: 'Sarawak', description: 'Kuching, Bau, Lundu, Sematan' },
  { code: 'SWK09', state: 'Sarawak', description: 'Zon Khas (Kampung Patarikan)' },

  // TERENGGANU
  { code: 'TRG01', state: 'Terengganu', description: 'Kuala Terengganu, Marang, Kuala Nerus' },
  { code: 'TRG02', state: 'Terengganu', description: 'Besut, Setiu' },
  { code: 'TRG03', state: 'Terengganu', description: 'Hulu Terengganu' },
  { code: 'TRG04', state: 'Terengganu', description: 'Dungun, Kemaman' },
];
