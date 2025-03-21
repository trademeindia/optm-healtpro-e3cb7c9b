
export enum FeedbackType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export enum ExerciseType {
  SQUAT = "squat",
  LUNGE = "lunge",
  PUSHUP = "pushup",
  PLANK = "plank",
  SHOULDER_PRESS = "shoulder_press",
  LATERAL_RAISE = "lateral_raise"
}

export interface KeyPoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

export interface Pose {
  keypoints: KeyPoint[];
  score: number;
}

export interface ExerciseForm {
  name: string;
  type: ExerciseType;
  keyAngles: {
    [key: string]: {
      joints: [string, string, string]; // The three joints that form the angle
      idealRange: [number, number]; // Min and max acceptable angles
    }
  };
  posture: {
    // Specific alignment requirements for the exercise
    [key: string]: {
      description: string;
      checkFunction: string; // Name of the function that checks this posture rule
    }
  };
}

export interface DetectionConfig {
  modelType: "MoveNet" | "PoseNet";
  scoreThreshold: number;
  maxPoses: number;
  enableTracking: boolean;
}

export interface ExerciseMetrics {
  reps: number;
  correctReps: number;
  incorrectReps: number;
  accuracy: number;
  rangeOfMotion: {
    average: number;
    min: number;
    max: number;
  };
  formErrors: {
    [key: string]: number; // Error type and count
  };
  sessionDuration: number;
}

export interface FeedbackMessage {
  message: string;
  type: FeedbackType;
  timestamp: number;
}

export interface PerformanceData {
  date: string;
  accuracy: number;
  reps: number;
  duration: number;
  exerciseType: ExerciseType;
}

export interface SessionSummary {
  exerciseType: ExerciseType;
  metrics: ExerciseMetrics;
  feedback: FeedbackMessage[];
  timestamp: number;
}
