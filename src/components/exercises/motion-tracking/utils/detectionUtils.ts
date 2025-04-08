
import { FeedbackType, BodyAngles, DetectionResult } from '@/lib/human/types';
import { human } from '@/lib/human/core';

/**
 * Analyzes posture and provides feedback based on body angles
 */
export const getPostureFeedback = (angles: BodyAngles) => {
  const { kneeAngle, hipAngle, shoulderAngle } = angles;
  
  // No detection yet
  if (kneeAngle === null && hipAngle === null) {
    return {
      message: "Position yourself so your full body is visible",
      type: FeedbackType.INFO
    };
  }
  
  // Check knee angle for squat form
  if (kneeAngle !== null && kneeAngle < 90) {
    return {
      message: "Your knees are bent too much, don't go below 90 degrees",
      type: FeedbackType.WARNING
    };
  }
  
  // Check hip angle for proper form
  if (hipAngle !== null && hipAngle < 90) {
    return {
      message: "Keep your back straighter and don't bend forward too much",
      type: FeedbackType.WARNING
    };
  }
  
  // Good form
  if (kneeAngle !== null && kneeAngle >= 90 && kneeAngle <= 160) {
    return {
      message: "Good squat form, keep going!",
      type: FeedbackType.SUCCESS
    };
  }
  
  // Standing position
  if (kneeAngle !== null && kneeAngle > 160) {
    return {
      message: "Standing position detected, bend your knees to begin",
      type: FeedbackType.INFO
    };
  }
  
  return {
    message: "Keep your movements controlled and steady",
    type: FeedbackType.INFO
  };
};

/**
 * Performs body detection on video frames
 * @param videoElement - HTML video element to process
 * @returns Detection results or null if detection failed
 */
export const performDetection = async (videoElement: HTMLVideoElement): Promise<DetectionResult | null> => {
  if (!videoElement || videoElement.readyState < 2) {
    return null;
  }
  
  try {
    const result = await human.detect(videoElement);
    
    // Transform the result to match DetectionResult interface
    return {
      result: result,
      error: null
    };
  } catch (error) {
    console.error('Error during pose detection:', error);
    return {
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error during detection'
    };
  }
};

/**
 * Estimates calories burned during exercise
 * @param durationSeconds - Exercise duration in seconds
 * @param intensity - Exercise intensity factor (0.0 to 1.0)
 * @returns Estimated calories burned
 */
export const estimateCaloriesBurned = (
  durationSeconds: number,
  intensity: number = 0.5,
  bodyWeightKg: number = 70
): number => {
  // MET values for different exercise intensities
  // MET = Metabolic Equivalent of Task
  const MET_LIGHT = 3.0;  // Light exercise
  const MET_MODERATE = 5.0;  // Moderate exercise
  const MET_VIGOROUS = 8.0;  // Vigorous exercise
  
  // Calculate MET based on intensity
  const met = MET_LIGHT + (intensity * (MET_VIGOROUS - MET_LIGHT));
  
  // Calories burned = MET × weight (kg) × duration (hours)
  const durationHours = durationSeconds / 3600;
  const caloriesBurned = met * bodyWeightKg * durationHours;
  
  return caloriesBurned;
};

/**
 * Detects repetitions (reps) based on angle changes
 * @param currentAngle - Current joint angle
 * @param previousAngle - Previous joint angle
 * @param threshold - Angle change threshold to count as movement
 * @param inMotion - Current motion state
 * @returns Updated motion state and rep count
 */
export const detectRepetition = (
  currentAngle: number | null,
  previousAngle: number | null,
  threshold: number = 20,
  inMotion: boolean = false
): { inMotion: boolean; isNewRep: boolean } => {
  if (currentAngle === null || previousAngle === null) {
    return { inMotion, isNewRep: false };
  }
  
  const angleChange = Math.abs(currentAngle - previousAngle);
  
  // Starting motion
  if (!inMotion && angleChange > threshold) {
    return { inMotion: true, isNewRep: false };
  }
  
  // Completing motion
  if (inMotion && angleChange > threshold && currentAngle > 160) {
    return { inMotion: false, isNewRep: true };
  }
  
  // Continuing same state
  return { inMotion, isNewRep: false };
};
