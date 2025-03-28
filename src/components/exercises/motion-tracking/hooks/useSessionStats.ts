
import { useState, useRef, useCallback } from 'react';
import { MotionStats } from '@/lib/human/types';
import { calculateAccuracy, estimateCaloriesBurned } from '../utils/statsUtils';

// Initialize stats function that was missing
export const getInitialStats = (): MotionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  accuracy: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastUpdated: Date.now(),
  caloriesBurned: 0
});

// Utility functions to update stats
export const updateStatsForGoodRep = (prevStats: MotionStats): MotionStats => {
  const newTotalReps = prevStats.totalReps + 1;
  const newGoodReps = prevStats.goodReps + 1;
  const newCurrentStreak = prevStats.currentStreak + 1;
  const newBestStreak = Math.max(prevStats.bestStreak, newCurrentStreak);
  
  return {
    totalReps: newTotalReps,
    goodReps: newGoodReps,
    badReps: prevStats.badReps,
    accuracy: calculateAccuracy(newGoodReps, newTotalReps),
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastUpdated: Date.now(),
    caloriesBurned: estimateCaloriesBurned(newTotalReps, 'squat')
  };
};

export const updateStatsForBadRep = (prevStats: MotionStats): MotionStats => {
  const newTotalReps = prevStats.totalReps + 1;
  const newBadReps = prevStats.badReps + 1;
  
  return {
    totalReps: newTotalReps,
    goodReps: prevStats.goodReps,
    badReps: newBadReps,
    accuracy: calculateAccuracy(prevStats.goodReps, newTotalReps),
    currentStreak: 0, // Reset streak on bad rep
    bestStreak: prevStats.bestStreak,
    lastUpdated: Date.now(),
    caloriesBurned: estimateCaloriesBurned(newTotalReps, 'squat')
  };
};

export const useSessionStats = () => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const exerciseType = useRef<string>('squat');
  
  // Initialize stats
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  
  // Handle good rep
  const handleGoodRep = useCallback(() => {
    setStats(prevStats => updateStatsForGoodRep(prevStats));
  }, []);
  
  // Handle bad rep
  const handleBadRep = useCallback(() => {
    setStats(prevStats => updateStatsForBadRep(prevStats));
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

export default useSessionStats;
