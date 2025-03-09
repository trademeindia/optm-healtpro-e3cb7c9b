
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
    <Card className="w-full h-full shadow-lg border border-primary/20 transition-shadow duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Brain className="h-5 w-5 text-primary" />
          AI Medical Report Analysis
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Upload your medical report or paste its content for AI-powered analysis and explanation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full flex justify-start overflow-x-auto scrollbar-none p-1 bg-muted/30 rounded-lg">
            <TabsTrigger 
              value="upload" 
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium"
            >
              Upload Report
            </TabsTrigger>
            <TabsTrigger 
              value="text-input"
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium"
            >
              Text Input
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              disabled={!analysis}
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium"
            >
              Analysis Results
            </TabsTrigger>
          </TabsList>
          
          <div className="min-h-[300px] md:min-h-[400px]">
            <TabsContent value="upload" className="mt-0 h-full">
              <UploadTab 
                file={file}
                isProcessing={isProcessing}
                processingProgress={processingProgress}
                onFileChange={handleFileChange}
                onProcessFile={handleProcessFile}
              />
            </TabsContent>
            
            <TabsContent value="text-input" className="mt-0 h-full">
              <TextInputTab 
                textInput={textInput}
                isProcessing={isProcessing}
                processingProgress={processingProgress}
                onTextInputChange={handleTextInputChange}
                onProcessText={handleProcessText}
              />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0 h-full">
              <AnalysisResultsTab analysis={analysis} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs bg-muted/10 px-4 md:px-6 py-3 border-t border-border/30">
        <p className="text-muted-foreground">Note: This AI analysis is not a substitute for professional medical advice. Always consult with your healthcare provider about your test results.</p>
      </CardFooter>
    </Card>
  );
};

export default MedicalReportAI;
export type { ReportAnalysis };
