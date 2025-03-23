
import { MotionState } from '@/lib/human/types';

// Determine the current motion state based on joint angles
export const determineMotionState = (kneeAngle: number | null): MotionState => {
  if (kneeAngle === null) return MotionState.STANDING;
  
  if (kneeAngle < 100) {
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 150) {
    return MotionState.MID_MOTION;
  } else {
    return MotionState.STANDING;
  }
};

// Check if a repetition was completed
export const isRepCompleted = (
  currentState: MotionState,
  previousState: MotionState
): boolean => {
  // A rep is completed when transitioning from full motion (squat depth) to mid motion (coming up)
  // This is the key moment to capture for counting reps
  
  if (previousState === MotionState.FULL_MOTION && 
      (currentState === MotionState.MID_MOTION || currentState === MotionState.STANDING)) {
    return true;
  }
  
  return false;
};

// Generate a description of the current motion state
export const getMotionStateDescription = (state: MotionState): string => {
  switch (state) {
    case MotionState.STANDING:
      return 'Standing - Ready position';
    case MotionState.MID_MOTION:
      return 'Mid-motion - Partial squat depth';
    case MotionState.FULL_MOTION:
      return 'Full motion - Good squat depth';
    default:
      return 'Unknown state';
  }
};

// Check if the motion is deep enough to count as a quality rep
export const isDeepEnough = (kneeAngle: number | null): boolean => {
  // For most exercises like squats, a knee angle less than 100 degrees
  // is considered a good depth
  if (kneeAngle === null) return false;
  
  return kneeAngle < 100;
};

// Check if the motion has proper form based on angles
export const hasProperForm = (
  kneeAngle: number | null,
  hipAngle: number | null,
  shoulderAngle: number | null
): boolean => {
  // This is a simplified check
  // In a real application, this would include more sophisticated biomechanical analysis
  
  // If any required angle is missing, we can't evaluate form
  if (kneeAngle === null || hipAngle === null) return false;
  
  // Check if knee and hip angles are in proper ranges for squats
  const properKneeAngle = kneeAngle < 100; // Good squat depth
  const properHipAngle = hipAngle > 70 && hipAngle < 130; // Proper hip hinge
  
  return properKneeAngle && properHipAngle;
};
