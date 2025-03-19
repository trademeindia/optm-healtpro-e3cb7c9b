
export interface RecordItem {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  isReport?: boolean;
  patientId: string; // Add this field to fix the type error
}

export interface FilteredState {
  filteredRecords: RecordItem[];
  filteredReports: RecordItem[];
}
