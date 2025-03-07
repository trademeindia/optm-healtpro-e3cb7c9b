
import { useState, useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from './types';
import { 
  UsePoseDetectionProps, 
  UsePoseDetectionResult,
  PoseDetectionConfig 
} from './poseDetectionTypes';
import { 
  DEFAULT_POSE_CONFIG, 
  analyzeSquatForm 
} from './poseDetectionUtils';
import { usePoseModel } from './usePoseModel';
import { toast } from '@/hooks/use-toast';

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
  
  // Analysis states
  const [currentSquatState, setCurrentSquatState] = useState<SquatState>(SquatState.STANDING);
  const [prevSquatState, setPrevSquatState] = useState<SquatState>(SquatState.STANDING);
  const [kneeAngle, setKneeAngle] = useState<number | null>(null);
  const [hipAngle, setHipAngle] = useState<number | null>(null);
  
  // Performance tracking states
  const [accuracy, setAccuracy] = useState(75); // Starting value
  const [reps, setReps] = useState(0);
  const [incorrectReps, setIncorrectReps] = useState(0);
  
  // Feedback states
  const [feedback, setFeedback] = useState<string | null>(
    isModelLoading ? "Loading pose detection model..." : null
  );
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.INFO);
  
  // Detection performance monitoring
  const lastDetectionTimeRef = useRef<number>(0);
  const detectionFailuresRef = useRef<number>(0);
  
  // Animation frame reference
  const requestAnimationRef = useRef<number | null>(null);
  
  // Update feedback when model loading state changes
  useEffect(() => {
    if (isModelLoading) {
      setFeedback("Loading pose detection model...");
      setFeedbackType(FeedbackType.INFO);
    } else if (modelError) {
      setFeedback(modelError);
      setFeedbackType(FeedbackType.WARNING);
    }
  }, [isModelLoading, modelError]);
  
  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !cameraActive) {
      console.log("Cannot detect pose: missing model, video, or camera inactive");
      return;
    }
    
    try {
      if (videoRef.current.readyState < 2) {
        // Video not ready yet
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        console.log("Video not ready for pose detection, waiting...");
        return;
      }
      
      // Ensure video is not paused
      if (videoRef.current.paused || videoRef.current.ended) {
        try {
          console.log("Video is paused/ended, attempting to play...");
          await videoRef.current.play();
        } catch (error) {
          console.error("Failed to play video during pose detection:", error);
          detectionFailuresRef.current++;
          
          if (detectionFailuresRef.current > 5) {
            setFeedback("Video stream issues detected. Please try restarting the camera.");
            setFeedbackType(FeedbackType.WARNING);
            
            // Reset failure counter to avoid repeated warnings
            detectionFailuresRef.current = 0;
          }
          
          requestAnimationRef.current = requestAnimationFrame(detectPose);
          return;
        }
      }
      
      // Calculate time since last successful detection for performance monitoring
      const now = performance.now();
      const timeSinceLastDetection = now - lastDetectionTimeRef.current;
      
      console.log("Estimating pose...");
      // Estimate pose
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true  // Mirror the camera view
      });
      
      console.log("Pose detected:", detectedPose.score);
      lastDetectionTimeRef.current = performance.now();
      
      // Reset failure counter on successful detection
      detectionFailuresRef.current = 0;
      
      // Calculate FPS for monitoring
      const detectionTime = performance.now() - now;
      console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      
      // Check if detection is taking too long
      if (detectionTime > 100) {
        console.warn("Pose detection is slow, may impact performance");
      }
      
      // Only proceed if we have a pose with sufficient confidence
      if (detectedPose.score > config.minPoseConfidence) {
        setPose(detectedPose);
        
        // Analyze the pose
        const analysisResult = analyzeSquatForm(detectedPose, currentSquatState, prevSquatState);
        
        // Update state with analysis results
        if (analysisResult.kneeAngle !== null) {
          setKneeAngle(analysisResult.kneeAngle);
        }
        
        if (analysisResult.hipAngle !== null) {
          setHipAngle(analysisResult.hipAngle);
        }
        
        setPrevSquatState(currentSquatState);
        setCurrentSquatState(analysisResult.newSquatState);
        
        // Update feedback from analysis
        setFeedback(analysisResult.feedback.message);
        setFeedbackType(analysisResult.feedback.type);
        
        // Update rep count and accuracy if a rep was completed
        if (analysisResult.repComplete && analysisResult.evaluation) {
          const { isGoodForm } = analysisResult.evaluation;
          
          if (isGoodForm) {
            setReps(prev => prev + 1);
            setAccuracy(prev => Math.min(prev + 2, 100));
            
            toast({
              title: "Rep Completed",
              description: "Great form! Keep going!",
            });
          } else {
            setIncorrectReps(prev => prev + 1);
            setAccuracy(prev => Math.max(prev - 5, 50));
          }
        }
      } else {
        // Pose confidence is too low
        console.warn("Low confidence in pose detection:", detectedPose.score);
        
        if (pose) {
          // Only show warning if we previously had a valid pose
          setFeedback("Can't detect your pose clearly. Ensure good lighting and that your full body is visible.");
          setFeedbackType(FeedbackType.WARNING);
        }
      }
    } catch (error) {
      console.error('Error estimating pose:', error);
      detectionFailuresRef.current++;
      
      if (detectionFailuresRef.current > 5) {
        setFeedback("Error detecting your pose. Please ensure good lighting and that your camera is working properly.");
        setFeedbackType(FeedbackType.WARNING);
        
        // Reset failure counter to avoid repeated warnings
        detectionFailuresRef.current = 0;
      }
    }
    
    // Continue the detection loop with adaptive frame rate
    // If detection is taking too long, we'll slow down the frame rate
    const frameDelay = Math.max(0, 33 - (performance.now() - lastDetectionTimeRef.current));
    requestAnimationRef.current = setTimeout(() => {
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    }, frameDelay) as unknown as number;
  }, [model, cameraActive, videoRef, currentSquatState, prevSquatState, config, pose]);
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && model && videoRef.current) {
      console.log("Starting pose detection...");
      // Start detection
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      
      // Set initial feedback
      if (!feedback) {
        setFeedback("Starting pose detection. Please stand with your full body visible to the camera.");
        setFeedbackType(FeedbackType.INFO);
      }
    } else if (!cameraActive) {
      // Stop detection if camera is inactive
      if (requestAnimationRef.current) {
        if (typeof requestAnimationRef.current === 'number') {
          cancelAnimationFrame(requestAnimationRef.current);
        } else {
          clearTimeout(requestAnimationRef.current);
        }
        requestAnimationRef.current = null;
      }
      
      // Reset pose data when camera is turned off
      setPose(null);
    }
    
    return () => {
      // Cleanup animation frame on unmount or dependency change
      if (requestAnimationRef.current) {
        if (typeof requestAnimationRef.current === 'number') {
          cancelAnimationFrame(requestAnimationRef.current);
        } else {
          clearTimeout(requestAnimationRef.current);
        }
        requestAnimationRef.current = null;
      }
    };
  }, [cameraActive, model, detectPose, videoRef, feedback]);

  // Reset session function to clear stats and state
  const resetSession = useCallback(() => {
    setReps(0);
    setIncorrectReps(0);
    setCurrentSquatState(SquatState.STANDING);
    setPrevSquatState(SquatState.STANDING);
    setFeedback("Session reset. Ready to start squatting!");
    setFeedbackType(FeedbackType.INFO);
    setAccuracy(75);
    
    toast({
      title: "Session Reset",
      description: "Your workout session has been reset. Ready to start new exercises!",
    });
  }, []);

  return {
    model,
    isModelLoading,
    pose,
    analysis: {
      kneeAngle,
      hipAngle,
      currentSquatState
    },
    stats: {
      accuracy,
      reps,
      incorrectReps
    },
    feedback: {
      message: feedback,
      type: feedbackType
    },
    resetSession,
    config
  };
};
