
import { useCallback } from 'react';
import { FeedbackType } from '../../types';
import { DetectionStateRef } from './types';

export const useDetectionFailureHandler = (
  setFeedback: (message: string, type: FeedbackType) => void,
  detectionStateRef: React.MutableRefObject<DetectionStateRef>
) => {
  // Handle detection failures
  const handleDetectionFailure = useCallback((error: any) => {
    detectionStateRef.current.detectionFailureCount++;
    detectionStateRef.current.consecutiveFailures++;
    
    console.warn(`Pose detection failure #${detectionStateRef.current.consecutiveFailures}:`, error);
    
    // After multiple consecutive failures, provide feedback to the user
    if (detectionStateRef.current.consecutiveFailures === 5) {
      setFeedback(
        "Having trouble detecting your pose. Please ensure you're fully visible in the camera.",
        FeedbackType.WARNING
      );
    } else if (detectionStateRef.current.consecutiveFailures === 10) {
      setFeedback(
        "Pose detection is challenging. Try standing further from the camera or improving lighting.",
        FeedbackType.WARNING
      );
    } else if (detectionStateRef.current.consecutiveFailures >= 20) {
      setFeedback(
        "Cannot detect your pose. Please check your camera or try in a different location.",
        FeedbackType.WARNING
      );
    }
  }, [setFeedback, detectionStateRef]);
  
  // Reset failure counter on successful detections
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
