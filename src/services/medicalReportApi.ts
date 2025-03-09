
import { MedicalReport, MedicalAnalysis, Patient } from '@/types/medicalData';
import { DataSyncService } from './dataSyncService';
import { supabase } from '@/integrations/supabase/client';
import { callOpenAI } from './ai/openaiClient';

/**
 * Service for handling medical report operations
 */
export class MedicalReportService {
  /**
   * Uploads a medical report file to storage and processes it
   */
  static async uploadAndProcessReport(
    file: File,
    patientId: string
  ): Promise<{
    report: MedicalReport;
    analysis: MedicalAnalysis;
  } | null> {
    try {
      console.log(`Uploading medical report for patient: ${patientId}`);
      
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user");
        throw new Error("Authentication required");
      }
      
      // 1. Upload file to Supabase storage
      const fileName = `${user.id}/${patientId}/${Date.now()}_${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('medical_reports')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      // 2. Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('medical_reports')
        .getPublicUrl(fileName);
      
      // 3. Extract text from file if possible
      let reportContent = "";
      
      if (file.type === 'application/pdf') {
        reportContent = await this.extractTextFromPdf(file);
      } else if (file.type.startsWith('image/')) {
        reportContent = `Image report: ${file.name}`;
        // Would implement OCR here in a real application
      } else {
        reportContent = await file.text();
      }
      
      // 4. Create report record
      const report: MedicalReport = {
        id: `report-${Date.now()}`,
        patientId,
        timestamp: new Date().toISOString(),
        reportType: this.determineReportType(file.name, reportContent),
        content: reportContent,
        source: 'upload',
        fileName: file.name,
        fileType: file.type,
        analyzed: false
      };
      
      // 5. Store report record in Supabase
      const { error: reportError } = await supabase
        .from('medical_reports')
        .insert({
          id: report.id,
          patient_id: patientId,
          user_id: user.id,
          report_type: report.reportType,
          content: report.content,
          file_url: publicUrl,
          file_name: report.fileName,
          file_type: report.fileType,
          created_at: report.timestamp
        });
        
      if (reportError) throw reportError;
      
      // 6. Get patient data
      const patient = await DataSyncService.getPatientData(patientId);
      if (!patient) throw new Error("Patient not found");
      
      // 7. Process the report
      const { analysis } = await DataSyncService.processMedicalReport(report, patient);
      
      return { report, analysis };
    } catch (error) {
      console.error("Error uploading and processing report:", error);
      return null;
    }
  }
  
  /**
   * Extract text from a PDF file
   */
  private static async extractTextFromPdf(file: File): Promise<string> {
    // In a real application, would use a PDF parsing library
    // For this demo, we'll return a mock message
    return `This is extracted text from PDF file: ${file.name}. 
    In a production environment, we would use a PDF parsing library or service.`;
  }
  
  /**
   * Determine the type of medical report based on filename and content
   */
  private static determineReportType(fileName: string, content: string): string {
    fileName = fileName.toLowerCase();
    content = content.toLowerCase();
    
    if (fileName.includes('blood') || content.includes('blood test') || content.includes('cbc')) {
      return 'blood_test';
    } else if (fileName.includes('mri') || content.includes('mri')) {
      return 'mri';
    } else if (fileName.includes('xray') || fileName.includes('x-ray') || content.includes('xray') || content.includes('x-ray')) {
      return 'xray';
    } else if (fileName.includes('ct') || content.includes('ct scan') || content.includes('computerized tomography')) {
      return 'ct_scan';
    } else if (fileName.includes('ultrasound') || content.includes('ultrasound') || content.includes('sonogram')) {
      return 'ultrasound';
    } else {
      return 'general_report';
    }
  }
  
  /**
   * Generates AI insights from a medical report analysis
   */
  static async generateInsightsFromAnalysis(analysis: MedicalAnalysis): Promise<string> {
    try {
      const prompt = `
        As a medical AI assistant, provide clinical insights for the following medical report analysis:
        
        Summary: ${analysis.summary}
        
        Key Findings:
        ${analysis.keyFindings.map(f => `- ${f}`).join('\n')}
        
        Biomarkers:
        ${analysis.extractedBiomarkers.map(b => 
          `- ${b.name}: ${b.value} ${b.unit} (${b.status}, normal range: ${b.normalRange})`
        ).join('\n')}
        
        Suggested Diagnoses:
        ${analysis.suggestedDiagnoses?.map(d => `- ${d}`).join('\n') || 'None provided'}
        
        Please provide:
        1. Your clinical assessment of these findings
        2. Potential implications for the patient's health
        3. Suggested follow-up tests or monitoring if appropriate
        4. Lifestyle recommendations based on these findings
        
        Keep your response concise, clear, and focused on actionable insights.
      `;
      
      const response = await callOpenAI(prompt, "gpt-4o-mini");
      return response || "Unable to generate insights at this time.";
    } catch (error) {
      console.error("Error generating insights:", error);
      return "An error occurred while generating insights. Please try again later.";
    }
  }
}
