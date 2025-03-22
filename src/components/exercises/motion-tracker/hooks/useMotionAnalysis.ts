
import { useState, useCallback, useRef } from 'react';
import { Result } from '@vladmandic/human';
import { FeedbackType, ExerciseType } from '../types';

interface UseMotionAnalysisProps {
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
  exerciseType: ExerciseType;
}

interface MotionStats {
  repetitions: number;
  accuracy: number;
  lastRepQuality?: number;
}

export const useMotionAnalysis = ({
  onFeedbackChange,
  exerciseType
}: UseMotionAnalysisProps) => {
  // State to track exercise metrics
  const [stats, setStats] = useState<MotionStats>({
    repetitions: 0,
    accuracy: 0,
    lastRepQuality: undefined
  });

  // Reference for current movement state
  const movementStateRef = useRef({
    isInBottomPosition: false,
    isInTopPosition: true,
    lastBottomTime: 0,
    lastTopTime: 0,
    repInProgress: false,
    lastAngles: {
      kneeAngle: 180,
      hipAngle: 180
    },
    consecutiveGoodPositions: 0,
  });

  // Analyze Human.js detection result for exercise tracking
  const analyzeMovement = useCallback((result: Result) => {
    if (!result.body || result.body.length === 0) {
      return;
    }

    const body = result.body[0];
    if (!body || !body.keypoints) {
      return;
    }

    // Get relevant keypoints for squat/lunge analysis
    const keypoints = body.keypoints;
    const hipLeft = keypoints.find(kp => kp.part === 'leftHip');
    const hipRight = keypoints.find(kp => kp.part === 'rightHip');
    const kneeLeft = keypoints.find(kp => kp.part === 'leftKnee');
    const kneeRight = keypoints.find(kp => kp.part === 'rightKnee');
    const ankleLeft = keypoints.find(kp => kp.part === 'leftAnkle');
    const ankleRight = keypoints.find(kp => kp.part === 'rightAnkle');

    // Skip analysis if required keypoints are missing
    if (!hipLeft || !hipRight || !kneeLeft || !kneeRight || !ankleLeft || !ankleRight) {
      return;
    }

    // Calculate knee and hip angles
    const calculateAngle = (p1: any, p2: any, p3: any) => {
      const vector1 = [p1.position[0] - p2.position[0], p1.position[1] - p2.position[1]];
      const vector2 = [p3.position[0] - p2.position[0], p3.position[1] - p2.position[1]];
      
      const dot = vector1[0] * vector2[0] + vector1[1] * vector2[1];
      const mag1 = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1]);
      const mag2 = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);
      
      const cosAngle = dot / (mag1 * mag2);
      const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
      
      return angle;
    };

    // Calculate average knee and hip angles
    const leftKneeAngle = calculateAngle(hipLeft, kneeLeft, ankleLeft);
    const rightKneeAngle = calculateAngle(hipRight, kneeRight, ankleRight);
    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Store current angles for reference
    movementStateRef.current.lastAngles = {
      kneeAngle,
      hipAngle: 180 // Simplified, in real app would calculate proper hip angle
    };

    // Detect squat/lunge positions based on knee angle
    const inBottomPosition = kneeAngle < 110; // Deep knee bend
    const inTopPosition = kneeAngle > 160; // Standing straight
    const state = movementStateRef.current;

    // Handle transition to bottom position (down phase)
    if (!state.isInBottomPosition && inBottomPosition) {
      state.isInBottomPosition = true;
      state.lastBottomTime = Date.now();
      state.repInProgress = true;
      onFeedbackChange("Good depth! Now push back up.", FeedbackType.SUCCESS);
    }

    // Handle transition to top position (up phase = rep completion)
    if (state.repInProgress && !state.isInTopPosition && inTopPosition) {
      state.isInTopPosition = true;
      state.lastTopTime = Date.now();
      state.isInBottomPosition = false;
      state.repInProgress = false;
      
      // Calculate rep quality (simplified version)
      const repDuration = state.lastTopTime - state.lastBottomTime;
      const isControlled = repDuration > 1000; // Good rep takes at least 1 second
      const formQuality = isControlled ? 90 : 70;
      
      // Update rep count and accuracy
      setStats(prevStats => {
        const newReps = prevStats.repetitions + 1;
        // Calculate new accuracy as average of all rep qualities
        const newAccuracy = prevStats.accuracy === 0 
          ? formQuality
          : (prevStats.accuracy * prevStats.repetitions + formQuality) / newReps;
        
        return {
          repetitions: newReps,
          accuracy: newAccuracy,
          lastRepQuality: formQuality
        };
      });
      
      // Provide feedback based on rep quality
      if (isControlled) {
        onFeedbackChange(
          `Great rep! That's ${stats.repetitions + 1} completed.`, 
          FeedbackType.SUCCESS
        );
      } else {
        onFeedbackChange(
          "Try to control your movement more on the way up.", 
          FeedbackType.WARNING
        );
      }
    }
    
    // Handle moving out of top position (starting new rep)
    if (state.isInTopPosition && !inTopPosition) {
      state.isInTopPosition = false;
      onFeedbackChange(
        "Keep your back straight as you descend.", 
        FeedbackType.INFO
      );
    }

  }, [onFeedbackChange, stats.repetitions, exerciseType]);

  // Reset all exercise stats
  const resetStats = useCallback(() => {
    setStats({
      repetitions: 0,
      accuracy: 0,
      lastRepQuality: undefined
    });
    
    movementStateRef.current = {
      isInBottomPosition: false,
      isInTopPosition: true,
      lastBottomTime: 0,
      lastTopTime: 0,
      repInProgress: false,
      lastAngles: {
        kneeAngle: 180,
        hipAngle: 180
      },
      consecutiveGoodPositions: 0,
    };
    
    onFeedbackChange(
      "Stats reset. Ready to start a new set.", 
      FeedbackType.INFO
    );
  }, [onFeedbackChange]);

  return {
    stats,
    analyzeMovement,
    resetStats
  };
};
