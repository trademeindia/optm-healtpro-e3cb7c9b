
import { useState, useRef, useCallback } from 'react';
import { MotionStats } from '@/lib/human/types';
import { calculateAccuracy, estimateCaloriesBurned } from '../utils/statsUtils';

export const useSessionStats = () => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const exerciseType = useRef<string>('squat');
  
  // Initialize stats
  const [stats, setStats] = useState<MotionStats>({
    totalReps: 0,
    goodReps: 0,
    badReps: 0,
    accuracy: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastUpdated: Date.now(),
    caloriesBurned: 0
  });
  
  // Handle good rep
  const handleGoodRep = useCallback(() => {
    setStats(prevStats => {
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
        caloriesBurned: estimateCaloriesBurned(newTotalReps, exerciseType.current)
      };
    });
  }, []);
  
  // Handle bad rep
  const handleBadRep = useCallback(() => {
    setStats(prevStats => {
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
        caloriesBurned: estimateCaloriesBurned(newTotalReps, exerciseType.current)
      };
    });
  }, []);
  
  // Reset stats
  const resetStats = useCallback(() => {
    setStats({
      totalReps: 0,
      goodReps: 0,
      badReps: 0,
      accuracy: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastUpdated: Date.now(),
      caloriesBurned: 0
    });
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
