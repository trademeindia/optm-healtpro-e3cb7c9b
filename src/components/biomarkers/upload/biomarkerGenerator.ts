
import { Biomarker } from '@/data/mockBiomarkerData';

// Types for the biomarker values
type BiomarkerStatus = 'normal' | 'elevated' | 'low' | 'critical';

interface BiomarkerValue {
  value: number;
  unit: string;
  normalRange: string;
  status: BiomarkerStatus;
  percentage: number;
}

interface BiomarkerValues {
  [key: string]: BiomarkerValue;
}

// Sample values for different biomarker types
const biomarkerValues: BiomarkerValues = {
  'Vitamin D': { value: 28, unit: 'ng/mL', normalRange: '30-50', status: 'low', percentage: 56 },
  'Cholesterol': { value: 195, unit: 'mg/dL', normalRange: '125-200', status: 'normal', percentage: 78 },
  'Glucose': { value: 110, unit: 'mg/dL', normalRange: '70-99', status: 'elevated', percentage: 65 },
  'Iron': { value: 80, unit: 'μg/dL', normalRange: '60-170', status: 'normal', percentage: 82 }
};

export const generateBiomarker = (): Biomarker => {
  // Create a few biomarkers based on the file name to simulate processing results
  const biomarkerTypes = Object.keys(biomarkerValues);
  const randomIndex = Math.floor(Math.random() * biomarkerTypes.length);
  const biomarkerName = biomarkerTypes[randomIndex];
  
  const selectedBiomarker = biomarkerValues[biomarkerName];

  return {
    id: `bm${Date.now()}`,
    name: biomarkerName,
    value: selectedBiomarker.value,
    unit: selectedBiomarker.unit,
    normalRange: selectedBiomarker.normalRange,
    status: selectedBiomarker.status,
    timestamp: new Date().toISOString(),
    percentage: selectedBiomarker.percentage,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    description: `Important health indicator extracted from your uploaded test results`
  };
};
