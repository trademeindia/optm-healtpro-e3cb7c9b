import { useState, useCallback } from 'react';
import { 
  UsePoseDetectionProps, 
  UsePoseDetectionResult
} from './poseDetectionTypes';
import { DEFAULT_POSE_CONFIG } from './utils/poseDetectionConfig';
import { usePoseModel } from './usePoseModel';
import { useSquatState } from './hooks/useSquatState';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { useFeedbackState } from './hooks/useFeedbackState';
import { usePoseDetectionLoop } from './hooks/detection';
import { usePoseAnalysis } from './hooks/usePoseAnalysis';
import { usePoseHandler } from './hooks/usePoseHandler';
import { useDetectionStatusHandler } from './hooks/useDetectionStatusHandler';
import { useSessionReset } from './hooks/useSessionReset';
import type { DetectionStatus } from './hooks/detection';

interface ExtendedUsePoseDetectionProps extends UsePoseDetectionProps {
  videoReady?: boolean;
}

export const usePoseDetection = ({ 
  cameraActive, 
  videoRef,
  videoReady = false
}: ExtendedUsePoseDetectionProps): UsePoseDetectionResult & { detectionStatus: DetectionStatus | null } => {
  // Configuration
  const [config] = useState(DEFAULT_POSE_CONFIG);
  
  // Load the pose model
  const { model, isModelLoading, error: modelError } = usePoseModel(config);
  
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
  
  // Pose detection handler
  const { pose, handlePoseDetected } = usePoseHandler({
    analyzePose
  });
  
  // Pose detection loop with status updates
  const { isDetectionRunning, detectionStatus: loopStatus } = usePoseDetectionLoop({
    model,
    cameraActive,
    videoRef,
    config,
    onPoseDetected: handlePoseDetected,
    setFeedback: setFeedbackMessage,
    videoReady
  });
  
  // Detection status management
  const { detectionStatus } = useDetectionStatusHandler(loopStatus);
  
  // Session reset functionality
  const { resetSession } = useSessionReset({
    resetMetrics,
    setCurrentSquatState,
    setPrevSquatState,
    setFeedbackMessage,
    feedbackType: feedback.type
  });

  return {
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    config,
    detectionStatus
  };
};
