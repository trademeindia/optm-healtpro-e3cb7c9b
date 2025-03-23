
import { useRef, useCallback } from 'react';
import { useDetectionStatusHandler } from './useDetectionStatusHandler';
import type { DetectionStatus } from './types';

export { type DetectionStatus } from './types';

export const useDetectionStatus = () => {
  const {
    detectionStatus,
    setDetectionStatus,
    updateDetectionStatus
  } = useDetectionStatusHandler();
  
  // Track frame times for FPS calculation
  const fpsTracker = useRef({
    frames: 0,
    lastFpsUpdate: 0,
    frameTimes: [] as number[]
  });
  
  // Update FPS calculation
  const updateFpsStats = useCallback((detectionTime: number, detectionStateRef: any) => {
    const now = performance.now();
    
    // Add current frame to tracker
    fpsTracker.current.frames++;
    fpsTracker.current.frameTimes.push(now);
    
    // Remove old frames outside of our 1-second window
    const oneSecondAgo = now - 1000;
    fpsTracker.current.frameTimes = fpsTracker.current.frameTimes.filter(time => time > oneSecondAgo);
    
    // Update FPS if it's been more than 500ms since last update
    if (now - fpsTracker.current.lastFpsUpdate > 500) {
      const fps = fpsTracker.current.frameTimes.length;
      
      // Only update FPS value if we have meaningful data
      if (fps > 0) {
        updateDetectionStatus({ fps });
      }
      
      fpsTracker.current.lastFpsUpdate = now;
    }
  }, [updateDetectionStatus]);
  
  return {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats,
    updateDetectionStatus
  };
};
