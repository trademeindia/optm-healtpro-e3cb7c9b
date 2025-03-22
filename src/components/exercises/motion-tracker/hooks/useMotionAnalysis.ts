
import { useState, useRef } from 'react';
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

// Utility functions for exercise detection
const calculateAngle = (pointA: number[], pointB: number[], pointC: number[]): number => {
  const AB = Math.sqrt(Math.pow(pointB[0] - pointA[0], 2) + Math.pow(pointB[1] - pointA[1], 2));
  const BC = Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2));
  const AC = Math.sqrt(Math.pow(pointC[0] - pointA[0], 2) + Math.pow(pointC[1] - pointA[1], 2));
  
  return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
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

  const resetStats = () => {
    setStats({
      repetitions: 0,
      accuracy: 0,
      feedback: ""
    });
    prevStateRef.current = "";
    onFeedbackChange("Session reset. Continue your exercise.", FeedbackType.INFO);
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
      
      if (leftKnee && rightKnee && leftHip && rightHip) {
        // Simple squat detection example (knees bend significantly)
        const kneeY = (leftKnee.position[1] + rightKnee.position[1]) / 2;
        const hipY = (leftHip.position[1] + rightHip.position[1]) / 2;
        
        // Calculate knee to hip distance (higher value means more bent knees)
        const kneeHipDistance = kneeY - hipY;
        
        // Static thresholds for demonstration (would need to be dynamic in practice)
        if (kneeHipDistance < 50) {  // Standing position
          if (prevStateRef.current === "squat-down") {
            // Count a repetition when returning to standing from squat
            setStats(prev => ({
              ...prev,
              repetitions: prev.repetitions + 1,
              accuracy: Math.min(100, prev.accuracy + 5),
              feedback: "squat-up"
            }));
            
            onFeedbackChange(`Great job! Repetition ${stats.repetitions + 1} completed.`, FeedbackType.SUCCESS);
          } else if (!prevStateRef.current) {
            setStats(prev => ({
              ...prev,
              feedback: "squat-up"
            }));
            
            onFeedbackChange("Stand straight and prepare for the exercise.", FeedbackType.INFO);
          }
          prevStateRef.current = "squat-up";
        } else if (kneeHipDistance > 100) {  // Squat position
          if (prevStateRef.current === "squat-up") {
            setStats(prev => ({
              ...prev,
              feedback: "squat-down"
            }));
            
            onFeedbackChange("Good squat form. Now rise back up slowly.", FeedbackType.INFO);
          }
          prevStateRef.current = "squat-down";
        }
      }
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

  const analyzeMovement = (result: Result) => {
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
  };

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
