
import { supabase } from '@/integrations/supabase/client';
import { ExerciseSession, JointAngle } from '@/components/exercises/body-tracker/types';

export const saveExerciseSession = async (sessionData: ExerciseSession) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sessions')
      .insert([sessionData]);
      
    if (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to save exercise session:', error);
    throw error;
  }
};

export const getPatientSessions = async (patientId: string) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get patient sessions:', error);
    throw error;
  }
};

export const getRecentSessions = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sessions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get recent sessions:', error);
    throw error;
  }
};
