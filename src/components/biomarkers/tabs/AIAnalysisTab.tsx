
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MedicalReportAI, { ReportAnalysis } from '@/components/biomarkers/MedicalReportAI';

interface AIAnalysisTabProps {
  onAnalysisComplete: (analysis: ReportAnalysis) => void;
}

const AIAnalysisTab: React.FC<AIAnalysisTabProps> = ({ onAnalysisComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicalReportAI onAnalysisComplete={onAnalysisComplete} />
        <div className="space-y-6">
          <AIHowItWorksCard />
          <AIPrivacyCard />
        </div>
      </div>
    </motion.div>
  );
};

const AIHowItWorksCard: React.FC = () => {
  return (
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
  );
};

const AIPrivacyCard: React.FC = () => {
  return (
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
  );
};

export default AIAnalysisTab;
