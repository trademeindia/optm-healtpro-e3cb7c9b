
import { HotSpot } from './types';
import { SymptomEntry } from '@/contexts/SymptomContext';
import { anatomicalRegions } from './regions';

/**
 * Converts symptom entries to hotspots for the anatomical map
 */
export const symptomsToHotspots = (symptoms: SymptomEntry[]): HotSpot[] => {
  return symptoms.map(symptom => {
    // Find the corresponding anatomical region
    const region = anatomicalRegions.find(r => r.id === symptom.region);
    
    // Generate a color based on severity
    const severityColor = getSeverityColor(symptom.severity || 1);
    
    return {
      id: symptom.id,
      region: symptom.region,
      x: region?.x || 50, // Default to center if region not found
      y: region?.y || 50, // Default to center if region not found
      size: getHotspotSize(symptom.severity || 1),
      color: severityColor,
      label: symptom.name,
      description: symptom.description || 'No description provided',
      severity: symptom.severity || 1
    };
  });
};

/**
 * Determines hotspot size based on symptom severity
 */
const getHotspotSize = (severity: number): number => {
  // Scale size based on severity (1-10)
  return Math.max(20, Math.min(40, 20 + (severity * 2)));
};

/**
 * Generates a color based on symptom severity
 */
const getSeverityColor = (severity: number): string => {
  if (severity <= 3) {
    return 'rgba(52, 211, 153, 0.8)'; // Green for mild
  } else if (severity <= 6) {
    return 'rgba(251, 191, 36, 0.8)'; // Yellow for moderate
  } else {
    return 'rgba(239, 68, 68, 0.8)';  // Red for severe
  }
};

/**
 * Get text color for contrast against the background
 */
export const getContrastTextColor = (backgroundColor: string): string => {
  // Simple implementation - if using a dark color, return white, otherwise black
  if (backgroundColor.includes('239, 68, 68') || backgroundColor.includes('251, 191, 36')) {
    return 'white';
  }
  return 'black';
};
