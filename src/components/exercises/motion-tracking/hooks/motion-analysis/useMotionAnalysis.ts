
import { useCallback } from 'react';
import { FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';
import { DetectionResult } from '../types';
import { generateFeedback, evaluateRepQuality } from '../../utils/feedbackUtils';
import { useFeedback } from './useFeedback';
import { useMotionState } from './useMotionState';
import { useDetectionResults } from './useDetectionResults';
import { isRepCompleted } from './repDetection';
import { UseMotionAnalysisReturn } from './types';

export const useMotionAnalysis = (): UseMotionAnalysisReturn => {
  // Combine the smaller hooks
  const { result, angles, biomarkers, updateResults, resetResults } = useDetectionResults();
  const { currentMotionState, prevMotionState, updateMotionState, resetMotionState } = useMotionState();
  const { feedback, updateFeedback, resetFeedback } = useFeedback();

  // Process detection results
  const processDetectionResult = useCallback((
    detectionResult: DetectionResult,
    onRepComplete?: (isGoodForm: boolean) => void
  ) => {
    // Update state with detection results
    updateResults(
      detectionResult.result,
      detectionResult.angles,
      detectionResult.biomarkers
    );
    
    // Check if a rep was completed (full motion to standing transition)
    if (isRepCompleted(
      detectionResult.newMotionState, 
      currentMotionState, 
      prevMotionState
    )) {
      // Evaluate rep quality
      const evaluation = evaluateRepQuality(detectionResult.angles);
      
      // Generate feedback based on evaluation
      const feedbackData = evaluation
        ? {
            message: "Great form on that rep!",
            type: FeedbackType.SUCCESS
          }
        : {
            message: "Try to keep your back straight and go deeper",
            type: FeedbackType.WARNING
          };
      
      updateFeedback(feedbackData.message, feedbackData.type);
      
      if (onRepComplete) {
        onRepComplete(evaluation);
      }
    } else {
      // Update feedback based on current state
      const newFeedback = generateFeedback(detectionResult.newMotionState, detectionResult.angles);
      updateFeedback(newFeedback.message, newFeedback.type);
    }
    
    // Update motion state
    updateMotionState(detectionResult.newMotionState);
  }, [currentMotionState, prevMotionState, updateFeedback, updateMotionState, updateResults]);

  // Reset analysis state
  const resetAnalysis = useCallback(() => {
    resetMotionState();
    resetResults();
    resetFeedback();
  }, [resetFeedback, resetMotionState, resetResults]);

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
