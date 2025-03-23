
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';
import { DetectionResult } from '../types';

export interface MotionAnalysisState {
  result: any | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  currentMotionState: MotionState;
  prevMotionState: MotionState;
  feedback: FeedbackMessage;
}

export interface UseMotionStateReturn {
  currentMotionState: MotionState;
  prevMotionState: MotionState;
  updateMotionState: (newMotionState: MotionState) => void;
  resetMotionState: () => void;
}

export interface UseFeedbackReturn {
  feedback: FeedbackMessage;
  updateFeedback: (message: string | null, type: FeedbackType) => void;
  resetFeedback: () => void;
}

export interface UseMotionAnalysisReturn {
  result: any | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  currentMotionState: MotionState;
  prevMotionState: MotionState;
  feedback: FeedbackMessage;
  processDetectionResult: (detectionResult: DetectionResult, onRepComplete?: (isGoodForm: boolean) => void) => void;
  resetAnalysis: () => void;
}
