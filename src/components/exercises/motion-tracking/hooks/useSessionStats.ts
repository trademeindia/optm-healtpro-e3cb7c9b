
import { useState, useCallback, useRef } from 'react';
import { MotionStats } from '@/lib/human/types';
import { getInitialStats, updateStatsForGoodRep, updateStatsForBadRep } from '../utils/statsUtils';

export const useSessionStats = () => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const exerciseType = useRef<string>("squat");
  
  const handleGoodRep = useCallback(() => {
    // Create a new stats object with the lastUpdated property to satisfy the MotionStats type
    const newStats = updateStatsForGoodRep({
      ...stats,
      lastUpdated: stats.lastUpdated || Date.now()
    });
    setStats(newStats);
  }, [stats]);
  
  const handleBadRep = useCallback(() => {
    // Create a new stats object with the lastUpdated property to satisfy the MotionStats type
    const newStats = updateStatsForBadRep({
      ...stats,
      lastUpdated: stats.lastUpdated || Date.now()
    });
    setStats(newStats);
  }, [stats]);
  
  const resetStats = useCallback(() => {
    // Ensure the new initial stats has the required lastUpdated property
    setStats(getInitialStats());
  }, []);
  
  return {
    sessionId,
    setSessionId,
    stats,
    exerciseType,
    handleGoodRep,
    handleBadRep,
    resetStats
  };
};
