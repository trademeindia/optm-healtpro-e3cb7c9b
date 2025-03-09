
export interface ReportAnalysis {
  id: string;
  timestamp: string;
  reportType: string;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  normalValues: Record<string, { value: string; status: 'normal' | 'abnormal' | 'critical' }>;
}

export interface MedicalReportAIProps {
  onAnalysisComplete?: (analysisResult: ReportAnalysis) => void;
}
