
import { useState, useRef, useEffect, useCallback } from 'react';
import { human, extractBodyAngles, extractBiomarkers, warmupModel, resetModel } from '@/lib/human';
import { MotionState, FeedbackType, DetectionStatus } from '@/lib/human/types';
import type { BodyAngles, MotionStats } from '@/lib/human/types';

interface UseHumanDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onStateChange?: (state: MotionState) => void;
  onGoodRep?: () => void;
  onBadRep?: () => void;
  onFeedback?: (message: string, type: FeedbackType) => void;
  onBiomarkersUpdate?: (biomarkers: Record<string, number | null>) => void;
  onAnglesUpdate?: (angles: BodyAngles) => void;
  onDetectionStatusChange?: (status: DetectionStatus) => void;
  sessionId?: string;
  onSessionDataSave?: (
    result: any,
    angles: any,
    biomarkers: any,
    motionState: MotionState,
    stats: MotionStats
  ) => void;
}

const DEFAULT_FPS_INTERVAL = 24; // Good compromise between performance and detection quality

export const useHumanDetection = ({
  videoRef,
  canvasRef,
  onStateChange,
  onGoodRep,
  onBadRep,
  onFeedback,
  onBiomarkersUpdate,
  onAnglesUpdate,
  onDetectionStatusChange,
  sessionId,
  onSessionDataSave
}: UseHumanDetectionProps) => {
  // Detection state
  const [isRunning, setIsRunning] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [motionState, setMotionState] = useState<MotionState>(MotionState.STANDING);
  const [kneeAngle, setKneeAngle] = useState<number | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null
  });
  
  // Performance tracking
  const lastProcessedRef = useRef<number>(0);
  const fpsCounterRef = useRef<number>(0);
  const fpsTimestampRef = useRef<number>(Date.now());
  const repCountedRef = useRef<boolean>(false);
  const prevKneeAngleRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Initialize Human.js
  useEffect(() => {
    const initialize = async () => {
      try {
        // Warm up the model
        await warmupModel();
        setIsModelLoaded(true);
        
        if (onFeedback) {
          onFeedback('Model loaded successfully', FeedbackType.SUCCESS);
        }
      } catch (error) {
        console.error('Error initializing Human.js:', error);
        if (onFeedback) {
          onFeedback('Failed to initialize model', FeedbackType.ERROR);
        }
      }
    };
    
    initialize();
    
    // Clean up on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resetModel();
    };
  }, [onFeedback]);
  
  // Process video frame and detect pose
  const processFrame = useCallback(async () => {
    if (!isRunning || !videoRef.current || !canvasRef.current || !isModelLoaded) {
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Skip frames based on FPS limiting interval
    const now = Date.now();
    const elapsed = now - lastProcessedRef.current;
    
    // Process this frame if enough time has elapsed
    if (elapsed > 1000 / DEFAULT_FPS_INTERVAL) {
      try {
        lastProcessedRef.current = now;
        
        // Run detection
        const result = await human.detect(video);
        
        // Update FPS counter
        fpsCounterRef.current++;
        if (now - fpsTimestampRef.current >= 1000) {
          const fps = Math.round((fpsCounterRef.current * 1000) / (now - fpsTimestampRef.current));
          setDetectionStatus(prev => ({
            ...prev,
            fps,
            isDetecting: true,
            confidence: result.body[0]?.score || null,
            detectedKeypoints: result.body[0]?.keypoints?.length || 0
          }));
          
          if (onDetectionStatusChange) {
            onDetectionStatusChange({
              isDetecting: true,
              fps,
              confidence: result.body[0]?.score || null,
              detectedKeypoints: result.body[0]?.keypoints?.length || 0
            });
          }
          
          fpsCounterRef.current = 0;
          fpsTimestampRef.current = now;
        }
        
        // Extract key angles
        const angles = extractBodyAngles(result);
        setKneeAngle(angles.kneeAngle);
        
        if (onAnglesUpdate) {
          onAnglesUpdate(angles);
        }
        
        // Extract biomarkers
        const biomarkers = extractBiomarkers(result, angles);
        
        if (onBiomarkersUpdate) {
          onBiomarkersUpdate(biomarkers);
        }
        
        // Determine motion state based on knee angle
        const prevState = motionState;
        let newState = motionState;
        
        if (angles.kneeAngle !== null) {
          if (angles.kneeAngle > 160) {
            newState = MotionState.STANDING;
          } else if (angles.kneeAngle < 100) {
            newState = MotionState.FULL_MOTION;
          } else {
            newState = MotionState.MID_MOTION;
          }
        }
        
        // Handle state changes
        if (newState !== prevState) {
          setMotionState(newState);
          
          if (onStateChange) {
            onStateChange(newState);
          }
          
          // Create rep counter logic
          if (prevState === MotionState.FULL_MOTION && newState === MotionState.MID_MOTION) {
            if (!repCountedRef.current) {
              // Going up from squat position - count the rep
              const quality = biomarkers.movementQuality || 0;
              
              // Determine rep quality (simulated)
              const goodForm = quality > 60;
              
              if (goodForm) {
                if (onGoodRep) {
                  onGoodRep();
                }
                
                if (onFeedback) {
                  onFeedback('Good form!', FeedbackType.SUCCESS);
                }
              } else {
                if (onBadRep) {
                  onBadRep();
                }
                
                if (onFeedback) {
                  onFeedback('Try going deeper in your squat', FeedbackType.WARNING);
                }
              }
              
              repCountedRef.current = true;
            }
          } else if (newState === MotionState.STANDING) {
            // Reset rep counter when standing
            repCountedRef.current = false;
            
            if (onFeedback) {
              onFeedback('Ready for next rep', FeedbackType.INFO);
            }
          }
        }
        
        // Draw pose on canvas
        await human.draw.canvas(canvas, video, result);
        
        // Save session data if provided
        if (sessionId && onSessionDataSave) {
          // Create a stats object with required fields
          const stats: MotionStats = {
            lastUpdated: Date.now(),
            totalReps: 0,
            goodReps: 0,
            badReps: 0,
            accuracy: 0,
            currentStreak: 0,
            bestStreak: 0,
            caloriesBurned: 0
          };
          
          onSessionDataSave(
            result,
            angles,
            biomarkers,
            motionState,
            stats
          );
        }
        
      } catch (error) {
        console.error('Error in pose detection:', error);
        setDetectionStatus(prev => ({
          ...prev,
          isDetecting: false
        }));
        
        if (onDetectionStatusChange) {
          onDetectionStatusChange({
            ...detectionStatus,
            isDetecting: false
          });
        }
      }
    }
    
    // Continue detection loop
    animationRef.current = requestAnimationFrame(processFrame);
  }, [
    isRunning,
    isModelLoaded,
    videoRef,
    canvasRef,
    motionState,
    detectionStatus,
    onStateChange,
    onGoodRep,
    onBadRep,
    onFeedback,
    onBiomarkersUpdate,
    onAnglesUpdate,
    onDetectionStatusChange,
    sessionId,
    onSessionDataSave
  ]);
  
  // Effect for running/stopping detection
  useEffect(() => {
    if (isRunning && isModelLoaded) {
      animationRef.current = requestAnimationFrame(processFrame);
      
      if (onFeedback) {
        onFeedback('Detection started', FeedbackType.INFO);
      }
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isRunning, isModelLoaded, processFrame, onFeedback]);
  
  // Start detection
  const startDetection = useCallback(() => {
    if (!isModelLoaded) {
      if (onFeedback) {
        onFeedback('Model not loaded yet', FeedbackType.WARNING);
      }
      return;
    }
    
    if (!videoRef.current || videoRef.current.paused) {
      if (onFeedback) {
        onFeedback('Video not ready', FeedbackType.ERROR);
      }
      return;
    }
    
    setIsRunning(true);
  }, [isModelLoaded, videoRef, onFeedback]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    setIsRunning(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (onFeedback) {
      onFeedback('Detection stopped', FeedbackType.INFO);
    }
  }, [onFeedback]);
  
  // Toggle detection
  const toggleDetection = useCallback(() => {
    if (isRunning) {
      stopDetection();
    } else {
      startDetection();
    }
  }, [isRunning, startDetection, stopDetection]);
  
  return {
    isRunning,
    isModelLoaded,
    motionState,
    kneeAngle,
    detectionStatus,
    startDetection,
    stopDetection,
    toggleDetection
  };
};
