import { supabase } from '../lib/supabase';

export interface IqraProgress {
  volume: number;
  lesson_id: string;
  score: number;
  stars: number;
  completed_at: string;
}

export interface ASRAnalysis {
  qwer: number;
  level: string;
  error_breakdown: {
    makhraj: number;
    tajwid: number;
    harakat: number;
    rhythm: number;
  };
  audio_info: {
    transcription: string;
    duration: number;
  };
}

const ASR_API_URL = import.meta.env.VITE_ASR_API_URL || 'http://localhost:8000';

export const IqraService = {
  /**
   * Sends audio blob to the ASR Microservice for Tajweed analysis.
   */
  async analyzeRecitation(audioBlob: Blob, expectedText: string = ""): Promise<ASRAnalysis | null> {
    try {
      console.log('🎙️ Sending recitation to ASR Engine...');
      const formData = new FormData();
      formData.append('file', audioBlob, 'recitation.wav');
      formData.append('expected_text', expectedText);

      const response = await fetch(`${ASR_API_URL}/analyze/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ASR API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.analysis ? {
        qwer: data.analysis.qwer,
        level: data.analysis.level,
        error_breakdown: data.analysis.error_breakdown,
        audio_info: {
          transcription: data.audio_info.transcription,
          duration: data.audio_info.duration
        }
      } : null;

    } catch (error) {
      console.error('❌ ASR Analysis failed:', error);
      return null;
    }
  },

  // Save or Update Progress
  async saveProgress(volume: number, lessonId: string, score: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Calculate stars based on score (Lower Q-WER is better, but here we assume 'score' is accuracy 0-100)
    const stars = score >= 90 ? 3 : score >= 80 ? 2 : 1;

    const { data, error } = await supabase
      .from('iqra_progress')
      .upsert({
        user_id: user.id,
        volume,
        lesson_id: lessonId,
        score,
        stars,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id, lesson_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving progress:', error);
      return null;
    }
    return data;
  },

  // Get Progress for a Volume
  async getVolumeProgress(volume: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('iqra_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('volume', volume);

    if (error) {
      console.error('Error fetching progress:', error);
      return [];
    }
    return data as IqraProgress[];
  },

  // Get Total Stars
  async getTotalStars() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data, error } = await supabase
      .from('iqra_progress')
      .select('stars')
      .eq('user_id', user.id);

    if (error) return 0;
    
    // Sum up stars
    return data.reduce((acc, curr) => acc + (curr.stars || 0), 0);
  }
};