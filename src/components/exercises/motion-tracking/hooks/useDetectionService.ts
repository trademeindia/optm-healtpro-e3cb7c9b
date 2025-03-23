
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { DetectionResult, DetectionState } from './types';
import { useModelLoader } from './useModelLoader';
import { useDetectionLoop } from './useDetectionLoop';

/**
 * Main detection service that coordinates model loading and detection
 */
export const useDetectionService = (videoRef: React.RefObject<HTMLVideoElement>) => {
  // Use the model loader hook
  const { modelState, loadModel } = useModelLoader();
  
  // Use the detection loop hook
  const { 
    detectionState, 
    startDetection: startDetectionLoop, 
    stopDetection: stopDetectionLoop,
    requestRef 
  } = useDetectionLoop(videoRef);
  
  // Combine states for external consumers
  const combinedState: DetectionState = {
    isDetecting: detectionState.isDetecting,
    detectionFps: detectionState.detectionFps,
    isModelLoaded: modelState.isModelLoaded,
    isModelLoading: modelState.isModelLoading,
    detectionError: detectionState.detectionError || modelState.modelError,
    loadProgress: modelState.loadProgress
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [requestRef]);

  // Start detection - ensures model is loaded first
  const startDetection = useCallback((
    onDetectionResult: (result: DetectionResult) => void
  ) => {
    if (!combinedState.isDetecting && combinedState.isModelLoaded) {
      startDetectionLoop(onDetectionResult, combinedState.isModelLoaded);
    } else if (!combinedState.isModelLoaded) {
      // Try to load the model and then start detection
      loadModel().then(success => {
        if (success) {
          startDetectionLoop(onDetectionResult, true);
        }
      });
    }
  }, [
    combinedState.isDetecting, 
    combinedState.isModelLoaded, 
    loadModel, 
    startDetectionLoop
  ]);

  // Stop detection
  const stopDetection = useCallback(() => {
    stopDetectionLoop();
  }, [stopDetectionLoop]);
  
  return {
    detectionState: combinedState,
    loadModel,
    startDetection,
    stopDetection,
    requestRef
  };
};
