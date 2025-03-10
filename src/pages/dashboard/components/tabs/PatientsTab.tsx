
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import PatientHistory from '@/components/dashboard/PatientHistory';
import { PatientsList } from '@/pages/patients/components/PatientsList';

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
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Function to refresh patient data
  const refreshPatientData = async () => {
    setIsLoading(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success("Patient data refreshed", { 
        description: "Latest patient information loaded",
        duration: 3000
      });
    } catch (error) {
      console.error("Error refreshing patient data:", error);
      toast.error("Failed to refresh data", {
        description: "Please try again or contact support",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-refresh patient data when tab is shown or when a patient record is updated
  useEffect(() => {
    refreshPatientData();
    
    // Set up interval for periodic data refresh (every 2 minutes)
    const intervalId = setInterval(refreshPatientData, 120000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle patient update with proper sync
  const handlePatientUpdate = async (patient: any) => {
    try {
      // Call the parent update function
      onUpdatePatient(patient);
      
      // Ensure data is resynced after update
      await refreshPatientData();
      
      // Additional success feedback
      toast.success("Patient record updated", {
        description: "Changes have been saved successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Update failed", {
        description: "Please try again or contact support",
        duration: 5000
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {selectedPatient ? (
        <PatientHistory 
          patient={selectedPatient} 
          onClose={onClosePatientHistory}
          onUpdate={handlePatientUpdate}
        />
      ) : (
        <PatientsList 
          patients={patients} 
          onViewPatient={onViewPatient}
        />
      )}
    </div>
  );
};

export default PatientsTab;
