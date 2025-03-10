
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import PatientHistory from '@/components/dashboard/PatientHistory';
import { PatientsList } from '@/pages/patients/components/PatientsList';
import { Spinner } from '@/components/ui/spinner';

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
  const [hasError, setHasError] = useState(false);
  
  // Function to refresh patient data with better error handling
  const refreshPatientData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // In a real app, this would call an API or invalidate queries
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if patients data exists and has items
      if (!patients || patients.length === 0) {
        setHasError(true);
        throw new Error("No patient data available");
      }
      
      toast.success("Patient data refreshed", { 
        description: "Latest patient information loaded",
        duration: 3000
      });
    } catch (error) {
      console.error("Error refreshing patient data:", error);
      setHasError(true);
      toast.error("Failed to refresh data", {
        description: "Please try again or contact support",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  }, [patients]);
  
  // Auto-refresh patient data when tab is shown
  useEffect(() => {
    refreshPatientData();
    return () => {};
  }, [refreshPatientData]);
  
  // Handle patient update with proper sync
  const handlePatientUpdate = async (patient: any) => {
    if (!patient) {
      toast.error("Invalid patient data", {
        description: "Cannot update with empty data",
        duration: 3000
      });
      return;
    }
    
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state
  if (isLoading && !selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">Loading patient data...</p>
      </div>
    );
  }
  
  // Show error state if there's an issue and no selected patient
  if (hasError && !selectedPatient && (!patients || patients.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Could not load patients</h3>
        <p className="text-muted-foreground mb-4">There was a problem loading the patient data</p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={refreshPatientData}
        >
          Try Again
        </button>
      </div>
    );
  }
  
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
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default PatientsTab;
