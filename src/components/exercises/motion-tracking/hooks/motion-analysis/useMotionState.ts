
import { useState, useCallback } from 'react';
import { MotionState } from '@/components/exercises/posture-monitor/types';
import { UseMotionStateReturn } from './types';

export const useMotionState = (): UseMotionStateReturn => {
  const [motionState, setMotionState] = useState<MotionState>(MotionState.STANDING);
  const [prevMotionState, setPrevMotionState] = useState<MotionState>(MotionState.STANDING);
  
  const updateMotionState = useCallback((newState: MotionState) => {
    setPrevMotionState(motionState);
    setMotionState(newState);
  }, [motionState]);
  
  const resetMotionState = useCallback(() => {
    setMotionState(MotionState.STANDING);
    setPrevMotionState(MotionState.STANDING);
  }, []);
  
  return {
    motionState,
    prevMotionState,
    updateMotionState,
    resetMotionState
  };
};
