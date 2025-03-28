
import { MotionStats } from '@/lib/human/types';

/**
 * Calculate the accuracy percentage based on good and bad reps
 */
export const calculateAccuracy = (goodReps: number, totalReps: number): number => {
  if (totalReps === 0) return 0;
  return Math.round((goodReps / totalReps) * 100);
};

/**
 * Estimate calories burned based on exercise stats
 * This is a simple approximation for demonstration
 */
export const estimateCaloriesBurned = (
  reps: number,
  exerciseType: string = 'squat',
  userWeight: number = 70 // Default 70kg if not provided
): number => {
  // MET values (Metabolic Equivalent of Task)
  // These are rough estimates for different exercises
  const metValues: Record<string, number> = {
    squat: 5.0,
    pushup: 4.0,
    lunge: 4.5,
    jumping_jack: 8.0,
    default: 5.0
  };
  
  // Get the appropriate MET value, default if not found
  const met = metValues[exerciseType] || metValues.default;
  
  // Formula: calories = MET * weight in kg * time in hours
  // For reps, we estimate time based on typical rep duration
  const averageSecPerRep = 4; // Seconds
  const timeInHours = (reps * averageSecPerRep) / 3600;
  
  // Calculate and return calories
  return Math.round(met * userWeight * timeInHours * 10) / 10; // Round to 1 decimal place
};

/**
 * Update exercise stats based on new rep data
 */
export const updateExerciseStats = (
  currentStats: MotionStats,
  isGoodForm: boolean
): MotionStats => {
  const newStats = { ...currentStats };
  
  // Increment total reps
  newStats.totalReps += 1;
  
  // Update good/bad rep counts
  if (isGoodForm) {
    newStats.goodReps += 1;
    newStats.currentStreak += 1;
    
    // Update best streak if current is better
    if (newStats.currentStreak > newStats.bestStreak) {
      newStats.bestStreak = newStats.currentStreak;
    }
  } else {
    newStats.badReps += 1;
    newStats.currentStreak = 0;
  }
  
  // Calculate accuracy
  newStats.accuracy = calculateAccuracy(newStats.goodReps, newStats.totalReps);
  
  // Update calories burned
  newStats.caloriesBurned = estimateCaloriesBurned(newStats.totalReps);
  
  // Update timestamp
  newStats.lastUpdated = Date.now();
  
  return newStats;
};
