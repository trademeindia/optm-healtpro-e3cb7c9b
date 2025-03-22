
import { useCallback } from 'react';

export const useAdaptiveFrameRate = () => {
  // Calculate frame delay based on device performance
  const calculateFrameDelay = useCallback((lastDetectionTime: number): number => {
    // Measure how long the last detection took
    const detectionTime = performance.now() - lastDetectionTime;
    
    // Base frame delay on detection time to optimize performance
    if (detectionTime < 20) {  // Super fast devices (~50 FPS)
      return 0;  // No delay needed
    } else if (detectionTime < 33) {  // Fast devices (~30 FPS)
      return 0;  // No delay needed
    } else if (detectionTime < 50) {  // Medium devices (~20 FPS)
      return 0;  // No delay, but naturally limited by detection time
    } else if (detectionTime < 100) {  // Slower devices (~10 FPS)
      return 0;  // No delay, detection is already slow enough
    } else {  // Very slow devices
      return 100;  // Add some delay to prevent device from overheating
    }
  }, []);
  
  return {
    calculateFrameDelay
  };
};
