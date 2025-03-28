
// Motion state enum
export enum MotionState {
  STANDING = 'STANDING',
  MID_MOTION = 'MID_MOTION',
  FULL_MOTION = 'FULL_MOTION'
}

// Feedback types
export enum FeedbackType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
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

// Detection status interface
export interface DetectionStatus {
  isDetecting: boolean;
  fps?: number | null;
  confidence?: number | null;
  detectedKeypoints?: number;
  lastDetectionTime?: number;
}

// Motion statistics
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

// Feedback message interface
export interface FeedbackMessage {
  message: string | null;
  type: FeedbackType;
}

// Helper function to safely extract values from a JSON object
export function safeGetFromJson<T>(obj: any, key: string, defaultValue: T): T {
  try {
    if (!obj || typeof obj !== 'object') return defaultValue;
    return (obj[key] !== undefined && obj[key] !== null) ? obj[key] : defaultValue;
  } catch {
    return defaultValue;
  }
}
