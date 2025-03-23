
import { useCallback, useRef } from 'react';

export const useFpsCalculator = (onFpsUpdate: (fps: number) => void) => {
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  
  const calculateFps = useCallback((time: number) => {
    // Update FPS every second
    if (time - lastFpsUpdateRef.current >= 1000) {
      const fps = Math.round(frameCountRef.current * 1000 / (time - lastFpsUpdateRef.current));
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = time;
      
      onFpsUpdate(fps);
    } else {
      frameCountRef.current++;
    }
  }, [onFpsUpdate]);
  
  const resetFpsCounter = useCallback(() => {
    frameCountRef.current = 0;
    lastFpsUpdateRef.current = 0;
  }, []);
  
  return {
    calculateFps,
    resetFpsCounter
  };
};
