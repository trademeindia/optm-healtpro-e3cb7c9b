
import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicalReportAIProps, ReportAnalysis } from './types';
import { simulateProcessing } from './utils/reportProcessing';
import UploadTab from './UploadTab';
import TextInputTab from './TextInputTab';
import AnalysisResultsTab from './AnalysisResultsTab';

const MedicalReportAI: React.FC<MedicalReportAIProps> = ({ onAnalysisComplete }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [textInput, setTextInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} ready for analysis`,
      });
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleProcessFile = () => {
    if (file) {
      simulateProcessing(
        true, 
        setIsProcessing, 
        setProcessingProgress, 
        setAnalysis, 
        setActiveTab, 
        onAnalysisComplete
      );
    } else {
      toast({
        title: "No File Selected",
        description: "Please upload a medical report to analyze",
        variant: "destructive",
      });
    }
  };

  const handleProcessText = () => {
    if (textInput.trim()) {
      simulateProcessing(
        false, 
        setIsProcessing, 
        setProcessingProgress, 
        setAnalysis, 
        setActiveTab, 
        onAnalysisComplete
      );
    } else {
      toast({
        title: "No Text Input",
        description: "Please enter medical report text to analyze",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Medical Report Analysis
        </CardTitle>
        <CardDescription>
          Upload your medical report or paste its content for AI-powered analysis and explanation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Report</TabsTrigger>
            <TabsTrigger value="text-input">Text Input</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysis}>Analysis Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <UploadTab 
              file={file}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
              onFileChange={handleFileChange}
              onProcessFile={handleProcessFile}
            />
          </TabsContent>
          
          <TabsContent value="text-input">
            <TextInputTab 
              textInput={textInput}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
              onTextInputChange={handleTextInputChange}
              onProcessText={handleProcessText}
            />
          </TabsContent>
          
          <TabsContent value="analysis">
            <AnalysisResultsTab analysis={analysis} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground">
        <p>Note: This AI analysis is not a substitute for professional medical advice. Always consult with your healthcare provider about your test results.</p>
      </CardFooter>
    </Card>
  );
};

export default MedicalReportAI;
export type { ReportAnalysis };
