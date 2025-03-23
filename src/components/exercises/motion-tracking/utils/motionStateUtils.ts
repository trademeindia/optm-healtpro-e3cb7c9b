
import { BodyAngles, MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Determines motion state based on joint angles
 */
export const determineMotionState = (
  angles: BodyAngles,
  previousState: MotionState
): MotionState => {
  const kneeAngle = angles.kneeAngle || 180;
  
  // Define thresholds for different states
  const standingThreshold = 160; // Nearly straight legs
  const midMotionThreshold = 120; // Mid-range bend
  const fullMotionThreshold = 90; // Deep bend
  
  // State transition logic with hysteresis to prevent oscillation
  switch (previousState) {
    case MotionState.STANDING:
      if (kneeAngle < midMotionThreshold) {
        return MotionState.MID_MOTION;
      }
      break;
      
    case MotionState.MID_MOTION:
      if (kneeAngle <= fullMotionThreshold) {
        return MotionState.FULL_MOTION;
      } else if (kneeAngle >= standingThreshold) {
        return MotionState.STANDING;
      }
      break;
      
    case MotionState.FULL_MOTION:
      if (kneeAngle > midMotionThreshold) {
        return MotionState.MID_MOTION;
      }
      break;
  }
  
  // If no transition conditions met, stay in current state
  return previousState;
};

/**
 * Detects if a rep has been completed
 */
export const isRepCompleted = (
  currentState: MotionState,
  previousState: MotionState
): boolean => {
  // A rep is completed when transitioning from FULL_MOTION to MID_MOTION
  return previousState === MotionState.FULL_MOTION && currentState === MotionState.MID_MOTION;
};

/**
 * Checks if user is in correct starting position
 */
export const isInStartingPosition = (angles: BodyAngles): boolean => {
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  // Knees and hips should be nearly straight
  return kneeAngle > 160 && hipAngle > 160;
};
