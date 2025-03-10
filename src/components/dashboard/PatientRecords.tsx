
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import NewPatientDialog from '@/pages/patients/components/NewPatientDialog';
import { PatientRecordsSearchBar } from './patient-records/PatientRecordsSearchBar';
import { PatientRecordsTable } from './patient-records/PatientRecordsTable';
import { PatientStatistics } from './patient-records/PatientStatistics';

interface Patient {
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

interface PatientRecordsProps {
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
}

const PatientRecords: React.FC<PatientRecordsProps> = ({ patients, onViewPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    setIsNewPatientDialogOpen(true);
  };

  const handleSavePatient = (patientData: any) => {
    // In a real app, this would add the patient to the database
    // For now, we'll just show a toast notification
    toast({
      title: "Patient Added",
      description: `${patientData.name} has been added to your patient records.`,
    });
  };

  const handleViewRecords = (patientId: number) => {
    onViewPatient(patientId);
  };

  const handleScheduleAppointment = (patientId: number) => {
    toast({
      title: "Schedule Appointment",
      description: "Opening appointment scheduler",
    });
  };

  const handleEditProfile = (patientId: number) => {
    onViewPatient(patientId);
  };

  const handleViewOptions = (patientId: number) => {
    toast({
      title: "More Options",
      description: "Opening additional options menu",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <PatientRecordsSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddPatient={handleAddPatient}
        />
        
        <PatientRecordsTable
          patients={filteredPatients}
          filteredCount={filteredPatients.length}
          totalCount={patients.length}
          onViewRecords={handleViewRecords}
          onScheduleAppointment={handleScheduleAppointment}
          onEditProfile={handleEditProfile}
          onViewOptions={handleViewOptions}
        />
      </div>
      
      <PatientStatistics patients={patients} />
      
      <NewPatientDialog 
        isOpen={isNewPatientDialogOpen}
        onOpenChange={setIsNewPatientDialogOpen}
        onSavePatient={handleSavePatient}
      />
    </div>
  );
};

export { PatientRecords };
export default PatientRecords;
