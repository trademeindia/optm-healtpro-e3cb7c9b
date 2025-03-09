
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
      
      // Store the analysis in Supabase
      const { error: analysisError } = await supabase
        .from('medical_analyses')
        .upsert({
          id: analysis.id,
          report_id: report.id,
          patient_id: patient.id,
          user_id: user.id,
          summary: analysis.summary,
          key_findings: analysis.keyFindings,
          recommendations: analysis.recommendations,
          suggested_diagnoses: analysis.suggestedDiagnoses,
          created_at: analysis.timestamp
        });
      
      if (analysisError) throw analysisError;
      
      // Store the biomarkers in Supabase
      for (const biomarker of patient.biomarkers) {
        const { error: biomarkerError } = await supabase
          .from('biomarkers')
          .upsert({
            id: biomarker.id,
            patient_id: patient.id,
            user_id: user.id,
            name: biomarker.name,
            category: biomarker.category,
            description: biomarker.description,
            latest_value: biomarker.latestValue,
            created_at: new Date().toISOString()
          });
          
        if (biomarkerError) console.error("Error storing biomarker:", biomarkerError);
      }
      
      console.log("Successfully stored data in Supabase");
    } catch (error) {
      console.error("Error storing data in Supabase:", error);
      // Don't throw here, as we don't want to fail the whole process if Supabase storage fails
      // The local state update will still work
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
      
      // Get patient data
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .eq('user_id', user.id)
        .single();
        
      if (patientError) throw patientError;
      
      if (!patientData) return null;
      
      // Get biomarkers
      const { data: biomarkersData, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id);
        
      if (biomarkersError) throw biomarkersError;
      
      // Convert the database patient structure to our application Patient type
      const patient: Patient = {
        id: patientData.id,
        name: patientData.name,
        biomarkers: this.mapDatabaseBiomarkers(biomarkersData),
        symptoms: [], // Would fetch from symptom records table
        anatomicalMappings: [], // Would fetch from mappings table
        reports: [], // Would fetch from reports table
        analyses: [] // Would fetch from analyses table
      };
      
      return patient;
    } catch (error) {
      console.error("Error retrieving patient data:", error);
      return null;
    }
  }
  
  /**
   * Maps database biomarker records to application Biomarker type
   */
  private static mapDatabaseBiomarkers(dbBiomarkers: any[]): Biomarker[] {
    return dbBiomarkers.map(db => ({
      id: db.id,
      name: db.name,
      category: db.category,
      description: db.description,
      latestValue: db.latest_value,
      historicalValues: db.historical_values || [],
      relatedSymptoms: db.related_symptoms || [],
      affectedBodyParts: db.affected_body_parts || [],
      recommendations: db.recommendations || []
    }));
  }
}
