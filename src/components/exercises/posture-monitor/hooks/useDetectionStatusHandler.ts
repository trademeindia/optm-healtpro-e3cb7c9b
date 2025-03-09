
import { useState, useEffect } from 'react';
import type { DetectionStatus } from './detection';

export const useDetectionStatusHandler = (loopStatus: DetectionStatus | null) => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus | null>(null);
  
  // Update detection status from loop
  useEffect(() => {
    if (loopStatus) {
      setDetectionStatus(loopStatus);
    }
  }, [loopStatus]);
  
  return { detectionStatus };
};
