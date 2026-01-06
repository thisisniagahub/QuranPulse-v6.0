/**
 * Voice Fingerprint Service - User acoustic profiling
 * Extracts and tracks user's unique voice characteristics
 */

import { supabase } from '../lib/supabase';

export interface VoiceFingerprint {
    id?: string;
    userId: string;
    formantF1Mean: number; // Average F1 frequency
    formantF2Mean: number; // Average F2 frequency
    pitchMean: number; // Average pitch (Hz)
    pitchRange: number; // Pitch variation
    jitter: number; // Pitch perturbation
    shimmer: number; // Amplitude perturbation
    speakingRate: number; // Syllables per second
    pauseDuration: number; // Average pause length
    totalSamples: number; // Number of recordings analyzed
    createdAt: Date;
    updatedAt: Date;
}

export interface PersonalizedThresholds {
    makhrajTolerance: number; // Error tolerance for makhraj (0-1)
    tajweedTolerance: number;
    harakatTolerance: number;
    rhythmTolerance: number;
    overallDifficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Voice Fingerprint Service
 */
export const voiceFingerprintService = {
    /**
     * Get user's voice fingerprint
     */
    async getFingerprint(userId: string): Promise<VoiceFingerprint | null> {
        const { data, error } = await supabase
            .from('voice_fingerprints')
            .select('*')
            .eq('userId', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Failed to get fingerprint:', error);
        }

        return data as VoiceFingerprint | null;
    },

    /**
     * Update fingerprint with new audio sample
     * Uses running average to update acoustic parameters
     */
    async updateFingerprint(
        userId: string,
        sample: {
            formantF1: number;
            formantF2: number;
            pitch: number;
            jitter: number;
            shimmer: number;
            speakingRate: number;
            pauseDuration: number;
        }
    ): Promise<VoiceFingerprint> {
        const existing = await this.getFingerprint(userId);
        const now = new Date();

        if (existing) {
            // Update with running average
            const n = existing.totalSamples;
            const newN = n + 1;

            const updated: Partial<VoiceFingerprint> = {
                formantF1Mean: (existing.formantF1Mean * n + sample.formantF1) / newN,
                formantF2Mean: (existing.formantF2Mean * n + sample.formantF2) / newN,
                pitchMean: (existing.pitchMean * n + sample.pitch) / newN,
                pitchRange: Math.max(existing.pitchRange, Math.abs(sample.pitch - existing.pitchMean)),
                jitter: (existing.jitter * n + sample.jitter) / newN,
                shimmer: (existing.shimmer * n + sample.shimmer) / newN,
                speakingRate: (existing.speakingRate * n + sample.speakingRate) / newN,
                pauseDuration: (existing.pauseDuration * n + sample.pauseDuration) / newN,
                totalSamples: newN,
                updatedAt: now,
            };

            const { data, error } = await supabase
                .from('voice_fingerprints')
                .update(updated)
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            return data as VoiceFingerprint;
        } else {
            // Create new fingerprint
            const newFingerprint: Partial<VoiceFingerprint> = {
                userId,
                formantF1Mean: sample.formantF1,
                formantF2Mean: sample.formantF2,
                pitchMean: sample.pitch,
                pitchRange: 0,
                jitter: sample.jitter,
                shimmer: sample.shimmer,
                speakingRate: sample.speakingRate,
                pauseDuration: sample.pauseDuration,
                totalSamples: 1,
                createdAt: now,
                updatedAt: now,
            };

            const { data, error } = await supabase
                .from('voice_fingerprints')
                .insert(newFingerprint)
                .select()
                .single();

            if (error) throw error;
            return data as VoiceFingerprint;
        }
    },

    /**
     * Calculate personalized error thresholds based on voice characteristics
     */
    calculateThresholds(fingerprint: VoiceFingerprint | null): PersonalizedThresholds {
        // Default thresholds for new users
        if (!fingerprint || fingerprint.totalSamples < 5) {
            return {
                makhrajTolerance: 0.2,
                tajweedTolerance: 0.25,
                harakatTolerance: 0.3,
                rhythmTolerance: 0.4,
                overallDifficulty: 'beginner',
            };
        }

        // Adjust based on voice stability
        // Higher jitter/shimmer = less stable voice = higher tolerance
        const voiceStability = 1 - (fingerprint.jitter + fingerprint.shimmer) / 2;
        const experienceFactor = Math.min(1, fingerprint.totalSamples / 50); // Max at 50 samples

        // More experienced users get stricter thresholds
        const baseTolerance = 0.15 + (1 - experienceFactor) * 0.15;

        // Voice instability increases tolerance slightly
        const stabilityAdjustment = (1 - voiceStability) * 0.1;

        // Determine difficulty level
        let difficulty: PersonalizedThresholds['overallDifficulty'] = 'beginner';
        if (fingerprint.totalSamples >= 100 && experienceFactor > 0.8) {
            difficulty = 'advanced';
        } else if (fingerprint.totalSamples >= 30) {
            difficulty = 'intermediate';
        }

        return {
            makhrajTolerance: Math.max(0.1, baseTolerance + stabilityAdjustment - 0.05),
            tajweedTolerance: Math.max(0.12, baseTolerance + stabilityAdjustment),
            harakatTolerance: Math.max(0.15, baseTolerance + stabilityAdjustment + 0.05),
            rhythmTolerance: Math.max(0.2, baseTolerance + stabilityAdjustment + 0.1),
            overallDifficulty: difficulty,
        };
    },

    /**
     * Analyze audio and extract acoustic features
     * (Simplified version - full implementation would use Web Audio API)
     */
    async extractFeatures(audioBlob: Blob): Promise<{
        formantF1: number;
        formantF2: number;
        pitch: number;
        jitter: number;
        shimmer: number;
        speakingRate: number;
        pauseDuration: number;
    }> {
        // In a full implementation, this would:
        // 1. Use Web Audio API to decode audio
        // 2. Apply autocorrelation for pitch detection
        // 3. Use LPC analysis for formants
        // 4. Calculate jitter/shimmer from pitch periods

        // For now, return placeholder values
        // TODO: Implement actual acoustic analysis
        return {
            formantF1: 500 + Math.random() * 200, // Typical male F1: 500-700 Hz
            formantF2: 1500 + Math.random() * 500, // Typical F2: 1500-2000 Hz
            pitch: 100 + Math.random() * 150, // Male: 85-180 Hz, Female: 165-255 Hz
            jitter: 0.01 + Math.random() * 0.02, // Normal: < 1%
            shimmer: 0.02 + Math.random() * 0.03, // Normal: < 3%
            speakingRate: 3 + Math.random() * 2, // Syllables per second
            pauseDuration: 0.3 + Math.random() * 0.3, // Seconds
        };
    },

    /**
     * Get voice profile summary for display
     */
    getProfileSummary(fingerprint: VoiceFingerprint): {
        voiceType: string;
        stability: string;
        experience: string;
    } {
        // Determine voice type based on pitch
        let voiceType = 'Sederhana';
        if (fingerprint.pitchMean < 120) voiceType = 'Bass/Rendah';
        else if (fingerprint.pitchMean < 180) voiceType = 'Tenor/Sederhana';
        else if (fingerprint.pitchMean < 220) voiceType = 'Alto/Tinggi';
        else voiceType = 'Soprano/Sangat Tinggi';

        // Determine stability
        const avgPerturbation = (fingerprint.jitter + fingerprint.shimmer) / 2;
        let stability = 'Stabil';
        if (avgPerturbation > 0.05) stability = 'Kurang Stabil';
        else if (avgPerturbation > 0.03) stability = 'Sederhana';

        // Determine experience
        let experience = 'Baru';
        if (fingerprint.totalSamples >= 100) experience = 'Mahir';
        else if (fingerprint.totalSamples >= 30) experience = 'Pertengahan';
        else if (fingerprint.totalSamples >= 10) experience = 'Bermula';

        return { voiceType, stability, experience };
    },
};

export default voiceFingerprintService;
