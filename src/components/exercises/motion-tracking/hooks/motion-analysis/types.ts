
import * as Human from '@vladmandic/human';
import { BodyAngles, FeedbackMessage, MotionState } from '@/components/exercises/posture-monitor/types';

export interface MotionAnalysisState {
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  currentMotionState: MotionState;
  prevMotionState: MotionState;
  feedback: FeedbackMessage;
}

export interface MotionAnalysisResult {
  repCompleted: boolean;
  isGoodForm: boolean;
}

export interface UseMotionAnalysisReturn {
  // State
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  motionState: MotionState;
  prevMotionState: MotionState;
  feedback: FeedbackMessage;
  
  // Actions
  processMotionData: (
    detectionResult: Human.Result | null,
    angles: BodyAngles,
    biomarkers: Record<string, any>
  ) => MotionAnalysisResult;
  resetMotionState: () => void;
}

export interface UseMotionStateReturn {
  motionState: MotionState;
  prevMotionState: MotionState;
  updateMotionState: (newState: MotionState) => void;
  resetMotionState: () => void;
}

export interface UseFeedbackReturn {
  feedback: FeedbackMessage;
  updateFeedback: (message: string | null, type: string) => void;
}
