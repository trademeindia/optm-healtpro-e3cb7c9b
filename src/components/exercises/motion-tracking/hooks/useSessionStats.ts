
import { useState, useRef, useCallback } from 'react';
import { MotionStats } from '@/lib/human/types';

// Get initial stats
export const getInitialStats = (): MotionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  accuracy: 0,
  currentStreak: 0,
  bestStreak: 0
});

// Update stats for good rep
export const updateStatsForGoodRep = (currentStats: MotionStats): MotionStats => {
  const totalReps = currentStats.totalReps + 1;
  const goodReps = currentStats.goodReps + 1;
  const currentStreak = currentStats.currentStreak + 1;
  const bestStreak = Math.max(currentStreak, currentStats.bestStreak);
  const accuracy = totalReps > 0 ? Math.round((goodReps / totalReps) * 100) : 0;
  
  return {
    ...currentStats,
    totalReps,
    goodReps,
    accuracy,
    currentStreak,
    bestStreak,
    lastUpdated: Date.now()
  };
};

// Update stats for bad rep
export const updateStatsForBadRep = (currentStats: MotionStats): MotionStats => {
  const totalReps = currentStats.totalReps + 1;
  const badReps = currentStats.badReps + 1;
  const goodReps = currentStats.goodReps;
  const accuracy = totalReps > 0 ? Math.round((goodReps / totalReps) * 100) : 0;
  
  return {
    ...currentStats,
    totalReps,
    badReps,
    accuracy,
    currentStreak: 0, // Reset streak on bad rep
    bestStreak: currentStats.bestStreak,
    lastUpdated: Date.now()
  };
};

export const useSessionStats = () => {
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const exerciseType = useRef<string>('squat');
  
  // Handle a good rep
  const handleGoodRep = useCallback(() => {
    setStats(currentStats => updateStatsForGoodRep(currentStats));
  }, []);
  
  // Handle a bad rep
  const handleBadRep = useCallback(() => {
    setStats(currentStats => updateStatsForBadRep(currentStats));
  }, []);
  
  // Reset stats
  const resetStats = useCallback(() => {
    setStats(getInitialStats());
  }, []);
  
  return {
    stats,
    sessionId,
    exerciseType,
    setSessionId,
    handleGoodRep,
    handleBadRep,
    resetStats
  };
};
