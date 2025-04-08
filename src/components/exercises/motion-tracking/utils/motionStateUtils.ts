
import { BodyAngles, MotionState } from '@/lib/human/types';

/**
 * Determines motion state based on body angles
 * @param angles Current body angles
 * @param previousState Previous motion state
 * @returns Current motion state
 */
export const determineMotionState = (
  angles: BodyAngles,
  previousState: MotionState
): MotionState => {
  const { kneeAngle } = angles;
  
  if (!kneeAngle) return MotionState.STANDING;
  
  // Standing phase (knees mostly straight)
  if (kneeAngle > 160) {
    return MotionState.STANDING;
  }
  
  // Full motion phase (deep bend in knees)
  if (kneeAngle < 100) {
    return MotionState.FULL_MOTION;
  }
  
  // Determine if descending or ascending based on previous state
  if (previousState === MotionState.STANDING || previousState === MotionState.DESCENDING) {
    return MotionState.DESCENDING;
  } else if (previousState === MotionState.FULL_MOTION || previousState === MotionState.ASCENDING) {
    return MotionState.ASCENDING;
  }
  
  return previousState;
};

/**
 * Checks if a repetition was completed
 * @param currentState Current motion state
 * @param previousState Previous motion state
 * @returns Boolean indicating if a rep was completed
 */
export const isRepCompleted = (
  currentState: MotionState,
  previousState: MotionState
): boolean => {
  // A rep is completed when moving from ascending back to standing
  return previousState === MotionState.ASCENDING && currentState === MotionState.STANDING;
};
