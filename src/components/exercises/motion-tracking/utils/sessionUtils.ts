
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MotionStats } from '../../posture-monitor/types';

let offlineQueue: Array<any> = [];
let isProcessingQueue = false;

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

/**
 * Process offline queue of detection data
 */
async function processOfflineQueue() {
  if (isProcessingQueue || offlineQueue.length === 0) return;
  
  isProcessingQueue = true;
  console.log(`Processing offline queue: ${offlineQueue.length} items`);
  
  try {
    // Check connection
    const { error: pingError } = await supabase.from('analysis_sessions').select('id').limit(1);
    
    if (pingError) {
      console.log('Still offline, keeping queue for later processing');
      isProcessingQueue = false;
      return;
    }
    
    // Process queue in batches
    const batchSize = 10;
    while (offlineQueue.length > 0) {
      const batch = offlineQueue.splice(0, batchSize);
      
      for (const item of batch) {
        try {
          await supabase.from('body_analysis').insert(item);
        } catch (error) {
          console.error('Error processing queue item:', error);
        }
      }
      
      // Wait briefly between batches
      if (offlineQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('Offline queue processed successfully');
    toast.success('Synced offline data with server');
  } catch (error) {
    console.error('Error processing offline queue:', error);
  } finally {
    isProcessingQueue = false;
  }
}

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
    
    // Prepare the data record with required patient_id field
    const dataRecord = {
      session_id: sessionId,
      patient_id: user?.id || 'anonymous', // Ensure patient_id is always present
      angles: angles || {},
      biomarkers: biomarkers || {},
      metadata: {
        motionState: motionState,
        exerciseType: exerciseType,
        stats: stats,
        timestamp: new Date().toISOString()
      }
    };
    
    // Try to save to Supabase
    const { error } = await supabase.from('body_analysis').insert(dataRecord);
    
    if (error) {
      console.warn('Error saving to database, adding to offline queue:', error);
      
      // Add to offline queue for later processing
      offlineQueue.push(dataRecord);
      
      // Try to process offline queue if we have items
      if (offlineQueue.length >= 10) {
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
    
    // Add to offline queue with the patient_id
    offlineQueue.push({
      session_id: sessionId,
      patient_id: user?.id || 'anonymous', // Ensure patient_id is always present
      angles: angles || {},
      biomarkers: biomarkers || {},
      metadata: {
        motionState: motionState,
        exerciseType: exerciseType,
        stats: stats,
        timestamp: new Date().toISOString()
      }
    });
    
    return false;
  }
};

/**
 * Complete the session and update the end time
 */
export const completeSession = (
  sessionId: string | undefined,
  stats: MotionStats,
  biomarkers: any
): void => {
  if (!sessionId || sessionId.startsWith('local-session-')) {
    console.log('Completing local session:', sessionId);
    return;
  }
  
  console.log('Completing session:', sessionId);
  
  // Process any remaining offline data
  if (offlineQueue.length > 0) {
    processOfflineQueue();
  }
  
  // Update the session with end time and summary
  supabase
    .from('analysis_sessions')
    .update({
      end_time: new Date().toISOString(),
      summary: {
        reps: stats.totalReps,
        goodReps: stats.goodReps,
        badReps: stats.badReps,
        accuracy: stats.accuracy,
        biomarkers: biomarkers
      }
    })
    .eq('id', sessionId)
    .then(({ error }) => {
      if (error) {
        console.error('Error completing session:', error);
      } else {
        console.log('Session completed successfully');
      }
    });
};

/**
 * Get the offline queue status
 */
export const getOfflineQueueStatus = () => {
  return {
    itemsCount: offlineQueue.length,
    isProcessing: isProcessingQueue
  };
};

/**
 * Force sync of offline queue
 */
export const forceSync = async (): Promise<boolean> => {
  if (offlineQueue.length === 0) return true;
  
  try {
    await processOfflineQueue();
    return offlineQueue.length === 0;
  } catch (error) {
    console.error('Error in forceSync:', error);
    return false;
  }
};
