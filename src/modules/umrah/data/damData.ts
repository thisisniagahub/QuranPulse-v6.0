// Dam (Denda) Calculator Data
import { DamViolation, IhramProhibition } from '../types';

// Jenis-jenis Dam
export const DAM_TYPES = {
    TARTIB: {
        name: 'Dam Tartib',
        nameAr: 'دم ترتيب',
        description: 'Wajib bayar mengikut urutan: Sembelih kambing → Jika tidak mampu, puasa 3 hari → Jika tidak mampu, beri makan 6 orang miskin',
    },
    TAKHYIR: {
        name: 'Dam Takhyir',
        nameAr: 'دم تخيير',
        description: 'Boleh pilih salah satu: Sembelih kambing ATAU Puasa 3 hari ATAU Beri makan 6 orang miskin',
    },
};

// Pelanggaran Ihram dan Dam
export const DAM_VIOLATIONS: DamViolation[] = [
    {
        id: 'potong_kuku_1',
        category: 'takhyir',
        name: 'Potong 1-2 kuku',
        nameAr: 'قص ظفر أو ظفرين',
        description: 'Memotong 1 atau 2 kuku jari tangan atau kaki',
        penalty: [
            { type: 'mud', description: '1 mud makanan untuk setiap kuku', descriptionAr: 'مد واحد لكل ظفر', amount: 1 },
        ],
    },
    {
        id: 'potong_kuku_3',
        category: 'takhyir',
        name: 'Potong 3+ kuku',
        nameAr: 'قص ثلاثة أظافر فأكثر',
        description: 'Memotong 3 kuku atau lebih',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'potong_rambut',
        category: 'takhyir',
        name: 'Potong/Cabut Rambut',
        nameAr: 'قص أو نتف الشعر',
        description: 'Memotong atau mencabut rambut kepala atau badan',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'wangi',
        category: 'takhyir',
        name: 'Pakai Wangi-wangian',
        nameAr: 'استعمال الطيب',
        description: 'Memakai minyak wangi, perfume, atau bahan harum',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'tutup_kepala',
        category: 'takhyir',
        name: 'Tutup Kepala (Lelaki)',
        nameAr: 'تغطية الرأس للرجل',
        description: 'Lelaki menutup kepala dengan sesuatu yang melekat',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'tutup_muka',
        category: 'takhyir',
        name: 'Tutup Muka (Wanita)',
        nameAr: 'تغطية الوجه للمرأة',
        description: 'Wanita menutup muka dengan niqab atau seumpamanya',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'pakai_baju',
        category: 'takhyir',
        name: 'Pakai Baju Berjahit (Lelaki)',
        nameAr: 'لبس المخيط للرجل',
        description: 'Lelaki memakai baju, seluar, atau pakaian berjahit',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'sarung_tangan',
        category: 'takhyir',
        name: 'Pakai Sarung Tangan (Wanita)',
        nameAr: 'لبس القفازين للمرأة',
        description: 'Wanita memakai sarung tangan',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
            { type: 'puasa', description: 'Puasa 3 hari', descriptionAr: 'صيام ثلاثة أيام' },
            { type: 'fidyah', description: 'Beri makan 6 orang miskin', descriptionAr: 'إطعام ستة مساكين' },
        ],
    },
    {
        id: 'jimak',
        category: 'tartib',
        name: 'Bersetubuh (Sebelum Tahallul)',
        nameAr: 'الجماع قبل التحلل',
        description: 'Bersetubuh sebelum tahallul pertama - Umrah batal',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing + Wajib qada Umrah', descriptionAr: 'ذبح شاة + وجوب القضاء' },
        ],
    },
    {
        id: 'nikah',
        category: 'tartib',
        name: 'Akad Nikah',
        nameAr: 'عقد النكاح',
        description: 'Melangsungkan akad nikah dalam keadaan ihram',
        penalty: [
            { type: 'kambing', description: 'Akad tidak sah + Sembelih kambing', descriptionAr: 'العقد باطل + ذبح شاة' },
        ],
    },
    {
        id: 'tinggal_miqat',
        category: 'tartib',
        name: 'Tinggal/Lalu Miqat Tanpa Ihram',
        nameAr: 'مجاوزة الميقات بدون إحرام',
        description: 'Melepasi miqat tanpa berihram',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
        ],
    },
    {
        id: 'tinggal_tawaf',
        category: 'tartib',
        name: 'Tinggal Tawaf Wada\'',
        nameAr: 'ترك طواف الوداع',
        description: 'Meninggalkan Mekah tanpa tawaf wada\' (untuk haji)',
        penalty: [
            { type: 'kambing', description: 'Sembelih seekor kambing', descriptionAr: 'ذبح شاة' },
        ],
    },
];

