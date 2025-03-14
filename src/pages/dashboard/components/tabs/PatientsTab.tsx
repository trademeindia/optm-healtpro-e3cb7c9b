
import React, { useState, useEffect } from 'react';
import PatientHistory from '@/components/dashboard/PatientHistory';
import AddPatientDialog from './overview/AddPatientDialog';
import { PatientLoadingState, PatientErrorState } from './patients/PatientLoadingStates';
import { PatientListView } from './patients/PatientListView';
import { usePatientsData } from './patients/usePatientsData';

const PatientsTab: React.FC = () => {
  const [showAddPatient, setShowAddPatient] = useState(false);
  const {
    patients,
    selectedPatient,
    isLoading,
    hasError,
    refreshPatientData,
    handleViewPatient,
    handleClosePatientHistory,
    handlePatientUpdate,
    handleAddPatient
  } = usePatientsData();
  
  // Auto-refresh patient data when tab is shown
  useEffect(() => {
    refreshPatientData();
  }, [refreshPatientData]);
  
  // Handle add patient dialog
  const onAddPatientClick = () => setShowAddPatient(true);
  const onAddPatientSubmit = (newPatient: any) => {
    const success = handleAddPatient(newPatient);
    if (success) {
      setShowAddPatient(false);
    }
  };
  
  // Show loading state
  if (isLoading && !selectedPatient) {
    return <PatientLoadingState />;
  }
  
  // Show error state if there's an issue and no selected patient
  if (hasError && !selectedPatient && (!patients || patients.length === 0)) {
    return <PatientErrorState onRetry={refreshPatientData} />;
  }
  
  return (
    <>
      {selectedPatient ? (
        <PatientHistory 
          patient={selectedPatient as any} 
          onClose={handleClosePatientHistory}
          onUpdate={handlePatientUpdate as any}
        />
      ) : (
        <PatientListView
          patients={patients}
          isLoading={isLoading}
          onViewPatient={handleViewPatient}
          onAddPatient={onAddPatientClick}
        />
      )}
      
      <AddPatientDialog 
        open={showAddPatient} 
        onOpenChange={setShowAddPatient}
        onAddPatient={onAddPatientSubmit}
      />
    </>
  );
};

export default PatientsTab;
