
import { useState, useCallback } from 'react';
import { SquatState, FeedbackType } from './types';
import { analyzeSquatForm } from './utils/squatAnalysisUtils';
import { PoseAnalysis, PoseFeedback, PoseStats } from './poseDetectionTypes';
import * as posenet from '@tensorflow-models/posenet';
import { toast } from '@/hooks/use-toast';

interface UsePoseAnalysisProps {
  pose: posenet.Pose | null;
}

export interface UsePoseAnalysisResult {
  analysis: PoseAnalysis;
  stats: PoseStats;
  feedback: PoseFeedback;
  updatePoseAnalysis: (pose: posenet.Pose) => void;
  resetAnalysisSession: () => void;
}

export const usePoseAnalysis = ({ pose }: UsePoseAnalysisProps): UsePoseAnalysisResult => {
  // Analysis states
  const [currentSquatState, setCurrentSquatState] = useState<SquatState>(SquatState.STANDING);
  const [prevSquatState, setPrevSquatState] = useState<SquatState>(SquatState.STANDING);
  const [kneeAngle, setKneeAngle] = useState<number | null>(null);
  const [hipAngle, setHipAngle] = useState<number | null>(null);
  
  // Performance tracking states
  const [accuracy, setAccuracy] = useState(75); // Starting value
  const [reps, setReps] = useState(0);
  const [incorrectReps, setIncorrectReps] = useState(0);
  
  // Feedback states
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.INFO);

  // Update analysis based on pose data
  const updatePoseAnalysis = useCallback((detectedPose: posenet.Pose) => {
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
    setFeedback(analysisResult.feedback.message);
    setFeedbackType(analysisResult.feedback.type);
    
    // Update rep count and accuracy if a rep was completed
    if (analysisResult.repComplete && analysisResult.evaluation) {
      const { isGoodForm } = analysisResult.evaluation;
      
      if (isGoodForm) {
        setReps(prev => prev + 1);
        setAccuracy(prev => Math.min(prev + 2, 100));
        
        toast({
          title: "Rep Completed",
          description: "Great form! Keep going!",
        });
      } else {
        setIncorrectReps(prev => prev + 1);
        setAccuracy(prev => Math.max(prev - 5, 50));
      }
    }
  }, [currentSquatState, prevSquatState]);

  // Reset session function to clear stats and state
  const resetAnalysisSession = useCallback(() => {
    setReps(0);
    setIncorrectReps(0);
    setCurrentSquatState(SquatState.STANDING);
    setPrevSquatState(SquatState.STANDING);
    setFeedback("Session reset. Ready to start squatting!");
    setFeedbackType(FeedbackType.INFO);
    setAccuracy(75);
    
    toast({
      title: "Session Reset",
      description: "Your workout session has been reset. Ready to start new exercises!",
    });
  }, []);

  return {
    analysis: {
      kneeAngle,
      hipAngle,
      currentSquatState
    },
    stats: {
      accuracy,
      reps,
      incorrectReps
    },
    feedback: {
      message: feedback,
      type: feedbackType
    },
    updatePoseAnalysis,
    resetAnalysisSession
  };
};
