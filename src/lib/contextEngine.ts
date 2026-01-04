import { supabase } from './supabase';

/**
 * Context Engine: The bridge between Iqra (Audio) and Smart Deen (Text).
 * This allows the AI Chatbot to "know" the user's recitation weaknesses.
 */

export interface LearnerProfile {
  weak_letters: string[];
  last_mistake: string;
  recitation_level: 'Beginner' | 'Intermediate' | 'Advanced';
  focus_area: 'Makhraj' | 'Tajweed' | 'Fluency';
}

export const ContextEngine = {
  /**
   * Updates the user's semantic profile based on ASR results.
   * Called automatically after every Iqra voice session.
   */
  async updateLearnerContext(userId: string, errorBreakdown: any) {
    // 1. Identify weaknesses
    const weakLetters = [];
    if (errorBreakdown.makhraj > 5) weakLetters.push('Makhraj Generic');
    // In future, ASR will return specific phonemes like 'Ha', 'Qaf'
    
    // 2. Determine Focus Area
    let focus: LearnerProfile['focus_area'] = 'Fluency';
    if (errorBreakdown.makhraj > errorBreakdown.tajwid) focus = 'Makhraj';
    else if (errorBreakdown.tajwid > errorBreakdown.harakat) focus = 'Tajweed';

    // 3. Update Supabase Profile (JSONB column)
    const { error } = await supabase
      .from('profiles')
      .update({
        learning_context: {
          last_updated: new Date().toISOString(),
          weaknesses: weakLetters,
          focus_area: focus,
          // We effectively "embed" this logic into the user's metadata
        }
      })
      .eq('id', userId);

    if (error) console.error('Failed to update learner context:', error);
  },

  /**
   * Retrieves the system prompt injection for the AI Chatbot.
   * This ensures the AI speaks specifically about the user's problems.
   */
  async getPersonalizedSystemPrompt(userId: string): Promise<string> {
    const { data } = await supabase
      .from('profiles')
      .select('learning_context, full_name')
      .eq('id', userId)
      .single();

    if (!data?.learning_context) return "";

    const ctx = data.learning_context as any;
    
    return `
    [SYSTEM CONTEXT - LEARNER PROFILE]
    User Name: ${data.full_name}
    Current Focus: ${ctx.focus_area}
    Known Weaknesses: ${ctx.weaknesses.join(', ') || 'None detected yet'}
    
    INSTRUCTION: 
    If the user asks for advice, PRIORITIZE fixing their '${ctx.focus_area}' issues.
    Be gentle but firm on their known weaknesses.
    `;
  }
};
