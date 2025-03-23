
import { MotionState, BodyAngles } from '../../posture-monitor/types';

export const determineMotionState = (angles: BodyAngles, prevState: MotionState): MotionState => {
  const kneeAngle = angles.kneeAngle || 180;
  
  if (kneeAngle < 130) {
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 160) {
    return MotionState.MID_MOTION;
  } else {
    return MotionState.STANDING;
  }
};

export const isRepCompleted = (
  currentState: MotionState, 
  prevState: MotionState, 
  beforePrevState: MotionState
): boolean => {
  // A rep is completed when going from FULL_MOTION to MID_MOTION to STANDING
  return (
    prevState === MotionState.FULL_MOTION && 
    currentState === MotionState.MID_MOTION &&
    beforePrevState === MotionState.FULL_MOTION
  );
};
