
import { Patient, MedicalAnalysis, MedicalReport, Biomarker } from '@/types/medicalData';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { storeInLocalStorage } from './localStorageService';

/**
 * Service to handle data storage operations with enhanced reliability
 */
export class DataStorageService {
  /**
   * Stores the updated patient data in Supabase if connected, otherwise locally
   */
  static async storeData(
    patient: Patient,
    analysis: MedicalAnalysis,
    report: MedicalReport
  ): Promise<void> {
    try {
      // Check if we have an authenticated user with retry mechanism
      const { data } = await withRetry(
        () => supabase.auth.getUser(),
        { showToastOnError: false }
      );
      
      if (!data.user) {
        console.log("No authenticated user, skipping data storage");
        return;
      }
      
      // Store in local storage instead of trying to use non-existent tables
      // This is a temporary solution until the database schema is updated
      this.storeAnalysis(analysis, patient.id, data.user.id);
      
      // Store biomarkers in local storage
      this.storeBiomarkers(patient.biomarkers, patient.id, data.user.id);
      
      console.log("Successfully stored data in local storage (Supabase schema mismatch)");
    } catch (error) {
      console.error("Error storing data:", error);
      // Don't throw here, as we don't want to fail the whole process if storage fails
      // The local state update will still work
    }
  }

  /**
   * Store analysis data
   */
  private static storeAnalysis(
    analysis: MedicalAnalysis,
    patientId: string,
    userId: string
  ): void {
    storeInLocalStorage('analyses', {
      id: analysis.id,
      reportId: analysis.reportId,
      patientId: patientId,
      userId: userId,
      summary: analysis.summary,
      keyFindings: analysis.keyFindings,
      recommendations: analysis.recommendations,
      suggestedDiagnoses: analysis.suggestedDiagnoses,
      timestamp: analysis.timestamp
    });
  }

  /**
   * Store biomarker data
   */
  private static storeBiomarkers(
    biomarkers: Biomarker[],
    patientId: string,
    userId: string
  ): void {
    for (const biomarker of biomarkers) {
      storeInLocalStorage('biomarkers', {
        id: biomarker.id,
        patientId: patientId,
        userId: userId,
        name: biomarker.name,
        category: biomarker.category,
        description: biomarker.description,
        latestValue: biomarker.latestValue,
        historicalValues: biomarker.historicalValues,
        relatedSymptoms: biomarker.relatedSymptoms,
        affectedBodyParts: biomarker.affectedBodyParts,
        recommendations: biomarker.recommendations,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * Check if Supabase tables exist to determine availability
   */
  static async checkTablesExist(): Promise<boolean> {
    try {
      // Try to query an expected table
      const response = await withRetry(
        () => supabase.from('profiles').select('count', { count: 'exact' }).limit(1),
        { retries: 1 } // Only try once for this check
      );
      
      // Check if there was an error in the response
      return !response.error;
    } catch (e) {
      console.error("Error checking tables:", e);
      return false;
    }
  }
}
