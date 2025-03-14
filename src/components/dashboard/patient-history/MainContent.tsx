
import React from 'react';
import { Grid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PatientProfile from '@/components/patient/PatientProfile';
import SimplifiedAnatomicalMap from '@/components/patient/SimplifiedAnatomicalMap';

interface MainContentProps {
  patient: any;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onAssignTests: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  patient,
  selectedRegion,
  onSelectRegion,
  onAssignTests
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Tabs defaultValue="anatomical" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="anatomical" className="flex-1">
                  <Grid className="w-4 h-4 mr-2" />
                  Anatomical Map
                </TabsTrigger>
                <TabsTrigger value="biomarkers" className="flex-1">Biomarkers</TabsTrigger>
                <TabsTrigger value="symptoms" className="flex-1">Symptoms</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="anatomical" className="p-4">
              <SimplifiedAnatomicalMap
                patientId={patient.id}
                onRegionSelect={onSelectRegion}
              />
            </TabsContent>
            
            <TabsContent value="biomarkers" className="p-4">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Biomarker Data</h3>
                <p className="text-muted-foreground">
                  Patient biomarker data will be displayed here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="symptoms" className="p-4">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Symptom Tracking</h3>
                <p className="text-muted-foreground">
                  Patient symptom data will be displayed here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div>
        <PatientProfile
          patient={patient}
          onAssignTests={onAssignTests}
        />
      </div>
    </div>
  );
};

export default MainContent;
