
import { SquatState } from '../types';

// Determine squat state based on knee angle
export const determineSquatState = (kneeAngle: number): SquatState => {
  if (kneeAngle > 160) {
    // Standing position (legs almost straight)
    return SquatState.STANDING;
  } else if (kneeAngle < 100) {
    // Bottom squat position (knees bent significantly)
    return SquatState.BOTTOM_SQUAT;
  } else {
    // Mid-squat position
    return SquatState.MID_SQUAT;
  }
};
