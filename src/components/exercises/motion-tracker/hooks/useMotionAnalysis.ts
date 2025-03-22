import { useState, useRef, useCallback } from 'react';
import { Result } from '@vladmandic/human';
import { TrackerStats, FeedbackType, ExerciseType } from '../types';

type UseMotionAnalysisProps = {
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
  exerciseType?: ExerciseType;
};

type UseMotionAnalysisReturn = {
  stats: TrackerStats;
  resetStats: () => void;
  analyzeMovement: (result: Result) => void;
};

// Optimized angle calculation function with better numerical stability
const calculateAngle = (pointA: number[], pointB: number[], pointC: number[]): number => {
  // Create vectors from B to A and B to C
  const vectorBA = [pointA[0] - pointB[0], pointA[1] - pointB[1]];
  const vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1]];
  
  // Calculate dot product
  const dotProduct = vectorBA[0] * vectorBC[0] + vectorBA[1] * vectorBC[1];
  
  // Calculate magnitudes
  const magnitudeBA = Math.sqrt(vectorBA[0] * vectorBA[0] + vectorBA[1] * vectorBA[1]);
  const magnitudeBC = Math.sqrt(vectorBC[0] * vectorBC[0] + vectorBC[1] * vectorBC[1]);
  
  // Calculate cosine of the angle with bounds check to avoid numerical issues
  const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magnitudeBA * magnitudeBC)));
  
  // Calculate angle in degrees
  return Math.acos(cosTheta) * (180 / Math.PI);
};

