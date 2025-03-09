
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
  return <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Patient profile - now full width */}
      <div className="lg:col-span-12">
        <PatientProfile patient={patient} onAssignTests={onAssignTests} />
      </div>
      
      {/* Anatomical Map Section */}
      <div className="lg:col-span-12 mt-6">
        <AnatomicalMap className="w-full" />
      </div>
    </div>;
};

export default MainContent;
