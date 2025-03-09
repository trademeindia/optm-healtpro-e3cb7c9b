
import React from 'react';
import PatientProfile from '@/components/patient/PatientProfile';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column - Anatomical map */}
      <div className="lg:col-span-8">
        <AnatomicalMap className="w-full h-full" />
      </div>
      
      {/* Right column - Patient profile */}
      <div className="lg:col-span-4">
        <PatientProfile patient={patient} onAssignTests={onAssignTests} />
      </div>
    </div>
  );
};

export default MainContent;
