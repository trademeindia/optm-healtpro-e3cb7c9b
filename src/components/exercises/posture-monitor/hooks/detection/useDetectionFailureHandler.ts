
import { useRef, useCallback } from 'react';
import { FeedbackType } from '../../types';
import { DetectionState } from './types';

export const useDetectionFailureHandler = (
  setFeedback: (message: string | null, type: FeedbackType) => void
) => {
  // Track detection failures and performance
  const detectionStateRef = useRef<DetectionState>({
    lastDetectionTime: 0,
    detectionFailures: 0,
    frameTimes: [],           // Array to track frame timestamps for FPS calculation
    cumulativeProcessingTime: 0, // Total time spent processing frames
    framesProcessed: 0        // Count of frames processed
  });
  
  // Handle detection failures with improved diagnostics
  const handleDetectionFailure = useCallback((error: any) => {
    console.error('Error estimating pose:', error);
    detectionStateRef.current.detectionFailures++;
    
    // Categorize errors for better feedback
    let errorMessage = "Error detecting your pose.";
    
    if (error instanceof Error) {
      // Check for common TensorFlow.js errors
      if (error.message.includes('memory')) {
        errorMessage = "Detection system ran out of memory. Try refreshing the page.";
      } else if (error.message.includes('input')) {
        errorMessage = "Invalid input to pose detection. Please ensure your camera is working properly.";
      } else if (error.message.includes('model')) {
        errorMessage = "AI model error. Please refresh the page to reload the model.";
      }
    }
    
    // Show error to user after several consecutive failures
    if (detectionStateRef.current.detectionFailures > 3) {
      setFeedback(
        errorMessage + " Please ensure good lighting and that your camera is working properly.",
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
