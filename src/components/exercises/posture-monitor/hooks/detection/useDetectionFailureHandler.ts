
import { useRef, useCallback } from 'react';
import { DetectionState } from './types';
import { FeedbackType } from '../../types';

export const useDetectionFailureHandler = (
  setFeedback: (message: string, type: FeedbackType) => void
) => {
  // State for tracking detection success/failure
  const detectionStateRef = useRef<DetectionState>({
    framesProcessed: 0,
    lastDetectionTime: 0,
    detectionTimes: [],
    failureCount: 0
  });
  
  // Handle detection failures
  const handleDetectionFailure = useCallback((error: any) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Pose detection error:', errorMessage);
    
    // Increment failure counter
    detectionStateRef.current.failureCount += 1;
    
    // If we have too many consecutive failures, show a message to the user
    if (detectionStateRef.current.failureCount > 5) {
      setFeedback(
        'Having trouble detecting your pose. Please ensure you are visible in the camera.',
        FeedbackType.WARNING
      );
    }
    
    // If we have a critical number of failures, show more detailed error
    if (detectionStateRef.current.failureCount > 20) {
      setFeedback(
        `Detection error: ${errorMessage}. Try restarting the camera.`,
        FeedbackType.ERROR
      );
    }
  }, [setFeedback]);
  
  // Reset failure counter on successful detection
  const resetFailureCounter = useCallback(() => {
    if (detectionStateRef.current.failureCount > 0) {
      detectionStateRef.current.failureCount = 0;
    }
  }, []);
  
  // Update detection time on successful detection
  const updateDetectionTime = useCallback(() => {
    detectionStateRef.current.lastDetectionTime = performance.now();
    detectionStateRef.current.framesProcessed += 1;
  }, []);
  
  return {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  };
};
