
import { MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Determine motion state based on knee angle
 */
export const determineMotionState = (kneeAngle: number | null): MotionState => {
  if (!kneeAngle) return MotionState.STANDING;
  
  if (kneeAngle > 160) {
    return MotionState.STANDING;
  } else if (kneeAngle < 100) {
    return MotionState.FULL_MOTION;
  } else {
    return MotionState.MID_MOTION;
  }
};

