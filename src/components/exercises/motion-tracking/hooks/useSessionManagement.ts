
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MotionState, MotionStats } from '@/lib/human/types';
import { getInitialStats, updateStatsForGoodRep, updateStatsForBadRep } from '../utils/statsUtils';
import { createSession, saveDetectionData, completeSession } from '../utils/sessionUtils';

export const useSessionManagement = () => {
  // Session state
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const [exerciseType, setExerciseType] = useState<string>('general');
  
  // Initialize a new session
  const initSession = useCallback(async (type: string = 'general') => {
    try {
      setExerciseType(type);
      const newSessionId = await createSession(type);
      setSessionId(newSessionId);
      setStats(getInitialStats());
      
      console.log(`New session created: ${newSessionId} for exercise type: ${type}`);
      return newSessionId;
    } catch (error) {
      console.error('Error initializing session:', error);
      toast.error('Failed to initialize session tracking');
      return undefined;
    }
  }, []);
  
  // Handle good rep (completed with proper form)
  const handleGoodRep = useCallback(() => {
    setStats(prev => updateStatsForGoodRep(prev));
    toast.success('Good rep!', { 
      position: 'top-right',
      duration: 1500
    });
  }, []);
  
  // Handle bad rep (completed with poor form)
  const handleBadRep = useCallback(() => {
    setStats(prev => updateStatsForBadRep(prev));
    toast.warning('Room for improvement on that rep', { 
      position: 'top-right',
      duration: 1500
    });
  }, []);
  
  // Save session data to persistent storage
  const saveSessionData = useCallback(async (
    detectionResult: any,
    angles: any,
    biomarkers: any,
    motionState: MotionState
  ) => {
    if (!sessionId) return;
    
    try {
      await saveDetectionData(
        sessionId,
        detectionResult,
        angles,
        biomarkers,
        motionState.toString(),
        exerciseType,
        stats
      );
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }, [sessionId, exerciseType, stats]);
  
  // Complete the current session
  const completeCurrentSession = useCallback((biomarkers: any = {}) => {
    if (!sessionId) return;
    
    try {
      completeSession(sessionId, stats, biomarkers);
      toast.success('Session completed and saved');
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to save session data');
    }
  }, [sessionId, stats]);
  
  // Reset the current session data
  const resetSession = useCallback(() => {
    setStats(getInitialStats());
    toast.info('Session reset');
  }, []);
  
  return {
    sessionId,
    stats,
    exerciseType,
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    completeCurrentSession,
    resetSession
  };
};
