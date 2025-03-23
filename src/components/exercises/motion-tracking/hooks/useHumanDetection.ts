
import { useCallback } from 'react';
import { toast } from 'sonner';
import { FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';
import { useDetectionService } from './useDetectionService';
import { useMotionAnalysis } from './useMotionAnalysis';
import { useSessionManagement } from './useSessionManagement';
import { UseHumanDetectionReturn } from './types';

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
    currentMotionState,
    feedback,
    processDetectionResult,
    resetAnalysis
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
  
  // Ensure model is loaded
  const ensureModelLoaded = useCallback(async () => {
    if (!detectionState.isModelLoaded) {
      toast.info("Loading motion tracking model...");
      const success = await loadModel();
      return success;
    }
    return true;
  }, [detectionState.isModelLoaded, loadModel]);
  
  // Create a new session if needed
  const setupSession = useCallback(async (exerciseType: string = 'general') => {
    if (!sessionId) {
      const newSessionId = await initSession(exerciseType);
      console.log(`Created new session: ${newSessionId}`);
      return !!newSessionId;
    }
    return true;
  }, [sessionId, initSession]);
  
  // Detection result handler
  const handleDetectionResult = useCallback((detectionResult: any) => {
    if (!detectionResult) return;
    
    processDetectionResult(detectionResult, isGoodForm => {
      if (isGoodForm) {
        handleGoodRep();
      } else {
        handleBadRep();
      }
      
      // Save data to database after completing a rep
      saveSessionData(
        detectionResult.result,
        detectionResult.angles,
        detectionResult.biomarkers,
        detectionResult.newMotionState || MotionState.STANDING
      );
    });
  }, [processDetectionResult, handleGoodRep, handleBadRep, saveSessionData]);
  
  // Start detection with improved setup
  const startDetection = useCallback(async () => {
    try {
      // Ensure model is loaded
      const modelReady = await ensureModelLoaded();
      if (!modelReady) {
        toast.error("Could not load motion tracking model. Please refresh and try again.");
        return;
      }
      
      // Ensure session is set up
      const sessionReady = await setupSession();
      if (!sessionReady) {
        toast.error("Could not initialize tracking session.");
        return;
      }
      
      // Start the detection service
      startDetectionService(handleDetectionResult);
      toast.success("Motion tracking started");
    } catch (error) {
      console.error("Failed to start detection:", error);
      toast.error("Failed to start motion tracking");
    }
  }, [ensureModelLoaded, setupSession, startDetectionService, handleDetectionResult]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    stopDetectionService();
    toast.info("Motion tracking paused");
  }, [stopDetectionService]);
  
  // Reset session
  const resetSession = useCallback(() => {
    resetSessionData();
    resetAnalysis();
    toast.info("Session has been reset");
  }, [resetSessionData, resetAnalysis]);
  
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
    currentMotionState,
    motionState: currentMotionState,
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
