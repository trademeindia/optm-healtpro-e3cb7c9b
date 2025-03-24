
import { MotionState } from '@/lib/human/types';

/**
 * Determine motion state based on body angles
 */
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

/**
 * Check if a rep has been completed based on motion state transition
 */
export const isRepCompleted = (
  currentState: MotionState,
  previousState: MotionState
): boolean => {
  // A rep is completed when transitioning from FULL_MOTION to STANDING
  // Or from FULL_MOTION to MID_MOTION (on the way back up)
  if (previousState === MotionState.FULL_MOTION && 
      (currentState === MotionState.STANDING || currentState === MotionState.MID_MOTION)) {
    return true;
  }
  
  return false;
};
