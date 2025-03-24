
import { useState, useRef, useCallback } from 'react';

// Define the MotionStats type
export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  caloriesBurned: number;
  lastUpdated?: number;
}

// Get initial stats for a new session
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

// Update stats for a good rep
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

// Update stats for a bad rep
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
  const exerciseType = useRef<string>("squat");
  
  // Handle a good rep
  const handleGoodRep = useCallback(() => {
    setStats(prevStats => updateStatsForGoodRep(prevStats));
  }, []);
  
  // Handle a bad rep
  const handleBadRep = useCallback(() => {
    setStats(prevStats => updateStatsForBadRep(prevStats));
  }, []);
  
  // Reset stats for a new session
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
