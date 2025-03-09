
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BiomarkerDisplay from '@/components/dashboard/BiomarkerDisplay';
import BiologicalAge from '@/components/dashboard/BiologicalAge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import BiomarkerUpload from '@/components/biomarkers/BiomarkerUpload';
import BiomarkerHowItWorks from '@/components/biomarkers/BiomarkerHowItWorks';
import { mockBiomarkers, mockBiologicalAge, mockChronologicalAge, Biomarker } from '@/data/mockBiomarkerData';

const BiomarkersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(mockBiomarkers);
  
  const handleProcessComplete = (newBiomarker: Biomarker) => {
    setBiomarkers((prevBiomarkers) => [...prevBiomarkers, newBiomarker]);
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Biological Age Card - 4 columns on large screens */}
                  <div className="lg:col-span-4">
                    <BiologicalAge 
                      biologicalAge={mockBiologicalAge} 
                      chronologicalAge={mockChronologicalAge} 
                    />
                  </div>
                  
                  {/* Biomarker Data Card - 8 columns on large screens */}
                  <div className="lg:col-span-8">
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
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BiomarkersPage;
