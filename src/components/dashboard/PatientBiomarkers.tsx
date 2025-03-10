
import React, { useState } from 'react';
import BiomarkerSearch from './biomarkers/BiomarkerSearch';
import BiomarkerFilter from './biomarkers/BiomarkerFilter';
import BiomarkerList from './biomarkers/BiomarkerList';
import { convertBiomarkerToComponentFormat } from './biomarkers/biomarkerUtils';
import { PatientBiomarkersProps as ComponentProps } from './biomarkers/types';
import { Biomarker as DataBiomarker } from '@/data/mockBiomarkerData';

interface PatientBiomarkersProps {
  biomarkers: DataBiomarker[];
  onAddBiomarker?: () => void;
}

const PatientBiomarkers: React.FC<PatientBiomarkersProps> = ({ 
  biomarkers,
  onAddBiomarker
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);
  
  // Convert the biomarkers from the data format to the component format
  const componentBiomarkers = biomarkers.map(convertBiomarkerToComponentFormat);
  
  const filteredBiomarkers = componentBiomarkers.filter(biomarker => {
    const matchesSearch = biomarker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || biomarker.status === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleDetails = (biomarkerId: string) => {
    if (expandedBiomarker === biomarkerId) {
      setExpandedBiomarker(null);
    } else {
      setExpandedBiomarker(biomarkerId);
    }
  };
  
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Biomarkers</h2>
          <p className="text-muted-foreground">Track and analyze patient biomarkers and inflammation indicators</p>
        </div>
        
        <BiomarkerSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddBiomarker={onAddBiomarker}
        />
      </div>
      
      <BiomarkerFilter filter={filter} setFilter={setFilter} />
      
      <BiomarkerList 
        biomarkers={filteredBiomarkers}
        expandedBiomarker={expandedBiomarker}
        toggleDetails={toggleDetails}
      />
    </div>
  );
};

export default PatientBiomarkers;
