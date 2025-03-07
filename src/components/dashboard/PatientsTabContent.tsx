
import React from 'react';
import PatientHistory from '@/components/dashboard/PatientHistory';
import PatientRecords from '@/components/dashboard/PatientRecords';
import { Patient } from '@/hooks/useDashboardState';

interface PatientsTabContentProps {
  selectedPatient: Patient | null;
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
  onClosePatientHistory: () => void;
  onUpdatePatient: (patient: any) => void;
}

const PatientsTabContent: React.FC<PatientsTabContentProps> = ({
  selectedPatient,
  patients,
  onViewPatient,
  onClosePatientHistory,
  onUpdatePatient
}) => {
  return (
    <>
      {selectedPatient ? (
        <PatientHistory 
          patient={selectedPatient} 
          onClose={onClosePatientHistory}
          onUpdate={onUpdatePatient}
        />
      ) : (
        <PatientRecords 
          patients={patients} 
          onViewPatient={onViewPatient}
        />
      )}
    </>
  );
};

export default PatientsTabContent;
