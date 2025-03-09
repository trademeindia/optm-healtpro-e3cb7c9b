
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

// Select the appropriate image based on active system
export const getSystemImage = (activeSystem: string): string => {
  switch (activeSystem) {
    case 'muscular':
      return "/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png";
    case 'skeletal':
      return "/lovable-uploads/c259fc72-51f3-49b7-863e-d018adadb9df.png";
    case 'skin':
      return "/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png";
    case 'organs':
      return "/lovable-uploads/5a2de827-6408-43ae-91c8-4bfd13c1ed17.png";
    case 'vascular':
    case 'nervous':
    case 'lymphatic':
    case 'full-body':
      return "/lovable-uploads/2f92810e-f197-4554-81aa-25c65d85b001.png";
    default:
      return "/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png";
  }
};
