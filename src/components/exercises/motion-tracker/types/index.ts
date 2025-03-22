
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export type ExerciseType = 'squat' | 'lunge' | 'pushup';

export interface MotionTrackerProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

export interface HumanDetectionStatus {
  isActive: boolean;
  fps: number | null;
  confidence: number | null;
}

export interface MotionAnalysisStats {
  repetitions: number;
  accuracy: number;
  lastRepQuality?: number;
}
