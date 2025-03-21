
import React, { useState, createContext, useContext, useCallback } from 'react';
import { FeedbackType } from '../types';
import { useCamera } from '../camera';
import { usePoseDetection } from '../usePoseDetection';
import { usePermissionMonitor } from '../hooks/usePermissionMonitor';
import { useVideoStatusMonitor } from '../hooks/useVideoStatusMonitor';
import { useAutoStartCamera } from '../hooks/useAutoStartCamera';
import { useOpenSimAnalysis } from '../hooks/useOpenSimAnalysis';
import { logRoutingState } from '@/utils/debugUtils';
import type { CustomFeedback } from '../hooks/types';

interface PostureMonitorContextType {
  // Camera state
  cameraActive: boolean;
  permission: PermissionState | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraError: string | null;
  videoStatus: {
    isReady: boolean;
    hasStarted: boolean;
    error: string | null;
  };
  
  // Pose detection state
  model: any;
  isModelLoading: boolean;
  pose: any;
  analysis: {
    kneeAngle: number | null;
    hipAngle: number | null;
    currentSquatState: any;
  };
  stats: {
    accuracy: number;
    reps: number;
    incorrectReps: number;
  };
  feedback: CustomFeedback | null;
  detectionStatus: any;
  
  // OpenSim analysis state
  analysisResult: any;
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // UI state
  showTutorial: boolean;
  showBiomechanics: boolean;
  customFeedback: CustomFeedback | null;
  
  // Actions
  handleToggleCamera: () => Promise<void>;
  stopCamera: () => void;
  retryCamera: () => void;
  resetSession: () => void;
  setShowTutorial: (show: boolean) => void;
  toggleBiomechanics: () => void;
  setCustomFeedback: (feedback: CustomFeedback | null) => void;
  handleFinish: () => void;
}

const PostureMonitorContext = createContext<PostureMonitorContextType | undefined>(undefined);

export const usePostureMonitor = () => {
  const context = useContext(PostureMonitorContext);
  if (!context) {
    throw new Error('usePostureMonitor must be used within a PostureMonitorProvider');
  }
  return context;
};

interface PostureMonitorProviderProps {
  children: React.ReactNode;
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

export const PostureMonitorProvider: React.FC<PostureMonitorProviderProps> = ({
  children,
  exerciseId,
  exerciseName,
  onFinish
}) => {
  // Debug this component's mounting
  React.useEffect(() => {
    logRoutingState('PostureMonitor', { exerciseId, exerciseName });
  }, [exerciseId, exerciseName]);

  const [showTutorial, setShowTutorial] = useState(false);
  const [showBiomechanics, setShowBiomechanics] = useState(false);
  const [customFeedback, setCustomFeedback] = useState<CustomFeedback | null>(null);
  
  // Initialize camera with enhanced detection
  const { 
    cameraActive, 
    permission, 
    videoRef, 
    canvasRef, 
    streamRef, 
    toggleCamera, 
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus
  } = useCamera({
    onCameraStart: () => {
      // Set initial feedback when camera starts
      setCustomFeedback({
        message: "Starting pose analysis... Stand in a clear space where your full body is visible.",
        type: FeedbackType.INFO
      });
    }
  });
  
  // Initialize pose detection
  const {
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    config,
    detectionStatus
  } = usePoseDetection({
    cameraActive,
    videoRef,
    videoReady: videoStatus.isReady
  });
  
  // Initialize OpenSim analysis
  const {
    analysisResult,
    isAnalyzing,
    analysisError
  } = useOpenSimAnalysis({
    pose,
    currentSquatState: analysis.currentSquatState,
    setFeedback: (message, type) => {
      // Only set feedback when biomechanics view is active or when there's important analysis
      if (showBiomechanics || type === FeedbackType.WARNING) {
        setCustomFeedback({
          message,
          type
        });
      }
    },
    modelParams: {
      height: 175,
      weight: 70,
      age: 30,
      gender: 'male'
    }
  });
  
  // Hook for permission monitoring
  usePermissionMonitor({
    permission,
    setCustomFeedback
  });
  
  // Hook for video status monitoring
  useVideoStatusMonitor({
    cameraActive,
    videoStatus,
    setCustomFeedback
  });
  
  // Hook for auto-starting camera - fixed to prevent infinite update loop
  useAutoStartCamera({
    cameraActive,
    permission,
    toggleCamera,
    setCustomFeedback
  });
  
  // Handle finishing the exercise
  const handleFinish = () => {
    stopCamera();
    onFinish();
  };
  
  // Wrapper for toggleCamera to ensure it returns a Promise
  const handleToggleCamera = useCallback(async () => {
    await toggleCamera();
  }, [toggleCamera]);
  
  // Toggle biomechanical analysis view
  const toggleBiomechanics = useCallback(() => {
    setShowBiomechanics(prev => !prev);
  }, []);

  const value = {
    // Camera state
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    cameraError,
    videoStatus,
    
    // Pose detection state
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback,
    detectionStatus,
    
    // OpenSim analysis state
    analysisResult,
    isAnalyzing,
    analysisError,
    
    // UI state
    showTutorial,
    showBiomechanics,
    customFeedback: customFeedback || feedback,
    
    // Actions
    handleToggleCamera,
    stopCamera,
    retryCamera,
    resetSession,
    setShowTutorial,
    toggleBiomechanics,
    setCustomFeedback,
    handleFinish
  };

  return (
    <PostureMonitorContext.Provider value={value}>
      {children}
    </PostureMonitorContext.Provider>
  );
};
