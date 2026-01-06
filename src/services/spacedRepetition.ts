/**
 * Spaced Repetition Service - SM-2 Algorithm for Quran Learning
 * Tracks mastery and schedules review sessions
 */

import { supabase } from '../lib/supabase';

export interface MasteryRecord {
    id?: string;
    userId: string;
    itemType: 'surah' | 'ayah' | 'phoneme' | 'tajweed_rule';
    itemId: string; // e.g., "1:1" for Surah 1, Ayah 1
    easeFactor: number; // SM-2 ease factor (default 2.5)
    interval: number; // Days until next review
    repetitions: number; // Number of successful reviews
    nextReviewDate: Date;
    lastScore: number; // Q-WER score (inverted: 100 - qwer)
    totalAttempts: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewResult {
    quality: 0 | 1 | 2 | 3 | 4 | 5; // SM-2 quality (0=complete blackout, 5=perfect)
    score: number; // Q-WER score
}

/**
 * SM-2 Algorithm Implementation
 */
class SM2Calculator {
    /**
     * Calculate new interval and ease factor based on review quality
     */
    calculate(
        quality: number,
        repetitions: number,
        previousEaseFactor: number,
        previousInterval: number
    ): { interval: number; easeFactor: number; repetitions: number } {
        // Quality must be 0-5
        const q = Math.max(0, Math.min(5, quality));

        // Calculate new ease factor
        let easeFactor = previousEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        easeFactor = Math.max(1.3, easeFactor); // Minimum ease factor

        // Calculate new interval and repetitions
        let interval: number;
        let newRepetitions: number;

        if (q < 3) {
            // Failed review - reset
            newRepetitions = 0;
            interval = 1;
        } else {
            // Successful review
            newRepetitions = repetitions + 1;

            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(previousInterval * easeFactor);
            }
        }

        return { interval, easeFactor, repetitions: newRepetitions };
    }

    /**
     * Convert Q-WER score to SM-2 quality (0-5)
     * Q-WER: 0 = perfect, 100 = worst
     * Quality: 5 = perfect, 0 = worst
     */
    qwerToQuality(qwer: number): 0 | 1 | 2 | 3 | 4 | 5 {
        const inverted = 100 - qwer;
        if (inverted >= 95) return 5;
        if (inverted >= 85) return 4;
        if (inverted >= 70) return 3;
        if (inverted >= 50) return 2;
        if (inverted >= 30) return 1;
        return 0;
    }
}

const sm2 = new SM2Calculator();

/**
 * Spaced Repetition Service
 */
export const spacedRepetitionService = {
    /**
     * Record a review attempt
     */
    async recordReview(
        userId: string,
        itemType: MasteryRecord['itemType'],
        itemId: string,
        result: ReviewResult
    ): Promise<MasteryRecord> {
        // Get existing record or create new
        const existing = await this.getMastery(userId, itemType, itemId);

        const quality = result.quality;
        const { interval, easeFactor, repetitions } = sm2.calculate(
            quality,
            existing?.repetitions ?? 0,
            existing?.easeFactor ?? 2.5,
            existing?.interval ?? 0
        );

        const now = new Date();
        const nextReviewDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

        const record: Partial<MasteryRecord> = {
            userId,
            itemType,
            itemId,
            easeFactor,
            interval,
            repetitions,
            nextReviewDate,
            lastScore: result.score,
            totalAttempts: (existing?.totalAttempts ?? 0) + 1,
            updatedAt: now,
        };

        if (existing?.id) {
            // Update existing
            const { data, error } = await supabase
                .from('user_mastery')
                .update(record)
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                console.error('Failed to update mastery:', error);
                throw error;
            }
            return data as MasteryRecord;
        } else {
            // Create new
            const { data, error } = await supabase
                .from('user_mastery')
                .insert({
                    ...record,
                    createdAt: now,
                })
                .select()
                .single();

            if (error) {
                console.error('Failed to create mastery:', error);
                throw error;
            }
            return data as MasteryRecord;
        }
    },

    /**
     * Get mastery record for an item
     */
    async getMastery(
        userId: string,
        itemType: MasteryRecord['itemType'],
        itemId: string
    ): Promise<MasteryRecord | null> {
        const { data, error } = await supabase
            .from('user_mastery')
            .select('*')
            .eq('userId', userId)
            .eq('itemType', itemType)
            .eq('itemId', itemId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Failed to get mastery:', error);
        }

        return data as MasteryRecord | null;
    },

    /**
     * Get items due for review
     */
    async getDueItems(
        userId: string,
        itemType?: MasteryRecord['itemType'],
        limit: number = 10
    ): Promise<MasteryRecord[]> {
        let query = supabase
            .from('user_mastery')
            .select('*')
            .eq('userId', userId)
            .lte('nextReviewDate', new Date().toISOString())
            .order('nextReviewDate', { ascending: true })
            .limit(limit);

        if (itemType) {
            query = query.eq('itemType', itemType);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to get due items:', error);
            return [];
        }

        return data as MasteryRecord[];
    },

    /**
     * Get overall mastery statistics
     */
    async getMasteryStats(userId: string): Promise<{
        totalItems: number;
        masteredItems: number; // 5+ successful reviews
        learningItems: number; // 1-4 reviews
        newItems: number; // 0 reviews
        averageScore: number;
        dueToday: number;
    }> {
        const { data, error } = await supabase
            .from('user_mastery')
            .select('*')
            .eq('userId', userId);

        if (error || !data) {
            return {
                totalItems: 0,
                masteredItems: 0,
                learningItems: 0,
                newItems: 0,
                averageScore: 0,
                dueToday: 0,
            };
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const stats = data.reduce(
            (acc, record) => {
                acc.totalItems++;
                acc.totalScore += record.lastScore || 0;

                if (record.repetitions >= 5) acc.masteredItems++;
                else if (record.repetitions >= 1) acc.learningItems++;
                else acc.newItems++;

                if (new Date(record.nextReviewDate) <= today) acc.dueToday++;

                return acc;
            },
            {
                totalItems: 0,
                masteredItems: 0,
                learningItems: 0,
                newItems: 0,
                totalScore: 0,
                dueToday: 0,
            }
        );

        return {
            ...stats,
            averageScore: stats.totalItems > 0 ? stats.totalScore / stats.totalItems : 0,
        };
    },

    /**
     * Convert Q-WER score to review quality
     */
    qwerToQuality: sm2.qwerToQuality.bind(sm2),
};

export default spacedRepetitionService;
