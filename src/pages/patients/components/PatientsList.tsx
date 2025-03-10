
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PatientsListProps } from '../types';
import { PatientStatistics } from './PatientStatistics';
import { PatientSearchBar } from './PatientSearchBar';
import { PatientTable } from './PatientTable';
import NewPatientDialog from './NewPatientDialog';

export const PatientsList: React.FC<PatientsListProps> = ({ 
  patients, 
  onViewPatient,
  onAddPatient 
}) => {
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
    if (onAddPatient) {
      onAddPatient(patientData);
    }
    
    toast({
      title: "Patient Added",
      description: `${patientData.name} has been added to your patient records.`,
    });
  };

  const handleScheduleAppointment = (patientId: number) => {
    toast({
      title: "Schedule Appointment",
      description: "Opening appointment scheduler",
    });
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
        <PatientSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddPatient={handleAddPatient}
        />
        
        <PatientTable
          patients={filteredPatients}
          filteredCount={filteredPatients.length}
          totalCount={patients.length}
          onViewPatient={onViewPatient}
          onScheduleAppointment={handleScheduleAppointment}
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
