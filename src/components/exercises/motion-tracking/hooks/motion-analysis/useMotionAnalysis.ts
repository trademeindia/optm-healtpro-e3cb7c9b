
import { useCallback, useRef } from 'react';
import * as Human from '@vladmandic/human';
import { BodyAngles, MotionState } from '@/components/exercises/posture-monitor/types';
import { generateFeedback } from '../../utils/feedbackUtils';
import { determineMotionState } from '../../utils/motionStateUtils';
import { useMotionState } from './useMotionState';
import { useFeedback } from './useFeedback';
import { useDetectionResults } from './useDetectionResults';
import { detectRep } from './repDetection';
import { UseMotionAnalysisReturn } from './types';

export const useMotionAnalysis = (): UseMotionAnalysisReturn => {
  const {
    result,
    angles,
    biomarkers,
    updateDetectionResults
  } = useDetectionResults();
  
  const {
    motionState,
    prevMotionState,
    updateMotionState,
    resetMotionState
  } = useMotionState();
  
  const {
    feedback,
    updateFeedback
  } = useFeedback();
  
  // Store a reference to the state before the previous state (for rep detection)
  const beforePrevMotionState = useRef<MotionState>(MotionState.STANDING);
  
  const processMotionData = useCallback((
    detectionResult: Human.Result | null,
    newAngles: BodyAngles,
    newBiomarkers: Record<string, any>
  ) => {
    // Update detection results
    updateDetectionResults(detectionResult, newAngles, newBiomarkers);
    
    // Determine the new motion state based on the angles
    const newMotionState = determineMotionState(newAngles, motionState);
    
    // Update motion state references
    beforePrevMotionState.current = prevMotionState;
    
    // Update the motion state
    updateMotionState(newMotionState);
    
    // Generate feedback based on the new state
    const newFeedback = generateFeedback(newMotionState, newAngles);
    updateFeedback(newFeedback.message, newFeedback.type);
    
    // Check if a rep was completed
    return detectRep(
      newAngles,
      newMotionState,
      prevMotionState,
      beforePrevMotionState.current
    );
  }, [
    updateDetectionResults,
    motionState,
    prevMotionState,
    updateMotionState,
    updateFeedback
  ]);
  
  return {
    result,
    angles,
    biomarkers,
    motionState,
    prevMotionState,
    feedback,
    processMotionData,
    resetMotionState
  };
};
