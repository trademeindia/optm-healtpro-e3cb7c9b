
// Joint angle measurement type
export interface JointAngle {
  joint: string;
  angle: number;
  timestamp: number;
}

// Motion analysis session type
export interface MotionAnalysisSession {
  id?: string;
  patientId: string;
  doctorId: string;
  notes: string;
  type: string;
  customType?: string;
  status: string;
  jointAngles: JointAngle[];
  measurementDate: string;
  targetJoints: string[];
  duration: number;
}

// Define a type that maps our MotionAnalysisSession to the format expected by Supabase
export type MotionAnalysisSessionDB = {
  id?: string;
  patient_id: string;
  doctor_id: string;
  notes: string;
  type: string;
  custom_type?: string;
  status: string;
  joint_angles: JointAngle[];
  measurement_date: string;
  target_joints: string[];
  duration: number;
  created_at?: string;
  updated_at?: string;
}

// Helper function to convert our application model to the DB model
export function toDbModel(session: MotionAnalysisSession): MotionAnalysisSessionDB {
  return {
    id: session.id,
    patient_id: session.patientId,
    doctor_id: session.doctorId,
    notes: session.notes,
    type: session.type,
    custom_type: session.customType,
    status: session.status,
    joint_angles: session.jointAngles,
    measurement_date: session.measurementDate,
    target_joints: session.targetJoints,
    duration: session.duration
  };
}

// Helper function to convert DB model to our application model
export function fromDbModel(dbSession: MotionAnalysisSessionDB): MotionAnalysisSession {
  return {
    id: dbSession.id,
    patientId: dbSession.patient_id,
    doctorId: dbSession.doctor_id,
    notes: dbSession.notes,
    type: dbSession.type,
    customType: dbSession.custom_type,
    status: dbSession.status,
    jointAngles: dbSession.joint_angles,
    measurementDate: dbSession.measurement_date,
    targetJoints: dbSession.target_joints,
    duration: dbSession.duration
  };
}

// Keypoint position type
export type KeypointPosition = [number, number];

// Human pose keypoints type
export interface HumanPoseKeypoints {
  nose: KeypointPosition;
  leftEye: KeypointPosition;
  rightEye: KeypointPosition;
  leftEar: KeypointPosition;
  rightEar: KeypointPosition;
  leftShoulder: KeypointPosition;
  rightShoulder: KeypointPosition;
  leftElbow: KeypointPosition;
  rightElbow: KeypointPosition;
  leftWrist: KeypointPosition;
  rightWrist: KeypointPosition;
  leftHip: KeypointPosition;
  rightHip: KeypointPosition;
  leftKnee: KeypointPosition;
  rightKnee: KeypointPosition;
  leftAnkle: KeypointPosition;
  rightAnkle: KeypointPosition;
  leftFoot: KeypointPosition;
  rightFoot: KeypointPosition;
}
