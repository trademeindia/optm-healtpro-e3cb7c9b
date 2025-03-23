
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { 
  BodyAngles, 
  DetectionStatus, 
  FeedbackMessage,
  FeedbackType, 
  MotionState, 
  MotionStats 
} from '@/components/exercises/posture-monitor/types';
import { getInitialStats, updateStatsForGoodRep, updateStatsForBadRep } from './utils/statsUtils';

// Utility functions for detection and feedback
const performDetection = async (video: HTMLVideoElement) => {
  const detectionResult = await human.detect(video);
  
  // Extract angles and biomarkers (simplified for demo)
  const extractedAngles = {
    kneeAngle: 170,
    hipAngle: 160,
    shoulderAngle: 180,
    elbowAngle: 170,
    ankleAngle: 90,
    neckAngle: 160
  };
  
  const extractedBiomarkers = {
    balance: 0.85,
    stability: 0.9,
    symmetry: 0.8
  };
  
  // Determine motion state based on knee angle
  const kneeAngle = extractedAngles.kneeAngle;
  let newMotionState = MotionState.STANDING;
  
  if (kneeAngle < 130) {
    newMotionState = MotionState.FULL_MOTION;
  } else if (kneeAngle < 160) {
    newMotionState = MotionState.MID_MOTION;
  }
  
  return {
    result: detectionResult,
    angles: extractedAngles,
    biomarkers: extractedBiomarkers,
    newMotionState
  };
};

const generateFeedback = (motionState: MotionState, angles: BodyAngles): FeedbackMessage => {
  switch (motionState) {
    case MotionState.STANDING:
      return {
        message: "Ready for exercise. Maintain good posture.",
        type: FeedbackType.INFO
      };
    case MotionState.MID_MOTION:
      return {
        message: "Good form, continue the movement.",
        type: FeedbackType.INFO
      };
    case MotionState.FULL_MOTION:
      return {
        message: "Great depth! Now return to starting position.",
        type: FeedbackType.SUCCESS
      };
    default:
      return {
        message: null,
        type: FeedbackType.INFO
      };
  }
};

const evaluateRepQuality = (angles: BodyAngles) => {
  // Simple evaluation logic
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  const isGoodForm = kneeAngle < 120 && hipAngle < 140;
  
  return {
    isGoodForm,
    feedback: isGoodForm 
      ? "Great form on that rep!" 
      : "Try to keep your back straight and go deeper",
    feedbackType: isGoodForm ? FeedbackType.SUCCESS : FeedbackType.WARNING
  };
};

// Mock functions for session management
const createSession = async (exerciseType: string) => {
  console.log('Creating session for:', exerciseType);
  return `session-${Date.now()}`;
};

const saveDetectionData = async (
  sessionId: string | undefined,
  detectionResult: any,
  angles: BodyAngles,
  biomarkers: any,
  motionState: MotionState,
  exerciseType: string,
  stats: MotionStats
) => {
  console.log('Saving detection data for session:', sessionId);
  // In a real implementation, this would save to a database
  return true;
};

const completeSession = (
  sessionId: string | undefined,
  stats: MotionStats,
  biomarkers: any
) => {
  console.log('Completing session:', sessionId);
  console.log('Final stats:', stats);
  // In a real implementation, this would update the session status
};

export { MotionState, FeedbackType } from '@/components/exercises/posture-monitor/types';

