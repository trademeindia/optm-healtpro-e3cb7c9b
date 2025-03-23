
import { useCallback, useState } from 'react';
import type { DetectionStatus } from './types';

export const useAdaptiveFrameRate = (status?: DetectionStatus, config?: any) => {
  const [frameInterval, setFrameInterval] = useState<number>(0);
  
  // Update frame rate based on detection performance
  const updateFrameRate = useCallback((confidence: number | null, config?: any) => {
    // If detection is performing well (high confidence), increase frame rate
    if (confidence && confidence > 0.7) {
      setFrameInterval(0); // No delay, run at full speed
    } else if (confidence && confidence > 0.5) {
      setFrameInterval(50); // Small delay for medium confidence
    } else {
      setFrameInterval(100); // Larger delay for low confidence or null
    }
  }, []);
  
  // Calculate delay based on performance
  const calculateFrameDelay = useCallback((lastDetectionTime: number) => {
    const detectionTime = performance.now() - lastDetectionTime;
    
    // If detection is slow (>100ms), reduce frame rate
    if (detectionTime > 100) {
      // Adaptive delay: longer delay for slower detections
      return Math.min(Math.max(detectionTime - 50, 0), 200);
    }
    
    // Fast detection, no delay needed
    return 0;
  }, []);
  
  return { 
    frameInterval, 
    updateFrameRate,
    calculateFrameDelay 
  };
};
