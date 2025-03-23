
import * as Human from '@vladmandic/human';

// Enhanced BodyKeypoint type to ensure it always has x, y coordinates
export interface EnhancedBodyKeypoint extends Human.BodyKeypoint {
  x: number;
  y: number;
  score: number;
  name?: string;
}

// Extended Result type with additional properties
export interface EnhancedResult extends Human.Result {
  source?: {
    width: number;
    height: number;
  };
  body: Human.BodyResult[];
}

// Detection status interface
export interface DetectionStatus {
  isDetecting: boolean;
  fps: number;
  confidence: number | null;
  detectedKeypoints?: number;
  lastDetectionTime?: number;
}

// Motion analysis state
export enum MotionState {
  STANDING = 'standing',
  MID_MOTION = 'mid_motion',
  FULL_MOTION = 'full_motion'
}

// Body angles interface
export interface BodyAngles {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
}

// Feedback types
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Feedback message interface
export interface FeedbackMessage {
  message: string | null;
  type: FeedbackType;
}

// Motion statistics
export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
}

// Exercise detection config
export interface ExerciseDetectionConfig {
  minConfidence: number;
  repCountThreshold: {
    kneeAngle?: {
      min: number;
      max: number;
    };
    hipAngle?: {
      min: number;
      max: number;
    };
    shoulderAngle?: {
      min: number;
      max: number;
    };
  };
  feedbackThresholds: {
    warning: number;
    error: number;
  };
}
