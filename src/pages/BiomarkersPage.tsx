
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { mockBiomarkers } from '@/data/mockBiomarkerData';
import BiomarkerDisplay from '@/components/dashboard/BiomarkerDisplay';
import BiomarkerUpload from '@/components/biomarkers/BiomarkerUpload';
import BiomarkerHowItWorks from '@/components/biomarkers/BiomarkerHowItWorks';

const BiomarkersPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Biomarker Analysis</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bloodwork">Blood Biomarkers</TabsTrigger>
              <TabsTrigger value="upload">Upload Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Removed the BiologicalAge component from here */}
                
                {/* Display the first three biomarkers in the overview tab */}
                {mockBiomarkers.slice(0, 3).map(biomarker => (
                  <BiomarkerDisplay key={biomarker.id} biomarker={biomarker} />
                ))}
              </div>
              
              <BiomarkerHowItWorks />
            </TabsContent>
            
            <TabsContent value="bloodwork" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBiomarkers.map(biomarker => (
                  <BiomarkerDisplay key={biomarker.id} biomarker={biomarker} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <BiomarkerUpload />
            </TabsContent>
            
            <TabsContent value="history">
              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Biomarker History</h2>
                <p>Your historical biomarker data will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BiomarkersPage;
