
import { useDetectionResults } from './useDetectionResults';
import { useMotionState } from './useMotionState';
import { useFeedback } from './useFeedback';
import { evaluateRepQuality } from './repDetection';
import { BodyAngles, MotionState } from '@/components/exercises/posture-monitor/types';

export const useMotionAnalysis = () => {
  const detectionResults = useDetectionResults();
  const motionState = useMotionState();
  const feedbackSystem = useFeedback();

  const processMotionData = (
    detectionResult: any,
    angles: BodyAngles,
    biomarkers: Record<string, any>
  ) => {
    // Update detection results
    detectionResults.updateResults(detectionResult, angles, biomarkers);

    // Determine motion state based on knee angle
    const kneeAngle = angles.kneeAngle;
    let newMotionState = MotionState.STANDING;
    
    if (kneeAngle && kneeAngle < 130) {
      newMotionState = MotionState.FULL_MOTION;
    } else if (kneeAngle && kneeAngle < 160) {
      newMotionState = MotionState.MID_MOTION;
    }

    // Check if a rep was completed (full motion to standing transition)
    if (motionState.currentMotionState === MotionState.FULL_MOTION && 
        newMotionState === MotionState.MID_MOTION &&
        motionState.prevMotionState === MotionState.FULL_MOTION) {
      
      // Evaluate rep quality
      const evaluation = evaluateRepQuality(angles);
      
      if (evaluation) {
        return {
          repCompleted: true,
          isGoodForm: evaluation.isGoodForm,
          feedback: evaluation.feedback,
          feedbackType: evaluation.feedbackType
        };
      }
    }

    // Update motion state
    motionState.updateMotionState(newMotionState);
    
    // Update feedback if no rep was completed
    const feedback = feedbackSystem.generateFeedback(newMotionState, angles);
    feedbackSystem.updateFeedback(feedback);
    
    return { repCompleted: false };
  };

  return {
    processMotionData,
    ...detectionResults,
    motionState: motionState.currentMotionState,
    prevMotionState: motionState.prevMotionState,
    feedback: feedbackSystem.feedback,
    updateMotionState: motionState.updateMotionState,
    resetMotionState: motionState.resetMotionState,
    updateFeedback: feedbackSystem.updateFeedback
  };
};
