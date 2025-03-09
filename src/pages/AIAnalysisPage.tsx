
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AIAnalysisTab from '@/components/biomarkers/tabs/AIAnalysisTab';
import { ReportAnalysis } from '@/components/biomarkers/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ShieldCheck, Lightbulb, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-background to-background/80">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 pl-10 lg:pl-0"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">AI Report Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Upload your medical reports for AI-powered analysis and explanations
            </p>
          </motion.div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <AIAnalysisTab onAnalysisComplete={handleReportAnalysisComplete} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-5"
              >
                <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-primary/5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Brain className="h-5 w-5 text-primary" />
                      How It Works
                    </CardTitle>
                    <CardDescription>
                      Understanding your AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 p-4 md:p-6">
                    <p className="text-sm leading-relaxed">
                      Our AI system analyzes your medical reports by identifying key biomarkers, 
                      test results, and medical terminology. It then provides explanations in 
                      simple language and identifies potential areas for follow-up.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-primary/5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Privacy Information
                    </CardTitle>
                    <CardDescription>
                      How we handle your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 p-4 md:p-6">
                    <p className="text-sm leading-relaxed">
                      Your medical reports are processed securely. We do not store the 
                      actual reports on our servers after analysis is complete. Only the 
                      analyzed results are saved to your profile.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-primary/5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      Quick Tips
                    </CardTitle>
                    <CardDescription>
                      Get the most from your analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 p-4 md:p-6">
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="bg-accent/10 text-accent rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <span>Upload clear, complete reports for best results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-accent/10 text-accent rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <span>Use the text input for typed lab results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-accent/10 text-accent rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <span>Save analyses to track changes over time</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Card className="border border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Important Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 p-4 md:p-6">
                  <p className="text-sm text-muted-foreground">
                    The AI analysis is meant to help you understand your medical reports better, but it is not a substitute for professional medical advice.
                    Always consult with your healthcare provider about your test results and any health concerns.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAnalysisPage;
