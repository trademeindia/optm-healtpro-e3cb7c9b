
import { MotionStats } from '../../posture-monitor/types';

/**
 * Returns initial stats object
 */
export const getInitialStats = (): MotionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  accuracy: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastUpdated: Date.now()
});

/**
 * Updates stats when a good rep is completed
 */
export const updateStatsForGoodRep = (prev: MotionStats): MotionStats => {
  const totalReps = prev.totalReps + 1;
  const goodReps = prev.goodReps + 1;
  const currentStreak = prev.currentStreak + 1;
  const bestStreak = Math.max(currentStreak, prev.bestStreak);
  
  return {
    totalReps,
    goodReps,
    badReps: prev.badReps,
    accuracy: Math.round((goodReps / totalReps) * 100),
    currentStreak,
    bestStreak,
    lastUpdated: Date.now()
  };
};

/**
 * Updates stats when a bad rep is completed
 */
export const updateStatsForBadRep = (prev: MotionStats): MotionStats => {
  const totalReps = prev.totalReps + 1;
  const badReps = prev.badReps + 1;
  
  return {
    totalReps,
    goodReps: prev.goodReps,
    badReps,
    accuracy: Math.round((prev.goodReps / totalReps) * 100),
    currentStreak: 0, // Reset streak on bad rep
    bestStreak: prev.bestStreak,
    lastUpdated: Date.now()
  };
};

/**
 * Calculates performance score based on stats
 * Returns a value between 0-100
 */
export const calculatePerformanceScore = (stats: MotionStats): number => {
  if (stats.totalReps === 0) return 0;
  
  // Base score is the accuracy percentage
  let score = stats.accuracy;
  
  // Bonus for consecutive good reps (max 10 points)
  const streakBonus = Math.min(stats.currentStreak * 2, 10);
  
  // Bonus for volume (max 10 points)
  const volumeBonus = Math.min(stats.totalReps / 2, 10);
  
  // Calculate final score, capped at 100
  return Math.min(score + streakBonus + volumeBonus, 100);
};

/**
 * Returns a difficulty rating based on the stats
 */
export const getDifficultyRating = (stats: MotionStats): string => {
  const score = calculatePerformanceScore(stats);
  
  if (score < 20) return "Getting Started";
  if (score < 40) return "Beginner";
  if (score < 60) return "Intermediate";
  if (score < 80) return "Advanced";
  return "Expert";
};

/**
 * Provides feedback based on stats
 */
export const getStatFeedback = (stats: MotionStats): string => {
  if (stats.totalReps === 0) {
    return "Complete your first rep to see performance stats";
  }
  
  if (stats.accuracy < 50) {
    return "Focus on proper form over speed or depth";
  } else if (stats.accuracy < 80) {
    return "Good progress! Keep practicing for better technique";
  } else {
    return "Excellent form! Try to maintain this quality";
  }
};
