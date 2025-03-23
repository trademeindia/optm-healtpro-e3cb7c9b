
/**
 * Types for posture monitoring and motion tracking
 */

export enum SquatState {
  UNKNOWN = 'unknown',
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

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints: number;
  lastDetectionTime: number;
}

export interface AngleDisplayProps {
  pose: any;
  angle: number | null;
  label: string;
  keypoint: string;
  scaleX: number;
  scaleY: number;
  minPartConfidence: number;
  offsetX?: number;
  offsetY?: number;
}

export interface MotionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  accuracy: number;
}

export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: {
    width: number;
    height: number;
  } | null;
  lastCheckTime: number;
  errorCount: number;
}
