
/**
 * Types for the Human.js integration
 */

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
