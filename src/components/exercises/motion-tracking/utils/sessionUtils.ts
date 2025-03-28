
import { v4 as uuidv4 } from 'uuid';
import { BodyAngles, MotionBiomarkers, MotionState, MotionStats } from '@/lib/human/types';

// Create a new exercise session
export const createSession = async (exerciseType: string): Promise<string> => {
  try {
    const sessionId = uuidv4();
    console.log('Created new session:', sessionId, 'for exercise type:', exerciseType);
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Save detection data for a rep
export const saveDetectionData = async (
  sessionId: string | undefined,
  result: any,
  angles: BodyAngles,
  biomarkers: Record<string, number | null>,
  motionState: MotionState,
  exerciseType: string,
  stats: MotionStats
): Promise<void> => {
  if (!sessionId) {
    console.warn('No session ID provided, cannot save detection data');
    return;
  }
  
  try {
    // For now, simply log the data - in a real app, this would save to a database
    console.log('Saving detection data for session:', sessionId, {
      timestamp: new Date().toISOString(),
      exerciseType,
      motionState,
      angles,
      biomarkers,
      stats
    });
  } catch (error) {
    console.error('Error saving detection data:', error);
  }
};

// Complete an exercise session
export const completeSession = async (sessionId: string | undefined): Promise<void> => {
  if (!sessionId) {
    console.warn('No session ID provided, cannot complete session');
    return;
  }
  
  try {
    console.log('Completing session:', sessionId);
    // In a real app, this would update the session status in the database
  } catch (error) {
    console.error('Error completing session:', error);
  }
};
