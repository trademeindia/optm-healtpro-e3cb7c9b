
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
  biomarkers?: any[];
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

export interface PatientsLayoutProps {
  children: React.ReactNode;
}

export interface PatientSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddPatient: () => void;
}

export interface PatientTableProps {
  patients: Patient[];
  filteredCount: number;
  totalCount: number;
  onViewPatient: (patientId: number) => void;
  onScheduleAppointment: (patientId: number) => void;
  onViewOptions: (patientId: number) => void;
}

export interface PatientTableRowProps {
  patient: Patient;
  onViewPatient: (patientId: number) => void;
  onScheduleAppointment: (patientId: number) => void;
  onViewOptions: (patientId: number) => void;
}

export interface PatientTablePaginationProps {
  filteredCount: number;
  totalCount: number;
}
