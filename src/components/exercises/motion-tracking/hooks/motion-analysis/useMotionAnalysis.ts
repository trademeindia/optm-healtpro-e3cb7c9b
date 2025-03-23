
import { useState, useCallback } from 'react';
import { FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';
import { useMotionState } from './useMotionState';
import { useFeedback } from './useFeedback';
import { useDetectionResults } from './useDetectionResults';
import { evaluateRepQuality } from './repDetection';

export const useMotionAnalysis = () => {
  const {
    result,
    angles,
    biomarkers,
    setResult,
    setAngles,
    setBiomarkers
  } = useDetectionResults();
  
  const {
    currentMotionState,
    prevMotionState,
    setCurrentMotionState,
    setPrevMotionState
  } = useMotionState();
  
  const {
    feedback,
    setFeedback,
    generateFeedback
  } = useFeedback();

  // Process detection results
  const processDetectionResult = useCallback((
    detectionResult: any,
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
        
        // Notify parent component about rep completion
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
  }, [
    currentMotionState, 
    prevMotionState, 
    setResult, 
    setAngles, 
    setBiomarkers, 
    setPrevMotionState, 
    setCurrentMotionState, 
    setFeedback,
    generateFeedback
  ]);

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setCurrentMotionState(MotionState.STANDING);
    setPrevMotionState(MotionState.STANDING);
    setFeedback({
      message: null,
      type: FeedbackType.INFO
    });
  }, [setCurrentMotionState, setPrevMotionState, setFeedback]);
  
  return {
    result,
    angles,
    biomarkers,
    currentMotionState,
    feedback,
    processDetectionResult,
    resetAnalysis
  };
};
