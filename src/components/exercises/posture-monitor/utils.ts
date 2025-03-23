import { SquatState } from './types';

export const determineSquatState = (
  kneeAngle: number | null, 
  prevSquatState: SquatState
): SquatState => {
  if (!kneeAngle) return SquatState.STANDING;

  if (kneeAngle > 160) {
    return SquatState.STANDING;
  } 
  else if (kneeAngle < 110) {
    return SquatState.BOTTOM;
  }
  else if (prevSquatState === SquatState.STANDING || prevSquatState === SquatState.ASCENDING) {
    return SquatState.DESCENDING;
  }
  else if (prevSquatState === SquatState.BOTTOM || prevSquatState === SquatState.DESCENDING) {
    return SquatState.ASCENDING;
  }
  
  return SquatState.STANDING;
};
