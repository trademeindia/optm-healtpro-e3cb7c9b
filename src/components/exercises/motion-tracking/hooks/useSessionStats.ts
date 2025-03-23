
import { useState, useCallback, useRef } from 'react';
import { MotionStats } from '@/lib/human/types';
import { getInitialStats, updateStatsForGoodRep, updateStatsForBadRep } from '../utils/statsUtils';

export const useSessionStats = () => {
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const exerciseType = useRef<string>("squat");
  
  // Handle a good rep
  const handleGoodRep = useCallback(() => {
    setStats(prevStats => updateStatsForGoodRep(prevStats));
  }, []);
  
  // Handle a bad rep
  const handleBadRep = useCallback(() => {
    setStats(prevStats => updateStatsForBadRep(prevStats));
  }, []);
  
  // Reset stats
  const resetStats = useCallback(() => {
    setStats(getInitialStats());
  }, []);
  
  // Set exercise type
  const setExerciseType = useCallback((type: string) => {
    exerciseType.current = type;
  }, []);
  
  return {
    stats,
    setStats,
    sessionId,
    setSessionId,
    handleGoodRep,
    handleBadRep,
    resetStats,
    exerciseType,
    setExerciseType
  };
};
