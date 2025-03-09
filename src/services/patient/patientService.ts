
import { Patient } from '@/types/medicalData';
import { supabase } from '@/integrations/supabase/client';
import { storeInLocalStorage, getFromLocalStorage, getItemByIdFromLocalStorage } from '../storage/localStorageService';

/**
 * Service to handle patient data operations
 */
export class PatientService {
  /**
   * Retrieves patient data from Supabase if available, otherwise from localStorage
   */
  static async getPatientData(patientId: string): Promise<Patient | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user, cannot retrieve patient data");
        return null;
      }
      
      // Get from localStorage instead of Supabase due to schema mismatch
      const patient = this.getPatientFromLocalStorage(patientId, user.id);
      
      return patient;
    } catch (error) {
      console.error("Error retrieving patient data:", error);
      return null;
    }
  }
  
  /**
   * Get patient data from localStorage as a temporary solution
   */
  private static getPatientFromLocalStorage(patientId: string, userId: string): Patient | null {
    try {
      // Try to get patient data
      const patientsData = getFromLocalStorage('patients');
      const patientData = patientsData.find((p: any) => p.id === patientId && p.userId === userId);
      
      if (!patientData) {
        // If no patients exist yet, create a default patient
        return this.createDefaultPatient(patientId, userId);
      }
      
      // Get biomarkers
      const biomarkersData = getFromLocalStorage('biomarkers');
      const biomarkers = biomarkersData
        .filter((b: any) => b.patientId === patientId && b.userId === userId)
        .map(this.mapStoredBiomarker);
      
      // Map to our application types
      const patient: Patient = {
        id: patientData.id,
        name: patientData.name || 'Default Patient',
        biomarkers: biomarkers,
        symptoms: [], // Would fetch from localStorage
        anatomicalMappings: [], // Would fetch from localStorage
        reports: [], // Would fetch from localStorage
        analyses: [] // Would fetch from localStorage
      };
      
      return patient;
    } catch (error) {
      console.error("Error retrieving patient from localStorage:", error);
      return this.createDefaultPatient(patientId, userId);
    }
  }
  
  /**
   * Create a default patient when none exists
   */
  private static createDefaultPatient(patientId: string, userId: string): Patient {
    const defaultPatient: Patient = {
      id: patientId,
      name: 'Default Patient',
      biomarkers: [],
      symptoms: [],
      anatomicalMappings: [],
      reports: [],
      analyses: []
    };
    
    // Store this default patient
    storeInLocalStorage('patients', {
      id: patientId,
      userId: userId,
      name: 'Default Patient',
      createdAt: new Date().toISOString()
    });
    
    return defaultPatient;
  }
  
  /**
   * Maps stored biomarker records to application Biomarker type
   */
  private static mapStoredBiomarker(stored: any) {
    return {
      id: stored.id,
      name: stored.name,
      category: stored.category,
      description: stored.description,
      latestValue: stored.latestValue,
      historicalValues: stored.historicalValues || [],
      relatedSymptoms: stored.relatedSymptoms || [],
      affectedBodyParts: stored.affectedBodyParts || [],
      recommendations: stored.recommendations || []
    };
  }
}
