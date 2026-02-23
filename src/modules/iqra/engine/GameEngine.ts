export interface GameStats {
    xp: number;
    stars: number;
    level: number;
    nextLevelXP: number;
}

export class GameEngine {
    private static readonly XP_PER_WORD = 10;
    private static readonly XP_PER_SECOND = 1; // Reward for sustained reading
    private static readonly LEVEL_MULTIPLIER = 1.5;
    private static readonly BASE_XP_REQUIREMENT = 500;

    /**
     * Calculates XP gained from a reading session.
     */
    public static calculateSessionXP(durationSeconds: number, correctWordsCount: number): number {
        const wordXP = correctWordsCount * this.XP_PER_WORD;
        const timeXP = durationSeconds * this.XP_PER_SECOND;

        // Bonus mechanism for high accuracy (optional, kept simple for MVP)
        const accuracyBonus = correctWordsCount > 20 ? 50 : 0;

        return Math.floor(wordXP + timeXP + accuracyBonus);
    }

    /**
     * Calculates the number of stars (1-3) based on Q-WER score.
     * Q-WER is an error rate, so lower is better. 100 is flawless.
     */
    public static calculateStars(score: number): number {
        if (score >= 90) return 3;
        if (score >= 70) return 2;
        if (score >= 40) return 1;
        return 0; // Needs improvement
    }

    /**
     * Calculates current level and progression based on total accumulated XP.
     */
    public static getLevelData(totalXP: number): GameStats {
        let level = 1;
        let xpRequiredForNext = this.BASE_XP_REQUIREMENT;
        let aggregateXpRequired = this.BASE_XP_REQUIREMENT;

        // Logarithmic-style leveling curve based on multiplier
        while (totalXP >= aggregateXpRequired) {
            level++;
            xpRequiredForNext = Math.floor(xpRequiredForNext * this.LEVEL_MULTIPLIER);
            aggregateXpRequired += xpRequiredForNext;
        }

        const currentLevelBaseXP = aggregateXpRequired - xpRequiredForNext;
        const xpIntoCurrentLevel = totalXP - currentLevelBaseXP;

        return {
            xp: totalXP,
            stars: 0, // This is context-dependent, usually calculated per session
            level: level,
            nextLevelXP: xpRequiredForNext
        };
    }
}
