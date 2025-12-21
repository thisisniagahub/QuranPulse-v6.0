/**
 * SuperMemo 2 (SM-2) Algorithm Implementation
 * 
 * calculates the next revision date based on user performance.
 * @param quality 0-5 (0: total blackout, 5: perfect response)
 * @param prevInterval Previous interval in days
 * @param prevRepetition Previous repetition count
 * @param prevEase Previous Ease Factor (EF)
 */
export const calculateSRS = (
    quality: number,
    prevInterval: number,
    prevRepetition: number,
    prevEase: number
) => {
    let nextInterval: number;
    let nextRepetition: number;
    let nextEase: number;

    // EF (Ease Factor) adjustment
    // EF' := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    nextEase = prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (nextEase < 1.3) nextEase = 1.3;

    if (quality >= 3) {
        // Successful response
        if (prevRepetition === 0) {
            nextInterval = 1;
        } else if (prevRepetition === 1) {
            nextInterval = 6;
        } else {
            nextInterval = Math.round(prevInterval * nextEase);
        }
        nextRepetition = prevRepetition + 1;
    } else {
        // Lapses (Reset sequence)
        nextRepetition = 0;
        nextInterval = 1;
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    return {
        nextInterval,
        nextRepetition,
        nextEase,
        nextReviewDate: nextReviewDate.toISOString()
    };
};
