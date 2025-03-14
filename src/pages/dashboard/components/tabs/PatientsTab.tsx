
import React from 'react';
import PatientsView from './patients/PatientsView';
import { usePatientData } from './patients/usePatientData';

const PatientsTab: React.FC = () => {
  const {
    patients,
    selectedPatient,
    isLoading,
    hasError,
    handleViewPatient,
    handleClosePatientHistory,
    handlePatientUpdate,
    handleAddPatient,
    refreshPatientData
  } = usePatientData();
  
  return (
    <PatientsView
      patients={patients}
      selectedPatient={selectedPatient}
      isLoading={isLoading}
      hasError={hasError}
      onViewPatient={handleViewPatient}
      onClosePatientHistory={handleClosePatientHistory}
      onUpdatePatient={handlePatientUpdate}
      onAddPatient={handleAddPatient}
      onRefreshData={refreshPatientData}
    />
  );
};

export default PatientsTab;
