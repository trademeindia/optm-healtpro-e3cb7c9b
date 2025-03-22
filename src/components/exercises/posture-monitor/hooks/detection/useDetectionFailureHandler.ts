import { useRef, useCallback } from 'react';
import { DetectionState } from './types';
import { FeedbackType } from '../../types';

export const useDetectionFailureHandler = (
  setFeedback: (message: string, type: FeedbackType) => void
) => {
  // State for tracking detection success/failure
  const detectionStateRef = useRef<DetectionState>({
    failureCounter: 0,
    lastFrameTime: 0,
    frameTimes: [],
    lastDetectionTime: 0
  });
  
  // Handle detection failures
  const handleDetectionFailure = useCallback((error: any) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Pose detection error:', errorMessage);
    
    // Increment failure counter
    detectionStateRef.current.failureCounter += 1;
    
    // If we have too many consecutive failures, show a message to the user
    if (detectionStateRef.current.failureCounter > 5) {
      setFeedback(
        'Having trouble detecting your pose. Please ensure you are visible in the camera.',
        FeedbackType.WARNING
      );
    }
    
    // If we have a critical number of failures, show more detailed error
    if (detectionStateRef.current.failureCounter > 20) {
      setFeedback(
        `Detection error: ${errorMessage}. Try restarting the camera.`,
        FeedbackType.ERROR
      );
    }
  }, [setFeedback]);
  
  // Reset failure counter on successful detection
  const resetFailureCounter = useCallback(() => {
    if (detectionStateRef.current.failureCounter > 0) {
      detectionStateRef.current.failureCounter = 0;
    }
  }, []);
  
  // Update detection time on successful detection
  const updateDetectionTime = useCallback(() => {
    detectionStateRef.current.lastDetectionTime = performance.now();
    // Add current frame time to the array
    detectionStateRef.current.frameTimes.push(performance.now());
    // Keep only the last 30 frames for performance
    if (detectionStateRef.current.frameTimes.length > 30) {
      detectionStateRef.current.frameTimes.shift();
    }
  }, []);
  
  return {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  };
};
