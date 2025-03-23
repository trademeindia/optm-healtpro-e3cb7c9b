
import * as Human from '@vladmandic/human';

// Define motion states for exercise analysis
export enum MotionState {
  STANDING = 'standing',
  MID_MOTION = 'mid_motion',
  FULL_MOTION = 'full_motion'
}

// Define feedback types for user interface
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Body angles for joint analysis
export interface BodyAngles {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
}

// Feedback message format
export interface FeedbackMessage {
  message: string | null;
  type: FeedbackType;
}

// Motion statistics for the exercise session
export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
  currentStreak?: number;
  bestStreak?: number;
  lastUpdated?: number;
}

// Detection status for UI
export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints?: number;
}
