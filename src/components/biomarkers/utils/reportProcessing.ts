
import { ReportAnalysis } from '../types';

export const simulateProcessing = (
  isFileUpload: boolean,
  setIsProcessing: (value: boolean) => void,
  setProcessingProgress: (value: number) => void,
  setAnalysis: (analysis: ReportAnalysis | null) => void,
  setActiveTab: (tab: string) => void,
  onAnalysisComplete?: (analysis: ReportAnalysis) => void
) => {
  setIsProcessing(true);
  setProcessingProgress(0);
  
  const interval = setInterval(() => {
    setProcessingProgress(prev => {
      if (prev >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        
        // Mock analysis result
        const mockAnalysis: ReportAnalysis = {
          id: `report-${Date.now()}`,
          timestamp: new Date().toISOString(),
          reportType: isFileUpload ? 'Blood Test' : 'Manual Input Analysis',
          summary: 'Overall, your blood test results are within normal ranges with a few minor exceptions that require monitoring.',
          keyFindings: [
            'Cholesterol levels are slightly elevated but not at concerning levels',
            'Vitamin D is lower than optimal, supplement recommended',
            'All other markers are within normal ranges'
          ],
          recommendations: [
            'Consider dietary changes to address cholesterol levels',
            'Take vitamin D supplement (2000 IU daily)',
            'Follow up in 3 months for another blood test'
          ],
          normalValues: {
            'Cholesterol': { value: '210 mg/dL', status: 'abnormal' },
            'HDL': { value: '65 mg/dL', status: 'normal' },
            'LDL': { value: '130 mg/dL', status: 'abnormal' },
            'Triglycerides': { value: '120 mg/dL', status: 'normal' },
            'Glucose': { value: '90 mg/dL', status: 'normal' },
            'Vitamin D': { value: '25 ng/mL', status: 'abnormal' },
            'Iron': { value: '90 μg/dL', status: 'normal' },
          }
        };
        
        setAnalysis(mockAnalysis);
        setActiveTab('analysis');
        
        if (onAnalysisComplete) {
          onAnalysisComplete(mockAnalysis);
        }
        
        return 100;
      }
      return prev + Math.random() * 15;
    });
  }, 500);
};

export const getStatusColor = (status: 'normal' | 'abnormal' | 'critical') => {
  switch (status) {
    case 'normal':
      return 'text-green-600';
    case 'abnormal':
      return 'text-amber-600';
    case 'critical':
      return 'text-red-600';
    default:
      return 'text-green-600';
  }
};
