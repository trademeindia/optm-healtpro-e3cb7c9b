
import { useRef, useCallback } from 'react';
import { FeedbackType } from '../../types';

interface DetectionState {
  failedDetections: number;
  consecutiveFailures: number;
  lastDetectionTime: number;
}

export const useDetectionFailureHandler = (
  setFeedback: (message: string, type: FeedbackType) => void
) => {
  const detectionStateRef = useRef<DetectionState>({
    failedDetections: 0,
    consecutiveFailures: 0,
    lastDetectionTime: 0
  });
  
  const handleDetectionFailure = useCallback((error: any) => {
    detectionStateRef.current.failedDetections++;
    detectionStateRef.current.consecutiveFailures++;
    
    // Log error but don't overwhelm the console
    if (detectionStateRef.current.consecutiveFailures <= 3 || detectionStateRef.current.consecutiveFailures % 10 === 0) {
      console.error('Pose detection error:', error);
    }
    
    // Only show feedback for persistent failures
    if (detectionStateRef.current.consecutiveFailures === 5) {
      setFeedback(
        "Having trouble detecting your pose. Make sure your whole body is visible.",
        FeedbackType.WARNING
      );
    } else if (detectionStateRef.current.consecutiveFailures === 20) {
      setFeedback(
        "Detection issues persist. Try adjusting lighting or camera position.",
        FeedbackType.WARNING
      );
    }
  }, [setFeedback]);
  
  const resetFailureCounter = useCallback(() => {
    detectionStateRef.current.consecutiveFailures = 0;
  }, []);
  
  const updateDetectionTime = useCallback(() => {
    detectionStateRef.current.lastDetectionTime = performance.now();
  }, []);
  
  return {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  };
};
