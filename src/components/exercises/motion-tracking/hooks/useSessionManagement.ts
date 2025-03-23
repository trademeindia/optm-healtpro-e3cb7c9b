
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { MotionStats } from './types';
import {
  getInitialStats,
  updateStatsForGoodRep,
  updateStatsForBadRep
} from '../utils/statsUtils';
import {
  createSession,
  saveDetectionData,
  completeSession
} from '../utils/sessionUtils';

export const useSessionManagement = () => {
  // Session state
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const exerciseTypeRef = useRef<string>('squat'); // Default exercise type
  const isSavingRef = useRef<boolean>(false);
  
  // Initialize session
  const initSession = useCallback(async (exerciseType?: string) => {
    if (exerciseType) {
      exerciseTypeRef.current = exerciseType;
    }
    
    if (!sessionId) {
      try {
        const newSessionId = await createSession(exerciseTypeRef.current);
        setSessionId(newSessionId);
        
        // Reset stats for new session
        setStats(getInitialStats());
        
        return newSessionId;
      } catch (error) {
        console.error('Error initializing session:', error);
        toast.error('Failed to initialize exercise session');
        return undefined;
      }
    }
    
    return sessionId;
  }, [sessionId]);
  
  // Handle good rep
  const handleGoodRep = useCallback(() => {
    setStats(prev => updateStatsForGoodRep(prev));
    if (stats.goodReps % 5 === 0) { // Provide encouragement every 5 good reps
      toast.success(`Great job! ${stats.goodReps + 1} good reps completed!`);
    }
  }, [stats.goodReps]);
  
  // Handle bad rep
  const handleBadRep = useCallback(() => {
    setStats(prev => updateStatsForBadRep(prev));
  }, []);
  
  // Save session data
  const saveSessionData = useCallback(async (
    detectionResult: any,
    angles: any,
    biomarkers: any,
    motionState: any
  ) => {
    // Prevent too frequent saves and overlapping save operations
    if (isSavingRef.current) return;
    
    isSavingRef.current = true;
    
    try {
      await saveDetectionData(
        sessionId,
        detectionResult,
        angles,
        biomarkers,
        motionState,
        exerciseTypeRef.current,
        stats
      );
    } catch (error) {
      console.error('Error saving session data:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [sessionId, stats]);
  
  // Reset session
  const resetSession = useCallback(async () => {
    // Complete current session if it exists
    if (sessionId) {
      try {
        await completeSession(sessionId, stats, {});
      } catch (error) {
        console.error('Error completing session:', error);
      }
    }
    
    // Create a new session
    const newSessionId = await initSession();
    setSessionId(newSessionId);
    
    // Reset stats
    setStats(getInitialStats());
    
    toast.info('Session reset. Ready to start new exercises!');
  }, [sessionId, stats, initSession]);
  
  return {
    stats,
    sessionId,
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    resetSession
  };
};
