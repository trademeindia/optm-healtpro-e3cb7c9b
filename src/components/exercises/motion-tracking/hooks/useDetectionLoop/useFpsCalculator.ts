
import { useCallback, useRef } from 'react';

export const useFpsCalculator = (
  onFpsUpdate: (fps: number) => void
) => {
  const framesRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  
  const calculateFps = useCallback((time: number) => {
    framesRef.current++;
    
    // Update FPS every 500ms
    if (time - lastFpsUpdateRef.current >= 500) {
      const fps = Math.round((framesRef.current * 1000) / (time - lastFpsUpdateRef.current));
      onFpsUpdate(fps);
      
      // Reset counters
      framesRef.current = 0;
      lastFpsUpdateRef.current = time;
    }
  }, [onFpsUpdate]);
  
  const resetFpsCounter = useCallback(() => {
    framesRef.current = 0;
    lastFpsUpdateRef.current = 0;
  }, []);
  
  return {
    calculateFps,
    resetFpsCounter
  };
};
