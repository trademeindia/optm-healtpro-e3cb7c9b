
import * as Human from '@vladmandic/human';

// Re-export Human types for convenience
export type HumanConfig = Human.Config;
export type HumanResult = Human.Result;
export type BodyResult = Human.BodyResult;
export type BodyKeypoint = Human.BodyKeypoint;

// Detection status for UI updates
export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints?: number;
  error?: string | null;
}

// Define error types
export enum DetectionErrorType {
  MODEL_LOADING = 'MODEL_LOADING',
  CAMERA_ACCESS = 'CAMERA_ACCESS',
  DETECTION_TIMEOUT = 'DETECTION_TIMEOUT',
  INSUFFICIENT_MEMORY = 'INSUFFICIENT_MEMORY',
  UNKNOWN = 'UNKNOWN'
}

export interface DetectionError {
  type: DetectionErrorType;
  message: string;
  retryable: boolean;
}
