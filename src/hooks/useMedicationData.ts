
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  Medication, 
  MedicationDose, 
  MedicationSummary, 
  MedicationWithSummary,
  MedicationImprovementData,
  PatientMedication 
} from '@/types/medicationData';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { useAuth } from '@/contexts/AuthContext';

// Default medications to track
const DEFAULT_MEDICATIONS = [
  { name: 'PH3-BHT', description: 'Take with water, 3 times daily', frequency: 3 },
  { name: 'PH3-JP', description: 'Take after meals, 3 times daily', frequency: 3 },
  { name: 'Foot Batch Crystal', description: 'Dissolve in warm water, 3 times daily', frequency: 3 },
  { name: 'Mornblooso', description: 'Take on empty stomach, 3 times daily', frequency: 3 }
];

export const useMedicationData = (patientId?: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [medications, setMedications] = useState<MedicationWithSummary[]>([]);
  const [improvementData, setImprovementData] = useState<MedicationImprovementData[]>([]);
  
  // Use current user's ID if no patient ID provided
  const effectivePatientId = patientId || user?.id || 'anonymous';
  
  // Function to calculate medication summary
  const calculateMedicationSummary = useCallback((medication: Medication): MedicationSummary => {
    const doses = medication.doses || [];
    const dosesTaken = doses.filter(dose => dose.status === 'taken').length;
    const dosesMissed = doses.filter(dose => dose.status === 'missed').length;
    const dosesScheduled = doses.length;
    const adherenceRate = dosesScheduled > 0 ? (dosesTaken / dosesScheduled) * 100 : 0;
    
    const sortedDoses = [...doses].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const lastTakenDose = sortedDoses.find(dose => dose.status === 'taken');
    
    return {
      adherenceRate,
      dosesScheduled,
      dosesTaken,
      dosesMissed,
      lastTaken: lastTakenDose?.timestamp
    };
  }, []);
  
  // Load medication data
  const loadMedicationData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get stored medication data
      const medicationsData = getFromLocalStorage('medications');
      const patientMedications = medicationsData.find(
        (data: PatientMedication) => data.patientId === effectivePatientId
      );
      
      if (patientMedications) {
        // Calculate summary for each medication
        const medicationsWithSummary = patientMedications.medications.map(med => ({
          ...med,
          summary: calculateMedicationSummary(med)
        }));
        
        setMedications(medicationsWithSummary);
        setImprovementData(patientMedications.improvements || []);
      } else {
        // Initialize with default medications if none exist
        initializeDefaultMedications();
      }
    } catch (error) {
      console.error('Error loading medication data:', error);
      toast.error('Failed to load medication data');
    } finally {
      setIsLoading(false);
    }
  }, [effectivePatientId, calculateMedicationSummary]);
  
  // Initialize default medications for new patients
  const initializeDefaultMedications = useCallback(() => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    
    // Create default medication entries
    const defaultMedications: Medication[] = DEFAULT_MEDICATIONS.map(med => {
      const doses: MedicationDose[] = [];
      
      // Generate 7 days of scheduled doses
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        
        for (let dose = 0; dose < med.frequency; dose++) {
          // Space doses evenly throughout the day (8am, 2pm, 8pm for 3x daily)
          const hour = 8 + (dose * (12 / med.frequency));
          date.setHours(hour, 0, 0, 0);
          
          doses.push({
            id: uuidv4(),
            medicationId: uuidv4(), // Will be replaced
            timestamp: date.toISOString(),
            status: day === 0 && dose === 0 ? 'taken' : 'scheduled'
          });
        }
      }
      
      return {
        id: uuidv4(),
        name: med.name,
        description: med.description,
        frequency: med.frequency,
        startDate,
        doses,
        isActive: true
      };
    });
    
    // Generate some sample improvement data
    const improvementData: MedicationImprovementData[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - 6 + day);
      
      improvementData.push({
        date: date.toISOString().split('T')[0],
        adherenceRate: 25 + (day * 10), // Gradually improving adherence
        healthScore: 60 + (day * 5), // Gradually improving health
        symptoms: {
          pain: Math.max(1, 8 - day), // Decreasing pain
          inflammation: Math.max(1, 7 - day), // Decreasing inflammation
          stiffness: Math.max(1, 8 - day * 0.8) // Decreasing stiffness
        }
      });
    }
    
    // Add the IDs to doses
    const medicationsWithIds = defaultMedications.map(med => {
      const doses = med.doses.map(dose => ({
        ...dose,
        medicationId: med.id
      }));
      
      return {
        ...med,
        doses
      };
    });
    
    // Calculate summaries
    const medicationsWithSummary = medicationsWithIds.map(med => ({
      ...med,
      summary: calculateMedicationSummary(med)
    }));
    
    // Save to storage
    const patientMedication: PatientMedication = {
      patientId: effectivePatientId,
      medications: medicationsWithSummary,
      improvements: improvementData
    };
    
    storeInLocalStorage('medications', patientMedication);
    
    // Update state
    setMedications(medicationsWithSummary);
    setImprovementData(improvementData);
    
    toast.success('Default medication tracking initialized');
  }, [effectivePatientId, calculateMedicationSummary]);
  
  // Record a dose as taken
  const recordDoseTaken = useCallback(async (medicationId: string, doseId: string) => {
    try {
      const updatedMedications = medications.map(med => {
        if (med.id === medicationId) {
          const updatedDoses = med.doses.map(dose => {
            if (dose.id === doseId) {
              return {
                ...dose,
                status: 'taken',
                timestamp: new Date().toISOString() // Update to current time
              };
            }
            return dose;
          });
          
          return {
            ...med,
            doses: updatedDoses
          };
        }
        return med;
      });
      
      // Recalculate summaries
      const medicationsWithSummary = updatedMedications.map(med => ({
        ...med,
        summary: calculateMedicationSummary({
          ...med,
          doses: med.doses
        })
      }));
      
      // Update local state
      setMedications(medicationsWithSummary);
      
      // Update storage
      const medicationsData = getFromLocalStorage('medications');
      const updatedMedicationsData = medicationsData.map((data: PatientMedication) => {
        if (data.patientId === effectivePatientId) {
          return {
            ...data,
            medications: medicationsWithSummary
          };
        }
        return data;
      });
      
      // If this patient doesn't exist in storage yet
      if (!medicationsData.some((data: PatientMedication) => data.patientId === effectivePatientId)) {
        updatedMedicationsData.push({
          patientId: effectivePatientId,
          medications: medicationsWithSummary,
          improvements: improvementData
        });
      }
      
      storeInLocalStorage('medications', updatedMedicationsData);
      
      // Update improvement data
      updateImprovementData();
      
      toast.success('Medication recorded as taken');
      return true;
    } catch (error) {
      console.error('Error recording medication dose:', error);
      toast.error('Failed to record medication');
      return false;
    }
  }, [medications, effectivePatientId, improvementData, calculateMedicationSummary]);
  
  // Mark a dose as missed
  const recordDoseMissed = useCallback(async (medicationId: string, doseId: string) => {
    try {
      const updatedMedications = medications.map(med => {
        if (med.id === medicationId) {
          const updatedDoses = med.doses.map(dose => {
            if (dose.id === doseId) {
              return {
                ...dose,
                status: 'missed'
              };
            }
            return dose;
          });
          
          return {
            ...med,
            doses: updatedDoses
          };
        }
        return med;
      });
      
      // Recalculate summaries
      const medicationsWithSummary = updatedMedications.map(med => ({
        ...med,
        summary: calculateMedicationSummary({
          ...med,
          doses: med.doses
        })
      }));
      
      // Update local state
      setMedications(medicationsWithSummary);
      
      // Update storage (similar to recordDoseTaken)
      const medicationsData = getFromLocalStorage('medications');
      const updatedMedicationsData = medicationsData.map((data: PatientMedication) => {
        if (data.patientId === effectivePatientId) {
          return {
            ...data,
            medications: medicationsWithSummary
          };
        }
        return data;
      });
      
      if (!medicationsData.some((data: PatientMedication) => data.patientId === effectivePatientId)) {
        updatedMedicationsData.push({
          patientId: effectivePatientId,
          medications: medicationsWithSummary,
          improvements: improvementData
        });
      }
      
      storeInLocalStorage('medications', updatedMedicationsData);
      
      toast.success('Medication recorded as missed');
      return true;
    } catch (error) {
      console.error('Error recording medication dose as missed:', error);
      toast.error('Failed to record missed medication');
      return false;
    }
  }, [medications, effectivePatientId, improvementData, calculateMedicationSummary]);
  
  // Update improvement data based on medication adherence
  const updateImprovementData = useCallback(() => {
    try {
      // Calculate overall adherence rate
      const overallAdherence = medications.reduce((sum, med) => {
        return sum + med.summary.adherenceRate;
      }, 0) / Math.max(1, medications.length);
      
      // Get the most recent improvement data
      const existingData = [...improvementData];
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already have data for today
      const todayIndex = existingData.findIndex(data => data.date === today);
      
      if (todayIndex >= 0) {
        // Update today's data
        existingData[todayIndex] = {
          ...existingData[todayIndex],
          adherenceRate: overallAdherence,
          healthScore: Math.min(100, 60 + (overallAdherence / 5)),
          symptoms: {
            pain: Math.max(1, 8 - (overallAdherence / 20)),
            inflammation: Math.max(1, 7 - (overallAdherence / 25)),
            stiffness: Math.max(1, 8 - (overallAdherence / 20))
          }
        };
      } else {
        // Add new data for today
        existingData.push({
          date: today,
          adherenceRate: overallAdherence,
          healthScore: Math.min(100, 60 + (overallAdherence / 5)),
          symptoms: {
            pain: Math.max(1, 8 - (overallAdherence / 20)),
            inflammation: Math.max(1, 7 - (overallAdherence / 25)),
            stiffness: Math.max(1, 8 - (overallAdherence / 20))
          }
        });
      }
      
      // Sort by date ascending
      existingData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Update state
      setImprovementData(existingData);
      
      // Update storage
      const medicationsData = getFromLocalStorage('medications');
      const updatedMedicationsData = medicationsData.map((data: PatientMedication) => {
        if (data.patientId === effectivePatientId) {
          return {
            ...data,
            improvements: existingData
          };
        }
        return data;
      });
      
      storeInLocalStorage('medications', updatedMedicationsData);
    } catch (error) {
      console.error('Error updating improvement data:', error);
    }
  }, [medications, improvementData, effectivePatientId]);
  
  // Load data on mount and when patient ID changes
  useEffect(() => {
    loadMedicationData();
  }, [loadMedicationData]);
  
  return {
    isLoading,
    medications,
    improvementData,
    loadMedicationData,
    recordDoseTaken,
    recordDoseMissed
  };
};
