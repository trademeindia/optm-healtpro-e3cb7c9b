
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import type { MotionStats } from '@/lib/human/types';

// Export this for reuse in other files
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

// Export functions for updating stats
export const updateStatsForGoodRep = (prevStats: MotionStats): MotionStats => {
  const currentStreak = prevStats.currentStreak + 1;
  const bestStreak = Math.max(prevStats.bestStreak, currentStreak);
  const totalReps = prevStats.totalReps + 1;
  const goodReps = prevStats.goodReps + 1;
  const accuracy = (goodReps / totalReps) * 100;
  const caloriesBurned = Math.round(prevStats.caloriesBurned + 0.75); // Approximate calories per rep
  
  return {
    totalReps,
    goodReps,
    badReps: prevStats.badReps,
    accuracy,
    currentStreak,
    bestStreak,
    lastUpdated: Date.now(),
    caloriesBurned
  };
};

export const updateStatsForBadRep = (prevStats: MotionStats): MotionStats => {
  const totalReps = prevStats.totalReps + 1;
  const badReps = prevStats.badReps + 1;
  const accuracy = (prevStats.goodReps / totalReps) * 100;
  const caloriesBurned = Math.round(prevStats.caloriesBurned + 0.5); // Lower calories for bad form
  
  return {
    totalReps,
    goodReps: prevStats.goodReps,
    badReps,
    accuracy,
    currentStreak: 0, // Reset streak on bad rep
    bestStreak: prevStats.bestStreak,
    lastUpdated: Date.now(),
    caloriesBurned
  };
};

export const useSessionStats = () => {
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const exerciseType = useRef('squat');
  
  // Function to handle when a good rep is completed
  const handleGoodRep = useCallback(() => {
    setStats(prevStats => updateStatsForGoodRep(prevStats));
  }, []);
  
  // Function to handle when a bad rep is completed
  const handleBadRep = useCallback(() => {
    setStats(prevStats => updateStatsForBadRep(prevStats));
  }, []);
  
  // Reset all stats
  const resetStats = useCallback(() => {
    setStats(getInitialStats());
    
    toast.info('Exercise stats reset');
  }, []);
  
  // Set exercise type
  const setExerciseType = useCallback((type: string) => {
    exerciseType.current = type;
  }, []);
  
  return {
    stats,
    sessionId,
    exerciseType,
    setSessionId,
    handleGoodRep,
    handleBadRep,
    resetStats,
    setExerciseType
  };
};

// Export the type as well
export type { MotionStats };
