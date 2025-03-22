
import { useState, useEffect } from 'react';
import { FeedbackType, SquatState } from '../types';

interface OpenSimAnalysisProps {
  pose: any;
  currentSquatState: SquatState;
  setFeedback: (message: string, type: FeedbackType) => void;
  modelParams: {
    height: number;
    weight: number;
    age: number;
    gender: string;
  };
}

interface AnalysisResult {
  jointLoads: {
    knees: number;
    lowerBack: number;
    ankles: number;
  };
  muscleActivation: {
    quadriceps: number;
    hamstrings: number;
    gluteus: number;
    calves: number;
  };
  feedback: string;
}

export const useOpenSimAnalysis = ({
  pose,
  currentSquatState,
  setFeedback,
  modelParams
}: OpenSimAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastProcessedPose, setLastProcessedPose] = useState<any>(null);

  // Process pose data when relevant
  useEffect(() => {
    // Skip if no pose data or same pose as before
    if (!pose || pose === lastProcessedPose) {
      return;
    }

    // Only analyze at specific squat states for better performance
    if (currentSquatState !== SquatState.BOTTOM_SQUAT && currentSquatState !== SquatState.MID_SQUAT) {
      return;
    }

    const analyzePose = async () => {
      try {
        setIsAnalyzing(true);
        setAnalysisError(null);

        // Mock OpenSim analysis - in a real app, this would call the OpenSim API
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate mock analysis result based on squat state and pose
        const result: AnalysisResult = {
          jointLoads: {
            knees: currentSquatState === SquatState.BOTTOM_SQUAT ? 
              Math.round(modelParams.weight * 2.5) : 
              Math.round(modelParams.weight * 1.7),
            lowerBack: currentSquatState === SquatState.BOTTOM_SQUAT ? 
              Math.round(modelParams.weight * 2.1) : 
              Math.round(modelParams.weight * 1.3),
            ankles: Math.round(modelParams.weight * 1.2)
          },
          muscleActivation: {
            quadriceps: currentSquatState === SquatState.BOTTOM_SQUAT ? 0.85 : 0.65,
            hamstrings: currentSquatState === SquatState.BOTTOM_SQUAT ? 0.75 : 0.45,
            gluteus: currentSquatState === SquatState.BOTTOM_SQUAT ? 0.9 : 0.6,
            calves: 0.4
          },
          feedback: currentSquatState === SquatState.BOTTOM_SQUAT ?
            "High quadriceps and gluteus activation observed. Knee load is within normal range." :
            "Moderate muscle activation detected. Continue through full range of motion for optimal results."
        };

        setAnalysisResult(result);
        setLastProcessedPose(pose);

        // Update feedback based on analysis
        if (currentSquatState === SquatState.BOTTOM_SQUAT) {
          setFeedback(
            "Biomechanical analysis shows good muscle engagement. Keep your form!", 
            FeedbackType.SUCCESS
          );
        }
      } catch (error) {
        console.error("Error in OpenSim analysis:", error);
        setAnalysisError("Failed to analyze biomechanics. Please try again.");
        setFeedback("Could not analyze biomechanics data", FeedbackType.WARNING);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzePose();
  }, [pose, currentSquatState, modelParams, setFeedback, lastProcessedPose]);

  return {
    analysisResult,
    isAnalyzing,
    analysisError
  };
};
