
import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Human from '@vladmandic/human';
import { human, extractBodyAngles, extractBiomarkers } from '@/lib/human';
import { toast } from 'sonner';

export enum MotionState {
  STANDING = 'standing',
  MID_MOTION = 'mid_motion',
  FULL_MOTION = 'full_motion'
}

export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
}

interface UseHumanDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  exerciseType: string;
  sessionId?: string;
  onSessionStart?: (sessionId: string) => void;
  videoReady: boolean;
}

// Function to determine motion state based on the knee angle
const determineMotionState = (kneeAngle: number | null): MotionState => {
  if (!kneeAngle) return MotionState.STANDING;
  
  if (kneeAngle > 160) {
    return MotionState.STANDING;
  } else if (kneeAngle < 100) {
    return MotionState.FULL_MOTION;
  } else {
    return MotionState.MID_MOTION;
  }
};

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
  const [angles, setAngles] = useState<{
    kneeAngle: number | null;
    hipAngle: number | null;
    shoulderAngle: number | null;
    elbowAngle: number | null;
    ankleAngle: number | null;
    neckAngle: number | null;
  }>({
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
  const [feedback, setFeedback] = useState<{message: string | null; type: FeedbackType}>({
    message: null,
    type: FeedbackType.INFO
  });
  
  // Exercise stats
  const [stats, setStats] = useState<MotionStats>({
    totalReps: 0,
    goodReps: 0,
    badReps: 0,
    accuracy: 75 // Start with a default accuracy
  });
  
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
    const createSession = async () => {
      if (!sessionId && isModelLoaded) {
        try {
          const { data, error } = await supabase
            .from('analysis_sessions')
            .insert({
              patient_id: (await supabase.auth.getUser()).data.user?.id,
              exercise_type: exerciseType,
              start_time: new Date().toISOString(),
              notes: 'Session created with Human.js detection'
            })
            .select('id')
            .single();
            
          if (error) throw error;
          
          setSessionId(data.id);
          
          if (onSessionStart) {
            onSessionStart(data.id);
          }
          
        } catch (error) {
          console.error('Error creating session:', error);
          toast.error('Failed to create tracking session');
        }
      }
    };
    
    createSession();
  }, [exerciseType, isModelLoaded, onSessionStart, sessionId]);
  
  // Generate feedback based on motion state and angles
  const generateFeedback = useCallback(() => {
    if (!angles.kneeAngle || !angles.hipAngle) {
      return {
        message: "Position yourself in the camera view",
        type: FeedbackType.INFO
      };
    }
    
    if (currentMotionState === MotionState.STANDING) {
      return {
        message: "Start your exercise by bending your knees",
        type: FeedbackType.INFO
      };
    } else if (currentMotionState === MotionState.MID_MOTION) {
      if (angles.hipAngle < 70) {
        return {
          message: "You're leaning too far forward",
          type: FeedbackType.WARNING
        };
      } else {
        return {
          message: "Good! Continue your movement",
          type: FeedbackType.SUCCESS
        };
      }
    } else if (currentMotionState === MotionState.FULL_MOTION) {
      return {
        message: "Great depth! Now return to starting position",
        type: FeedbackType.SUCCESS
      };
    }
    
    return {
      message: "Maintain good form during your exercise",
      type: FeedbackType.INFO
    };
  }, [angles, currentMotionState]);
  
  // Evaluate rep quality when a rep is completed
  const evaluateRepQuality = useCallback(() => {
    if (!angles.kneeAngle || !angles.hipAngle) return null;
    
    let isGoodForm = true;
    let feedback = '';
    
    // Check knee angle
    if (angles.kneeAngle < 70) {
      isGoodForm = false;
      feedback = "Movement is too deep. Try not to overextend.";
    } else if (angles.kneeAngle > 130) {
      isGoodForm = false;
      feedback = "You're not going deep enough. Try to lower more.";
    }
    
    // Check hip angle
    if (angles.hipAngle < 70) {
      isGoodForm = false;
      feedback = "You're leaning too far forward. Keep your back straighter.";
    }
    
    if (isGoodForm) {
      feedback = "Excellent form! Keep it up!";
    }
    
    return {
      isGoodForm,
      feedback,
      feedbackType: isGoodForm ? FeedbackType.SUCCESS : FeedbackType.WARNING
    };
  }, [angles]);
  
  // Update stats when a rep is completed
  const updateStatsForGoodRep = useCallback(() => {
    setStats(prev => ({
      totalReps: prev.totalReps + 1,
      goodReps: prev.goodReps + 1,
      badReps: prev.badReps,
      accuracy: Math.min(prev.accuracy + 2, 100)
    }));
    
    toast.success("Rep Completed", {
      description: "Great form! Keep going!",
      duration: 3000
    });
  }, []);
  
  const updateStatsForBadRep = useCallback(() => {
    setStats(prev => ({
      totalReps: prev.totalReps + 1,
      goodReps: prev.goodReps,
      badReps: prev.badReps + 1,
      accuracy: Math.max(prev.accuracy - 5, 50)
    }));
    
    toast.warning("Rep Needs Improvement", {
      description: "Watch your form. Check feedback for tips.",
      duration: 3000
    });
  }, []);
  
  // Save data to Supabase
  const saveDetectionData = useCallback(async () => {
    if (!sessionId || !result) return;
    
    try {
      await supabase.from('body_analysis').insert({
        patient_id: (await supabase.auth.getUser()).data.user?.id,
        session_id: sessionId,
        angles: angles,
        posture_score: biomarkers.postureScore || null,
        biomarkers: biomarkers,
        metadata: {
          exerciseType,
          motionState: currentMotionState,
          stats
        }
      });
    } catch (error) {
      console.error('Error saving detection data:', error);
    }
  }, [sessionId, result, angles, biomarkers, currentMotionState, exerciseType, stats]);
  
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
      const detectionResult = await human.detect(videoRef.current);
      
      // Update state with detection results
      setResult(detectionResult);
      
      // Extract angles and biomarkers
      if (detectionResult.body && detectionResult.body.length > 0) {
        const extractedAngles = extractBodyAngles(detectionResult);
        setAngles(extractedAngles);
        
        const extractedBiomarkers = extractBiomarkers(detectionResult, extractedAngles);
        setBiomarkers(extractedBiomarkers);
        
        // Determine motion state
        const newMotionState = determineMotionState(extractedAngles.kneeAngle);
        
        // Check if a rep was completed (full motion to standing transition)
        if (currentMotionState === MotionState.FULL_MOTION && 
            newMotionState === MotionState.MID_MOTION &&
            prevMotionState === MotionState.FULL_MOTION) {
          
          // Evaluate rep quality
          const evaluation = evaluateRepQuality();
          
          if (evaluation) {
            setFeedback({
              message: evaluation.feedback,
              type: evaluation.feedbackType
            });
            
            if (evaluation.isGoodForm) {
              updateStatsForGoodRep();
            } else {
              updateStatsForBadRep();
            }
            
            // Save data to Supabase after completing a rep
            await saveDetectionData();
          }
        } else {
          // Update feedback based on current state
          setFeedback(generateFeedback());
        }
        
        // Update motion state
        setPrevMotionState(currentMotionState);
        setCurrentMotionState(newMotionState);
      }
      
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
    evaluateRepQuality, 
    generateFeedback, 
    updateStatsForGoodRep, 
    updateStatsForBadRep, 
    saveDetectionData
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
      const completeSession = async () => {
        if (sessionId) {
          try {
            await supabase
              .from('analysis_sessions')
              .update({
                end_time: new Date().toISOString(),
                summary: {
                  stats,
                  lastBiomarkers: biomarkers
                }
              })
              .eq('id', sessionId);
          } catch (error) {
            console.error('Error completing session:', error);
          }
        }
      };
      
      completeSession();
    };
  }, [sessionId, stats, biomarkers]);
  
  // Reset session
  const resetSession = useCallback(() => {
    setStats({
      totalReps: 0,
      goodReps: 0,
      badReps: 0,
      accuracy: 75
    });
    
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
