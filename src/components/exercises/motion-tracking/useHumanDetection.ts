
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

// Import all utilities from the central export file
import {
  performDetection,
  generateFeedback,
  evaluateRepQuality,
  updateStatsForGoodRep,
  updateStatsForBadRep,
  getInitialStats,
  saveDetectionData,
  createSession,
  completeSession
} from './utils';

interface UseHumanDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  exerciseType: string;
  sessionId?: string;
  onSessionStart?: (sessionId: string) => void;
  videoReady: boolean;
}

export { MotionState, FeedbackType } from '@/components/exercises/posture-monitor/types';

export const useHumanDetection = ({
  videoRef,
  exerciseType,
  sessionId: providedSessionId,
  onSessionStart,
  videoReady
}: UseHumanDetectionProps) => {
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
  const [sessionId, setSessionId] = useState<string | undefined>(providedSessionId);
  
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
        const newSessionId = await createSession(exerciseType);
        
        if (newSessionId) {
          setSessionId(newSessionId);
          
          if (onSessionStart) {
            onSessionStart(newSessionId);
          }
        }
      }
    };
    
    initSession();
  }, [exerciseType, isModelLoaded, onSessionStart, sessionId]);
  
  // Human.js detection loop
  const detectFrame = useCallback(async (time: number) => {
    if (!videoRef.current || !isModelLoaded || !videoReady) {
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
          
          // Save data to Supabase after completing a rep
          await saveDetectionData(
            sessionId, 
            detectionResult, 
            extractedAngles, 
            extractedBiomarkers, 
            newMotionState, 
            exerciseType, 
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
    videoReady, 
    currentMotionState, 
    prevMotionState,
    exerciseType,
    sessionId,
    stats
  ]);
  
  // Start/stop detection loop
  useEffect(() => {
    if (isModelLoaded && videoReady) {
      requestRef.current = requestAnimationFrame(detectFrame);
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isModelLoaded, videoReady, detectFrame]);
  
  // Complete session when component unmounts
  useEffect(() => {
    return () => {
      completeSession(sessionId, stats, biomarkers);
    };
  }, [sessionId, stats, biomarkers]);
  
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
    angles,
    biomarkers,
    currentMotionState,
    feedback,
    
    // Session data
    stats,
    sessionId,
    
    // Actions
    resetSession
  };
};