// Larangan Ihram (10 Larangan Utama)
export const IHRAM_PROHIBITIONS: IhramProhibition[] = [
    {
        id: '1',
        name: 'Bersetubuh',
        nameAr: 'الجماع',
        description: 'Bersetubuh dengan isteri/suami',
        gender: 'semua',
        damType: 'tartib',
        penalty: 'Umrah batal + Wajib qada + Sembelih kambing',
    },
    {
        id: '2',
        name: 'Perkara Cabul',
        nameAr: 'المباشرة',
        description: 'Bercumbu, mencium dengan syahwat',
        gender: 'semua',
        damType: 'takhyir',
        penalty: 'Sembelih kambing / Puasa 3 hari / Beri makan 6 orang miskin',
    },
    {
        id: '3',
        name: 'Akad Nikah',
        nameAr: 'عقد النكاح',
        description: 'Melangsungkan atau menjadi wali/saksi akad nikah',
        gender: 'semua',
        damType: 'tartib',
        penalty: 'Akad batal + Sembelih kambing',
    },
    {
        id: '4',
        name: 'Memburu Binatang Darat',
        nameAr: 'صيد البر',
        description: 'Memburu atau membantu memburu binatang liar darat',
        gender: 'semua',
        damType: 'tartib',
        penalty: 'Ganti binatang yang semisal',
    },
    {
        id: '5',
        name: 'Potong Kuku',
        nameAr: 'قص الأظافر',
        description: 'Memotong kuku tangan atau kaki',
        gender: 'semua',
        damType: 'takhyir',
        penalty: '1-2 kuku: 1 mud. 3+ kuku: Dam Takhyir',
    },
    {
        id: '6',
        name: 'Cabut/Potong Rambut',
        nameAr: 'إزالة الشعر',
        description: 'Mencabut atau memotong rambut kepala/badan',
        gender: 'semua',
        damType: 'takhyir',
        penalty: 'Sembelih kambing / Puasa 3 hari / Beri makan 6 orang miskin',
    },
    {
        id: '7',
        name: 'Pakai Wangi-wangian',
        nameAr: 'الطيب',
        description: 'Memakai minyak wangi pada badan/pakaian',
        gender: 'semua',
        damType: 'takhyir',
        penalty: 'Sembelih kambing / Puasa 3 hari / Beri makan 6 orang miskin',
    },
    {
        id: '8',
        name: 'Pakai Baju Berjahit (Lelaki)',
        nameAr: 'لبس المخيط',
        description: 'Lelaki memakai baju, seluar, sarung kaki berjahit',
        gender: 'lelaki',
        damType: 'takhyir',
        penalty: 'Sembelih kambing / Puasa 3 hari / Beri makan 6 orang miskin',
    },
    {
        id: '9',
        name: 'Tutup Kepala (Lelaki)',
        nameAr: 'تغطية الرأس',
        description: 'Lelaki menutup kepala dengan topi, serban dll',
        gender: 'lelaki',
        damType: 'takhyir',
        penalty: 'Sembelih kambing / Puasa 3 hari / Beri makan 6 orang miskin',
    },
    {
        id: '10',
        name: 'Tutup Muka/Pakai Sarung Tangan (Wanita)',
        nameAr: 'النقاب والقفازين',
        description: 'Wanita memakai niqab atau sarung tangan',
        gender: 'wanita',
        damType: 'takhyir',
        penalty: 'Sembelih kambing / Puasa 3 hari / Beri makan 6 orang miskin',
    },
];
