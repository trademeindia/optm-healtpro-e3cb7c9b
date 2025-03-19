
export interface RecordItem {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  isReport?: boolean;
  patientId: string;
}

export interface MedicalRecord extends RecordItem {
  notes?: string;
  recordType?: string;
  timestamp?: string;
  fileId?: string | null;
}

export interface MedicalReport extends RecordItem {
  title: string;
  fileType?: string;
  fileSize?: string;
  fileId?: string | null;
}

export interface FilteredState {
  filteredRecords: RecordItem[];
  filteredReports: RecordItem[];
}
