
import { useState } from 'react';
import { MotionState } from '@/components/exercises/posture-monitor/types';

export interface UseMotionStateReturn {
  currentMotionState: MotionState;
  prevMotionState: MotionState;
  updateMotionState: (newState: MotionState) => void;
  resetMotionState: () => void;
}

export function useMotionState(): UseMotionStateReturn {
  const [currentMotionState, setCurrentMotionState] = useState<MotionState>(MotionState.STANDING);
  const [prevMotionState, setPrevMotionState] = useState<MotionState>(MotionState.STANDING);

  const updateMotionState = (newState: MotionState) => {
    setPrevMotionState(currentMotionState);
    setCurrentMotionState(newState);
  };

  const resetMotionState = () => {
    setCurrentMotionState(MotionState.STANDING);
    setPrevMotionState(MotionState.STANDING);
  };

  return {
    currentMotionState,
    prevMotionState,
    updateMotionState,
    resetMotionState
  };
}
