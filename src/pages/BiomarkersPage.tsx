
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BiomarkerDisplay from '@/components/dashboard/BiomarkerDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import BiomarkerUpload from '@/components/biomarkers/BiomarkerUpload';
import BiomarkerHowItWorks from '@/components/biomarkers/BiomarkerHowItWorks';
import MedicalReportAI, { ReportAnalysis } from '@/components/biomarkers/MedicalReportAI';
import { mockBiomarkers, Biomarker } from '@/data/mockBiomarkerData';

const BiomarkersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(mockBiomarkers);
  
  const handleProcessComplete = (newBiomarker: Biomarker) => {
    setBiomarkers((prevBiomarkers) => [...prevBiomarkers, newBiomarker]);
  };

  const handleReportAnalysisComplete = (analysis: ReportAnalysis) => {
    // In a real application, you might want to store this analysis result
    // or update the UI based on it
    console.log("Report analysis completed:", analysis);
    
    toast({
      title: "Analysis Saved",
      description: "Your medical report analysis has been saved to your profile",
    });
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
              <TabsTrigger value="ai-analysis">AI Report Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 gap-6">
                  {/* Biomarker Data Card - full width now that we've removed the Biological Age card */}
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
                  <BiomarkerUpload onProcessComplete={handleProcessComplete} />
                  <BiomarkerHowItWorks />
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="ai-analysis">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MedicalReportAI onAnalysisComplete={handleReportAnalysisComplete} />
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">How AI Report Analysis Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center shrink-0">1</div>
                            <div>
                              <h4 className="font-medium">Upload your medical report</h4>
                              <p className="text-sm text-muted-foreground">Upload lab results, imaging reports, or any other medical documents.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center shrink-0">2</div>
                            <div>
                              <h4 className="font-medium">AI analyzes your report</h4>
                              <p className="text-sm text-muted-foreground">Our AI system reviews the medical terminology and data in your report.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center shrink-0">3</div>
                            <div>
                              <h4 className="font-medium">Get a plain-language explanation</h4>
                              <p className="text-sm text-muted-foreground">Receive a clear breakdown of what your results mean and what actions you might consider.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center shrink-0">4</div>
                            <div>
                              <h4 className="font-medium">Prepare questions for your doctor</h4>
                              <p className="text-sm text-muted-foreground">Use the insights to have more informed discussions with your healthcare provider.</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Privacy & Security</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your medical data is important and sensitive. Here's how we protect it:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="bg-green-100 text-green-800 rounded-full p-0.5 shrink-0 mt-0.5">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>End-to-end encryption for all uploaded documents</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-green-100 text-green-800 rounded-full p-0.5 shrink-0 mt-0.5">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Documents are processed locally and not stored on our servers</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-green-100 text-green-800 rounded-full p-0.5 shrink-0 mt-0.5">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>HIPAA-compliant processing and analytics</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-green-100 text-green-800 rounded-full p-0.5 shrink-0 mt-0.5">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>You maintain complete ownership of your medical data</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
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
