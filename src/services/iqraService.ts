import { supabase } from '../lib/supabase';

export interface ClassificationResult {
    label: string;
    score: number;
}

/**
 * Sends audio blob to the 'audio-classifier' Edge Function.
 * Wraps the logic to convert Blob -> FormData -> API Call.
 */
export const classifyAudio = async (audioBlob: Blob): Promise<ClassificationResult[]> => {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        const { data, error } = await supabase.functions.invoke('audio-classifier', {
            body: formData,
            // Header is implicitly handled if using FormData with Supabase client usually, 
            // but sometimes explicit boundary is safer. 
            // However, Supabase JS invoke handles FormData serialization automatically.
        });

        if (error) {
            console.error('Iqra AI Error:', error);
            throw new Error(error.message);
        }

        return data as ClassificationResult[];
    } catch (err) {
        console.error('Classification Failed:', err);
        throw err;
    }
};

/**
 * Mock Service (Fallback) if API is offline
 */
export const mockClassifyAudio = async (audioBlob: Blob): Promise<ClassificationResult[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { label: 'ba', score: 0.95 },
                { label: 'ta', score: 0.05 }
            ]);
        }, 800);
    });
};
