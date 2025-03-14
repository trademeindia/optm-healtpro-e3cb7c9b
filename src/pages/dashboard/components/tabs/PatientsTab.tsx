
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Plus } from 'lucide-react';
import PatientHistory from '@/components/dashboard/PatientHistory';
import { PatientsList } from '@/pages/patients/components/PatientsList';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { v4 as uuidv4 } from 'uuid';
import AddPatientDialog from './overview/AddPatientDialog';

// Define a extended Patient interface that matches the PatientsTab needs
// This ensures compatibility with the various interfaces in the app
interface DashboardPatient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  condition: string;
  lastVisit: string;
  nextVisit: string;
  icdCode: string;
  status: string;
  nextAppointment?: string; // Optional to accommodate different formats
  biomarkers?: any[];
  medicalRecords?: any[];
  isSample?: boolean; // For sample data marking
}

const PatientsTab: React.FC = () => {
  const [patients, setPatients] = useState<DashboardPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<DashboardPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  
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
        
        // Mark them as sample data and make sure they conform to our DashboardPatient type
        const markedSamplePatients = samplePatients.map(patient => ({
          ...patient,
          isSample: true,
          status: 'active', // Adding the required status field
          nextAppointment: patient.nextVisit // Using nextVisit as nextAppointment
        }));
        
        // Store sample patients
        markedSamplePatients.forEach(patient => {
          storeInLocalStorage('patients', patient);
        });
        
        setPatients(markedSamplePatients as DashboardPatient[]);
      } else {
        console.log('Loaded patients from storage:', storedPatients.length);
        // Ensure loaded patients match our required interface
        const formattedPatients = storedPatients.map((patient: any) => ({
          ...patient,
          status: patient.status || 'active',
          nextAppointment: patient.nextAppointment || patient.nextVisit
        }));
        setPatients(formattedPatients);
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
  
  // Auto-refresh patient data when tab is shown
  useEffect(() => {
    refreshPatientData();
  }, [refreshPatientData]);
  
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
  const handlePatientUpdate = async (updatedPatient: DashboardPatient) => {
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
  
  const handleAddPatient = (newPatient: Partial<DashboardPatient>) => {
    try {
      const patientWithId = {
        ...newPatient,
        id: Date.now(),
        lastVisit: new Date().toISOString().split('T')[0],
        status: 'active',
        icdCode: newPatient.icdCode || 'N/A',
        nextAppointment: newPatient.nextVisit || 'Not scheduled',
        nextVisit: newPatient.nextVisit || 'Not scheduled'
      } as DashboardPatient;
      
      // Store the new patient
      storeInLocalStorage('patients', patientWithId);
      
      // Update the local state
      setPatients(prev => [...prev, patientWithId]);
      
      toast.success("Patient added successfully", {
        description: "New patient record has been created",
        duration: 3000
      });
      
      setShowAddPatient(false);
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient", {
        description: "Please try again or contact support",
        duration: 5000
      });
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
          onClick={() => refreshPatientData()}
        >
          Try Again
        </button>
      </div>
    );
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
          patient={selectedPatient as any} 
          onClose={handleClosePatientHistory}
          onUpdate={handlePatientUpdate as any}
        />
      ) : (
        <PatientsList 
          patients={patients as any[]} 
          onViewPatient={handleViewPatient}
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

export default PatientsTab;
