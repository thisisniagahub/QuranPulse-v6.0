export interface ASRResult {
    score: number; // 0-100
    feedback_ms: string;   // Localized feedback
    qwer: {
        makhraj: number; // Simplified components based on string heuristic
        tajwid: number;
        harakat: number;
        fluency: number;
    };
    highlightedIndices: { index: number, status: 'red' | 'yellow' | 'green' }[];
}

export class ASRTajweedAnalysis {
    /**
     * Compare expected target text (usually phonetic Rumi or Arabic) with the actual transcript.
     * Leverages Levenshtein distance conceptually, simplified for MVPs.
     */
    public static analyze(expectedPhonetics: string, actualTranscript: string): ASRResult {
        const expectedWords = expectedPhonetics.toLowerCase().split(/\s+/);
        const actualWords = actualTranscript.toLowerCase().split(/\s+/);

        let matchCount = 0;
        const highlights: { index: number, status: 'red' | 'yellow' | 'green' }[] = [];

        // Simple robust zip comparison
        for (let i = 0; i < expectedWords.length; i++) {
            const expected = expectedWords[i];

            // Find best match in neighborhood to account for fluency drops
            let bestDistance = Infinity;
            let bestMatchIndex = -1;

            const startIdx = Math.max(0, i - 2);
            const endIdx = Math.min(actualWords.length, i + 3);

            for (let j = startIdx; j < endIdx; j++) {
                const actual = actualWords[j] || '';
                const distance = this.levenshtein(expected, actual);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestMatchIndex = j;
                }
            }

            // Scoring threshold
            let status: 'red' | 'yellow' | 'green';
            if (bestDistance === 0) {
                matchCount += 1.0;
                status = 'green';
            } else if (bestDistance <= 2 && expected.length > 3) {
                matchCount += 0.5; // Partial Match (yellow)
                status = 'yellow';
            } else {
                status = 'red'; // Miss
            }

            highlights.push({ index: i, status });
        }

        const rawScore = (matchCount / expectedWords.length) * 100;
        const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

        // Simulating Q-WER derived parameters based on score bands
        const qwer = {
            makhraj: finalScore > 80 ? 95 : (finalScore > 50 ? 60 : 30),
            tajwid: finalScore > 90 ? 85 : (finalScore > 60 ? 55 : 20),
            harakat: finalScore > 70 ? 90 : 50,
            fluency: actualWords.length >= expectedWords.length * 0.8 ? 85 : 40
        };

        let feedback = "Teruskan latihan!";
        if (finalScore >= 90) feedback = "Mašāʾallāh! Bacaan sangat tepat dan lancar.";
        else if (finalScore >= 70) feedback = "Alhamdulillah. Perlu sedikit perhatian pada sebutan makhraj huruf.";
        else feedback = "Jangan putus asa. Mulakan dengan bacaan yang pelan.";

        return {
            score: finalScore,
            feedback_ms: feedback,
            qwer,
            highlightedIndices: highlights
        };
    }

    // Basic utility to compute distance between two strings
    private static levenshtein(a: string, b: string): number {
        const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[a.length][b.length];
    }
}
