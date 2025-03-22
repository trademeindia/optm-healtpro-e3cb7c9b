
import { useState } from 'react';
import { Result } from '@vladmandic/human';
import { TrackerStats, FeedbackType } from '../types';

type UseMotionAnalysisProps = {
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
};

type UseMotionAnalysisReturn = {
  stats: TrackerStats;
  resetStats: () => void;
  analyzeMovement: (result: Result) => void;
};

export const useMotionAnalysis = ({
  onFeedbackChange
}: UseMotionAnalysisProps): UseMotionAnalysisReturn => {
  const [stats, setStats] = useState<TrackerStats>({
    repetitions: 0,
    accuracy: 0,
    feedback: ""
  });

  const resetStats = () => {
    setStats({
      repetitions: 0,
      accuracy: 0,
      feedback: ""
    });
    
    onFeedbackChange("Session reset. Continue your exercise.", FeedbackType.INFO);
  };

  const analyzeMovement = (result: Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Check if enough keypoints are detected with good confidence
    if (body.score > 0.7) {
      // Get specific keypoints for analysis
      const nose = keypoints.find(kp => kp.part === 'nose');
      const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
      const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
      const leftHip = keypoints.find(kp => kp.part === 'leftHip');
      const rightHip = keypoints.find(kp => kp.part === 'rightHip');
      const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
      const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
      
      // Detect repetitive movements (simplified example)
      if (leftKnee && rightKnee && leftHip && rightHip) {
        // Simple squat detection example (knees bend significantly)
        const kneeY = (leftKnee.position[1] + rightKnee.position[1]) / 2;
        const hipY = (leftHip.position[1] + rightHip.position[1]) / 2;
        
        // Calculate knee to hip distance (higher value means more bent knees)
        const kneeHipDistance = kneeY - hipY;
        
        // Static thresholds for demonstration (would need to be dynamic in practice)
        if (kneeHipDistance < 50) {  // Standing position
          if (stats.feedback === "squat-down") {
            // Count a repetition when returning to standing from squat
            setStats(prev => ({
              ...prev,
              repetitions: prev.repetitions + 1,
              accuracy: Math.min(100, prev.accuracy + 5),
              feedback: "squat-up"
            }));
            
            onFeedbackChange(`Great job! Repetition ${stats.repetitions + 1} completed.`, FeedbackType.SUCCESS);
          } else if (!stats.feedback) {
            setStats(prev => ({
              ...prev,
              feedback: "squat-up"
            }));
            
            onFeedbackChange("Stand straight and prepare for the exercise.", FeedbackType.INFO);
          }
        } else if (kneeHipDistance > 100) {  // Squat position
          if (stats.feedback === "squat-up") {
            setStats(prev => ({
              ...prev,
              feedback: "squat-down"
            }));
            
            onFeedbackChange("Good squat form. Now rise back up slowly.", FeedbackType.INFO);
          }
        }
      }
      
      // Check posture alignment
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
    } else {
      onFeedbackChange("Move closer to the camera for better tracking.", FeedbackType.WARNING);
    }
  };

  return {
    stats,
    resetStats,
    analyzeMovement
  };
};
