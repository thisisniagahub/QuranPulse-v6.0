export interface IqraGridRow {
  baris: string;
  kanan: string; // Arabic text (Right column)
  kiri: string;  // Arabic text (Left column)
}

export interface IqraPageStrict {
  page: number;
  title: string;
  focus: string;
  grid: IqraGridRow[];
}

// SMART Learning Objectives
export interface SmartObjective {
  id: string;
  description: string; // e.g., "Mengenal bentuk huruf Ba"
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze';
  successCriteria: string[]; // e.g., "Boleh beza 1 titik di bawah"
}

// Assessment Configuration for ASR/Voice
export interface AssessmentConfig {
  mode: 'practice' | 'test';
  passingScore: number; // 0-100
  targetPhonemes: string[]; // e.g., ['ba', 'ta']
  allowedMistakes: number;
}

// The "Lesson" wraps the physical page with teaching logic
export interface IqraLesson {
  id: string;
  unitId: string; // e.g., "UNIT-1"
  unitTitle: string; // e.g., "Pengenalan Huruf Tunggal"
  pageRef: number; // Links to physical book page
  title: string;
  objectives: SmartObjective[];
  teachingTips: string[]; // Tips for parents/teachers
  assessment: AssessmentConfig;
  videoGuideUrl?: string; // Optional link to tutorial
}

export interface IqraUnit {
  id: string;
  title: string;
  description: string;
  lessons: string[]; // List of Lesson IDs
}
