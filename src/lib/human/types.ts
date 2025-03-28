
// Enum definitions
export enum FeedbackType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum SquatState {
  STANDING = 'standing',
  DESCENDING = 'descending',
  BOTTOM = 'bottom',
  ASCENDING = 'ascending'
}

export enum MotionState {
  STANDING = 'standing',
  MID_MOTION = 'mid_motion',
  FULL_MOTION = 'full_motion'
}

// Interface definitions
export interface BodyAngles {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
}

export interface FeedbackMessage {
  message: string | null;
  type: FeedbackType;
}

export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  lastUpdated?: number;
  caloriesBurned?: number;
}

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints?: number;
  lastDetectionTime?: number;
}
