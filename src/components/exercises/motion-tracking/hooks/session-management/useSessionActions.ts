
import { useCallback } from 'react';
import { toast } from 'sonner';
import { MotionStats } from '@/components/exercises/posture-monitor/types';
import { updateStatsForGoodRep, updateStatsForBadRep } from '../../utils/statsUtils';
import { createSession, saveDetectionData, completeSession } from '../../utils/sessionUtils';

export const useSessionActions = (
  sessionId: string | undefined,
  setSessionId: (id: string | undefined) => void,
  stats: MotionStats,
  setStats: (stats: MotionStats | ((prev: MotionStats) => MotionStats)) => void,
  exerciseType: string
) => {
  // Initialize session
  const initSession = useCallback(async () => {
    if (!sessionId) {
      const newSessionId = await createSession(exerciseType);
      
      if (newSessionId) {
        setSessionId(newSessionId);
        return newSessionId;
      }
    }
    return sessionId;
  }, [sessionId, exerciseType, setSessionId]);
  
  // Handle good rep
  const handleGoodRep = useCallback(() => {
    setStats(prev => updateStatsForGoodRep(prev));
  }, [setStats]);
  
  // Handle bad rep
  const handleBadRep = useCallback(() => {
    setStats(prev => updateStatsForBadRep(prev));
  }, [setStats]);
  
  // Save session data
  const saveSessionData = useCallback(async (
    detectionResult: any,
    angles: any,
    biomarkers: any,
    motionState: string
  ) => {
    return await saveDetectionData(
      sessionId, 
      detectionResult, 
      angles, 
      biomarkers, 
      motionState, 
      exerciseType, 
      stats
    );
  }, [sessionId, stats, exerciseType]);
  
  // Complete the session
  const completeCurrentSession = useCallback(() => {
    if (sessionId) {
      completeSession(sessionId, stats, {});
    }
  }, [sessionId, stats]);
  
  // Reset session
  const resetSession = useCallback(() => {
    setStats(getInitialStats());
    
    toast.info("Session Reset", {
      description: "Your workout session has been reset. Ready to start new exercises!",
      duration: 3000
    });
  }, [setStats]);

  return {
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    completeCurrentSession,
    resetSession
  };
};
