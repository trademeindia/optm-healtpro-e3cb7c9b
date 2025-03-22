
// Define feedback types
export enum FeedbackType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error"
}

// Define video status interface
export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  hasStarted?: boolean; // Added for compatibility
  resolution: { width: number; height: number } | null;
  lastCheckTime: number;
  errorCount: number;
  error?: string | null; // Added for compatibility
}

// Define squat state enum
export enum SquatState {
  STANDING = "standing",
  DESCENDING = "descending",
  BOTTOM = "bottom",
  ASCENDING = "ascending",
  UNKNOWN = "unknown",
  // Add the missing states used in the code
  BOTTOM_SQUAT = "bottom_squat",
  MID_SQUAT = "mid_squat"
}

// Add TrackingStats interface that was missing
export interface TrackingStats {
  reps: number;
  incorrectReps: number;
  accuracy: number;
}

// Add RepEvaluation interface that was missing
export interface RepEvaluation {
  isGoodForm: boolean;
  feedback: string;
  score: number;
  feedbackType: FeedbackType;
}
