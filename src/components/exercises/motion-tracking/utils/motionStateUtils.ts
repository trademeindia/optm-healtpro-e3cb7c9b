
import { MotionState } from '@/lib/human/types';

// Determine the current motion state based on angles and previous state
export const determineMotionState = (
  kneeAngle: number | null, 
  prevState: MotionState
): MotionState => {
  if (kneeAngle === null) {
    return prevState; // Keep previous state if no data
  }
  
  // For squats: 
  // - Standing is around 170-180 degrees
  // - Bottom position is around 90 degrees or less
  // - Mid motion is in between
  if (kneeAngle > 160) {
    return MotionState.STANDING;
  } else if (kneeAngle < 100) {
    return MotionState.FULL_MOTION;
  } else {
    return MotionState.MID_MOTION;
  }
};

// Check if a rep was completed - when transitioning from FULL_MOTION to MID_MOTION
export const isRepCompleted = (
  currentState: MotionState, 
  previousState: MotionState
): boolean => {
  return (
    previousState === MotionState.FULL_MOTION && 
    currentState === MotionState.MID_MOTION
  );
};

// Check if the user is starting a new rep - from STANDING to MID_MOTION
export const isStartingRep = (
  currentState: MotionState, 
  previousState: MotionState
): boolean => {
  return (
    previousState === MotionState.STANDING && 
    currentState === MotionState.MID_MOTION
  );
};

// Check if the user has returned to starting position
export const isReturnedToStart = (
  currentState: MotionState, 
  previousState: MotionState
): boolean => {
  return (
    previousState !== MotionState.STANDING && 
    currentState === MotionState.STANDING
  );
};
