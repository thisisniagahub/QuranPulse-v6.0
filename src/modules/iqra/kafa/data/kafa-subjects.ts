export interface KafaSubject {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  color: string;
  icon: string;
  locked: boolean;
}

export const KAFA_SUBJECTS: KafaSubject[] = [
  { 
    id: 'jawi', 
    title: 'Jawi & Khat', 
    arabicTitle: 'جاوي', 
    description: 'Kuasai ejaan dan penulisan Jawi.', 
    color: 'from-emerald-500 to-teal-600',
    icon: 'PenTool',
    locked: false 
  },
  { 
    id: 'arab', 
    title: 'Bahasa Arab', 
    arabicTitle: 'اللغة العربية', 
    description: 'Kosa kata dan komunikasi asas.', 
    color: 'from-blue-500 to-cyan-600',
    icon: 'Languages',
    locked: false 
  },
  { 
    id: 'solat', 
    title: 'Amali Solat', 
    arabicTitle: 'عملي صلاة', 
    description: 'Bacaan dan perlakuan solat sempurna.', 
    color: 'from-indigo-500 to-purple-600',
    icon: 'Users', // Using Users to represent Jamaah
    locked: false 
  },
  { 
    id: 'sirah', 
    title: 'Sirah', 
    arabicTitle: 'سيرة', 
    description: 'Sejarah Nabi dan Tamadun Islam.', 
    color: 'from-orange-500 to-amber-600',
    icon: 'Scroll',
    locked: true 
  },
  { 
    id: 'ibadah', 
    title: 'Ulum Syariah', 
    arabicTitle: 'علوم شريعة', 
    description: 'Ibadah dan Aqidah.', 
    color: 'from-pink-500 to-rose-600',
    icon: 'BookHeart',
    locked: true 
  },
  { 
    id: 'adab', 
    title: 'Adab & Akhlak', 
    arabicTitle: 'أدب', 
    description: 'Nilai murni dan sahsiah diri.', 
    color: 'from-red-500 to-crimson-600',
    icon: 'HeartHandshake',
    locked: true 
  }
];
