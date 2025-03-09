
import { SymptomEntry } from '@/contexts/SymptomContext';
import { HotSpot } from './types';

// Function to get hotspot color based on pain level
export const getPainLevelColor = (level: number) => {
  if (level <= 3) return 'rgba(34, 197, 94, 0.8)'; // Green for low pain
  if (level <= 6) return 'rgba(249, 115, 22, 0.7)'; // Orange for medium pain
  return 'rgba(234, 56, 76, 0.8)'; // Red for high pain
};

// Convert symptoms to hotspots
export const symptomsToHotspots = (symptoms: SymptomEntry[]): HotSpot[] => {
  return symptoms.map(symptom => ({
    id: symptom.id,
    region: symptom.location,
    size: 20 + (symptom.painLevel * 0.8), // Size based on pain level
    color: getPainLevelColor(symptom.painLevel),
    label: symptom.symptomName,
    description: symptom.notes
  }));
};
