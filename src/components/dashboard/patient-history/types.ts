
export interface MedicalRecord {
  id: string;
  type: 'xray' | 'bloodTest' | 'medication' | 'notes';
  title: string;
  date: string;
  details: string;
  fileUrl?: string;
  fileSize?: string;
}

export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'low' | 'normal' | 'elevated' | 'critical';
  timestamp: string;
}

export interface PatientData {
  id: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  condition: string;
  icdCode: string;
  lastVisit: string;
  nextVisit: string;
  medicalRecords?: MedicalRecord[];
  biomarkers?: Biomarker[];
}

export interface PatientHistoryProps {
  patient: PatientData;
  onClose: () => void;
  onUpdate: (updatedPatient: PatientData) => void;
}
