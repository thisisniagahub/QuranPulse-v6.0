import { supabase } from '../lib/supabase';

export interface IqraProgress {
  volume: number;
  lesson_id: string;
  score: number;
  stars: number;
  completed_at: string;
}

export const IqraService = {
  // Save or Update Progress
  async saveProgress(volume: number, lessonId: string, score: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Calculate stars based on score
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