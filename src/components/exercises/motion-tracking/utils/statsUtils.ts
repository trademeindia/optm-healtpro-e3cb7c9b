
import { MotionStats } from '@/components/exercises/posture-monitor/types';

/**
 * Initialize motion stats with default values
 */
export const getInitialStats = (): MotionStats => {
  return {
    totalReps: 0,
    goodReps: 0,
    badReps: 0,
    accuracy: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastUpdated: Date.now()
  };
};

/**
 * Update stats when a good rep is completed
 */
export const updateStatsForGoodRep = (prevStats: MotionStats): MotionStats => {
  const totalReps = prevStats.totalReps + 1;
  const goodReps = prevStats.goodReps + 1;
  const currentStreak = prevStats.currentStreak + 1;
  const bestStreak = Math.max(prevStats.bestStreak, currentStreak);
  const accuracy = calculateAccuracy(goodReps, totalReps);
  
  return {
    totalReps,
    goodReps,
    badReps: prevStats.badReps,
    accuracy,
    currentStreak,
    bestStreak,
    lastUpdated: Date.now()
  };
};

/**
 * Update stats when a bad rep is completed
 */
export const updateStatsForBadRep = (prevStats: MotionStats): MotionStats => {
  const totalReps = prevStats.totalReps + 1;
  const badReps = prevStats.badReps + 1;
  const accuracy = calculateAccuracy(prevStats.goodReps, totalReps);
  
  return {
    totalReps,
    goodReps: prevStats.goodReps,
    badReps,
    accuracy,
    currentStreak: 0, // Reset streak on bad rep
    bestStreak: prevStats.bestStreak,
    lastUpdated: Date.now()
  };
};

/**
 * Calculate accuracy percentage
 */
const calculateAccuracy = (goodReps: number, totalReps: number): number => {
  if (totalReps === 0) return 0;
  return Math.round((goodReps / totalReps) * 100);
};
