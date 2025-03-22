
import { supabase } from '@/integrations/supabase/client';
import { ExerciseSession, JointAngle } from '@/components/exercises/body-tracker/types';

export const saveExerciseSession = async (sessionData: ExerciseSession) => {
  try {
    // Convert angles to a plain object that can be stored as JSON
    const plainAngles = sessionData.angles.map(angle => ({
      joint: angle.joint,
      angle: angle.angle
    }));

    // Ensure sessionData matches the expected database schema
    const { data, error } = await supabase
      .from('exercise_sessions')
      .insert({
        patient_id: sessionData.patient_id,
        exercise_type: sessionData.exercise_type,
        timestamp: sessionData.timestamp,
        angles: plainAngles, // Now properly formatted for JSON storage
        notes: sessionData.notes
      });
      
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
