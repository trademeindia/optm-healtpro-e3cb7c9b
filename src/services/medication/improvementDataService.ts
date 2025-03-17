
import { 
  MedicationWithSummary,
  MedicationImprovementData
} from '@/types/medicationData';
import { generateImprovementData } from '@/utils/medicationUtils';
import { saveMedicationData } from './medicationDataService';

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
