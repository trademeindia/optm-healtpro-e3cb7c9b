
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { DetectionResult, DetectionState } from './types';
import { useModelLoader } from './useModelLoader';
import { useDetectionLoop } from './useDetectionLoop';
import { useDetectionError } from './useDetectionError';

export const useDetectionService = (videoRef: React.RefObject<HTMLVideoElement>) => {
  // Load the model
  const { modelState, loadModel, cleanupModelLoader } = useModelLoader();
  
  // Initialize detection loop
  const { 
    detectionLoopState, 
    startDetection: startDetectionLoop,
    stopDetection: stopDetectionLoop,
    requestRef
  } = useDetectionLoop(videoRef, modelState.isModelLoaded);
  
  // Error handling
  const { detectionError, handleDetectionError, clearDetectionError } = useDetectionError();

  // Combine all states into a single detection state
  const detectionState: DetectionState = {
    isDetecting: detectionLoopState.isDetecting,
    detectionFps: detectionLoopState.detectionFps,
    isModelLoaded: modelState.isModelLoaded,
    isModelLoading: modelState.isModelLoading,
    detectionError: detectionError || modelState.detectionError
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      cleanupModelLoader();
    };
  }, [cleanupModelLoader]);

  // Start detection with error handling
  const startDetection = useCallback((
    onDetectionResult: (result: DetectionResult) => void
  ) => {
    if (!detectionState.isDetecting && detectionState.isModelLoaded) {
      clearDetectionError();
      try {
        startDetectionLoop((result) => {
          try {
            onDetectionResult(result);
          } catch (error) {
            handleDetectionError(error);
            stopDetectionLoop();
          }
        });
        console.log('Starting detection with error handling');
      } catch (error) {
        handleDetectionError(error);
      }
    } else if (!detectionState.isModelLoaded) {
      // Try to load the model and then start detection
      loadModel().then(success => {
        if (success) {
          clearDetectionError();
          try {
            startDetectionLoop((result) => {
              try {
                onDetectionResult(result);
              } catch (error) {
                handleDetectionError(error);
                stopDetectionLoop();
              }
            });
            console.log('Starting detection after model load');
          } catch (error) {
            handleDetectionError(error);
          }
        }
      });
    }
  }, [
    detectionState.isDetecting, 
    detectionState.isModelLoaded, 
    loadModel, 
    startDetectionLoop, 
    stopDetectionLoop,
    handleDetectionError,
    clearDetectionError
  ]);

  // Stop detection
  const stopDetection = useCallback(() => {
    stopDetectionLoop();
  }, [stopDetectionLoop]);
  
  return {
    detectionState,
    loadModel,
    startDetection,
    stopDetection,
    requestRef
  };
};
