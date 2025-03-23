
import { BodyAngles, MotionState } from '@/lib/human/types';

/**
 * Determines the current motion state based on body angles
 */
export const determineMotionState = (angles: BodyAngles): MotionState => {
  const kneeAngle = angles.kneeAngle || 180;
  
  if (kneeAngle < 130) {
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 160) {
    return MotionState.MID_MOTION;
  } else {
    return MotionState.STANDING;
  }
};

/**
 * Determines if a repetition is completed based on state transitions
 */
export const isRepCompleted = (
  currentState: MotionState, 
  prevState: MotionState
): boolean => {
  return currentState === MotionState.MID_MOTION && 
         prevState === MotionState.FULL_MOTION;
};