export const useMotionAnalysis = ({
  onFeedbackChange,
  exerciseType = 'squat'
}: UseMotionAnalysisProps): UseMotionAnalysisReturn => {
  const [stats, setStats] = useState<TrackerStats>({
    repetitions: 0,
    accuracy: 0,
    feedback: ""
  });
  
  // Store previous state to detect transitions
  const prevStateRef = useRef<string>("");
  
  // Keep track of form quality for feedback
  const formQualityRef = useRef<{
    backStraight: boolean;
    kneeAlignment: boolean;
    depthSufficient: boolean;
    movementSmooth: boolean;
  }>({
    backStraight: true,
    kneeAlignment: true,
    depthSufficient: true,
    movementSmooth: true
  });
  
  // Store movement history for smoothing and analysis
  const movementHistoryRef = useRef<{
    kneeAngles: number[];
    hipAngles: number[];
    timestamps: number[];
  }>({
    kneeAngles: [],
    hipAngles: [],
    timestamps: []
  });
  
  // Maximum history length to prevent memory issues
  const MAX_HISTORY_LENGTH = 30;

  const resetStats = () => {
    setStats({
      repetitions: 0,
      accuracy: 0,
      feedback: ""
    });
    prevStateRef.current = "";
    formQualityRef.current = {
      backStraight: true,
      kneeAlignment: true,
      depthSufficient: true,
      movementSmooth: true
    };
    movementHistoryRef.current = {
      kneeAngles: [],
      hipAngles: [],
      timestamps: []
    };
    onFeedbackChange("Session reset. Continue your exercise.", FeedbackType.INFO);
  };

  // Get smoothed angle by averaging recent values
  const getSmoothedAngle = (angles: number[]): number => {
    if (angles.length === 0) return 0;
    // Use only the last few frames for smoothing
    const recentAngles = angles.slice(-5);
    return recentAngles.reduce((sum, angle) => sum + angle, 0) / recentAngles.length;
  };

  // Add angle to history with timestamp and trim if needed
  const addAngleToHistory = (kneeAngle: number | null, hipAngle: number | null) => {
    const now = performance.now();
    
    if (kneeAngle !== null) {
      movementHistoryRef.current.kneeAngles.push(kneeAngle);
      movementHistoryRef.current.timestamps.push(now);
    }
    
    if (hipAngle !== null) {
      movementHistoryRef.current.hipAngles.push(hipAngle);
    }
    
    // Trim history if it gets too long
    if (movementHistoryRef.current.kneeAngles.length > MAX_HISTORY_LENGTH) {
      movementHistoryRef.current.kneeAngles.shift();
      movementHistoryRef.current.hipAngles.shift();
      movementHistoryRef.current.timestamps.shift();
    }
  };

  // Check if movement is smooth based on angle changes
  const isMovementSmooth = (): boolean => {
    const angles = movementHistoryRef.current.kneeAngles;
    if (angles.length < 3) return true;
    
    // Check for sudden changes in angles
    for (let i = 2; i < angles.length; i++) {
      const diff1 = Math.abs(angles[i] - angles[i-1]);
      const diff2 = Math.abs(angles[i-1] - angles[i-2]);
      
      // If there's a sudden large change in the rate of change, movement isn't smooth
      if (Math.abs(diff1 - diff2) > 20) {
        return false;
      }
    }
    
    return true;
  };

  const detectSquat = (result: Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    if (body.score > 0.7) {
      // Get specific keypoints for analysis
      const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
      const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
      const leftHip = keypoints.find(kp => kp.part === 'leftHip');
      const rightHip = keypoints.find(kp => kp.part === 'rightHip');
      const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
      const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
      const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
      const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
      
      if (leftKnee && rightKnee && leftHip && rightHip && leftAnkle && rightAnkle && leftShoulder && rightShoulder) {
        // Calculate knee angles
        const leftKneeAngle = calculateAngle(
          [leftHip.position[0], leftHip.position[1]],
          [leftKnee.position[0], leftKnee.position[1]],
          [leftAnkle.position[0], leftAnkle.position[1]]
        );
        
        const rightKneeAngle = calculateAngle(
          [rightHip.position[0], rightHip.position[1]],
          [rightKnee.position[0], rightKnee.position[1]],
          [rightAnkle.position[0], rightAnkle.position[1]]
        );
        
        // Calculate hip angles
        const leftHipAngle = calculateAngle(
          [leftShoulder.position[0], leftShoulder.position[1]],
          [leftHip.position[0], leftHip.position[1]],
          [leftKnee.position[0], leftKnee.position[1]]
        );
        
        const rightHipAngle = calculateAngle(
          [rightShoulder.position[0], rightShoulder.position[1]],
          [rightHip.position[0], rightHip.position[1]],
          [rightKnee.position[0], rightKnee.position[1]]
        );
        
        // Average the angles
        const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
        const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;
        
        // Add to history for smoothing
        addAngleToHistory(avgKneeAngle, avgHipAngle);
        
        // Get smoothed angles
        const smoothedKneeAngle = getSmoothedAngle(movementHistoryRef.current.kneeAngles);
        
        // Check form quality
        // 1. Check if back is straight (using hip angle)
        formQualityRef.current.backStraight = avgHipAngle > 160;
        
        // 2. Check knee alignment (knees shouldn't collapse inward)
        const kneeDistance = Math.sqrt(
          Math.pow(leftKnee.position[0] - rightKnee.position[0], 2) +
          Math.pow(leftKnee.position[1] - rightKnee.position[1], 2)
        );
        
        const ankleDistance = Math.sqrt(
          Math.pow(leftAnkle.position[0] - rightAnkle.position[0], 2) +
          Math.pow(leftAnkle.position[1] - rightAnkle.position[1], 2)
        );
        
        formQualityRef.current.kneeAlignment = kneeDistance >= ankleDistance * 0.8;
        
        // 3. Check if squat depth is sufficient
        formQualityRef.current.depthSufficient = movementHistoryRef.current.kneeAngles.some(angle => angle < 100);
        
        // 4. Check if movement is smooth
        formQualityRef.current.movementSmooth = isMovementSmooth();
        
        // State detection based on smoothed knee angle
        if (smoothedKneeAngle < 100) {  // Bottom squat position
          if (prevStateRef.current === "squat-up") {
            setStats(prev => ({
              ...prev,
              feedback: "squat-down"
            }));
            
            onFeedbackChange("Good depth. Hold briefly, then rise up with control.", FeedbackType.INFO);
          }
          prevStateRef.current = "squat-down";
        } else if (smoothedKneeAngle > 160) {  // Standing position
          if (prevStateRef.current === "squat-down") {
            // Count a repetition when returning to standing from squat
            setStats(prev => ({
              ...prev,
              repetitions: prev.repetitions + 1,
              accuracy: calculateAccuracy(),
              feedback: "squat-up"
            }));
            
            // Provide form feedback
            provideFeedback();
          } else if (!prevStateRef.current) {
            setStats(prev => ({
              ...prev,
              feedback: "squat-up"
            }));
            
            onFeedbackChange("Stand with feet shoulder-width apart and prepare to squat.", FeedbackType.INFO);
          }
          prevStateRef.current = "squat-up";
        } else {  // Mid squat position
          // No state change, just transitioning
          if (prevStateRef.current === "squat-up") {
            onFeedbackChange("Good, now keep going down slowly.", FeedbackType.INFO);
          } else if (prevStateRef.current === "squat-down") {
            onFeedbackChange("Now push through your heels to stand back up.", FeedbackType.INFO);
          }
        }
      }
    }
  };

  // Calculate accuracy based on form quality metrics
  const calculateAccuracy = (): number => {
    let score = 0;
    let total = 0;
    
    // Add points for each good form element
    if (formQualityRef.current.backStraight) {
      score += 25;
    }
    total += 25;
    
    if (formQualityRef.current.kneeAlignment) {
      score += 25;
    }
    total += 25;
    
    if (formQualityRef.current.depthSufficient) {
      score += 25;
    }
    total += 25;
    
    if (formQualityRef.current.movementSmooth) {
      score += 25;
    }
    total += 25;
    
    // Calculate percentage and blend with previous accuracy for smoother changes
    const newAccuracy = (score / total) * 100;
    const prevAccuracy = stats.accuracy || 0;
    
    return prevAccuracy * 0.7 + newAccuracy * 0.3; // Weighted average for smoother transitions
  };

  // Provide feedback based on form quality
  const provideFeedback = () => {
    if (!formQualityRef.current.backStraight) {
      onFeedbackChange("Keep your back straighter during the squat.", FeedbackType.WARNING);
    } else if (!formQualityRef.current.kneeAlignment) {
      onFeedbackChange("Keep your knees aligned with your toes, don't let them collapse inward.", FeedbackType.WARNING);
    } else if (!formQualityRef.current.depthSufficient) {
      onFeedbackChange("Try to squat deeper for better muscle engagement.", FeedbackType.WARNING);
    } else if (!formQualityRef.current.movementSmooth) {
      onFeedbackChange("Aim for smoother movement throughout the squat.", FeedbackType.WARNING);
    } else {
      onFeedbackChange(`Great job! Repetition ${stats.repetitions + 1} completed with good form.`, FeedbackType.SUCCESS);
    }
  };

  const detectLunge = (result: Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    if (body.score > 0.7) {
      // Get relevant keypoints for lunge detection
      const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
      const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
      const leftHip = keypoints.find(kp => kp.part === 'leftHip');
      const rightHip = keypoints.find(kp => kp.part === 'rightHip');
      const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
      const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
      
      if (leftKnee && rightKnee && leftHip && rightHip && leftAnkle && rightAnkle) {
        // Check vertical separation between knees (one knee should be lower in a lunge)
        const kneeYDifference = Math.abs(leftKnee.position[1] - rightKnee.position[1]);
        
        // Check horizontal separation between ankles (feet should be apart in a lunge)
        const ankleXDifference = Math.abs(leftAnkle.position[0] - rightAnkle.position[0]);
        
        // Calculate knee angles
        const leftKneeAngle = calculateAngle(
          leftHip.position, 
          leftKnee.position, 
          leftAnkle.position
        );
        
        const rightKneeAngle = calculateAngle(
          rightHip.position, 
          rightKnee.position, 
          rightAnkle.position
        );
        
        // Detect lunge position - one knee bent with significant vertical difference
        if (kneeYDifference > 80 && ankleXDifference > 50 && 
            ((leftKneeAngle < 100 && rightKneeAngle > 150) || 
             (rightKneeAngle < 100 && leftKneeAngle > 150))) {
          
          // Lunge down position
          if (prevStateRef.current === "lunge-up" || !prevStateRef.current) {
            setStats(prev => ({
              ...prev,
              feedback: "lunge-down"
            }));
            
            onFeedbackChange("Good lunge position. Maintain balance and control.", FeedbackType.INFO);
          }
          prevStateRef.current = "lunge-down";
        } 
        // Detect standing position
        else if (kneeYDifference < 30 && leftKneeAngle > 160 && rightKneeAngle > 160) {
          if (prevStateRef.current === "lunge-down") {
            // Count a repetition when returning to standing from lunge
            setStats(prev => ({
              ...prev,
              repetitions: prev.repetitions + 1,
              accuracy: Math.min(100, prev.accuracy + 5),
              feedback: "lunge-up"
            }));
            
            onFeedbackChange(`Great job! Lunge repetition ${stats.repetitions + 1} completed.`, FeedbackType.SUCCESS);
          } else if (!prevStateRef.current) {
            setStats(prev => ({
              ...prev,
              feedback: "lunge-up"
            }));
            
            onFeedbackChange("Stand straight and prepare for lunges.", FeedbackType.INFO);
          }
          prevStateRef.current = "lunge-up";
        }
      }
    }
  };

  const analyzeMovement = useCallback((result: Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    
    // Check if enough keypoints are detected with good confidence
    if (body.score > 0.7) {
      // Apply the appropriate exercise detection algorithm based on exerciseType
      switch (exerciseType) {
        case 'squat':
          detectSquat(result);
          break;
        case 'lunge':
          detectLunge(result);
          break;
        default:
          detectSquat(result); // Default to squat detection
      }
      
      // Check posture - this applies to all exercises
      checkPosture(result);
    } else {
      onFeedbackChange("Move closer to the camera for better tracking.", FeedbackType.WARNING);
    }
  }, [exerciseType, onFeedbackChange]);

  const checkPosture = (result: Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Check posture alignment
    const nose = keypoints.find(kp => kp.part === 'nose');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    
    if (nose && leftShoulder && rightShoulder && leftHip && rightHip) {
      // Simple posture check: vertical alignment
      const shoulderX = (leftShoulder.position[0] + rightShoulder.position[0]) / 2;
      const hipX = (leftHip.position[0] + rightHip.position[0]) / 2;
      const noseX = nose.position[0];
      
      // Check if body is leaning too much
      const shoulderHipDiff = Math.abs(shoulderX - hipX);
      const noseShoulderDiff = Math.abs(noseX - shoulderX);
      
      if (shoulderHipDiff > 50 || noseShoulderDiff > 50) {
        onFeedbackChange("Keep your body aligned vertically for better form.", FeedbackType.WARNING);
      }
    }
  };

  return {
    stats,
    resetStats,
    analyzeMovement
  };
};
