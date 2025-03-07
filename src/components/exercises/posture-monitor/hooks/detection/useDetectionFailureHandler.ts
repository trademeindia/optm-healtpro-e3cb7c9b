
import { useRef, useCallback } from 'react';
import { FeedbackType } from '../../types';
import { DetectionState } from './types';

export const useDetectionFailureHandler = (
  setFeedback: (message: string | null, type: FeedbackType) => void
) => {
  // Track detection failures
  const detectionStateRef = useRef<DetectionState>({
    lastDetectionTime: 0,
    detectionFailures: 0
  });
  
  // Handle detection failures
  const handleDetectionFailure = useCallback((error: any) => {
    console.error('Error estimating pose:', error);
    detectionStateRef.current.detectionFailures++;
    
    if (detectionStateRef.current.detectionFailures > 5) {
      setFeedback(
        "Error detecting your pose. Please ensure good lighting and that your camera is working properly.",
        FeedbackType.WARNING
      );
      
      // Reset failure counter to avoid repeated warnings
      detectionStateRef.current.detectionFailures = 0;
    }
  }, [setFeedback]);
  
  // Reset failure counter on successful detection
  const resetFailureCounter = useCallback(() => {
    detectionStateRef.current.detectionFailures = 0;
  }, []);
  
  // Update last detection time
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
