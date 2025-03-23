
import * as Human from '@vladmandic/human';
import { 
  BodyAngles, 
  FeedbackMessage,
  MotionState, 
  MotionStats 
} from '@/components/exercises/posture-monitor/types';

export interface DetectionResult {
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  newMotionState: MotionState;
}

export interface UseHumanDetectionReturn {
  // Detection state
  isDetecting: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  detectionError: string | null;
  
  // Motion analysis
  result: Human.Result | null;
  detectionResult: Human.Result | null;
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

export interface DetectionState {
  isDetecting: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  detectionError: string | null;
}

export interface MotionAnalysisState {
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  currentMotionState: MotionState;
  prevMotionState: MotionState;
  feedback: FeedbackMessage;
}

export interface SessionState {
  stats: MotionStats;
  sessionId: string | undefined;
}
