
import { useState, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { 
  UsePoseDetectionProps, 
  UsePoseDetectionResult
} from './poseDetectionTypes';
import { DEFAULT_POSE_CONFIG } from './poseDetectionUtils';
import { usePoseModel } from './usePoseModel';
import { useSquatState } from './hooks/useSquatState';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { useFeedbackState } from './hooks/useFeedbackState';
import { usePoseDetectionLoop } from './hooks/detection';
import { usePoseAnalysis } from './hooks/usePoseAnalysis';
import { SquatState } from './types';

export const usePoseDetection = ({ 
  cameraActive, 
  videoRef 
}: UsePoseDetectionProps): UsePoseDetectionResult => {
  // Configuration
  const [config] = useState(DEFAULT_POSE_CONFIG);
  
  // Load the pose model
  const { model, isModelLoading, error: modelError } = usePoseModel(config);
  
  // Pose detection related states
  const [pose, setPose] = useState<posenet.Pose | null>(null);
  
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
  const { feedback, setFeedback, setFeedbackType } = useFeedbackState(isModelLoading, modelError);
  
  // Combined feedback setter function
  const setFeedbackMessage = useCallback((message: string | null, type: typeof feedback.type) => {
    setFeedback(message);
    setFeedbackType(type);
  }, [setFeedback, setFeedbackType]);
  
  // Pose analysis
  const { analysis, analyzePose } = usePoseAnalysis({
    currentSquatState,
    prevSquatState,
    setCurrentSquatState,
    setPrevSquatState,
    updateMetricsForGoodRep,
    updateMetricsForBadRep,
    setFeedback: setFeedbackMessage
  });
  
  // Handle pose detection
  const handlePoseDetected = useCallback((detectedPose: posenet.Pose) => {
    setPose(detectedPose);
    analyzePose(detectedPose);
  }, [analyzePose]);
  
  // Pose detection loop
  usePoseDetectionLoop({
    model,
    cameraActive,
    videoRef,
    config,
    onPoseDetected: handlePoseDetected,
    setFeedback: setFeedbackMessage
  });
  
  // Reset session function to clear stats and state
  const resetSession = useCallback(() => {
    resetMetrics();
    setCurrentSquatState(SquatState.STANDING);
    setPrevSquatState(SquatState.STANDING);
    setFeedbackMessage("Session reset. Ready to start squatting!", feedback.type);
  }, [resetMetrics, setCurrentSquatState, setPrevSquatState, setFeedbackMessage, feedback.type]);

  return {
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    config
  };
};
