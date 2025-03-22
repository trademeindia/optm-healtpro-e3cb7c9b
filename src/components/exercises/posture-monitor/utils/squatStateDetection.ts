
import { SquatState } from '../types';

export const determineSquatState = (kneeAngle: number): SquatState => {
  // Determine squat state based on knee angle
  // Standing: legs are fairly straight, knee angle close to 180 degrees
  // Mid Squat: knee angle between 100-140 degrees (descending or ascending)
  // Bottom Squat: deep squat position, knee angle less than 100 degrees
  
  if (kneeAngle < 100) {
    return SquatState.BOTTOM_SQUAT;
  } else if (kneeAngle < 140) {
    return SquatState.MID_SQUAT;
  } else {
    return SquatState.STANDING;
  }
};
