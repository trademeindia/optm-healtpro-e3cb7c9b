
export interface BodyRegion {
  id: string;
  name: string;
  description?: string;
  x: number; // X coordinate as percentage
  y: number; // Y coordinate as percentage
  svgPathId?: string; // Added to support SVG path references
}

export interface PainSymptom {
  id: string;
  bodyRegionId: string;
  severity: 'mild' | 'moderate' | 'severe';
  painType: string;
  description: string;
  triggers?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PatientSymptomRecord {
  patientId: string;
  symptoms: PainSymptom[];
}

export type PainSeverity = 'mild' | 'moderate' | 'severe';

export interface PainSeverityOption {
  value: PainSeverity;
  label: string;
  color: string;
}

export interface PainTypeOption {
  value: string;
  label: string;
}

export const painSeverityOptions: PainSeverityOption[] = [
  { value: 'mild', label: 'Mild', color: 'bg-yellow-500' },
  { value: 'moderate', label: 'Moderate', color: 'bg-orange-500' },
  { value: 'severe', label: 'Severe', color: 'bg-red-500' },
];

export const painTypeOptions: PainTypeOption[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'dull', label: 'Dull' },
  { value: 'throbbing', label: 'Throbbing' },
  { value: 'stabbing', label: 'Stabbing' },
  { value: 'aching', label: 'Aching' },
  { value: 'burning', label: 'Burning' },
  { value: 'tingling', label: 'Tingling' },
  { value: 'stiffness', label: 'Stiffness' },
];

// Make sure our SymptomEntry type is compatible with the one in SymptomContext
export interface SymptomEntry {
  id: string;
  date: Date;
  symptomName: string;
  painLevel: number;
  location: string;
  notes: string; // Make sure this is required to match the context definition
  patientId?: number;
}
