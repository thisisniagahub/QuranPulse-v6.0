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

const OPENCLAW_URL = import.meta.env.VITE_OPENCLAW_URL || 'https://operator.gangniaga.my';
const OPENCLAW_TOKEN = import.meta.env.VITE_OPENCLAW_TOKEN || '';

function calculateTextSimilarity(transcribed: string, expected: string): number {
  if (!transcribed || !expected) return 0;

  const a = transcribed.trim().toLowerCase();
  const b = expected.trim().toLowerCase();
  if (!a || !b) return 0;
  if (a === b) return 1;

  const aChars = new Set(a.split(''));
  const bChars = new Set(b.split(''));
  let overlap = 0;
  for (const ch of aChars) {
    if (bChars.has(ch)) overlap++;
  }
  return Math.min(1, overlap / Math.max(aChars.size, bChars.size));
}

export const IqraService = {
  /**
   * Sends audio blob to the ASR Microservice for Tajweed analysis.
   */
  async analyzeRecitation(audioBlob: Blob, expectedText: string = ""): Promise<ASRAnalysis | null> {
    try {
      console.log('🎙️ Sending recitation to OpenClaw ASR...');
      const formData = new FormData();
      formData.append('file', audioBlob, 'recitation.wav');
      formData.append('model', 'gpt-4o-mini-transcribe');
      formData.append('language', 'ar');

      const response = await fetch(`${OPENCLAW_URL}/v1/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENCLAW_TOKEN}`
        },
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`ASR API Error: ${response.status}`);
      }

      const data = await response.json();
      const transcription = (data.text || '') as string;
      const similarity = calculateTextSimilarity(transcription, expectedText);
      const qwer = Math.max(0, Math.round((1 - similarity) * 100));
      const level = qwer <= 10 ? 'excellent' : qwer <= 30 ? 'good' : qwer <= 50 ? 'fair' : 'needs_practice';

      return {
        qwer,
        level,
        error_breakdown: {
          makhraj: qwer,
          tajwid: qwer,
          harakat: qwer,
          rhythm: qwer
        },
        audio_info: {
          transcription,
          duration: 0
        }
      };

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
