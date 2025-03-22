
// Define types for motion analysis

export interface JointAngle {
  joint: string;
  angle: number;
  timestamp: number;
}

export interface MotionAnalysisSession {
  id: string;
  patientId: string;
  doctorId: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  measurementDate: string;
  duration: number;
  jointAngles: JointAngle[];
  targetJoints: string[];
  customType?: string;
}

export interface AnalysisResult {
  sessionId: string;
  abnormalities: string[];
  recommendations: string[];
  comparisonToPrevious?: {
    sessionId: string;
    improvementPercentage: number;
    keyDifferences: string[];
  };
}
