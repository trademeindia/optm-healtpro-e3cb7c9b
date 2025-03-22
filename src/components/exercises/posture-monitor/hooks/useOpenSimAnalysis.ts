
import { useState, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from '../types';
import { openSimService, OpenSimModelParams, OpenSimAnalysisResult } from '@/services/opensim/opensimService';

interface UseOpenSimAnalysisProps {
  pose: posenet.Pose | null;
  currentSquatState: SquatState;
  setFeedback: (message: string, type: FeedbackType) => void;
  modelParams: OpenSimModelParams;
}

export const useOpenSimAnalysis = ({
  pose,
  currentSquatState,
  setFeedback,
  modelParams
}: UseOpenSimAnalysisProps) => {
  const [analysisResult, setAnalysisResult] = useState<OpenSimAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);

  useEffect(() => {
    // Only analyze poses with reasonable confidence
    if (!pose || pose.score < 0.6) return;
    
    // Don't run analysis too frequently - aim for 2-3 per second max
    const now = Date.now();
    if (now - lastAnalysisTime < 500) return;
    
    const analyzeCurrentPose = async () => {
      try {
        setIsAnalyzing(true);
        setAnalysisError(null);
        
        const result = await openSimService.analyzePose({
          poseKeypoints: pose.keypoints,
          modelParams,
          exerciseType: 'squat',
          currentState: currentSquatState
        });
        
        setAnalysisResult(result);
        setLastAnalysisTime(Date.now());
        
        // Provide feedback based on the analysis result
        if (result.formAssessment && result.formAssessment.issues.length > 0) {
          // Display the first issue as feedback
          setFeedback(result.formAssessment.issues[0], FeedbackType.WARNING);
        }
      } catch (error) {
        console.error('Error in biomechanical analysis:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setAnalysisError(`Analysis failed: ${errorMessage}`);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    analyzeCurrentPose();
  }, [pose, currentSquatState, modelParams, lastAnalysisTime, setFeedback]);
  
  return {
    analysisResult,
    isAnalyzing,
    analysisError
  };
};
