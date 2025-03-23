
import { supabase } from '@/integrations/supabase/client';
import { MotionStats } from '../../posture-monitor/types';
import { toJsonObject } from './jsonUtils';
import { processOfflineQueue } from './offlineQueueManager';

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
  processOfflineQueue();
  
  // Update the session with end time and summary
  supabase
    .from('analysis_sessions')
    .update({
      end_time: new Date().toISOString(),
      summary: toJsonObject({
        reps: stats.totalReps,
        goodReps: stats.goodReps,
        badReps: stats.badReps,
        accuracy: stats.accuracy,
        biomarkers: biomarkers
      })
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
