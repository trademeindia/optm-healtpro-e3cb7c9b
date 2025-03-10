
// Types for the biomarker values
export type BiomarkerStatus = 'normal' | 'elevated' | 'low' | 'critical';

export interface BiomarkerValue {
  value: number;
  unit: string;
  normalRange: string;
  status: BiomarkerStatus;
  percentage: number;
  description: string;
  possibleCauses?: string[];
  recommendations?: string[];
}

export interface BiomarkerValues {
  [key: string]: BiomarkerValue;
}
