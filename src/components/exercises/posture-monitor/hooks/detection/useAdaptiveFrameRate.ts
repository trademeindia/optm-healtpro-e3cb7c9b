
import { useCallback } from 'react';

export const useAdaptiveFrameRate = () => {
  // Calculate adaptive frame delay based on performance
  const calculateFrameDelay = useCallback((lastDetectionTime: number) => {
    return Math.max(0, 33 - (performance.now() - lastDetectionTime));
  }, []);

  // Add initial delay to ensure video element is ready
  const getInitialDelay = useCallback(() => {
    return 500; // 500ms initial delay to ensure video is loaded
  }, []);

  return { calculateFrameDelay, getInitialDelay };
};
