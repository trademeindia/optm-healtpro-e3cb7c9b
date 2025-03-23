
import { MotionState, BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Checks if a rep was completed based on state transitions
 */
export const isRepCompleted = (
  currentState: MotionState, 
  prevState: MotionState,
  beforePrevState: MotionState
): boolean => {
  return (
    currentState === MotionState.MID_MOTION && 
    prevState === MotionState.FULL_MOTION &&
    beforePrevState === MotionState.FULL_MOTION
  );
};

/**
 * Evaluates if the rep was performed with good form
 */
export const evaluateRepQuality = (angles: BodyAngles) => {
  // Simple evaluation logic
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  const isGoodForm = kneeAngle < 120 && hipAngle < 140;
  
  return isGoodForm;
};
