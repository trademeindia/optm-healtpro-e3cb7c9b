
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { ReportAnalysis } from '@/components/biomarkers/types';
import { mockBiomarkers, Biomarker } from '@/data/mockBiomarkerData';
import ViewBiomarkersTab from '@/components/biomarkers/tabs/ViewBiomarkersTab';
import UploadResultsTab from '@/components/biomarkers/tabs/UploadResultsTab';
import AIAnalysisTab from '@/components/biomarkers/tabs/AIAnalysisTab';

const BiomarkersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(mockBiomarkers);
  const [activeTab, setActiveTab] = useState<string>("view");
  
  const handleProcessComplete = (newBiomarker: Biomarker) => {
    setBiomarkers((prevBiomarkers) => [...prevBiomarkers, newBiomarker]);
    // Switch to view tab to show the newly added biomarker
    setActiveTab("view");
    
    toast({
      title: "New Biomarker Added",
      description: `${newBiomarker.name} has been added to your profile`,
    });
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="view">View Biomarkers</TabsTrigger>
              <TabsTrigger value="upload">Upload Test Results</TabsTrigger>
              <TabsTrigger value="ai-analysis">AI Report Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <ViewBiomarkersTab biomarkers={biomarkers} />
            </TabsContent>
            
            <TabsContent value="upload">
              <UploadResultsTab onProcessComplete={handleProcessComplete} />
            </TabsContent>
            
            <TabsContent value="ai-analysis">
              <AIAnalysisTab onAnalysisComplete={handleReportAnalysisComplete} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BiomarkersPage;