export const useHumanDetection = (videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  // Detection state
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionFps, setDetectionFps] = useState<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  
  // Motion analysis state
  const [result, setResult] = useState<Human.Result | null>(null);
  const [angles, setAngles] = useState<BodyAngles>({
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  });
  const [biomarkers, setBiomarkers] = useState<Record<string, any>>({});
  const [currentMotionState, setCurrentMotionState] = useState(MotionState.STANDING);
  const [prevMotionState, setPrevMotionState] = useState(MotionState.STANDING);
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: null,
    type: FeedbackType.INFO
  });
  
  // Exercise stats
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  
  // Session tracking
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  
  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  const exerciseType = useRef<string>("squat");

  // Ensure model is loaded
  useEffect(() => {
    const loadModel = async () => {
      try {
        if (!isModelLoaded) {
          setDetectionError(null);
          await human.load();
          setIsModelLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Human.js model:', error);
        setDetectionError('Failed to load Human.js model');
        toast.error('Failed to load motion detection model. Please refresh and try again.');
      }
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isModelLoaded]);
  
  // Create a new session if needed
  useEffect(() => {
    const initSession = async () => {
      if (!sessionId && isModelLoaded) {
        const newSessionId = await createSession(exerciseType.current);
        
        if (newSessionId) {
          setSessionId(newSessionId);
        }
      }
    };
    
    initSession();
  }, [isModelLoaded, sessionId]);
  
  // Human.js detection loop
  const detectFrame = useCallback(async (time: number) => {
    if (!videoRef.current || !isModelLoaded) {
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    // Calculate FPS
    const elapsed = time - lastFrameTime.current;
    
    // Limit detection rate for performance (aim for ~20-30 FPS)
    if (elapsed < 33) { // ~30 FPS
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    lastFrameTime.current = time;
    frameCount.current++;
    
    // Update FPS counter every second
    if (time - lastFpsUpdateTime.current >= 1000) {
      setDetectionFps(frameCount.current);
      frameCount.current = 0;
      lastFpsUpdateTime.current = time;
    }
    
    try {
      setIsDetecting(true);
      
      // Perform detection
      const {
        result: detectionResult,
        angles: extractedAngles,
        biomarkers: extractedBiomarkers,
        newMotionState
      } = await performDetection(videoRef.current);
      
      // Update state with detection results
      setResult(detectionResult);
      setAngles(extractedAngles);
      setBiomarkers(extractedBiomarkers);
      
      // Check if a rep was completed (full motion to standing transition)
      if (currentMotionState === MotionState.FULL_MOTION && 
          newMotionState === MotionState.MID_MOTION &&
          prevMotionState === MotionState.FULL_MOTION) {
        
        // Evaluate rep quality
        const evaluation = evaluateRepQuality(extractedAngles);
        
        if (evaluation) {
          setFeedback({
            message: evaluation.feedback,
            type: evaluation.feedbackType
          });
          
          if (evaluation.isGoodForm) {
            setStats(prev => updateStatsForGoodRep(prev));
          } else {
            setStats(prev => updateStatsForBadRep(prev));
          }
          
          // Save data to database after completing a rep
          await saveDetectionData(
            sessionId, 
            detectionResult, 
            extractedAngles, 
            extractedBiomarkers, 
            newMotionState, 
            exerciseType.current, 
            stats
          );
        }
      } else {
        // Update feedback based on current state
        setFeedback(generateFeedback(newMotionState, extractedAngles));
      }
      
      // Update motion state
      setPrevMotionState(currentMotionState);
      setCurrentMotionState(newMotionState);
      
      setIsDetecting(false);
    } catch (error) {
      console.error('Error in detection:', error);
      setIsDetecting(false);
      setDetectionError('Detection failed');
    }
    
    // Continue detection loop
    requestRef.current = requestAnimationFrame(detectFrame);
  }, [
    videoRef, 
    isModelLoaded, 
    currentMotionState, 
    prevMotionState,
    sessionId,
    stats
  ]);

  // Start detection
  const startDetection = useCallback(() => {
    if (!isDetecting && isModelLoaded) {
      requestRef.current = requestAnimationFrame(detectFrame);
      setIsDetecting(true);
      console.log('Starting detection loop');
    }
  }, [detectFrame, isDetecting, isModelLoaded]);

  // Stop detection
  const stopDetection = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      setIsDetecting(false);
      console.log('Stopping detection loop');
    }
  }, []);
  
  // Reset session
  const resetSession = useCallback(() => {
    setStats(getInitialStats());
    
    setFeedback({
      message: "Session reset. Ready for new exercises.",
      type: FeedbackType.INFO
    });
    
    toast.info("Session Reset", {
      description: "Your workout session has been reset. Ready to start new exercises!",
      duration: 3000
    });
  }, []);
  
  return {
    // Detection state
    isDetecting,
    detectionFps,
    isModelLoaded,
    detectionError,
    
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
