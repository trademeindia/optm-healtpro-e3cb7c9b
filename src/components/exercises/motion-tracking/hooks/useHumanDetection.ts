
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { MotionState, FeedbackType } from '@/lib/human/types';
import { useDetectionState } from './useDetectionState';
import { useMotionAnalysis } from './useMotionAnalysis';
import { useSessionStats } from './useSessionStats';
import { performDetection } from '../utils/detectionUtils';
import { generateFeedback, FeedbackType as UtilsFeedbackType } from '../utils/feedbackUtils';
import { createSession, saveDetectionData, completeSession } from '../utils/sessionUtils';
import { isRepCompleted } from '../utils/motionStateUtils';

// Map feedback types from utils to human types
const mapFeedbackType = (type: UtilsFeedbackType): FeedbackType => {
  switch (type) {
    case UtilsFeedbackType.SUCCESS:
      return FeedbackType.SUCCESS;
    case UtilsFeedbackType.WARNING:
      return FeedbackType.WARNING;
    case UtilsFeedbackType.ERROR:
      return FeedbackType.ERROR;
    case UtilsFeedbackType.INFO:
    default:
      return FeedbackType.INFO;
  }
};

// We're explicitly re-exporting these types with their original names
export { MotionState, FeedbackType } from '@/lib/human/types';

// Evaluate rep quality based on angles and form
export const evaluateRepQuality = (angles: any) => {
  // Simple evaluation logic based on knee angle
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  const isGoodForm = kneeAngle < 120 && hipAngle < 140;
  
  return {
    isGoodForm,
    feedback: isGoodForm 
      ? "Great form on that rep!" 
      : "Try to keep your back straight and go deeper",
    feedbackType: isGoodForm ? UtilsFeedbackType.SUCCESS : UtilsFeedbackType.WARNING
  };
};

