
import React from 'react';
import BiomarkerItem from './BiomarkerItem';
import { Biomarker } from './types';

interface BiomarkerListProps {
  biomarkers: Biomarker[];
  expandedBiomarker: string | null;
  toggleDetails: (biomarkerId: string) => void;
}

const BiomarkerList: React.FC<BiomarkerListProps> = ({ 
  biomarkers, 
  expandedBiomarker,
  toggleDetails 
}) => {
  if (biomarkers.length === 0) {
    return (
      <div className="col-span-full text-center py-10 text-muted-foreground">
        No biomarkers found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {biomarkers.map((biomarker) => (
        <BiomarkerItem 
          key={biomarker.id}
          biomarker={biomarker}
          expanded={expandedBiomarker === biomarker.id}
          onToggle={toggleDetails}
        />
      ))}
    </div>
  );
};

export default BiomarkerList;
