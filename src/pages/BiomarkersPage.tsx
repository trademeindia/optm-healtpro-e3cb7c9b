import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, Upload, FileText, Check, X, AlertCircle, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BiomarkerDisplay from '@/components/dashboard/BiomarkerDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'low' | 'critical';
  timestamp: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

const mockBiomarkers: Biomarker[] = [
  {
    id: 'bm1',
    name: 'Hemoglobin',
    value: 14.2,
    unit: 'g/dL',
    normalRange: '13.5-17.5',
    status: 'normal',
    timestamp: '2023-05-15T10:30:00',
    percentage: 82,
    trend: 'stable',
    description: 'Protein in red blood cells that carries oxygen throughout the body'
  },
  {
    id: 'bm2',
    name: 'White Blood Cell Count',
    value: 9.1,
    unit: 'K/uL',
    normalRange: '4.5-11.0',
    status: 'normal',
    timestamp: '2023-05-15T10:30:00',
    percentage: 77,
    trend: 'up',
    description: 'Cells that help fight infection and other diseases'
  },
  {
    id: 'bm3',
    name: 'Glucose (Fasting)',
    value: 118,
    unit: 'mg/dL',
    normalRange: '70-99',
    status: 'elevated',
    timestamp: '2023-05-15T10:30:00',
    percentage: 65,
    trend: 'up',
    description: 'Blood sugar level after not eating for at least 8 hours'
  },
  {
    id: 'bm4',
    name: 'Total Cholesterol',
    value: 215,
    unit: 'mg/dL',
    normalRange: '125-200',
    status: 'elevated',
    timestamp: '2023-05-15T10:30:00',
    percentage: 58,
    trend: 'up',
    description: 'Measures all the cholesterol in your blood'
  },
  {
    id: 'bm5',
    name: 'HDL Cholesterol',
    value: 52,
    unit: 'mg/dL',
    normalRange: '40-60',
    status: 'normal',
    timestamp: '2023-05-15T10:30:00',
    percentage: 86,
    trend: 'stable',
    description: 'Good cholesterol that helps remove LDL from your arteries'
  },
  {
    id: 'bm6',
    name: 'LDL Cholesterol',
    value: 145,
    unit: 'mg/dL',
    normalRange: '0-99',
    status: 'elevated',
    timestamp: '2023-05-15T10:30:00',
    percentage: 42,
    trend: 'up',
    description: 'Bad cholesterol that can build up in your arteries'
  }
];

const BiomarkersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState(false);
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(mockBiomarkers);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setProcessingFile(true);
      
      setTimeout(() => {
        setProcessingFile(false);
        
        const newBiomarker: Biomarker = {
          id: `bm${biomarkers.length + 1}`,
          name: 'Vitamin D',
          value: 28,
          unit: 'ng/mL',
          normalRange: '30-50',
          status: 'low',
          timestamp: new Date().toISOString(),
          percentage: 56,
          trend: 'down',
          description: 'Important for bone health and immune function'
        };
        
        setBiomarkers([...biomarkers, newBiomarker]);
        
        setUploadedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        toast({
          title: "File processed successfully",
          description: "New biomarker data has been added to your profile",
        });
      }, 2000);
    }, 3000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Biomarkers</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage your health metrics
            </p>
          </div>
          
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="view">View Biomarkers</TabsTrigger>
              <TabsTrigger value="upload">Upload Test Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-primary" />
                        Your Biomarker Data
                      </CardTitle>
                      <CardDescription>
                        Track your health metrics over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BiomarkerDisplay biomarkers={biomarkers} />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="upload">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Upload Test Results
                      </CardTitle>
                      <CardDescription>
                        Upload your blood test reports or biomarker images for automatic processing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                          <input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading || processingFile}
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-base font-medium">
                              {uploadedFile ? uploadedFile.name : 'Drag and drop or click to upload'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Supports: PDF, JPG, PNG
                            </p>
                          </label>
                        </div>
                        
                        {uploadedFile && !isUploading && !processingFile && (
                          <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                              <span className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadedFile(null)}
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {isUploading && (
                          <div className="space-y-2">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                              Uploading... {uploadProgress}%
                            </p>
                          </div>
                        )}
                        
                        {processingFile && (
                          <div className="flex items-center justify-center space-x-2 py-2">
                            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm">Processing your file with AI...</span>
                          </div>
                        )}
                        
                        <Button
                          onClick={uploadFile}
                          className="w-full"
                          disabled={!uploadedFile || isUploading || processingFile}
                        >
                          {isUploading ? 'Uploading...' : processingFile ? 'Processing...' : 'Upload and Process'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scan className="h-5 w-5 text-primary" />
                        How It Works
                      </CardTitle>
                      <CardDescription>
                        Learn how we process your test results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Upload Your Reports</h4>
                            <p className="text-sm text-muted-foreground">
                              Upload your lab test results in PDF or image format
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Scan className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">AI Processing</h4>
                            <p className="text-sm text-muted-foreground">
                              Our AI system scans and extracts key biomarker data from your reports
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Results Added</h4>
                            <p className="text-sm text-muted-foreground">
                              Extracted data is added to your biomarker profile for easy tracking
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-muted">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium">Important Note</h4>
                              <p className="text-xs text-muted-foreground">
                                While our system is highly accurate, it's always a good idea to verify 
                                the extracted data against your original reports. If you notice any 
                                discrepancies, please contact your healthcare provider.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BiomarkersPage;
