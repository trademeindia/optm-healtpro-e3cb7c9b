
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import our tab components
import TabHeader from './tabs/TabHeader';
import XRayContent from './tabs/XRayContent';
import BloodTestContent from './tabs/BloodTestContent';
import MedicationsContent from './tabs/MedicationsContent';
import ClinicalNotesContent from './tabs/ClinicalNotesContent';
import BiomarkersContent from './tabs/BiomarkersContent';

interface MedicalRecordsTabsProps {
  patientId: number;
}

const MedicalRecordsTabs: React.FC<MedicalRecordsTabsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('xrays');
  const { toast } = useToast();
  
  const handleAddRecord = () => {
    toast({
      title: "Add Record",
      description: "Record upload functionality coming soon",
    });
  };
  
  return (
    <Card className="glass-morphism">
      <CardHeader className="pb-2">
        <CardTitle>Medical Records</CardTitle>
        <CardDescription>View and manage patient medical records</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto mb-4 grid grid-cols-5 p-1">
            <TabsTrigger value="xrays" className="text-sm py-2">X-Rays & Scans</TabsTrigger>
            <TabsTrigger value="bloodtests" className="text-sm py-2">Blood Tests</TabsTrigger>
            <TabsTrigger value="medications" className="text-sm py-2">Medications</TabsTrigger>
            <TabsTrigger value="notes" className="text-sm py-2">Clinical Notes</TabsTrigger>
            <TabsTrigger value="biomarkers" className="text-sm py-2">Biomarkers</TabsTrigger>
          </TabsList>
          
          <TabHeader 
            title={
              activeTab === 'xrays' ? "X-Rays & Scan Reports" :
              activeTab === 'bloodtests' ? "Blood Test Reports" : 
              activeTab === 'medications' ? "Current Medications" :
              activeTab === 'notes' ? "Clinical Notes" :
              "Biomarker Data"
            }
            description=""
            onAddRecord={handleAddRecord}
            buttonLabel={activeTab === 'notes' ? "Add Note" : "Add Record"}
          />
          
          <TabsContent value="xrays" className="mt-0">
            <XRayContent />
          </TabsContent>
          
          <TabsContent value="bloodtests" className="mt-0">
            <BloodTestContent />
          </TabsContent>
          
          <TabsContent value="medications" className="mt-0">
            <MedicationsContent />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <ClinicalNotesContent />
          </TabsContent>
          
          <TabsContent value="biomarkers" className="mt-0">
            <BiomarkersContent />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsTabs;
