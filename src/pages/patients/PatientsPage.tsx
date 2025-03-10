
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
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
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
    // Update patient in our state
    setPatients(prevPatients => 
      prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
    
    // In a real app, this would update the patient data in your backend
    console.log("Patient updated:", updatedPatient);
  };
  
  const handleAddPatient = (newPatient: Patient) => {
    // Add the new patient to our state
    setPatients(prevPatients => [...prevPatients, newPatient]);
    
    // In a real app, this would add the patient data to your backend
    console.log("Patient added:", newPatient);
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
          onAddPatient={handleAddPatient}
        />
      )}
    </PatientsLayout>
  );
};

export default PatientsPage;
