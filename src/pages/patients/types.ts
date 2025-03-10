
export interface Patient {
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
  medicalRecords?: any[];
}

export interface PatientsListProps {
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
  onAddPatient?: (patient: Patient) => void;
}

export interface PatientDetailsProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (patient: Patient) => void;
}
