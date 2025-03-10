
import React, { useState, useEffect } from 'react';
import { PatientsLayout } from './components/PatientsLayout';
import { PatientsList } from './components/PatientsList';
import { PatientDetails } from './components/PatientDetails';
import { useSymptoms } from '@/contexts/SymptomContext';
import { Patient } from './types';

// Sample patient data moved to a separate file
import { samplePatients } from './data/samplePatients';

const PatientsPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [patients] = useState<Patient[]>(samplePatients);
  const { loadPatientSymptoms } = useSymptoms();
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  
  const handleViewPatient = (patientId: number) => {
    setSelectedPatientId(patientId);
    loadPatientSymptoms(patientId);
  };
  
  const handleClosePatientHistory = () => {
    setSelectedPatientId(null);
  };
  
  const handleUpdatePatient = (updatedPatient: Patient) => {
    // In a real app, this would update the patient data in your state or backend
    console.log("Patient updated:", updatedPatient);
  };
  
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientSymptoms(selectedPatientId);
    }
  }, [selectedPatientId, loadPatientSymptoms]);
  
  return (
    <PatientsLayout>
      {selectedPatientId && selectedPatient ? (
        <PatientDetails
          patient={selectedPatient}
          onClose={handleClosePatientHistory}
          onUpdate={handleUpdatePatient}
        />
      ) : (
        <PatientsList
          patients={patients}
          onViewPatient={handleViewPatient}
        />
      )}
    </PatientsLayout>
  );
};

export default PatientsPage;
