
import { useState, useRef, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType, PostureAnalysis } from './types';
import { calculateAngle, determineSquatState, generateFeedback, evaluateRepQuality } from './utils';

interface UsePoseDetectionProps {
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

interface UsePoseDetectionResult {
  model: posenet.PoseNet | null;
  isModelLoading: boolean;
  pose: posenet.Pose | null;
  analysis: PostureAnalysis;
  stats: {
    accuracy: number;
    reps: number;
    incorrectReps: number;
  };
  feedback: {
    message: string | null;
    type: FeedbackType;
  };
  resetSession: () => void;
}

export const usePoseDetection = ({ 
  cameraActive, 
  videoRef 
}: UsePoseDetectionProps): UsePoseDetectionResult => {
  // PoseNet related states
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
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
  const [feedback, setFeedback] = useState<string | null>("Loading pose detection model...");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.INFO);
  
  // Animation frame reference
  const requestAnimationRef = useRef<number | null>(null);
  
  // Load PoseNet model
  useEffect(() => {
    const loadModel = async () => {
      if (model) return; // Prevent reloading if model exists
      
      setIsModelLoading(true);
      try {
        console.log("Loading TensorFlow.js...");
        // Make sure TensorFlow.js is ready
        await tf.ready();
        console.log("TensorFlow.js is ready");
        
        // Load PoseNet model
        console.log("Loading PoseNet model...");
        const loadedModel = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });
        
        console.log("PoseNet model loaded successfully");
        setModel(loadedModel);
        setFeedback("PoseNet model loaded successfully. You can start exercising now.");
        setFeedbackType(FeedbackType.SUCCESS);
      } catch (error) {
        console.error('Error loading PoseNet model:', error);
        setFeedback("Failed to load pose estimation model. Please try refreshing the page.");
        setFeedbackType(FeedbackType.WARNING);
      } finally {
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, [model]);

  // Analyze squat form
  const analyzeSquatForm = useCallback((pose: posenet.Pose) => {
    const keypoints = pose.keypoints;
    
    // Get necessary keypoints for squat analysis
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    
    // If we don't have all the keypoints, we can't analyze the squat
    if (!leftHip || !rightHip || !leftKnee || !rightKnee || 
        !leftAnkle || !rightAnkle || !leftShoulder || !rightShoulder) {
      setFeedback("Can't detect all body parts. Please make sure your full body is visible.");
      setFeedbackType(FeedbackType.WARNING);
      return;
    }
    
    // Calculate the knee angle (between hip, knee, and ankle)
    // We'll use the average of left and right sides for better accuracy
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    setKneeAngle(Math.round(avgKneeAngle));
    
    // Calculate the hip angle (between shoulder, hip, and knee)
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;
    setHipAngle(Math.round(avgHipAngle));
    
    // Determine squat state based on knee angle
    setPrevSquatState(currentSquatState);
    const newSquatState = determineSquatState(avgKneeAngle);
    setCurrentSquatState(newSquatState);
    
    // Count reps when coming up from bottom squat
    if (prevSquatState === SquatState.BOTTOM_SQUAT && newSquatState === SquatState.MID_SQUAT) {
      // Coming up from bottom squat
      
      // Determine if this was a good squat or not
      const evaluation = evaluateRepQuality(avgKneeAngle, avgHipAngle);
      
      if (evaluation.isGoodForm) {
        setReps(prev => prev + 1);
        setAccuracy(prev => Math.min(prev + 2, 100));
      } else {
        setIncorrectReps(prev => prev + 1);
        setAccuracy(prev => Math.max(prev - 5, 50));
      }
      
      setFeedback(evaluation.feedback);
      setFeedbackType(evaluation.feedbackType);
    } else {
      // Provide real-time feedback during the squat
      const feedbackResult = generateFeedback(newSquatState, avgKneeAngle, avgHipAngle);
      setFeedback(feedbackResult.feedback);
      setFeedbackType(feedbackResult.feedbackType);
    }
  }, [currentSquatState, prevSquatState]);
  
  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !cameraActive) return;
    
    try {
      if (videoRef.current.readyState < 2) {
        // Video not ready yet
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      // Ensure video is not paused
      if (videoRef.current.paused || videoRef.current.ended) {
        await videoRef.current.play();
      }
      
      console.log("Estimating pose...");
      // Estimate pose
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true  // Mirror the camera view
      });
      
      console.log("Pose detected:", detectedPose.score);
      
      // Only proceed if we have a pose with sufficient confidence
      if (detectedPose.score > 0.2) { // Lower threshold for better detection
        setPose(detectedPose);
        
        // Analyze squat form
        analyzeSquatForm(detectedPose);
      } else {
        setFeedback("Can't detect your pose clearly. Ensure good lighting and that your full body is visible.");
        setFeedbackType(FeedbackType.WARNING);
      }
    } catch (error) {
      console.error('Error estimating pose:', error);
    }
    
    // Continue the detection loop
    requestAnimationRef.current = requestAnimationFrame(detectPose);
  }, [model, cameraActive, videoRef, analyzeSquatForm]);
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && model && videoRef.current) {
      console.log("Starting pose detection...");
      // Start detection
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    } else if (!cameraActive && requestAnimationRef.current) {
      // Stop detection if camera is inactive
      cancelAnimationFrame(requestAnimationRef.current);
      requestAnimationRef.current = null;
    }
    
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
    };
  }, [cameraActive, model, detectPose, videoRef]);

  const resetSession = useCallback(() => {
    setReps(0);
    setIncorrectReps(0);
    setCurrentSquatState(SquatState.STANDING);
    setPrevSquatState(SquatState.STANDING);
    setFeedback("Session reset. Ready to start squatting!");
    setFeedbackType(FeedbackType.INFO);
    setAccuracy(75);
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
    resetSession
  };
};
