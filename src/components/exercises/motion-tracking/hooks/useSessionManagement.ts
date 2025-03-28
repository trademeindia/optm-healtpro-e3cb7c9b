
import { useState, useCallback, useEffect } from 'react';
import * as Human from '@vladmandic/human';
import { MotionState, BodyAngles } from '@/lib/human/types';
import { getInitialStats, updateStatsForGoodRep, updateStatsForBadRep } from './useSessionStats';
import { MotionStats } from '@/lib/human/types';

interface UseSessionManagementProps {
  sessionId?: string;
  onSessionComplete?: (sessionData: any) => void;
}

export const useSessionManagement = ({ sessionId, onSessionComplete }: UseSessionManagementProps) => {
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const [sessionData, setSessionData] = useState<any[]>([]);
  
  // Add a rep with good form
  const addGoodRep = useCallback(() => {
    setStats(prev => updateStatsForGoodRep(prev));
  }, []);
  
  // Add a rep with bad form
  const addBadRep = useCallback(() => {
    setStats(prev => updateStatsForBadRep(prev));
  }, []);
  
  // Reset the session stats
  const resetSession = useCallback(() => {
    setStats(getInitialStats());
    setSessionData([]);
  }, []);
  
  // Save session data for a rep
  const saveRepData = useCallback((
    result: Human.Result,
    angles: BodyAngles,
    biomarkers: Record<string, number | null>,
    motionState: MotionState,
    isGoodForm: boolean
  ) => {
    const timestamp = Date.now();
    
    const repData = {
      timestamp,
      sessionId,
      motionState,
      angles,
      biomarkers,
      isGoodForm,
      stats: { ...stats }
    };
    
    setSessionData(prev => [...prev, repData]);
    
    return repData;
  }, [sessionId, stats]);
  
  // Complete the session and process data
  const completeSession = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      // Prepare session summary
      const sessionSummary = {
        sessionId,
        completedAt: Date.now(),
        stats,
        data: sessionData
      };
      
      // Call the provided callback with session data
      if (onSessionComplete) {
        onSessionComplete(sessionSummary);
      }
      
      return sessionSummary;
    } catch (error) {
      console.error('Error completing session:', error);
      return null;
    }
  }, [sessionId, stats, sessionData, onSessionComplete]);
  
  return {
    stats,
    sessionData,
    addGoodRep,
    addBadRep,
    resetSession,
    saveRepData,
    completeSession
  };
};
