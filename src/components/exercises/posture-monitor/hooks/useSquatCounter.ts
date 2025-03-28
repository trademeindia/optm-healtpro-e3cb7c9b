
import { useState, useCallback } from 'react';

const useSquatCounter = () => {
  const [squatCount, setSquatCount] = useState(0);
  const [goodSquats, setGoodSquats] = useState(0);
  const [badSquats, setBadSquats] = useState(0);
  
  const incrementSquatCount = useCallback((isGood: boolean = true) => {
    setSquatCount(prev => prev + 1);
    
    if (isGood) {
      setGoodSquats(prev => prev + 1);
    } else {
      setBadSquats(prev => prev + 1);
    }
  }, []);
  
  const resetCounter = useCallback(() => {
    setSquatCount(0);
    setGoodSquats(0);
    setBadSquats(0);
  }, []);
  
  return {
    squatCount,
    goodSquats,
    badSquats,
    incrementSquatCount,
    resetCounter
  };
};

export default useSquatCounter;
