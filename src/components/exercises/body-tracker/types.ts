
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

export interface DetectionQualityIndicatorProps {
  quality: number; // 0-100
}

export interface PerformanceModeSelectorProps {
  currentMode: 'high' | 'balanced' | 'low';
  onChange: (mode: 'high' | 'balanced' | 'low') => void;
  disabled?: boolean;
}
