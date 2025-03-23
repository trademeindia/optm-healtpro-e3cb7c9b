
import { MotionStats } from '@/lib/human/types';

// Get initial stats for a new session
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

// Update stats after a good rep
export const updateStatsForGoodRep = (stats: MotionStats): MotionStats => {
  const totalReps = stats.totalReps + 1;
  const goodReps = stats.goodReps + 1;
  const currentStreak = stats.currentStreak + 1;
  const bestStreak = Math.max(stats.bestStreak, currentStreak);
  const accuracy = Math.round((goodReps / totalReps) * 100);
  
  return {
    totalReps,
    goodReps,
    badReps: stats.badReps,
    accuracy,
    currentStreak,
    bestStreak,
    lastUpdated: Date.now()
  };
};

// Update stats after a bad rep
export const updateStatsForBadRep = (stats: MotionStats): MotionStats => {
  const totalReps = stats.totalReps + 1;
  const badReps = stats.badReps + 1;
  const currentStreak = 0; // Reset streak on bad rep
  const bestStreak = stats.bestStreak; // Unchanged
  const accuracy = Math.round((stats.goodReps / totalReps) * 100);
  
  return {
    totalReps,
    goodReps: stats.goodReps,
    badReps,
    accuracy,
    currentStreak,
    bestStreak,
    lastUpdated: Date.now()
  };
};

// Calculate estimated calories burned
export const calculateCaloriesBurned = (stats: MotionStats, exerciseType: string): number => {
  // Simple placeholder calculation - in a real app this would account for:
  // - Exercise type
  // - User's weight, height, age
  // - Exercise intensity
  // - Duration
  
  const caloriesPerRep = exerciseType === 'squat' ? 0.32 : 0.28;
  return Math.round(stats.totalReps * caloriesPerRep * 10) / 10;
};
