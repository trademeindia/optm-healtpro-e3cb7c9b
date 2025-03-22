
import { JointAngle, MotionAnalysisSession } from '@/types/motion-analysis';

// A simple in-memory array to store motion analysis records
const mockMotionRecords: MotionAnalysisSession[] = [
  {
    id: '1',
    patientId: '1',
    type: 'Knee Flexion',
    measurementDate: new Date().toISOString(),
    duration: 30,
    notes: 'Initial assessment of right knee mobility',
    jointAngles: [
      { joint: 'rightKnee', angle: 45.5, timestamp: Date.now() - 5000 },
      { joint: 'rightKnee', angle: 65.2, timestamp: Date.now() - 4000 },
      { joint: 'rightKnee', angle: 85.7, timestamp: Date.now() - 3000 },
      { joint: 'rightKnee', angle: 95.1, timestamp: Date.now() - 2000 },
      { joint: 'rightKnee', angle: 105.3, timestamp: Date.now() - 1000 }
    ]
  },
  {
    id: '2',
    patientId: '1',
    type: 'Shoulder Rotation',
    measurementDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    duration: 45,
    notes: 'Follow-up on shoulder rehabilitation exercises',
    jointAngles: [
      { joint: 'rightShoulder', angle: 25.8, timestamp: Date.now() - 105000 },
      { joint: 'rightShoulder', angle: 35.4, timestamp: Date.now() - 104000 },
      { joint: 'rightShoulder', angle: 55.9, timestamp: Date.now() - 103000 },
      { joint: 'rightShoulder', angle: 72.3, timestamp: Date.now() - 102000 }
    ]
  }
];

// Get all motion analysis records for a specific patient
export const getMotionRecords = async (patientId: string): Promise<MotionAnalysisSession[]> => {
  return mockMotionRecords.filter(record => record.patientId === patientId);
};

// Get a specific motion analysis record by ID
export const getMotionRecordById = async (recordId: string): Promise<MotionAnalysisSession | null> => {
  const record = mockMotionRecords.find(record => record.id === recordId);
  return record || null;
};

// Save a new motion analysis record
export const saveMotionRecord = async (record: Omit<MotionAnalysisSession, 'id'>): Promise<MotionAnalysisSession> => {
  const newRecord: MotionAnalysisSession = {
    ...record,
    id: Math.random().toString(36).substring(2, 9),
  };
  
  mockMotionRecords.push(newRecord);
  return newRecord;
};

// Update an existing motion analysis record
export const updateMotionRecord = async (
  recordId: string, 
  updates: Partial<MotionAnalysisSession>
): Promise<MotionAnalysisSession> => {
  const index = mockMotionRecords.findIndex(record => record.id === recordId);
  
  if (index === -1) {
    throw new Error(`Record with ID ${recordId} not found`);
  }
  
  // Update the record with new values
  mockMotionRecords[index] = {
    ...mockMotionRecords[index],
    ...updates,
  };
  
  return mockMotionRecords[index];
};

// Add joint angles to an existing motion analysis record
export const addJointAnglesToRecord = async (
  recordId: string, 
  jointAngles: JointAngle[]
): Promise<MotionAnalysisSession> => {
  const index = mockMotionRecords.findIndex(record => record.id === recordId);
  
  if (index === -1) {
    throw new Error(`Record with ID ${recordId} not found`);
  }
  
  // Add new joint angles to the existing ones
  mockMotionRecords[index].jointAngles = [
    ...mockMotionRecords[index].jointAngles,
    ...jointAngles
  ];
  
  return mockMotionRecords[index];
};

// Delete a motion analysis record
export const deleteMotionRecord = async (recordId: string): Promise<boolean> => {
  const initialLength = mockMotionRecords.length;
  const filteredRecords = mockMotionRecords.filter(record => record.id !== recordId);
  
  // Update our mock database
  mockMotionRecords.length = 0;
  mockMotionRecords.push(...filteredRecords);
  
  return mockMotionRecords.length < initialLength;
};
