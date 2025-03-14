
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientsList } from '@/pages/patients/components/PatientsList';
import PatientHistory from '@/components/dashboard/PatientHistory';
import AddPatientDialog from '../overview/AddPatientDialog';
import { LoadingState, ErrorState } from './PatientStates';
import { Patient } from './usePatientData';

interface PatientsViewProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  hasError: boolean;
  onViewPatient: (patientId: number) => void;
  onClosePatientHistory: () => void;
  onUpdatePatient: (patient: Patient) => void;
  onAddPatient: (patient: Partial<Patient>) => boolean;
  onRefreshData: () => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  selectedPatient,
  isLoading,
  hasError,
  onViewPatient,
  onClosePatientHistory,
  onUpdatePatient,
  onAddPatient,
  onRefreshData
}) => {
  const [showAddPatient, setShowAddPatient] = useState(false);
  
  const handleAddPatient = (newPatient: Partial<Patient>) => {
    const success = onAddPatient(newPatient);
    if (success) {
      setShowAddPatient(false);
    }
  };
  
  // Show loading state
  if (isLoading && !selectedPatient) {
    return <LoadingState />;
  }
  
  // Show error state if there's an issue and no selected patient
  if (hasError && !selectedPatient && (!patients || patients.length === 0)) {
    return <ErrorState onRetry={onRefreshData} />;
  }
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {!selectedPatient && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Patients</h2>
          <Button onClick={() => setShowAddPatient(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Patient
          </Button>
        </div>
      )}
      
      {selectedPatient ? (
        <PatientHistory 
          patient={selectedPatient} 
          onClose={onClosePatientHistory}
          onUpdate={onUpdatePatient}
        />
      ) : (
        <PatientsList 
          patients={patients as any[]} 
          onViewPatient={onViewPatient}
          isLoading={isLoading}
        />
      )}
      
      <AddPatientDialog 
        open={showAddPatient} 
        onOpenChange={setShowAddPatient}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
};

export default PatientsView;
