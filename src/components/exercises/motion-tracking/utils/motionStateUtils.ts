
import { BodyAngles } from '@/components/exercises/posture-monitor/types';
import { MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Determines the motion state based on body angles
 */
export const determineMotionState = (
  angles: BodyAngles,
  currentState: MotionState
): MotionState => {
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  // If no body is detected, maintain current state
  if (angles.kneeAngle === null && angles.hipAngle === null) {
    return currentState;
  }
  
  // Logic for determining motion state based on angles
  if (kneeAngle < 110 && hipAngle < 120) {
    // Deep squat position
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 150 && hipAngle < 160) {
    // Partial squat position
    return MotionState.MID_MOTION;
  } else {
    // Standing position
    return MotionState.STANDING;
  }
};

/**
 * Check if a rep was completed
 * A rep is completed when going from FULL_MOTION back to STANDING
 */
export const isRepCompleted = (
  prevState: MotionState,
  currentState: MotionState
): boolean => {
  return prevState === MotionState.FULL_MOTION && currentState === MotionState.STANDING;
};

/**
 * Check if motion transition is valid
 * Helps filter out noise and random fluctuations
 */
export const isValidTransition = (
  prevState: MotionState,
  currentState: MotionState
): boolean => {
  // Any transition to the same state is valid
  if (prevState === currentState) {
    return true;
  }
  
  // Valid transitions
  const validTransitions: Record<MotionState, MotionState[]> = {
    [MotionState.STANDING]: [MotionState.MID_MOTION],
    [MotionState.MID_MOTION]: [MotionState.STANDING, MotionState.FULL_MOTION],
    [MotionState.FULL_MOTION]: [MotionState.MID_MOTION]
  };
  
  return validTransitions[prevState]?.includes(currentState) || false;
};