export const useHumanDetection = (
  videoRef: React.RefObject<HTMLVideoElement>, 
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  // Import required hooks
  const detection = useDetectionState();
  const motion = useMotionAnalysis();
  const session = useSessionStats();
  
  // Create a new session if needed
  useEffect(() => {
    const initSession = async () => {
      if (!session.sessionId && detection.state.isModelLoaded) {
        const newSessionId = await createSession(session.exerciseType.current);
        
        if (newSessionId) {
          session.setSessionId(newSessionId);
        }
      }
    };
    
    initSession();
  }, [detection.state.isModelLoaded, session.sessionId]);
  
  // Ensure model is loaded
  useEffect(() => {
    const loadModel = async () => {
      await detection.loadModel();
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (detection.refs.requestRef.current) {
        cancelAnimationFrame(detection.refs.requestRef.current);
      }
    };
  }, []);
  
  // Human.js detection loop
  const detectFrame = useCallback(async (time: number) => {
    if (!videoRef.current || !detection.state.isModelLoaded) {
      detection.refs.requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    // Calculate FPS
    const elapsed = time - detection.refs.lastFrameTime.current;
    
    // Limit detection rate for performance (aim for ~20-30 FPS)
    if (elapsed < 33) { // ~30 FPS
      detection.refs.requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    detection.refs.lastFrameTime.current = time;
    detection.refs.frameCount.current++;
    
    // Update FPS counter every second
    if (time - detection.refs.lastFpsUpdateTime.current >= 1000) {
      detection.setters.setDetectionFps(detection.refs.frameCount.current);
      detection.refs.frameCount.current = 0;
      detection.refs.lastFpsUpdateTime.current = time;
    }
    
    try {
      detection.setters.setIsDetecting(true);
      
      // Perform detection
      const {
        result: detectionResult,
        angles: extractedAngles,
        biomarkers: extractedBiomarkers,
        newMotionState
      } = await performDetection(videoRef.current);
      
      // Update state with detection results
      motion.setResult(detectionResult);
      motion.setAngles(extractedAngles);
      motion.setBiomarkers(extractedBiomarkers);
      
      // Check if a rep was completed (full motion to standing transition)
      if (isRepCompleted(newMotionState, motion.currentMotionState)) {
        // Evaluate rep quality
        const evaluation = evaluateRepQuality(extractedAngles);
        
        if (evaluation) {
          // Convert from utility feedback type to human feedback type
          const mappedFeedbackType = mapFeedbackType(evaluation.feedbackType);
          
          motion.setFeedback({
            message: evaluation.feedback,
            type: mappedFeedbackType
          });
          
          if (evaluation.isGoodForm) {
            session.handleGoodRep();
          } else {
            session.handleBadRep();
          }
          
          // Save data to database after completing a rep
          await saveDetectionData(
            session.sessionId, 
            detectionResult, 
            extractedAngles, 
            extractedBiomarkers, 
            newMotionState, 
            session.exerciseType.current, 
            session.stats
          );
        }
      } else {
        // Generate feedback data
        const feedbackData = generateFeedback(
          extractedBiomarkers.postureScore || 0,
          extractedBiomarkers.movementQuality || 0,
          extractedBiomarkers.rangeOfMotion || 0,
          extractedBiomarkers.stabilityScore || 0
        );
        
        // Map the feedback type and update motion feedback
        const mappedFeedbackType = mapFeedbackType(feedbackData.type);
        
        motion.setFeedback({
          message: feedbackData.message,
          type: mappedFeedbackType
        });
      }
      
      // Update motion state
      motion.setPrevMotionState(motion.currentMotionState);
      motion.setCurrentMotionState(newMotionState);
      
      detection.setters.setIsDetecting(false);
    } catch (error) {
      console.error('Error in detection:', error);
      detection.setters.setIsDetecting(false);
      detection.setters.setDetectionError('Detection failed');
    }
    
    // Continue detection loop
    detection.refs.requestRef.current = requestAnimationFrame(detectFrame);
  }, [
    videoRef, 
    detection.state.isModelLoaded, 
    motion.currentMotionState, 
    motion.prevMotionState,
    session.sessionId,
    session.stats
  ]);

  // Start detection
  const startDetection = useCallback(() => {
    if (!detection.state.isDetecting && detection.state.isModelLoaded) {
      detection.refs.requestRef.current = requestAnimationFrame(detectFrame);
      detection.setters.setIsDetecting(true);
      console.log('Starting detection loop');
    }
  }, [detectFrame, detection.state.isDetecting, detection.state.isModelLoaded]);

  // Stop detection
  const stopDetection = useCallback(() => {
    if (detection.refs.requestRef.current) {
      cancelAnimationFrame(detection.refs.requestRef.current);
      detection.setters.setIsDetecting(false);
      console.log('Stopping detection loop');
    }
  }, []);
  
  // Reset session
  const resetSession = useCallback(() => {
    session.resetStats();
    
    motion.setFeedback({
      message: "Session reset. Ready for new exercises.",
      type: HumanFeedbackType.INFO
    });
    
    toast.info("Session Reset", {
      description: "Your workout session has been reset. Ready to start new exercises!",
      duration: 3000
    });
  }, []);
  
  // Prepare detection status for external components
  const detectionStatus = {
    isDetecting: detection.state.isDetecting,
    fps: detection.state.detectionFps || 0,
    confidence: motion.result?.body?.[0]?.score || 0,
    detectedKeypoints: motion.result?.body?.[0]?.keypoints?.length || 0
  };
  
  // Prepare detection stats object
  const detectionStats = {
    fps: detection.state.detectionFps || 0,
    detections: motion.result?.body?.length || 0,
    accuracy: (motion.result?.body?.[0]?.score || 0) * 100
  };
  
  return {
    // Detection state
    isDetecting: detection.state.isDetecting,
    detectionFps: detection.state.detectionFps,
    isModelLoaded: detection.state.isModelLoaded,
    detectionError: detection.state.detectionError,
    
    // Motion analysis
    result: motion.result,
    detectionResult: motion.result,
    angles: motion.angles,
    biomarkers: motion.biomarkers,
    currentMotionState: motion.currentMotionState,
    motionState: motion.currentMotionState,
    feedback: motion.feedback,
    
    // Session data
    stats: session.stats,
    sessionId: session.sessionId,
    
    // Compatibility properties
    detectionStatus,
    detectionStats,
    resetDetection: resetSession,
    
    // Actions
    startDetection,
    stopDetection,
    resetSession
  };
};
