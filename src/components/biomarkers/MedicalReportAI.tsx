
import React, { useState } from 'react';
import { Upload, Zap, FileText, Info, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface MedicalReportAIProps {
  onAnalysisComplete?: (analysisResult: ReportAnalysis) => void;
}

export interface ReportAnalysis {
  id: string;
  timestamp: string;
  reportType: string;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  normalValues: Record<string, { value: string; status: 'normal' | 'abnormal' | 'critical' }>;
}

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

  const simulateProcessing = (isFileUpload: boolean) => {
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
          
          toast({
            title: "Analysis Complete",
            description: "Your medical report has been analyzed successfully",
          });
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleProcessFile = () => {
    if (file) {
      simulateProcessing(true);
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
      simulateProcessing(false);
    } else {
      toast({
        title: "No Text Input",
        description: "Please enter medical report text to analyze",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: 'normal' | 'abnormal' | 'critical') => {
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
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center"
                style={{ minHeight: '200px' }}
              >
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Upload Medical Report</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Drag and drop your medical report file, or click to browse. We support PDF, JPG, and PNG formats.
                </p>
                <div>
                  <label htmlFor="report-upload">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer inline-flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </div>
                    <input 
                      id="report-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <div className="mt-4 text-sm">
                    Selected: <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>
              
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Analyzing your report...</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <Progress value={processingProgress} />
                  <div className="text-xs text-muted-foreground mt-2">
                    Our AI is examining your medical data and preparing an easy-to-understand explanation
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleProcessFile}
                  disabled={!file}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze Report
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="text-input">
            <div className="space-y-4">
              <Textarea 
                placeholder="Paste your medical report text here (e.g., 'Cholesterol: 210 mg/dL, HDL: 65 mg/dL, LDL: 130 mg/dL...')"
                className="min-h-[200px]"
                value={textInput}
                onChange={handleTextInputChange}
              />
              
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Analyzing your report...</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <Progress value={processingProgress} />
                  <div className="text-xs text-muted-foreground mt-2">
                    Our AI is examining your medical data and preparing an easy-to-understand explanation
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleProcessText}
                  disabled={!textInput.trim()}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze Text
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            {analysis && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Summary</h3>
                  <p className="text-muted-foreground">{analysis.summary}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Findings</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.keyFindings.map((finding, index) => (
                      <li key={index} className="text-muted-foreground">{finding}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Your Values</h3>
                  <div className="space-y-2">
                    {Object.entries(analysis.normalValues).map(([key, data]) => (
                      <div key={key} className="flex justify-between items-center p-2 border-b">
                        <span className="font-medium">{key}</span>
                        <span className={getStatusColor(data.status)}>
                          {data.value}
                          {data.status !== 'normal' && (
                            <Info className="inline ml-1 h-4 w-4" />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Questions for your doctor</h3>
                  <Textarea 
                    placeholder="Write any questions you want to ask your doctor about this report..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}
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
