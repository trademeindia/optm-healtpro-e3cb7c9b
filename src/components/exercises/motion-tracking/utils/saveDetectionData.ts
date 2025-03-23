
import { supabase } from '@/integrations/supabase/client';
import { MotionStats } from '../../posture-monitor/types';
import { toJsonObject } from './jsonUtils';
import { addToOfflineQueue, processOfflineQueue, getOfflineQueueStatus } from './offlineQueueManager';

/**
 * Save detection data to database with offline support
 */
export const saveDetectionData = async (
  sessionId: string | undefined,
  detectionResult: any,
  angles: any,
  biomarkers: any,
  motionState: string,
  exerciseType: string = 'squat',
  stats: MotionStats
): Promise<boolean> => {
  // Don't save if no session ID
  if (!sessionId) return false;
  
  // Don't save null results
  if (!detectionResult && !angles) return false;
  
  try {
    // Try to get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create a JSON-safe version of the data with properly transformed MotionStats
    const dataRecord = {
      session_id: sessionId,
      patient_id: user?.id || 'anonymous', // Ensure patient_id is always present
      angles: toJsonObject(angles || {}),
      biomarkers: toJsonObject(biomarkers || {}),
      metadata: toJsonObject({
        motionState: motionState,
        exerciseType: exerciseType,
        stats: {
          totalReps: stats.totalReps,
          goodReps: stats.goodReps,
          badReps: stats.badReps,
          accuracy: stats.accuracy,
          currentStreak: stats.currentStreak,
          bestStreak: stats.bestStreak
        },
        timestamp: new Date().toISOString()
      })
    };
    
    // Try to save to Supabase
    const { error } = await supabase.from('body_analysis').insert(dataRecord);
    
    if (error) {
      console.warn('Error saving to database, adding to offline queue:', error);
      
      // Add to offline queue for later processing
      addToOfflineQueue(dataRecord);
      
      // Try to process offline queue if we have items
      if (getOfflineQueueItems() >= 10) {
        processOfflineQueue();
      }
      
      return false;
    }
    
    // Successfully saved
    return true;
  } catch (error) {
    console.error('Error in saveDetectionData:', error);
    
    // Get the authenticated user for the offline queue item
    const { data: { user } } = await supabase.auth.getUser();
    
    // Add to offline queue with the patient_id and properly converted to JSON
    addToOfflineQueue({
      session_id: sessionId,
      patient_id: user?.id || 'anonymous', // Ensure patient_id is always present
      angles: toJsonObject(angles || {}),
      biomarkers: toJsonObject(biomarkers || {}),
      metadata: toJsonObject({
        motionState: motionState,
        exerciseType: exerciseType,
        stats: {
          totalReps: stats.totalReps,
          goodReps: stats.goodReps,
          badReps: stats.badReps,
          accuracy: stats.accuracy,
          currentStreak: stats.currentStreak || 0,
          bestStreak: stats.bestStreak || 0
        },
        timestamp: new Date().toISOString()
      })
    });
    
    return false;
  }
};

// Helper function to get offline queue item count
function getOfflineQueueItems(): number {
  return getOfflineQueueStatus().itemsCount;
}

// Re-export getOfflineQueueStatus for external use
export { getOfflineQueueStatus } from './offlineQueueManager';
