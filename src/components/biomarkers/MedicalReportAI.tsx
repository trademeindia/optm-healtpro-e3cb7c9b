
import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicalReportAIProps } from './types';
import UploadTab from './UploadTab';
import TextInputTab from './TextInputTab';
import AnalysisResultsTab from './AnalysisResultsTab';
import { useMedicalData } from '@/contexts/MedicalDataContext';
import { MedicalReport, MedicalAnalysis } from '@/types/medicalData';
import { ReportAnalysis } from './types';

const MedicalReportAI: React.FC<MedicalReportAIProps> = ({ onAnalysisComplete }) => {
  const { toast } = useToast();
  const { processMedicalReport, lastAnalysis, isLoading } = useMedicalData();
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} ready for analysis`,
      });
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setError(null);
  };

  const handleProcessFile = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a medical report to analyze",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Create a progress interval to show activity while processing
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 95 ? 95 : newProgress; // Cap at 95% until actual completion
        });
      }, 300);
      
      // Create a new medical report object
      const report: MedicalReport = {
        id: `report-${Date.now()}`,
        patientId: 'default-patient', // Would come from authentication in a real app
        timestamp: new Date().toISOString(),
        reportType: getReportTypeFromFilename(file.name),
        content: `File upload: ${file.name}`,
        source: 'upload',
        fileName: file.name,
        fileType: file.type,
        analyzed: false
      };
      
      // Process the report using our data sync service
      const analysis = await processMedicalReport(report);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      // Complete the UI progress
      setProcessingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        
        if (analysis) {
          setActiveTab('analysis');
          if (onAnalysisComplete) {
            onAnalysisComplete(analysis);
          }
        }
      }, 500);
      
    } catch (err) {
      setIsProcessing(false);
      setError('Failed to process the file. Please try again.');
      console.error('Error in handleProcessFile:', err);
      toast({
        title: "Processing Failed",
        description: "There was an error analyzing your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProcessText = async () => {
    if (!textInput.trim()) {
      toast({
        title: "No Text Input",
        description: "Please enter medical report text to analyze",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Create a progress interval to show activity while processing
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 95 ? 95 : newProgress; // Cap at 95% until actual completion
        });
      }, 300);
      
      // Create a new medical report object
      const report: MedicalReport = {
        id: `report-${Date.now()}`,
        patientId: 'default-patient', // Would come from authentication in a real app
        timestamp: new Date().toISOString(),
        reportType: detectReportTypeFromText(textInput),
        content: textInput,
        source: 'text',
        analyzed: false
      };
      
      // Process the report using our data sync service
      const analysis = await processMedicalReport(report);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      // Complete the UI progress
      setProcessingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        
        if (analysis) {
          setActiveTab('analysis');
          if (onAnalysisComplete) {
            onAnalysisComplete(analysis);
          }
        }
      }, 500);
      
    } catch (err) {
      setIsProcessing(false);
      setError('Failed to process the text. Please try again.');
      console.error('Error in handleProcessText:', err);
      toast({
        title: "Processing Failed",
        description: "There was an error analyzing your text. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Attempts to determine report type from filename
   */
  const getReportTypeFromFilename = (filename: string): string => {
    const lowerName = filename.toLowerCase();
    
    if (lowerName.includes('blood')) return 'Blood Test';
    if (lowerName.includes('thyroid')) return 'Thyroid Panel';
    if (lowerName.includes('lipid')) return 'Lipid Panel';
    if (lowerName.includes('glucose')) return 'Glucose Test';
    if (lowerName.includes('vitamin')) return 'Vitamin Panel';
    if (lowerName.includes('cbc')) return 'Complete Blood Count';
    if (lowerName.includes('metabolic')) return 'Metabolic Panel';
    
    return 'Medical Report';
  };

  /**
   * Attempts to determine report type from text content
   */
  const detectReportTypeFromText = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('blood test') || lowerText.includes('blood panel') || lowerText.includes('blood count')) {
      return 'Blood Test';
    }
    if (lowerText.includes('thyroid')) return 'Thyroid Panel';
    if (lowerText.includes('lipid') || lowerText.includes('cholesterol') || lowerText.includes('hdl') || lowerText.includes('ldl')) {
      return 'Lipid Panel';
    }
    if (lowerText.includes('glucose') || lowerText.includes('a1c') || lowerText.includes('diabetes')) {
      return 'Glucose Test';
    }
    if (lowerText.includes('vitamin')) return 'Vitamin Panel';
    if (lowerText.includes('metabolic')) return 'Metabolic Panel';
    
    return 'Medical Report';
  };

  return (
    <Card className="w-full shadow-lg border-0 rounded-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4 space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold">
          <Brain className="h-6 w-6 text-primary" />
          AI Medical Report Analysis
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Upload your medical report or paste its content for AI-powered analysis and explanation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-5 w-full grid grid-cols-3 bg-muted/30 rounded-xl p-1">
            <TabsTrigger 
              value="upload" 
              className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Upload Report
            </TabsTrigger>
            <TabsTrigger 
              value="text-input"
              className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Text Input
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              disabled={!lastAnalysis}
              className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Results
            </TabsTrigger>
          </TabsList>
          
          <div className="min-h-[300px] md:min-h-[380px] relative">
            <TabsContent value="upload" className="mt-0 absolute inset-0 h-full">
              <UploadTab 
                file={file}
                isProcessing={isProcessing || isLoading}
                processingProgress={processingProgress}
                onFileChange={handleFileChange}
                onProcessFile={handleProcessFile}
              />
            </TabsContent>
            
            <TabsContent value="text-input" className="mt-0 absolute inset-0 h-full">
              <TextInputTab 
                textInput={textInput}
                isProcessing={isProcessing || isLoading}
                processingProgress={processingProgress}
                onTextInputChange={handleTextInputChange}
                onProcessText={handleProcessText}
              />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0 absolute inset-0 h-full overflow-y-auto">
              {lastAnalysis && (
                <AnalysisResultsTab 
                  analysis={convertToReportAnalysis(lastAnalysis)} 
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
        
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs bg-gray-50 dark:bg-gray-900/10 px-4 md:px-6 py-3 border-t border-border/30">
        <p className="text-muted-foreground">Note: This AI analysis is not a substitute for professional medical advice. Always consult with your healthcare provider about your test results.</p>
      </CardFooter>
    </Card>
  );
};

// Helper function to convert MedicalAnalysis to ReportAnalysis
const convertToReportAnalysis = (analysis: MedicalAnalysis): ReportAnalysis => {
  // Create normalValues from extractedBiomarkers
  const normalValues: Record<string, { value: string; status: 'normal' | 'abnormal' | 'critical' }> = {};
  
  analysis.extractedBiomarkers.forEach(biomarker => {
    let displayStatus: 'normal' | 'abnormal' | 'critical';
    
    // Map the status values
    switch(biomarker.status) {
      case 'normal':
        displayStatus = 'normal';
        break;
      case 'critical':
        displayStatus = 'critical';
        break;
      default:
        displayStatus = 'abnormal';
        break;
    }
    
    normalValues[biomarker.name] = {
      value: String(biomarker.value) + (biomarker.unit ? ` ${biomarker.unit}` : ''),
      status: displayStatus
    };
  });
  
  return {
    ...analysis,
    reportType: 'Medical Analysis',
    normalValues
  };
};

export default MedicalReportAI;
