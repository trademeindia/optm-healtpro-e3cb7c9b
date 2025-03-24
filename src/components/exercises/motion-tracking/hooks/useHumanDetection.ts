
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { 
  BodyAngles, 
  FeedbackMessage,
  FeedbackType, 
  MotionState
} from '@/lib/human/types';
import { performDetection } from '../utils/detectionUtils';
import { determineMotionState, isRepCompleted } from '../utils/motionStateUtils';
import { generateFeedback, FeedbackType as UtilsFeedbackType } from '../utils/feedbackUtils';
import { useSessionStats } from './useSessionStats';
import { createSession, saveDetectionData, completeSession } from '../utils/sessionUtils';

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

// Evaluate rep quality based on angles and form
export const evaluateRepQuality = (angles: BodyAngles) => {
  // Simple evaluation logic based on knee angle
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

export const useHumanDetection = (
  videoRef: React.RefObject<HTMLVideoElement>, 
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
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
  
  // Use session stats hook for tracking
  const {
    stats,
    sessionId,
    exerciseType,
    setSessionId,
    handleGoodRep,
    handleBadRep,
    resetStats
  } = useSessionStats();
  
  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);

  // Ensure model is loaded
  useEffect(() => {
    const loadModel = async () => {
      try {
        if (!isModelLoaded) {
          setDetectionError(null);
          console.log('Loading Human.js model...');
          
          // Configure human.js to use a lite model
          human.config = {
            ...human.config,
            modelBasePath: '/',
            body: {
              enabled: true,
              modelPath: 'blazepose-lite.json',
              minConfidence: 0.3,
              maxDetected: 1,
            },
            // Improve performance
            backend: 'webgl',
            warmup: 'none',
          };
          
          await human.load();
          console.log('Human.js model loaded successfully');
          setIsModelLoaded(true);
          toast.success("AI model loaded successfully");
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
        try {
          console.log('Creating new exercise session');
          const newSessionId = await createSession(exerciseType.current);
          
          if (newSessionId) {
            setSessionId(newSessionId);
            console.log('New session created:', newSessionId);
          }
        } catch (error) {
          console.error('Error creating session:', error);
        }
      }
    };
    
    initSession();
  }, [isModelLoaded, sessionId, exerciseType, setSessionId]);
  
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
      if (isRepCompleted(newMotionState, currentMotionState)) {
        // Evaluate rep quality
        const evaluation = evaluateRepQuality(extractedAngles);
        
        if (evaluation) {
          setFeedback({
            message: evaluation.feedback,
            type: evaluation.feedbackType
          });
          
          if (evaluation.isGoodForm) {
            handleGoodRep();
            toast.success("Good rep!", { duration: 2000 });
          } else {
            handleBadRep();
            toast.warning("Form needs improvement", { duration: 2000 });
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
        // Generate feedback based on biomarkers
        const feedbackData = generateFeedback(
          extractedBiomarkers.postureScore || 0,
          extractedBiomarkers.movementQuality || 0,
          extractedBiomarkers.rangeOfMotion || 0,
          extractedBiomarkers.stabilityScore || 0
        );
        
        // Map the feedback type and update motion feedback
        const mappedFeedbackType = mapFeedbackType(feedbackData.type);
        
        setFeedback({
          message: feedbackData.message,
          type: mappedFeedbackType
        });
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
    sessionId,
    stats,
    exerciseType,
    handleGoodRep,
    handleBadRep
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
    resetStats();
    
    setFeedback({
      message: "Session reset. Ready for new exercises.",
      type: FeedbackType.INFO
    });
    
    toast.info("Session Reset", {
      description: "Your workout session has been reset. Ready to start new exercises!"
    });
  }, [resetStats]);
  
  return {
    // Detection state
    isDetecting,
    detectionFps,
    isModelLoaded,
    detectionError,
    
    // Motion analysis
    result,
    angles,
    biomarkers,
    currentMotionState,
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
