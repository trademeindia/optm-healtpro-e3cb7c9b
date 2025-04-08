
import { MotionState, MotionStats } from '@/lib/human/types';

/**
 * Initialize a new exercise session
 */
export const initializeSessionStats = (): MotionStats => {
  return {
    reps: 0,
    goodReps: 0,
    badReps: 0,
    averageKneeAngle: null,
    averageHipAngle: null,
    currentMotionState: MotionState.STANDING,
    startTime: Date.now(),
    duration: 0,
    caloriesBurned: 0,
    symmetry: 0,
    stability: 0,
    rangeOfMotion: 0
  };
};

/**
 * Calculates session duration in seconds
 * @param startTime - Start timestamp
 * @returns Duration in seconds
 */
export const calculateSessionDuration = (startTime: number): number => {
  return (Date.now() - startTime) / 1000;
};

/**
 * Updates session statistics with new data
 * @param stats - Current session stats
 * @param params - Parameters to update
 * @returns Updated session stats
 */
export const updateSessionStats = (
  stats: MotionStats,
  params: Partial<MotionStats>
): MotionStats => {
  return {
    ...stats,
    ...params,
    duration: calculateSessionDuration(stats.startTime)
  };
};

/**
 * Creates a formatted summary of exercise session
 * @param stats - Session statistics
 * @returns Formatted summary text
 */
export const createSessionSummary = (stats: MotionStats): string => {
  const { reps, goodReps, duration, caloriesBurned } = stats;
  const formattedDuration = duration.toFixed(0);
  const formattedCalories = caloriesBurned.toFixed(1);
  
  return `Completed ${reps} repetitions (${goodReps} good) in ${formattedDuration} seconds, burning approximately ${formattedCalories} calories.`;
};
