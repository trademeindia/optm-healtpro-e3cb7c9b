
import { 
  MedicalReport, 
  MedicalAnalysis, 
  Patient,
  Biomarker,
  SymptomRecord,
  AnatomicalMapping
} from '@/types/medicalData';
import { analyzeReportContent } from './openaiService';
import { syncBiomarkers } from './sync/biomarkerSync';
import { syncSymptoms } from './sync/symptomSync';
import { syncAnatomicalMappings } from './sync/anatomicalSync';
import { supabase } from '@/integrations/supabase/client';

export class DataSyncService {
  /**
   * Processes a medical report, analyzes it, and syncs all extracted data
   */
  static async processMedicalReport(
    report: MedicalReport, 
    currentPatient: Patient
  ): Promise<{
    updatedPatient: Patient;
    analysis: MedicalAnalysis;
  }> {
    try {
      console.log(`Processing medical report: ${report.id}`);
      
      // 1. Analyze the report
      const analysis = await analyzeReportContent(report.content);
      
      // Add metadata to analysis
      const analysisWithMeta: MedicalAnalysis = {
        ...analysis,
        id: `analysis-${Date.now()}`,
        reportId: report.id,
        timestamp: new Date().toISOString()
      };
      
      // 2. Update the report with analysis ID
      const updatedReport = {
        ...report,
        analyzed: true,
        analysisId: analysisWithMeta.id
      };
      
      // 3. Create updated biomarkers from the analysis
      const updatedBiomarkers = syncBiomarkers(
        analysisWithMeta.extractedBiomarkers,
        currentPatient.biomarkers
      );
      
      // 4. Update symptom records if needed
      const updatedSymptoms = syncSymptoms(
        updatedBiomarkers,
        currentPatient.symptoms
      );
      
      // 5. Update anatomical mappings
      const updatedMappings = syncAnatomicalMappings(
        updatedBiomarkers,
        currentPatient.anatomicalMappings
      );
      
      // 6. Prepare the updated patient object
      const updatedPatient: Patient = {
        ...currentPatient,
        biomarkers: updatedBiomarkers,
        symptoms: updatedSymptoms,
        anatomicalMappings: updatedMappings,
        reports: [updatedReport, ...currentPatient.reports.filter(r => r.id !== report.id)],
        analyses: [analysisWithMeta, ...currentPatient.analyses]
      };
      
      // 7. If connected to Supabase, store the updated data
      await this.storeDataInSupabase(updatedPatient, analysisWithMeta, updatedReport);
      
      console.log(`Successfully processed report: ${report.id}`);
      
      return {
        updatedPatient,
        analysis: analysisWithMeta
      };
    } catch (error) {
      console.error('Error in processing medical report:', error);
      throw new Error('Failed to process medical report');
    }
  }
  
  /**
   * Stores the updated patient data in Supabase if connected
   */
  private static async storeDataInSupabase(
    patient: Patient,
    analysis: MedicalAnalysis,
    report: MedicalReport
  ): Promise<void> {
    try {
      // Check if we have an authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user, skipping Supabase storage");
        return;
      }
      
      // Store in local storage instead of trying to use non-existent tables
      // This is a temporary solution until the database schema is updated
      this.storeInLocalStorage('analyses', {
        id: analysis.id,
        reportId: report.id,
        patientId: patient.id,
        userId: user.id,
        summary: analysis.summary,
        keyFindings: analysis.keyFindings,
        recommendations: analysis.recommendations,
        suggestedDiagnoses: analysis.suggestedDiagnoses,
        timestamp: analysis.timestamp
      });
      
      // Store biomarkers in local storage
      for (const biomarker of patient.biomarkers) {
        this.storeInLocalStorage('biomarkers', {
          id: biomarker.id,
          patientId: patient.id,
          userId: user.id,
          name: biomarker.name,
          category: biomarker.category,
          description: biomarker.description,
          latestValue: biomarker.latestValue,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log("Successfully stored data in local storage (Supabase schema mismatch)");
    } catch (error) {
      console.error("Error storing data:", error);
      // Don't throw here, as we don't want to fail the whole process if storage fails
      // The local state update will still work
    }
  }
  
  /**
   * Store data in localStorage as a temporary solution
   */
  private static storeInLocalStorage(key: string, data: any): void {
    try {
      // Get existing data
      const existingData = localStorage.getItem(`medical_${key}`);
      let dataArray = existingData ? JSON.parse(existingData) : [];
      
      // Add new data
      if (Array.isArray(dataArray)) {
        // Replace if item with same ID exists
        const index = dataArray.findIndex((item: any) => item.id === data.id);
        if (index !== -1) {
          dataArray[index] = data;
        } else {
          dataArray.push(data);
        }
      } else {
        dataArray = [data];
      }
      
      // Store updated array
      localStorage.setItem(`medical_${key}`, JSON.stringify(dataArray));
    } catch (error) {
      console.error(`Error storing ${key} in localStorage:`, error);
    }
  }
  
  /**
   * Retrieves patient data from Supabase if available
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
      const patientsData = localStorage.getItem('medical_patients');
      if (!patientsData) {
        // If no patients exist yet, create a default patient
        return this.createDefaultPatient(patientId, userId);
      }
      
      const patients = JSON.parse(patientsData);
      const patientData = patients.find((p: any) => p.id === patientId && p.userId === userId);
      
      if (!patientData) {
        return this.createDefaultPatient(patientId, userId);
      }
      
      // Get biomarkers
      const biomarkersData = localStorage.getItem('medical_biomarkers');
      const biomarkers = biomarkersData 
        ? JSON.parse(biomarkersData).filter((b: any) => b.patientId === patientId && b.userId === userId)
        : [];
      
      // Map to our application types
      const patient: Patient = {
        id: patientData.id,
        name: patientData.name || 'Default Patient',
        biomarkers: this.mapStoredBiomarkers(biomarkers),
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
    this.storeInLocalStorage('patients', {
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
  private static mapStoredBiomarkers(storedBiomarkers: any[]): Biomarker[] {
    return storedBiomarkers.map(stored => ({
      id: stored.id,
      name: stored.name,
      category: stored.category,
      description: stored.description,
      latestValue: stored.latestValue,
      historicalValues: stored.historicalValues || [],
      relatedSymptoms: stored.relatedSymptoms || [],
      affectedBodyParts: stored.affectedBodyParts || [],
      recommendations: stored.recommendations || []
    }));
  }
}
