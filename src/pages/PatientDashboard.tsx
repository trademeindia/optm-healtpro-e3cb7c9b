
import React from 'react';
import { MedicalDataProvider } from '@/contexts/MedicalDataContext';
import { SymptomProvider } from '@/contexts/SymptomContext';
import PatientDashboardContent from '@/components/patient/PatientDashboard';

const PatientDashboard: React.FC = () => {
  return (
    <MedicalDataProvider>
      <SymptomProvider>
        <PatientDashboardContent />
      </SymptomProvider>
    </MedicalDataProvider>
  );
};

export default PatientDashboard;
