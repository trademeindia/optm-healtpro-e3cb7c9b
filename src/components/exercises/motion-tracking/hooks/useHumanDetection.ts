
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';
import { useDetectionService } from './useDetectionService';
import { useMotionAnalysis } from './motion-analysis/useMotionAnalysis';
import { useSessionManagement } from './useSessionManagement';
import { UseHumanDetectionReturn } from './types';
import { DetectionError } from '@/lib/human/types';

export const useHumanDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
): UseHumanDetectionReturn => {
  // Initialize all services
  const {
    detectionState,
    loadModel,
    startDetection: startDetectionService,
    stopDetection: stopDetectionService,
    requestRef
  } = useDetectionService(videoRef);
  
  const {
    result,
    angles,
    biomarkers,
    motionState,
    prevMotionState,
    feedback,
    processMotionData,
    resetMotionState
  } = useMotionAnalysis();
  
  const {
    stats,
    sessionId,
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    resetSession: resetSessionData
  } = useSessionManagement();
  
  // Load model on component mount
  useEffect(() => {
    loadModel();
    
    // Cleanup when component unmounts
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [loadModel, requestRef]);
  
  // Create a new session if needed
  useEffect(() => {
    if (detectionState.isModelLoaded) {
      initSession();
    }
  }, [detectionState.isModelLoaded, initSession]);
  
  // Detection result handler
  const handleDetectionResult = useCallback((detectionResult: any) => {
    const result = processMotionData(
      detectionResult.result,
      detectionResult.angles,
      detectionResult.biomarkers
    );
    
    if (result.repCompleted) {
      if (result.isGoodForm) {
        handleGoodRep();
      } else {
        handleBadRep();
      }
      
      // Save data to database after completing a rep
      saveSessionData(
        detectionResult.result,
        detectionResult.angles,
        detectionResult.biomarkers,
        detectionResult.newMotionState
      );
    }
  }, [processMotionData, handleGoodRep, handleBadRep, saveSessionData]);
  
  // Start detection
  const startDetection = useCallback(() => {
    startDetectionService(handleDetectionResult);
  }, [startDetectionService, handleDetectionResult]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    stopDetectionService();
  }, [stopDetectionService]);
  
  // Reset session
  const resetSession = useCallback(() => {
    resetSessionData();
    resetMotionState();
  }, [resetSessionData, resetMotionState]);
  
  return {
    // Detection state
    isDetecting: detectionState.isDetecting,
    detectionFps: detectionState.detectionFps,
    isModelLoaded: detectionState.isModelLoaded,
    detectionError: detectionState.detectionError,
    
    // Motion analysis
    result,
    detectionResult: result,
    angles,
    biomarkers,
    currentMotionState: motionState,
    motionState,
    feedback,
    
    // Session data
    stats,
    sessionId,
    
    // Actions
    startDetection,
    stopDetection,
    resetSession
  };
};
