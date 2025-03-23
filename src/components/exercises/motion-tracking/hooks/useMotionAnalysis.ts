
import { useState, useCallback } from 'react';
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';
import { generateFeedback, evaluateRepQuality } from '../utils/feedbackUtils';
import { DetectionResult } from './types';

export const useMotionAnalysis = () => {
  // Motion analysis state
  const [result, setResult] = useState<any | null>(null);
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

  // Process detection results
  const processDetectionResult = useCallback((
    detectionResult: DetectionResult,
    onRepComplete?: (isGoodForm: boolean) => void
  ) => {
    // Update state with detection results
    setResult(detectionResult.result);
    setAngles(detectionResult.angles);
    setBiomarkers(detectionResult.biomarkers);
    
    // Check if a rep was completed (full motion to standing transition)
    if (currentMotionState === MotionState.FULL_MOTION && 
        detectionResult.newMotionState === MotionState.MID_MOTION &&
        prevMotionState === MotionState.FULL_MOTION) {
      
      // Evaluate rep quality
      const evaluation = evaluateRepQuality(detectionResult.angles);
      
      if (evaluation) {
        setFeedback({
          message: evaluation.feedback,
          type: evaluation.feedbackType
        });
        
        if (onRepComplete) {
          onRepComplete(evaluation.isGoodForm);
        }
      }
    } else {
      // Update feedback based on current state
      setFeedback(generateFeedback(detectionResult.newMotionState, detectionResult.angles));
    }
    
    // Update motion state
    setPrevMotionState(currentMotionState);
    setCurrentMotionState(detectionResult.newMotionState);
  }, [currentMotionState, prevMotionState]);

  // Reset analysis state
  const resetAnalysis = useCallback(() => {
    setCurrentMotionState(MotionState.STANDING);
    setPrevMotionState(MotionState.STANDING);
    setFeedback({
      message: "Ready to start. Position yourself in the camera view.",
      type: FeedbackType.INFO
    });
  }, []);

  return {
    result,
    angles,
    biomarkers,
    currentMotionState,
    prevMotionState,
    feedback,
    processDetectionResult,
    resetAnalysis
  };
};
