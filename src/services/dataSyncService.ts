
import { 
  MedicalReport, 
  MedicalAnalysis, 
  Patient
} from '@/types/medicalData';
import { analyzeReportContent } from './openaiService';
import { syncBiomarkers } from './sync/biomarkerSync';
import { syncSymptoms } from './sync/symptomSync';
import { syncAnatomicalMappings } from './sync/anatomicalSync';

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
      
      return {
        updatedPatient,
        analysis: analysisWithMeta
      };
    } catch (error) {
      console.error('Error in processing medical report:', error);
      throw new Error('Failed to process medical report');
    }
  }
}
