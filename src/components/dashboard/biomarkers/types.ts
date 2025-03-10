
export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'low' | 'critical';
  lastUpdated: string;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  possibleCauses?: string[];
  recommendations?: string[];
}

export interface PatientBiomarkersProps {
  biomarkers: Biomarker[];
  onAddBiomarker?: () => void;
}

export interface BiomarkerItemProps {
  biomarker: Biomarker;
  expanded: boolean;
  onToggle: (id: string) => void;
}

export interface BiomarkerSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddBiomarker?: () => void;
}

export interface BiomarkerFilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}
