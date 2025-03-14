
import React from 'react';
import { Grid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PatientProfile from '@/components/patient/PatientProfile';
import SimplifiedAnatomicalMap from '@/components/patient/SimplifiedAnatomicalMap';
import { AnatomicalMap } from '@/components/patient/anatomical-map';

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
        <AnatomicalMap className="w-full h-full" />
      </div>
      
      <div>
        <PatientProfile patient={patient} onAssignTests={onAssignTests} />
      </div>
    </div>
  );
};

export default MainContent;
