
import * as Human from '@vladmandic/human';
import { BodyAngles, FeedbackMessage, MotionState, MotionStats } from '../../posture-monitor/types';

// Result from detection process
export interface DetectionResult {
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  newMotionState: MotionState | null;
}

// State of the detection service
export interface DetectionState {
  isDetecting: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  isModelLoading: boolean;
  detectionError: string | null;
  loadProgress?: number;
}

// Model loading state
export interface ModelState {
  isModelLoaded: boolean;
  isModelLoading: boolean;
  modelError: string | null;
  loadProgress: number;
}

// Return type for the useHumanDetection hook
export interface UseHumanDetectionReturn {
  // Detection state
  isDetecting: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  isModelLoading: boolean;
  loadProgress?: number;
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
