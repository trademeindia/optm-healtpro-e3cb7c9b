
import { useCallback, useRef, useState } from 'react';
import { MotionStats } from '@/lib/human/types';

// Helper functions for stats management
export const getInitialStats = (): MotionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  accuracy: 0,
  currentStreak: 0,
  bestStreak: 0,
  caloriesBurned: 0,
  lastUpdated: Date.now()
});

export const updateStatsForGoodRep = (stats: MotionStats): MotionStats => {
  const goodReps = stats.goodReps + 1;
  const totalReps = stats.totalReps + 1;
  const currentStreak = stats.currentStreak + 1;
  const bestStreak = Math.max(stats.bestStreak, currentStreak);
  
  // Calculate calories burned (rough estimate based on metabolic equivalent)
  // Assuming 1 rep burns about 0.15 calories for an average person
  const caloriesBurned = stats.caloriesBurned + 0.15;
  
  return {
    goodReps,
    totalReps,
    badReps: stats.badReps,
    accuracy: Math.round((goodReps / totalReps) * 100),
    currentStreak,
    bestStreak,
    caloriesBurned,
    lastUpdated: Date.now()
  };
};

export const updateStatsForBadRep = (stats: MotionStats): MotionStats => {
  const badReps = stats.badReps + 1;
  const totalReps = stats.totalReps + 1;
  
  // Calculate calories burned (less for bad form)
  // Assuming bad rep burns about 0.1 calories
  const caloriesBurned = stats.caloriesBurned + 0.1;
  
  return {
    goodReps: stats.goodReps,
    totalReps,
    badReps,
    accuracy: stats.goodReps > 0 ? Math.round((stats.goodReps / totalReps) * 100) : 0,
    currentStreak: 0, // Reset streak on bad rep
    bestStreak: stats.bestStreak,
    caloriesBurned,
    lastUpdated: Date.now()
  };
};

export const useSessionStats = () => {
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const exerciseType = useRef<string>('squat'); // Default exercise type
  
  // Handle a good rep (proper form)
  const handleGoodRep = useCallback(() => {
    setStats(prevStats => updateStatsForGoodRep(prevStats));
  }, []);
  
  // Handle a bad rep (improper form)
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
    sessionId,
    exerciseType,
    setSessionId,
    handleGoodRep,
    handleBadRep,
    resetStats,
    setExerciseType
  };
};

// Re-export types for consumers
export type { MotionStats } from '@/lib/human/types';
