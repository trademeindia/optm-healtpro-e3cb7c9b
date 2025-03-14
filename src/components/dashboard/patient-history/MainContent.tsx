
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PatientProfile from '@/components/patient/PatientProfile';
import { AnatomicalView } from '@/components/patient/anatomical-view';
import { SymptomProvider } from '@/contexts/SymptomContext';

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
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <SymptomProvider patientId={patient.id}>
          <Tabs defaultValue="anatomical-view" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full justify-start mb-2 overflow-x-auto">
                <TabsTrigger value="anatomical-view">Anatomical View</TabsTrigger>
                <TabsTrigger value="simplified-map">Simplified Map</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="anatomical-view" className="m-0">
              <div className="p-4">
                <AnatomicalView 
                  selectedRegion={selectedRegion}
                  onSelectRegion={onSelectRegion}
                  patientId={patient.id}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="simplified-map" className="m-0">
              <div className="p-4">
                {/* SimplifiedAnatomicalMap will be used here when needed */}
              </div>
            </TabsContent>
          </Tabs>
        </SymptomProvider>
      </div>
      
      <div>
        <PatientProfile 
          patient={patient} 
          onAssignTests={onAssignTests} 
          showFullDetails={true}
        />
      </div>
    </div>
  );
};

export default MainContent;
