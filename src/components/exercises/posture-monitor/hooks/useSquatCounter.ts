
import { useState, useCallback } from 'react';
import { SquatState } from '../types';

// Simple implementation to fix build errors
export const useSquatCounter = () => {
  const [squatCount, setSquatCount] = useState(0);
  
  const incrementSquatCount = useCallback(() => {
    setSquatCount(prev => prev + 1);
  }, []);
  
  return {
    squatCount,
    incrementSquatCount,
    resetSquatCount: () => setSquatCount(0)
  };
};

export default useSquatCounter;
