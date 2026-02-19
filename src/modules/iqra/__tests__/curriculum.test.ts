import { getCurriculumForVolume, FULL_CURRICULUM } from '../data/master-curriculum';
import { IQRA_1_STRICT } from '../data/iqra-1-strict';

describe('Iqra Curriculum Logic', () => {
  
  test('Curriculum Loader returns default for invalid volume', () => {
    const data = getCurriculumForVolume(99);
    expect(data).toBeDefined();
    // Should fallback to Volume 1
    expect(data.lessons.length).toBeGreaterThan(0);
  });

  test('All volumes (1-6) exist in Master Registry', () => {
    expect(FULL_CURRICULUM[1]).toBeDefined();
    expect(FULL_CURRICULUM[2]).toBeDefined();
    expect(FULL_CURRICULUM[3]).toBeDefined();
    expect(FULL_CURRICULUM[4]).toBeDefined();
    expect(FULL_CURRICULUM[5]).toBeDefined();
    expect(FULL_CURRICULUM[6]).toBeDefined();
  });

  test('Iqra 1 Lessons map to valid Strict Page Data', () => {
    const lessons = FULL_CURRICULUM[1].lessons;
    lessons.forEach(lesson => {
      const pageData = IQRA_1_STRICT.find(p => p.page === lesson.pageRef);
      expect(pageData).toBeDefined();
      if (pageData) {
        expect(pageData.focus).toBeTruthy();
        expect(pageData.grid.length).toBeGreaterThan(0);
      }
    });
  });

  test('Unit IDs are unique within a volume', () => {
    const units = FULL_CURRICULUM[1].units;
    const ids = units.map(u => u.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

});
