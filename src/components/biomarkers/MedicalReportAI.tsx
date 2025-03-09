
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
import { OpenAI } from 'openai';

// Initialize OpenAI client - in a real production app, this should use environment variables
// For this demo, we're using a limited client-side implementation
const openai = new OpenAI({
  apiKey: 'demo-key', // Replace with actual key in production
  dangerouslyAllowBrowser: true // Only for demo purposes
});

const MedicalReportAI: React.FC<MedicalReportAIProps> = ({ onAnalysisComplete }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
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

  const processFileWithAI = async (fileToProcess: File): Promise<string> => {
    try {
      // For images or PDFs, we would convert to base64 and send to OpenAI
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (event) => {
          try {
            if (!event.target || typeof event.target.result !== 'string') {
              throw new Error('Failed to read file');
            }
            
            const base64Data = event.target.result.split(',')[1];
            
            // This would be an actual API call in production
            console.log('Processing file with OpenAI:', fileToProcess.name);
            
            // For demo purposes, we're skipping the actual API call
            // In production, you would make a call like:
            /*
            const response = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: "Analyze this medical report and extract key biomarkers and findings:" },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:${fileToProcess.type};base64,${base64Data}`,
                      },
                    },
                  ],
                },
              ],
            });
            return response.choices[0].message.content || 'Analysis completed';
            */
            
            // Simulating the delay of an API call
            setTimeout(() => {
              resolve("Analysis completed successfully");
            }, 2000);
          } catch (err) {
            reject(err);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };
        
        if (fileToProcess.type.includes('image')) {
          reader.readAsDataURL(fileToProcess);
        } else {
          // For PDFs, we'd need a PDF library in production
          reader.readAsDataURL(fileToProcess);
        }
      });
    } catch (err) {
      console.error('Error processing file with AI:', err);
      throw err;
    }
  };

  const processTextWithAI = async (text: string): Promise<string> => {
    try {
      // For demo purposes, we're skipping the actual API call
      console.log('Processing text with OpenAI:', text.substring(0, 50) + '...');
      
      // In production, you would make a call like:
      /*
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant that analyzes medical reports and provides clear explanations."
          },
          {
            role: "user",
            content: `Analyze this medical report text and extract key biomarkers and findings: ${text}`
          }
        ],
      });
      return response.choices[0].message.content || 'Analysis completed';
      */
      
      // Simulating the delay of an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Analysis completed successfully");
        }, 1500);
      });
    } catch (err) {
      console.error('Error processing text with AI:', err);
      throw err;
    }
  };

  const handleProcessFile = async () => {
    if (file) {
      setError(null);
      try {
        // Start the processing animation first
        setIsProcessing(true);
        setProcessingProgress(0);
        
        // Create a progress interval to show activity while processing
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => {
            const newProgress = prev + Math.random() * 5;
            return newProgress > 95 ? 95 : newProgress; // Cap at 95% until actual completion
          });
        }, 300);
        
        // Process the file with AI
        await processFileWithAI(file);
        
        // Clear the progress interval
        clearInterval(progressInterval);
        
        // Complete the simulation for UI purposes
        simulateProcessing(
          true, 
          setIsProcessing, 
          setProcessingProgress, 
          setAnalysis, 
          setActiveTab, 
          onAnalysisComplete
        );
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
    } else {
      toast({
        title: "No File Selected",
        description: "Please upload a medical report to analyze",
        variant: "destructive",
      });
    }
  };

  const handleProcessText = async () => {
    if (textInput.trim()) {
      setError(null);
      try {
        // Start the processing animation first
        setIsProcessing(true);
        setProcessingProgress(0);
        
        // Create a progress interval to show activity while processing
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => {
            const newProgress = prev + Math.random() * 5;
            return newProgress > 95 ? 95 : newProgress; // Cap at 95% until actual completion
          });
        }, 300);
        
        // Process the text with AI
        await processTextWithAI(textInput);
        
        // Clear the progress interval
        clearInterval(progressInterval);
        
        // Complete the simulation for UI purposes
        simulateProcessing(
          false, 
          setIsProcessing, 
          setProcessingProgress, 
          setAnalysis, 
          setActiveTab, 
          onAnalysisComplete
        );
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
    } else {
      toast({
        title: "No Text Input",
        description: "Please enter medical report text to analyze",
        variant: "destructive",
      });
    }
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
              disabled={!analysis}
              className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Results
            </TabsTrigger>
          </TabsList>
          
          <div className="min-h-[300px] md:min-h-[380px] relative">
            <TabsContent value="upload" className="mt-0 absolute inset-0 h-full">
              <UploadTab 
                file={file}
                isProcessing={isProcessing}
                processingProgress={processingProgress}
                onFileChange={handleFileChange}
                onProcessFile={handleProcessFile}
              />
            </TabsContent>
            
            <TabsContent value="text-input" className="mt-0 absolute inset-0 h-full">
              <TextInputTab 
                textInput={textInput}
                isProcessing={isProcessing}
                processingProgress={processingProgress}
                onTextInputChange={handleTextInputChange}
                onProcessText={handleProcessText}
              />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0 absolute inset-0 h-full overflow-y-auto">
              <AnalysisResultsTab analysis={analysis} />
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

export default MedicalReportAI;
export type { ReportAnalysis };
