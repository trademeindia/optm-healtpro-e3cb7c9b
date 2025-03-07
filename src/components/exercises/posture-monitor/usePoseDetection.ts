
import { useState, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from './types';
import { 
  UsePoseDetectionProps, 
  UsePoseDetectionResult,
  PoseDetectionConfig 
} from './poseDetectionTypes';
import { DEFAULT_POSE_CONFIG } from './poseDetectionUtils';
import { usePoseModel } from './usePoseModel';
import { usePoseAnalysis } from './usePoseAnalysis';
import { usePoseDetectionLoop } from './usePoseDetectionLoop';

export const usePoseDetection = ({ 
  cameraActive, 
  videoRef 
}: UsePoseDetectionProps): UsePoseDetectionResult => {
  // Configuration
  const [config] = useState<PoseDetectionConfig>(DEFAULT_POSE_CONFIG);
  
  // Load the pose model
  const { model, isModelLoading, error: modelError } = usePoseModel(config);
  
  // Pose detection related states
  const [pose, setPose] = useState<posenet.Pose | null>(null);
  
  // Custom feedback for errors 
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);
  const [customFeedbackType, setCustomFeedbackType] = useState<FeedbackType>(FeedbackType.INFO);
  
  // Initialize pose analysis
  const { 
    analysis, 
    stats, 
    feedback: analysisResultFeedback, 
    updatePoseAnalysis,
    resetAnalysisSession 
  } = usePoseAnalysis({ pose });
  
  // Handle pose detection success
  const handlePoseDetected = (detectedPose: posenet.Pose) => {
    setPose(detectedPose);
    updatePoseAnalysis(detectedPose);
    
    // Clear any custom error feedback when we successfully detect a pose
    if (customFeedback) {
      setCustomFeedback(null);
    }
  };
  
  // Handle pose detection errors
  const handlePoseError = (errorMessage: string) => {
    // Only set error feedback if we previously had a valid pose
    // or if there's no existing custom feedback
    if (pose || !customFeedback) {
      setCustomFeedback(errorMessage);
      setCustomFeedbackType(FeedbackType.WARNING);
    }
  };
  
  // Initialize pose detection loop
  usePoseDetectionLoop({
    cameraActive, 
    videoRef,
    model,
    config,
    onPoseDetected: handlePoseDetected,
    onPoseError: handlePoseError
  });
  
  // Update feedback when model loading state changes
  useEffect(() => {
    if (isModelLoading) {
      setCustomFeedback("Loading pose detection model...");
      setCustomFeedbackType(FeedbackType.INFO);
    } else if (modelError) {
      setCustomFeedback(modelError);
      setCustomFeedbackType(FeedbackType.WARNING);
    }
  }, [isModelLoading, modelError]);
  
  // Reset pose data when camera is turned off
  useEffect(() => {
    if (!cameraActive) {
      setPose(null);
    }
  }, [cameraActive]);
  
  // Get the feedback to display (custom errors take precedence)
  const feedbackToDisplay = customFeedback || analysisResultFeedback.message;
  const feedbackTypeToDisplay = customFeedback ? customFeedbackType : analysisResultFeedback.type;
  
  return {
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback: {
      message: feedbackToDisplay,
      type: feedbackTypeToDisplay
    },
    resetSession: resetAnalysisSession,
    config
  };
};
