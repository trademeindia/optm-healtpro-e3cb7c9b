
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
  notes: string;
  jointAngles: JointAngle[];
  status: 'pending' | 'completed' | 'failed';
}

export interface MotionAnalysisReport {
  id: string;
  sessionId: string;
  patientId: string;
  createdAt: string;
  asymmetryScore?: number;
  stabilityScore?: number;
  rangeOfMotionScore?: number;
  overallScore?: number;
  findings?: string;
  recommendations?: string;
}
