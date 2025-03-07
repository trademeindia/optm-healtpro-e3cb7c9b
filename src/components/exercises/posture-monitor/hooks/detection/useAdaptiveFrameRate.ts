
import { useCallback } from 'react';

export const useAdaptiveFrameRate = () => {
  // Calculate adaptive frame delay based on performance
  const calculateFrameDelay = useCallback((lastDetectionTime: number) => {
    return Math.max(0, 33 - (performance.now() - lastDetectionTime));
  }, []);

  return { calculateFrameDelay };
};
