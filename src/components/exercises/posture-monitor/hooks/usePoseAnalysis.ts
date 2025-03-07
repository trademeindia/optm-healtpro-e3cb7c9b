import { useState, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from '../types';
import { analyzeSquatForm } from '../utils/poseAnalysis';

interface UsePoseAnalysisProps {
  currentSquatState: SquatState;
  prevSquatState: SquatState;
  setCurrentSquatState: (state: SquatState) => void;
  setPrevSquatState: (state: SquatState) => void;
  updateMetricsForGoodRep: () => void;
  updateMetricsForBadRep: () => void;
  setFeedback: (message: string, type: FeedbackType) => void;
}

export const usePoseAnalysis = ({
  currentSquatState,
  prevSquatState,
  setCurrentSquatState,
  setPrevSquatState,
  updateMetricsForGoodRep,
  updateMetricsForBadRep,
  setFeedback
}: UsePoseAnalysisProps) => {
  const [kneeAngle, setKneeAngle] = useState<number | null>(null);
  const [hipAngle, setHipAngle] = useState<number | null>(null);
  
  const analyzePose = useCallback((detectedPose: posenet.Pose) => {
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
    setFeedback(analysisResult.feedback.message, analysisResult.feedback.type);
    
    // Update rep count and accuracy if a rep was completed
    if (analysisResult.repComplete && analysisResult.evaluation) {
      const { isGoodForm } = analysisResult.evaluation;
      
      if (isGoodForm) {
        updateMetricsForGoodRep();
      } else {
        updateMetricsForBadRep();
      }
    }
  }, [
    currentSquatState, 
    prevSquatState, 
    setPrevSquatState, 
    setCurrentSquatState, 
    setFeedback, 
    updateMetricsForGoodRep, 
    updateMetricsForBadRep
  ]);
  
  return {
    analysis: {
      kneeAngle,
      hipAngle,
      currentSquatState
    },
    analyzePose
  };
};
