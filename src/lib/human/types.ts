
/**
 * Types for the Human.js integration
 */

import { BackendEnum, WarmupEnum } from '@vladmandic/human';

export enum FeedbackType {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum SquatState {
  STANDING = 'standing',
  DESCENDING = 'descending',
  BOTTOM = 'bottom',
  ASCENDING = 'ascending'
}

export enum MotionState {
  STANDING = 'standing',
  DESCENDING = 'descending',
  FULL_MOTION = 'full_motion',
  ASCENDING = 'ascending'
}

// Updated MotionStats to match SessionStats requirements
export interface MotionStats {
  reps: number;
  goodReps: number;
  badReps: number;
  totalReps: number; // Added to match SessionStats
  averageKneeAngle: number | null;
  averageHipAngle: number | null;
  currentMotionState: MotionState;
  startTime: number;
  duration: number;
  caloriesBurned: number;
  lastRepTime?: number;
  lastUpdated: number; // Added to match SessionStats
  accuracy: number; // Added to match SessionStats
  currentStreak: number; // Added to match SessionStats
  bestStreak: number; // Added to match SessionStats
  symmetry?: number;
  stability?: number;
  rangeOfMotion?: number;
}

export interface BodyAngles {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  elbowAngle?: number | null;
  ankleAngle?: number | null;
  neckAngle?: number | null;
}

export interface DetectionStatus {
  isDetecting: boolean;
  fps?: number | null;
  confidence?: number | null;
  detectedKeypoints?: number | null;
  lastDetectionTime?: number | null;
}

export interface MotionBiomarkers {
  symmetry: number;
  movementQuality: number;
  rangeOfMotion: number;
  stability: number;
}

export interface ExerciseStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  caloriesBurned: number;
  duration?: number;
  averageConfidence?: number;
}

export interface DetectionOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  showSkeleton?: boolean;
  onPoseDetected?: (pose: any) => void;
  onAngleUpdate?: (angles: BodyAngles) => void;
}

// Define DetectionResult interface to match what's used in useDetectionService
export interface DetectionResult {
  result: any;
  error?: string | null;
  angles?: BodyAngles;
  biomarkers?: Record<string, any>;
  newMotionState?: MotionState | null;
}
