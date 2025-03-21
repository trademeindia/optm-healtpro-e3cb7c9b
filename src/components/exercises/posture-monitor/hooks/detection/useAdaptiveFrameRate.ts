
import { useCallback } from 'react';

export const useAdaptiveFrameRate = () => {
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
  
  return { calculateFrameDelay };
};
