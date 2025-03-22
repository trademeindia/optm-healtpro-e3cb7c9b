
import { useState, useEffect, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { openSimService, OpenSimAnalysisResult, OpenSimModelParams } from '@/services/opensim/opensimService';
import { SquatState, FeedbackType } from '../types';

interface UseOpenSimAnalysisProps {
  pose: posenet.Pose | null;
  currentSquatState: SquatState;
  setFeedback: (message: string, type: FeedbackType) => void;
  modelParams?: OpenSimModelParams;
}

export const useOpenSimAnalysis = ({
  pose, 
  currentSquatState,
  setFeedback,
  modelParams = {
    height: 175, // Default height in cm
    weight: 70,  // Default weight in kg
    age: 30,     // Default age
    gender: 'male' // Default gender
  }
}: UseOpenSimAnalysisProps) => {
  const [analysisResult, setAnalysisResult] = useState<OpenSimAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Only run analysis when in the bottom position of the squat to avoid excessive API calls
  const shouldAnalyze = currentSquatState === SquatState.BOTTOM_SQUAT;
  
  // Process OpenSim results and provide feedback
  const processResults = useCallback((results: OpenSimAnalysisResult) => {
    // Extract form assessment
    const { formAssessment } = results;
    
    // Format feedback message
    if (formAssessment.issues.length > 0) {
      // If issues were found, display them with recommendations
      const issuesList = formAssessment.issues.join(', ');
      const recommendationsList = formAssessment.recommendations.join(' ');
      
      const feedbackMessage = `Biomechanical analysis: ${issuesList}. ${recommendationsList}`;
      
      // Determine feedback type based on score
      const feedbackType = formAssessment.overallScore > 70 
        ? FeedbackType.INFO 
        : FeedbackType.WARNING;
      
      setFeedback(feedbackMessage, feedbackType);
    } else {
      // If no issues, provide positive feedback
      setFeedback(
        `Great form! Biomechanical analysis shows optimal joint angles and muscle activation.`,
        FeedbackType.SUCCESS
      );
    }
  }, [setFeedback]);
  
  // Run the analysis when pose data is available and we're in the bottom squat position
  useEffect(() => {
    let isActive = true;
    
    const runAnalysis = async () => {
      if (!pose || !shouldAnalyze || isAnalyzing) return;
      
      try {
        setIsAnalyzing(true);
        setAnalysisError(null);
        
        const result = await openSimService.analyzePose({
          poseKeypoints: pose.keypoints,
          modelParams,
          exerciseType: 'squat',
          currentState: currentSquatState
        });
        
        if (isActive) {
          setAnalysisResult(result);
          processResults(result);
        }
      } catch (error) {
        console.error('Error in OpenSim analysis:', error);
        if (isActive) {
          setAnalysisError('Failed to complete biomechanical analysis');
        }
      } finally {
        if (isActive) {
          setIsAnalyzing(false);
        }
      }
    };
    
    runAnalysis();
    
    return () => {
      isActive = false;
    };
  }, [pose, shouldAnalyze, isAnalyzing, modelParams, currentSquatState, processResults]);
  
  return {
    analysisResult,
    isAnalyzing,
    analysisError
  };
};
