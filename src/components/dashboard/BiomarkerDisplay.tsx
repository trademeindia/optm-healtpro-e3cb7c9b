
import React, { useState } from 'react';
import BiomarkerCard from './biomarker-display/BiomarkerCard';
import BiomarkerDetailDialog from './biomarker-display/BiomarkerDetailDialog';
import EmptyBiomarkerState from './biomarker-display/EmptyBiomarkerState';
import { Biomarker } from './biomarker-display/biomarkerUtils';

interface BiomarkerDisplayProps {
  biomarkers: Biomarker[];
}

const BiomarkerDisplay: React.FC<BiomarkerDisplayProps> = ({ biomarkers }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  if (!biomarkers || biomarkers.length === 0) {
    return <EmptyBiomarkerState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {biomarkers.map((biomarker) => (
          <BiomarkerCard 
            key={biomarker.id}
            biomarker={biomarker} 
            onSelectBiomarker={setSelectedBiomarker} 
          />
        ))}
      </div>

      <BiomarkerDetailDialog 
        biomarker={selectedBiomarker} 
        open={!!selectedBiomarker} 
        onOpenChange={(open) => !open && setSelectedBiomarker(null)} 
      />
    </>
  );
};

export default BiomarkerDisplay;
