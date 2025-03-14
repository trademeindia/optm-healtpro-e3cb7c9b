
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';

// Define the Patient interface that matches all requirements
export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  condition: string;
  lastVisit: string;
  nextVisit: string; // Required by the patients/types Patient
  nextAppointment: string; // Required for our local usage
  status: string; // Required for our local usage
  icdCode: string;
  medicalRecords?: any[];
  biomarkers?: any[];
  isSample?: boolean;
}

export function usePatientData() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Function to refresh patient data with better error handling
  const refreshPatientData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Load patients from localStorage
      const storedPatients = getFromLocalStorage('patients');
      
      // Load sample data if no patients exist (first time only)
      if (storedPatients.length === 0) {
        // Import sample data from the patients page
        const { samplePatients } = await import('@/pages/patients/data/samplePatients');
        
        // Mark them as sample data and ensure they have all required properties
        const markedSamplePatients = samplePatients.map(patient => ({
          ...patient,
          nextAppointment: patient.nextVisit || 'Not scheduled',
          status: patient.status || 'active',
          isSample: true
        }));
        
        // Store sample patients
        markedSamplePatients.forEach(patient => {
          storeInLocalStorage('patients', patient);
        });
        
        setPatients(markedSamplePatients);
      } else {
        console.log('Loaded patients from storage:', storedPatients.length);
        // Ensure all stored patients have the required fields
        const validPatients = storedPatients.map((patient: any) => ({
          ...patient,
          nextAppointment: patient.nextVisit || patient.nextAppointment || 'Not scheduled',
          status: patient.status || 'active',
          // Ensure nextVisit is always present
          nextVisit: patient.nextVisit || patient.nextAppointment || 'Not scheduled'
        }));
        setPatients(validPatients);
      }
      
      toast.success("Patient data loaded", { 
        description: "Latest patient information is ready",
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
  }, []);
  
  const handleViewPatient = (patientId: number) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    } else {
      toast.error("Patient not found", {
        description: "Could not find the selected patient",
        duration: 3000
      });
    }
  };
  
  const handleClosePatientHistory = () => {
    setSelectedPatient(null);
  };
  
  // Handle patient update with proper sync
  const handlePatientUpdate = async (updatedPatient: Patient) => {
    if (!updatedPatient) {
      toast.error("Invalid patient data", {
        description: "Cannot update with empty data",
        duration: 3000
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Store the updated patient
      storeInLocalStorage('patients', updatedPatient);
      
      // Update the local state
      setPatients(prevPatients => 
        prevPatients.map(p => 
          p.id === updatedPatient.id ? updatedPatient : p
        )
      );
      
      // Update the selected patient
      setSelectedPatient(updatedPatient);
      
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
  
  const handleAddPatient = (newPatient: Partial<Patient>) => {
    try {
      const patientWithId = {
        ...newPatient,
        id: Date.now(),
        lastVisit: new Date().toISOString().split('T')[0], // Set today's date as default
        status: newPatient.status || 'active',
        nextAppointment: newPatient.nextAppointment || 'Not scheduled',
        // Ensure nextVisit is always present
        nextVisit: newPatient.nextVisit || 'Not scheduled',
        icdCode: newPatient.icdCode || 'N/A'
      } as Patient;
      
      // Store the new patient
      storeInLocalStorage('patients', patientWithId);
      
      // Update the local state
      setPatients(prev => [...prev, patientWithId]);
      
      toast.success("Patient added successfully", {
        description: "New patient record has been created",
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient", {
        description: "Please try again or contact support",
        duration: 5000
      });
      return false;
    }
  };

  // Auto-refresh patient data when tab is shown
  useEffect(() => {
    refreshPatientData();
  }, [refreshPatientData]);

  return {
    patients,
    selectedPatient,
    isLoading,
    hasError,
    handleViewPatient,
    handleClosePatientHistory,
    handlePatientUpdate,
    handleAddPatient,
    refreshPatientData
  };
}
