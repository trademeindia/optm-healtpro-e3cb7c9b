
import { useCallback } from 'react';
import { FeedbackType } from '../../types';
import { DetectionStateRef } from './types';

export const useDetectionFailureHandler = (
  setFeedback: (message: string, type: FeedbackType) => void,
  detectionStateRef: React.MutableRefObject<DetectionStateRef>
) => {
  // Handle detection failures
  const handleDetectionFailure = useCallback((error?: any) => {
    detectionStateRef.current.detectionFailureCount++;
    detectionStateRef.current.consecutiveFailures++;
    
    console.error("Detection failure:", error);
    
    // If too many consecutive failures, show feedback
    if (detectionStateRef.current.consecutiveFailures > 5) {
      setFeedback(
        "Having trouble detecting your pose. Please ensure you're fully visible in the camera.",
        FeedbackType.WARNING
      );
    }
  }, [detectionStateRef, setFeedback]);

  // Reset failure counter
  const resetFailureCounter = useCallback(() => {
    detectionStateRef.current.consecutiveFailures = 0;
  }, [detectionStateRef]);

  // Update last detection time
  const updateDetectionTime = useCallback(() => {
    detectionStateRef.current.lastDetectionTime = performance.now();
  }, [detectionStateRef]);

  return {
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  };
};
