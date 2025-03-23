
import { supabase } from '@/integrations/supabase/client';

/**
 * Create a new analysis session in the database
 */
export const createSession = async (exerciseType: string): Promise<string> => {
  console.log('Creating session for:', exerciseType);
  
  try {
    // Check if we're authenticated first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('User not authenticated, creating local session ID');
      return `local-session-${Date.now()}`;
    }
    
    // Create a new analysis session in the database
    const { data, error } = await supabase
      .from('analysis_sessions')
      .insert({
        patient_id: user.id,
        exercise_type: exerciseType,
        start_time: new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating session:', error);
      return `local-session-${Date.now()}`;
    }
    
    console.log('Session created with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error in createSession:', error);
    return `local-session-${Date.now()}`;
  }
};
