
export interface MedicalRecord {
  id: string;
  patientId: string;
  name: string;
  date: string;
  type: string;
  recordType?: string;
  notes?: string;
  fileId?: string;
  timestamp: string;
}

export interface MedicalReport {
  id: string;
  patientId?: string;
  title: string;
  date: string;
  fileType: string;
  fileSize: string;
  fileId?: string;
}

export interface RecordItem {
  id: string;
  name: string;
  date: string;
  type: string;
  isReport?: boolean;
}
