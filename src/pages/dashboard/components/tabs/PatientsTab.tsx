
import React from 'react';
import PatientHistory from '@/components/dashboard/PatientHistory';
import PatientRecords from '@/components/dashboard/PatientRecords';

interface PatientsTabProps {
  patients: any[];
  selectedPatient: any;
  onViewPatient: (patientId: number) => void;
  onClosePatientHistory: () => void;
  onUpdatePatient: (patient: any) => void;
}

const PatientsTab: React.FC<PatientsTabProps> = ({
  patients,
  selectedPatient,
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

export default PatientsTab;
