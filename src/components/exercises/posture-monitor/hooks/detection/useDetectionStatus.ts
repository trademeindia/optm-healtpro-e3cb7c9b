
import { useState, useRef, useCallback } from 'react';
import type { DetectionStatus } from './useDetectionStatusHandler';

export { type DetectionStatus } from './useDetectionStatusHandler';

export const useDetectionStatus = () => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });
  
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
        setDetectionStatus(prev => ({ ...prev, fps }));
      }
      
      fpsTracker.current.lastFpsUpdate = now;
    }
  }, []);
  
  return {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats
  };
};
