
export enum SquatState {
  STANDING = 'standing',
  MID_SQUAT = 'mid_squat',
  BOTTOM_SQUAT = 'bottom_squat'
}

export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export interface SessionStats {
  accuracy: number;
  reps: number;
  incorrectReps: number;
}

export interface CameraState {
  isActive: boolean;
  error: string | null;
  permission: PermissionState | null;
}

export interface VideoState {
  isReady: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export interface ModelState {
  isLoading: boolean;
  error: string | null;
  model: any | null;
}

export interface DetectionConfig {
  minPoseConfidence: number;
  minPartConfidence: number;
  scoreThreshold: number;
  inputResolution: {
    width: number;
    height: number;
  };
}

export interface MonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

export interface PostureAnalysis {
  feedback: {
    message: string;
    type: FeedbackType;
  };
  kneeAngle: number | null;
  hipAngle: number | null;
  newSquatState: SquatState;
  repComplete: boolean;
  evaluation: {
    isGoodForm: boolean;
    feedback: string;
    feedbackType: FeedbackType;
  } | null;
}
