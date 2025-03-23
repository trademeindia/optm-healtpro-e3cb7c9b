
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { toJsonObject } from './jsonUtils';
import { BodyAngles, MotionState, MotionStats } from '@/components/exercises/posture-monitor/types';
import * as Human from '@vladmandic/human';

/**
 * Save detection data to Supabase
 */
export const saveDetectionData = async (
  sessionId: string | undefined,
  result: Human.Result | null,
  angles: BodyAngles,
  biomarkers: Record<string, any>,
  currentMotionState: MotionState,
  exerciseType: string,
  stats: MotionStats
) => {
  if (!sessionId || !result) return;
  
  try {
    // Convert complex objects to plain objects for JSON serialization
    const serializedAngles = angles ? toJsonObject(angles) : null;
    const serializedBiomarkers = biomarkers ? toJsonObject(biomarkers) : null;
    const serializedMetadata = toJsonObject({
      exerciseType: exerciseType,
      motionState: currentMotionState,
      stats: stats
    });
    
    await supabase.from('body_analysis').insert({
      patient_id: (await supabase.auth.getUser()).data.user?.id,
      session_id: sessionId,
      angles: serializedAngles,
      posture_score: biomarkers.postureScore || null,
      biomarkers: serializedBiomarkers,
      metadata: serializedMetadata
    });
  } catch (error) {
    console.error('Error saving detection data:', error);
  }
};

/**
 * Create a new session in Supabase
 */
export const createSession = async (exerciseType: string): Promise<string | undefined> => {
  try {
    const { data, error } = await supabase
      .from('analysis_sessions')
      .insert({
        patient_id: (await supabase.auth.getUser()).data.user?.id,
        exercise_type: exerciseType,
        start_time: new Date().toISOString(),
        notes: 'Session created with Human.js detection'
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error creating session:', error);
    toast.error('Failed to create tracking session');
    return undefined;
  }
};

/**
 * Complete a session in Supabase
 */
export const completeSession = async (sessionId: string | undefined, stats: MotionStats, biomarkers: Record<string, any>) => {
  if (!sessionId) return;
  
  try {
    // Convert complex objects to plain objects for JSON serialization
    const summaryData = toJsonObject({
      stats: stats,
      lastBiomarkers: biomarkers
    });
    
    await supabase
      .from('analysis_sessions')
      .update({
        end_time: new Date().toISOString(),
        summary: summaryData
      })
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error completing session:', error);
  }
};
