
import { useState } from 'react';
import { SquatState } from '../types';

export const useSquatState = () => {
  const [currentSquatState, setCurrentSquatState] = useState<SquatState>(SquatState.STANDING);
  const [prevSquatState, setPrevSquatState] = useState<SquatState>(SquatState.STANDING);
  
  return {
    currentSquatState,
    prevSquatState,
    setCurrentSquatState,
    setPrevSquatState
  };
};
