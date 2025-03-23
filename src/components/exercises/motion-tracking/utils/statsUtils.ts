
import { MotionStats } from '../hooks/types';

// Get initial stats object
export const getInitialStats = (): MotionStats => {
  return {
    totalReps: 0,
    goodReps: 0,
    badReps: 0,
    accuracy: 0,
    timeStarted: Date.now()
  };
};

// Update stats after completing a good rep
export const updateStatsForGoodRep = (prevStats: MotionStats): MotionStats => {
  const totalReps = prevStats.totalReps + 1;
  const goodReps = prevStats.goodReps + 1;
  
  return {
    ...prevStats,
    totalReps,
    goodReps,
    accuracy: (goodReps / totalReps) * 100,
    lastRepTime: Date.now()
  };
};

// Update stats after completing a bad rep
export const updateStatsForBadRep = (prevStats: MotionStats): MotionStats => {
  const totalReps = prevStats.totalReps + 1;
  const badReps = prevStats.badReps + 1;
  const goodReps = prevStats.goodReps;
  
  return {
    ...prevStats,
    totalReps,
    badReps,
    accuracy: (goodReps / totalReps) * 100,
    lastRepTime: Date.now()
  };
};

// Calculate calories burned (very approximate)
export const calculateCaloriesBurned = (
  stats: MotionStats,
  exerciseType: string,
  userWeight: number = 70 // Default to 70kg if not provided
): number => {
  // MET values (Metabolic Equivalent of Task) for different exercises
  const metValues: Record<string, number> = {
    squat: 5.0,
    pushup: 3.8,
    plank: 3.5,
    lunge: 4.0,
    default: 4.0
  };
  
  const met = metValues[exerciseType] || metValues.default;
  
  // Duration in hours
  const duration = stats.timeStarted 
    ? (Date.now() - stats.timeStarted) / (1000 * 60 * 60)
    : 0;
  
  // Calories = MET × weight (kg) × duration (hours)
  const calories = met * userWeight * duration;
  
  return Math.round(calories);
};
