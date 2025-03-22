
export interface JointAngle {
  joint: string;
  angle: number;
  timestamp: number;
}

export interface MotionAnalysisSession {
  id: string;
  patientId: string;
  type: string;
  measurementDate: string;
  duration: number;
  jointAngles: JointAngle[];
  notes?: string;
}

export enum SquatState {
  STANDING = 'standing',
  DESCENDING = 'descending',
  BOTTOM = 'bottom',
  ASCENDING = 'ascending'
}

export interface PoseAnalysis {
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  reps: number;
  formErrors: string[];
}

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
}
