
import { BodyAngles, MotionState } from '@/components/exercises/posture-monitor/types';
import { evaluateRepQuality } from '../../utils/feedbackUtils';
import { isRepCompleted } from '../../utils/motionStateUtils';

export const detectRep = (
  angles: BodyAngles,
  currentState: MotionState,
  prevState: MotionState,
  beforePrevState: MotionState
) => {
  const repCompleted = isRepCompleted(currentState, prevState, beforePrevState);
  
  if (repCompleted) {
    const { isGoodForm } = evaluateRepQuality(angles);
    return {
      repCompleted: true,
      isGoodForm
    };
  }
  
  return {
    repCompleted: false,
    isGoodForm: false
  };
};
