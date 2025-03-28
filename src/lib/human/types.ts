
// Add necessary types for the motion tracking system

export enum MotionState {
  STANDING = 'standing',
  MID_MOTION = 'mid-motion',
  FULL_MOTION = 'full-motion',
  REST = 'rest'
}

export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface FeedbackMessage {
  message: string | null;
  type: FeedbackType;
}

export interface BodyAngles {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
}

export interface MotionBiomarkers {
  postureScore?: number | null;
  movementQuality?: number | null;
  rangeOfMotion?: number | null;
  stabilityScore?: number | null;
  symmetry?: number | null;
  balance?: number | null;
  [key: string]: number | null | undefined;
}

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints?: number;
}

export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  lastUpdated: number;
  caloriesBurned: number;
}
