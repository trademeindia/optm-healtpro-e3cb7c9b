
import { HotSpot } from './types';
import { SymptomEntry } from '@/contexts/SymptomContext';
import { anatomicalRegions } from './constants';

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

// Get the position for a hotspot based on its anatomical region
export const getHotspotPosition = (region: string) => {
  if (!region) {
    console.warn('Region is undefined');
    return { x: 50, y: 50 }; // Default to center if region is undefined
  }
  
  const regionData = anatomicalRegions[region];
  if (!regionData) {
    console.warn(`Region ${region} not found in anatomical regions`);
    return { x: 50, y: 50 }; // Fallback to center if region not found
  }
  
  return { x: regionData.x, y: regionData.y };
};
