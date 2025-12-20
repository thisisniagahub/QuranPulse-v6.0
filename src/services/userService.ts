import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export const userService = {
  /**
   * Upserts user profile data into the 'profiles' table.
   * Checks for authentication before proceeding.
   * 
   * @param userId - The ID of the user to update (must match auth session usually, depends on RLS)
   * @param updates - Object containing fields to update
   * @returns { data, error }
   */
  async upsertUserProfile(userId: string, updates: Partial<UserProfile>) {
    console.log(`[UserService] Initiating upsert for user: ${userId}`);

    // 1. Auth Check
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
        console.error('[UserService] Auth Session Error:', authError);
        return { data: null, error: authError };
    }

    if (!session) {
        console.warn('[UserService] No active session found. RLS might block this request.');
        // We proceed, but RLS will likely fail if anon key doesn't have permission.
    } else {
        console.log(`[UserService] Verified Session: ${session.user.id}`);
    }

    // 2. Prepare Data
    // We enforce 'id' to ensure upsert targets the correct row.
    const upsertData = {
        ...updates,
        id: userId,
        updated_at: new Date().toISOString(),
    };

    console.log('[UserService] Payload:', JSON.stringify(upsertData, null, 2));

    // 3. Perform Upsert
    // .upsert() determines insert vs update based on primary key ('id').
    const { data, error } = await supabase
      .from('profiles')
      .upsert(upsertData, { 
          onConflict: 'id', 
          ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('[UserService] Upsert Error:', error);
      return { data: null, error };
    }

    // 4. Verify Update
    console.log('[UserService] Upsert Success. New Data:', data);
    return { data, error: null };
  },

  /**
   * Fetches a user profile by ID.
   */
  async getUserProfile(userId: string) {
      const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
      
      return { data, error };
  }
};
