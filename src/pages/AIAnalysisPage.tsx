
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AIAnalysisTab from '@/components/biomarkers/tabs/AIAnalysisTab';
import { ReportAnalysis } from '@/components/biomarkers/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from 'lucide-react';

const AIAnalysisPage: React.FC = () => {
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
            <h1 className="text-2xl font-bold">AI Report Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Upload your medical reports for AI-powered analysis and explanations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <AIAnalysisTab onAnalysisComplete={handleReportAnalysisComplete} />
            </div>
            
            <div className="col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    How It Works
                  </CardTitle>
                  <CardDescription>
                    Understanding your AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our AI system analyzes your medical reports by identifying key biomarkers, 
                    test results, and medical terminology. It then provides explanations in 
                    simple language and identifies potential areas for follow-up.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Privacy Information
                  </CardTitle>
                  <CardDescription>
                    How we handle your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Your medical reports are processed securely. We do not store the 
                    actual reports on our servers after analysis is complete. Only the 
                    analyzed results are saved to your profile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAnalysisPage;
