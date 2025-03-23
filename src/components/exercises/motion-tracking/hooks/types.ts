
import { BodyAngles, FeedbackMessage, MotionState, MotionStats } from '@/components/exercises/posture-monitor/types';
import * as Human from '@vladmandic/human';

export interface DetectionState {
  isDetecting: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  isModelLoading?: boolean;
  detectionError: string | null;
}

export interface DetectionResult {
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  newMotionState: MotionState | null;
}

export interface UseHumanDetectionReturn {
  // Detection state
  isDetecting: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  detectionError: string | null;
  
  // Motion analysis
  result: any;
  detectionResult: any;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  currentMotionState: MotionState;
  motionState: MotionState;
  feedback: FeedbackMessage;
  
  // Session data
  stats: MotionStats;
  sessionId: string | undefined;
  
  // Actions
  startDetection: () => void;
  stopDetection: () => void;
  resetSession: () => void;
}
