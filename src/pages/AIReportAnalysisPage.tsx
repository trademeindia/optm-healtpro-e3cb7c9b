
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MedicalReportAI, { ReportAnalysis } from '@/components/biomarkers/MedicalReportAI';
import { motion } from 'framer-motion';
import { AIHowItWorksCard, AIPrivacyCard } from '@/components/biomarkers/AIHelpCards';

const AIReportAnalysisPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleReportAnalysisComplete = (analysis: ReportAnalysis) => {
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
            <h1 className="text-2xl font-bold">AI Medical Report Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Upload your medical report for AI-powered analysis and explanation
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MedicalReportAI onAnalysisComplete={handleReportAnalysisComplete} />
              <div className="space-y-6">
                <AIHowItWorksCard />
                <AIPrivacyCard />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AIReportAnalysisPage;
