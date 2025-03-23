
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { MotionStats, FeedbackType } from '@/components/exercises/posture-monitor/types';
import { getInitialStats, updateStatsForGoodRep, updateStatsForBadRep } from '../utils/statsUtils';
import { createSession, saveDetectionData, completeSession } from '../utils/sessionUtils';

export const useSessionManagement = () => {
  // Exercise stats
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  
  // Session tracking
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const exerciseType = useRef<string>("squat");
  
  // Initialize session
  const initSession = useCallback(async () => {
    if (!sessionId) {
      const newSessionId = await createSession(exerciseType.current);
      
      if (newSessionId) {
        setSessionId(newSessionId);
        return newSessionId;
      }
    }
    return sessionId;
  }, [sessionId]);
  
  // Handle good rep
  const handleGoodRep = useCallback(() => {
    setStats(prev => updateStatsForGoodRep(prev));
  }, []);
  
  // Handle bad rep
  const handleBadRep = useCallback(() => {
    setStats(prev => updateStatsForBadRep(prev));
  }, []);
  
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
      exerciseType.current, 
      stats
    );
  }, [sessionId, stats]);
  
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
  }, []);
  
  return {
    stats,
    sessionId,
    exerciseType: exerciseType.current,
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    completeCurrentSession,
    resetSession
  };
};
