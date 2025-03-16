
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  Medication, 
  MedicationWithSummary,
  MedicationImprovementData,
  PatientMedication,
  MedicationDose
} from '@/types/medicationData';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { DEFAULT_MEDICATIONS, calculateMedicationSummary, generateImprovementData } from '@/utils/medicationUtils';

// Initialize default medications for a new patient
export const initializeDefaultMedications = (patientId: string) => {
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
          status: day === 0 && dose === 0 ? 'taken' : 'scheduled' as 'taken' | 'scheduled'
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
  const medicationsWithSummary: MedicationWithSummary[] = medicationsWithIds.map(med => ({
    ...med,
    summary: calculateMedicationSummary(med)
  }));
  
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
  
  // Save to storage
  const patientMedication: PatientMedication = {
    patientId,
    medications: medicationsWithSummary,
    improvements: improvementData
  };
  
  saveMedicationData(patientId, medicationsWithSummary, improvementData);
  
  return {
    medications: medicationsWithSummary,
    improvements: improvementData
  };
};

// Load medication data for a patient
export const loadPatientMedicationData = (patientId: string) => {
  try {
    // Get stored medication data
    const medicationsData = getFromLocalStorage('medications') || [];
    const patientMedications = medicationsData.find(
      (data: PatientMedication) => data.patientId === patientId
    );
    
    if (patientMedications) {
      // Calculate summary for each medication
      const medicationsWithSummary = patientMedications.medications.map(med => ({
        ...med,
        summary: calculateMedicationSummary(med)
      }));
      
      return {
        medications: medicationsWithSummary,
        improvements: patientMedications.improvements || []
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading medication data:', error);
    throw error;
  }
};

// Save medication data for a patient
export const saveMedicationData = (patientId: string, medications: MedicationWithSummary[], improvements: MedicationImprovementData[]) => {
  try {
    const medicationsData = getFromLocalStorage('medications') || [];
    
    // Update existing patient data or add new patient
    const updatedMedicationsData = medicationsData.some((data: PatientMedication) => data.patientId === patientId)
      ? medicationsData.map((data: PatientMedication) => {
          if (data.patientId === patientId) {
            return {
              ...data,
              medications,
              improvements
            };
          }
          return data;
        })
      : [...medicationsData, { patientId, medications, improvements }];
    
    storeInLocalStorage('medications', updatedMedicationsData);
    return true;
  } catch (error) {
    console.error('Error saving medication data:', error);
    throw error;
  }
};

// Update improvement data based on medication adherence
export const updateImprovementData = (patientId: string, medications: MedicationWithSummary[], existingData: MedicationImprovementData[]) => {
  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Generate new improvement data for today
    const newImprovementData = generateImprovementData(medications);
    
    // Clone the existing data
    const updatedImprovementData = [...existingData];
    
    // Check if we already have data for today
    const todayIndex = updatedImprovementData.findIndex(data => data.date === today);
    
    if (todayIndex >= 0) {
      // Update today's data
      updatedImprovementData[todayIndex] = {
        ...updatedImprovementData[todayIndex],
        ...newImprovementData,
        date: today
      };
    } else {
      // Add new data for today
      updatedImprovementData.push({
        ...newImprovementData,
        date: today
      });
    }
    
    // Sort by date ascending
    updatedImprovementData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Save the updated improvement data
    saveMedicationData(patientId, medications, updatedImprovementData);
    
    return updatedImprovementData;
  } catch (error) {
    console.error('Error updating improvement data:', error);
    throw error;
  }
};
