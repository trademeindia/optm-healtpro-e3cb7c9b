
import type { Human, Result, Config, Tensor } from '@vladmandic/human';

export interface MotionTrackerProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

export interface MotionAnalysisResult {
  posture: {
    isCorrect: boolean;
    feedback: string;
  };
  movement: {
    repetitions: number;
    quality: number; // 0-100 percentage
    feedback: string;
  };
}

export interface TrackerStats {
  repetitions: number;
  accuracy: number;
  feedback: string;
}

export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export type ExerciseType = 'squat' | 'lunge' | string;

export interface HumanDetectionStatus {
  isActive: boolean;
  fps: number | null;
  confidence: number | null;
}

export type { Human, Result, Config, Tensor };
