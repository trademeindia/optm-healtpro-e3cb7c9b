
import { useState, useCallback } from 'react';
import { MotionState } from '@/components/exercises/posture-monitor/types';
import { UseMotionStateReturn } from './types';

export const useMotionState = (): UseMotionStateReturn => {
  const [currentMotionState, setCurrentMotionState] = useState(MotionState.STANDING);
  const [prevMotionState, setPrevMotionState] = useState(MotionState.STANDING);

  const updateMotionState = useCallback((newMotionState: MotionState) => {
    setPrevMotionState(currentMotionState);
    setCurrentMotionState(newMotionState);
  }, [currentMotionState]);

  const resetMotionState = useCallback(() => {
    setCurrentMotionState(MotionState.STANDING);
    setPrevMotionState(MotionState.STANDING);
  }, []);

  return {
    currentMotionState,
    prevMotionState,
    updateMotionState,
    resetMotionState
  };
};
