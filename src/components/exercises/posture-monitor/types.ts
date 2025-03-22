
// Exercise analysis state
export enum SquatState {
  STANDING = 'standing',
  MID_SQUAT = 'descending',  // Previously 'descending'
  BOTTOM_SQUAT = 'bottom',   // Previously 'bottom'
  ASCENDING = 'ascending',
  UNKNOWN = 'unknown'
}

// Feedback types
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Human detection status from Human.js
export interface HumanDetectionStatus {
  isActive: boolean;
  fps: number | null;
  confidence: number | null;
}

// Add missing TrackingStats interface
export interface TrackingStats {
  reps: number;
  incorrectReps: number;
  accuracy: number;
}

// Add missing RepEvaluation interface
export interface RepEvaluation {
  isGoodForm: boolean;
  feedback: string;
  feedbackType: FeedbackType;
  score: number;
}

// OpenSim Analysis Result interface
export interface OpenSimAnalysisResult {
  jointForces: {
    knee: number | null;
    hip: number | null;
    ankle: number | null;
  };
  muscleTension: {
    quadriceps: number | null;
    hamstrings: number | null;
    calves: number | null;
  };
  recommendations: string[];
  safetyScore: number;
}

// Custom feedback interface
export interface CustomFeedback {
  message: string;
  type: FeedbackType;
}

// Video Status interface
export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: { width: number; height: number } | null;
  lastCheckTime: number;
  errorCount: number;
  hasStarted?: boolean;
  error?: string | null;
}

// Renderer props
export interface RendererProps {
  pose: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  config: any;
}
