import { IQRA_1_CURRICULUM, IQRA_1_UNITS } from './iqra-1-curriculum';
import { IQRA_2_CURRICULUM, IQRA_2_UNITS } from './iqra-2-curriculum';
import { IQRA_3_CURRICULUM, IQRA_3_UNITS } from './iqra-3-curriculum';
import { IQRA_4_CURRICULUM, IQRA_4_UNITS } from './iqra-4-curriculum';
import { IQRA_5_CURRICULUM, IQRA_5_UNITS } from './iqra-5-curriculum';
import { IQRA_6_CURRICULUM, IQRA_6_UNITS } from './iqra-6-curriculum';

export const FULL_CURRICULUM = {
  1: { units: IQRA_1_UNITS, lessons: IQRA_1_CURRICULUM },
  2: { units: IQRA_2_UNITS, lessons: IQRA_2_CURRICULUM },
  3: { units: IQRA_3_UNITS, lessons: IQRA_3_CURRICULUM },
  4: { units: IQRA_4_UNITS, lessons: IQRA_4_CURRICULUM },
  5: { units: IQRA_5_UNITS, lessons: IQRA_5_CURRICULUM },
  6: { units: IQRA_6_UNITS, lessons: IQRA_6_CURRICULUM },
};

export const getCurriculumForVolume = (vol: number) => {
  return FULL_CURRICULUM[vol as keyof typeof FULL_CURRICULUM] || FULL_CURRICULUM[1];
};
