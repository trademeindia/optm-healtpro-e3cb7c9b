
import React from 'react';
import { motion } from 'framer-motion';
import { TestTube } from 'lucide-react';
import { Biomarker } from '@/data/mockBiomarkerData';
import BiomarkerDisplay from '@/components/dashboard/BiomarkerDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ViewBiomarkersTabProps {
  biomarkers: Biomarker[];
}

const ViewBiomarkersTab: React.FC<ViewBiomarkersTabProps> = ({ biomarkers }) => {
  return (
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
  );
};

export default ViewBiomarkersTab;
