import { useState, useEffect } from 'react';
import iqra1Data from '../../../../packages/iqra-content/iqra/extracted_BUKU_IQRA1_structured.json';

export interface LessonStep {
    id: number;
    type: 'cover' | 'intro' | 'practice' | 'quiz' | 'challenge' | 'insight';
    letter?: string;
    letters?: string[];
    name?: string;
    sound?: string;
    description?: string;
    instruction?: string;
    target?: string;
    options?: string[];
    title?: string;
    text?: string;
}

export const useIqraLoader = (volume: number) => {
    const [steps, setSteps] = useState<LessonStep[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // For now, we only have Iqra 1 structured. 
            // In a real app, we'd fetch different JSONs based on volume.
            const rawData = volume === 1 ? iqra1Data : { grid: [] };

            const generatedSteps: LessonStep[] = [];
            let currentId = 0;

            // 1. Add Cover
            generatedSteps.push({
                id: currentId++,
                type: 'cover',
                letter: `IQRA ${volume}`,
                name: 'Mula Belajar',
                sound: `Iqra ${volume}`,
                description: 'Permulaan perjalanan mengenal huruf Al-Quran.'
            });

            // 2. Process Grid
            // We group by "fokus" to create intro/practice blocks
            const focusGroups = new Map<string, any[]>();
            rawData.grid.forEach((row: any) => {
                if (!focusGroups.has(row.fokus)) {
                    focusGroups.set(row.fokus, []);
                }
                focusGroups.get(row.fokus)?.push(row);
            });

            focusGroups.forEach((rows, focus) => {
                // Add Intro for the focus
                generatedSteps.push({
                    id: currentId++,
                    type: 'intro',
                    letter: focus,
                    name: `Fokus: ${focus}`,
                    sound: focus,
                    description: `Mari kita kenal bunyi ${focus}.`
                });

                // Add Practice steps from rows
                rows.forEach((row, idx) => {
                    generatedSteps.push({
                        id: currentId++,
                        type: 'practice',
                        letters: [row.kanan, row.kiri],
                        instruction: `Latihan ${idx + 1}: Sebut dengan jelas.`
                    });
                });

                // Add a Quiz for this focus
                const lastRow = rows[rows.length - 1];
                generatedSteps.push({
                    id: currentId++,
                    type: 'quiz',
                    letter: lastRow.kanan,
                    options: [lastRow.kanan, lastRow.kiri],
                    instruction: `Pilih bunyi "${lastRow.kanan}".`
                });
            });

            setSteps(generatedSteps);
            setLoading(false);
        };

        loadData();
    }, [volume]);

    return { steps, loading };
};
