
import { useState, useEffect, useRef, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
import { SquatState, FeedbackType } from './types';
import { DEFAULT_POSE_CONFIG } from './utils/index';
import { usePoseHandler } from './hooks/usePoseHandler';
import { useSquatState } from './hooks/useSquatState';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { usePoseAnalysis } from './hooks/usePoseAnalysis';
import { usePoseDetectionLoop } from './hooks/detection';

interface UsePoseDetectionProps {
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoReady: boolean;
}

export const usePoseDetection = ({ cameraActive, videoRef, videoReady }: UsePoseDetectionProps) => {
  // Model state
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  
  // Pose detection configuration
  const [config, setConfig] = useState(DEFAULT_POSE_CONFIG);
  
  // Squat state tracking
  const {
    currentSquatState,
    prevSquatState,
    setCurrentSquatState,
    setPrevSquatState
  } = useSquatState();
  
  // Performance metrics
  const {
    stats,
    updateMetricsForGoodRep,
    updateMetricsForBadRep,
    resetMetrics
  } = usePerformanceMetrics();
  
  // Feedback state
  const [feedback, setFeedback] = useState<{ message: string | null; type: FeedbackType }>({
    message: null,
    type: FeedbackType.INFO
  });
  
  // Set feedback handler
  const setFeedbackWithType = useCallback((message: string, type: FeedbackType) => {
    setFeedback({ message, type });
  }, []);
  
  // Pose analysis
  const { analysis, analyzePose } = usePoseAnalysis({
    currentSquatState,
    prevSquatState,
    setCurrentSquatState,
    setPrevSquatState,
    updateMetricsForGoodRep,
    updateMetricsForBadRep,
    setFeedback: setFeedbackWithType
  });
  
  // Pose handler
  const { pose, handlePoseDetected } = usePoseHandler({
    analyzePose
  });
  
  // Load PoseNet model
  useEffect(() => {
    const loadModel = async () => {
      if (model) return; // Model already loaded
      
      try {
        setIsModelLoading(true);
        setModelError(null);
        setFeedback({
          message: "Loading AI model...",
          type: FeedbackType.INFO
        });
        
        console.log('Loading PoseNet model...');
        
        // Load the model with configuration
        const loadedModel = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75 // Lower multiplier for better performance
        });
        
        setModel(loadedModel);
        setFeedback({
          message: "AI model loaded. Starting pose detection...",
          type: FeedbackType.SUCCESS
        });
        
        console.log('PoseNet model loaded successfully');
      } catch (error) {
        console.error('Error loading PoseNet model:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setModelError(`Failed to load AI model: ${errorMessage}`);
        setFeedback({
          message: `Could not load AI model: ${errorMessage}`,
          type: FeedbackType.WARNING
        });
      } finally {
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    // Clean up TF memory on unmount
    return () => {
      tf.disposeVariables();
    };
  }, []);
  
  // Use pose detection loop
  const { detectionStatus } = usePoseDetectionLoop({
    model,
    cameraActive,
    videoRef,
    config,
    onPoseDetected: handlePoseDetected,
    setFeedback: setFeedbackWithType,
    videoReady
  });
  
  // Reset session
  const resetSession = useCallback(() => {
    setPrevSquatState(SquatState.STANDING);
    setCurrentSquatState(SquatState.STANDING);
    resetMetrics();
    setFeedback({
      message: "Session reset. Ready for new exercises.",
      type: FeedbackType.INFO
    });
  }, [setPrevSquatState, setCurrentSquatState, resetMetrics]);
  
  return {
    model,
    isModelLoading,
    config,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    detectionStatus
  };
};
