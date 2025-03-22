
import { BodyResult } from '@vladmandic/human';

export interface JointAngle {
  joint: string;
  angle: number;
}

export interface BodyTrackerProps {
  onAnglesDetected?: (angles: JointAngle[]) => void;
  onSaveData?: (data: any) => void;
  isActive?: boolean;
}

export interface AngleDisplayProps {
  angles: JointAngle[];
}

export interface ExerciseSession {
  patient_id: string;
  timestamp: string;
  angles: JointAngle[];
  exercise_type: string;
  notes?: string;
}
