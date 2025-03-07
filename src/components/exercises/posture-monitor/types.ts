
import * as posenet from '@tensorflow-models/posenet';

export enum SquatState {
  STANDING = 'standing',
  MID_SQUAT = 'midSquat',
  BOTTOM_SQUAT = 'bottomSquat',
}

export enum FeedbackType {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

export interface FeedbackProps {
  feedback: string | null;
  feedbackType: FeedbackType;
}

export interface StatsProps {
  accuracy: number;
  reps: number;
  incorrectReps: number;
}

export interface PostureAnalysis {
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
}
