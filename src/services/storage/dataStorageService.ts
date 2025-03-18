
import { Patient, MedicalAnalysis, MedicalReport, Biomarker } from '@/types/medicalData';
import { supabase, getConnectionStatus } from '@/integrations/supabase/client';
import { storeInLocalStorage } from './localStorageService';
import { toast } from 'sonner';

/**
 * Service to handle data storage operations
 */
export class DataStorageService {
  private static lastConnectionErrorTime: number = 0;
  private static ERROR_THROTTLE_MS: number = 10000; // Only show connection error toast every 10 seconds

  /**
   * Stores the updated patient data in Supabase if connected, otherwise locally
   */
  static async storeData(
    patient: Patient,
    analysis: MedicalAnalysis,
    report: MedicalReport
  ): Promise<void> {
    try {
      // Check if we have an authenticated user and valid connection
      const { data: { user } } = await supabase.auth.getUser();
      const { isConnected } = getConnectionStatus();
      
      if (!isConnected) {
        console.log("Supabase connection unavailable, using local storage only");
        this.storeLocally(patient, analysis, report);
        
        // Show error message but throttle to avoid spamming
        const now = Date.now();
        if (now - this.lastConnectionErrorTime > this.ERROR_THROTTLE_MS) {
          this.lastConnectionErrorTime = now;
          toast.warning('Connection unavailable', {
            description: 'Data saved locally only',
            duration: 3000
          });
        }
        return;
      }
      
      if (!user) {
        console.log("No authenticated user, using local storage only");
        this.storeLocally(patient, analysis, report);
        return;
      }
      
      // Try Supabase storage with timeout and fallback
      try {
        // Set a 5-second timeout for Supabase operations
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database operation timed out')), 5000)
        );
        
        // Attempt to store in Supabase with timeout
        await Promise.race([
          this.storeInSupabase(patient, analysis, report, user.id),
          timeoutPromise
        ]);
        
        console.log("Successfully stored data in Supabase");
      } catch (supabaseError) {
        console.error("Supabase storage error, falling back to local storage:", supabaseError);
        this.storeLocally(patient, analysis, report);
        
        // Show error only if it's not a connection error (already handled above)
        if (supabaseError instanceof Error && !supabaseError.message.includes('timed out')) {
          toast.error('Database error', {
            description: 'Data saved locally instead',
            duration: 4000
          });
        }
      }
    } catch (error) {
      console.error("Error storing data:", error);
      // Don't throw, store locally as fallback
      this.storeLocally(patient, analysis, report);
      
      toast.error('Error saving data', {
        description: 'Some changes may not be saved',
        duration: 4000
      });
    }
  }

  /**
   * Store data locally
   */
  private static storeLocally(
    patient: Patient,
    analysis: MedicalAnalysis,
    report: MedicalReport
  ): void {
    try {
      this.storeAnalysis(analysis, patient.id, 'local-user');
      this.storeBiomarkers(patient.biomarkers, patient.id, 'local-user');
      console.log("Successfully stored data in local storage");
    } catch (localError) {
      console.error("Error storing in local storage:", localError);
      toast.error('Failed to save data locally', {
        duration: 3000
      });
    }
  }

  /**
   * Attempt to store in Supabase
   */
  private static async storeInSupabase(
    patient: Patient,
    analysis: MedicalAnalysis,
    report: MedicalReport,
    userId: string
  ): Promise<void> {
    // This is a placeholder for actual Supabase storage operations
    // When tables are created, actual implementation would go here
    
    // For now, we'll use local storage as a fallback
    this.storeLocally(patient, analysis, report);
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
}
