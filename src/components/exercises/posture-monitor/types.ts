
// Enum for motion state
export enum MotionState {
  STANDING = 'STANDING',
  MID_MOTION = 'MID_MOTION',
  FULL_MOTION = 'FULL_MOTION'
}

// Enum for feedback type
export enum FeedbackType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

// Enum for squat state (legacy)
export enum SquatState {
  STANDING = 'STANDING',
  DESCENDING = 'DESCENDING',
  BOTTOM = 'BOTTOM',
  ASCENDING = 'ASCENDING'
}

// Detection status for monitoring detection performance
export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints: number;
  lastDetectionTime: number;
}

// Posture check result
export interface PostureCheckResult {
  isGoodPosture: boolean;
  message: string;
}

// Motion stats
export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  lastUpdated?: number;
}

// Body angle measurements
export interface BodyAngles {
  kneeAngle: number | null;
  hipAngle: number | null;
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
}

// Feedback message
export interface FeedbackMessage {
  message: string | null;
  type: FeedbackType;
}
