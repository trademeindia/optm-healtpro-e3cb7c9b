
import { HotSpot } from './types';
import { SymptomEntry } from '@/contexts/SymptomContext';
import { anatomicalRegions } from './regions';

/**
 * Get system image path based on selected system
 */
export const getSystemImage = (system: string): string => {
  // Default images for different body systems
  switch (system) {
    case 'skeletal':
      return '/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png';
    case 'circulatory':
      return '/lovable-uploads/5a2de827-6408-43ae-91c8-4bfd13c1ed17.png';
    case 'nervous':
      return '/lovable-uploads/c259fc72-51f3-49b7-863e-d018adadb9df.png';
    case 'muscular':
    default:
      return '/lovable-uploads/d4871440-0787-4dc8-bfbf-20a04c1f96fc.png';
  }
};

/**
 * Converts symptom entries to hotspots for the anatomical map
 */
export const symptomsToHotspots = (symptoms: SymptomEntry[]): HotSpot[] => {
  return symptoms.map(symptom => {
    // Map symptom location to anatomical region
    const regionId = mapSymptomLocationToRegion(symptom.location);
    
    // Find the corresponding anatomical region
    const region = anatomicalRegions.find(r => r.id === regionId);
    
    // Generate a color based on severity
    const severityColor = getSeverityColor(symptom.painLevel || 1);
    
    // Ensure proper positioning with fine-tuned adjustments
    const position = getAdjustedPosition(region?.x || 50, region?.y || 50, symptom.location);
    
    return {
      id: symptom.id,
      region: regionId,
      x: position.x, 
      y: position.y,
      size: getHotspotSize(symptom.painLevel || 1),
      color: severityColor,
      label: symptom.symptomName,
      description: symptom.notes || 'No description provided',
      severity: symptom.painLevel || 1
    };
  });
};

/**
 * Fine-tune position based on specific body part
 */
const getAdjustedPosition = (x: number, y: number, location: string) => {
  // Minor adjustments to better align hotspots with the anatomical regions
  switch(location) {
    case 'right-shoulder':
    case 'rightShoulder':
      return { x: x - 2, y: y + 1 };
    case 'left-shoulder':
    case 'leftShoulder':
      return { x: x + 2, y: y + 1 };
    case 'right-knee':
    case 'rightKnee':
      return { x: x - 1, y };
    case 'left-knee':
    case 'leftKnee':
      return { x: x + 1, y };
    case 'lower-back':
    case 'lowerBack':
      return { x, y: y - 1 };
    case 'upper-back':
    case 'upperBack':
      return { x, y: y - 2 };
    case 'neck':
      return { x, y: y - 1 };
    default:
      return { x, y };
  }
};

/**
 * Maps symptom location from SymptomEntry to region ID
 */
const mapSymptomLocationToRegion = (location: string): string => {
  // Direct mapping if the location matches a region ID
  if (anatomicalRegions.some(region => region.id === location)) {
    return location;
  }

  // Handle special cases or format differences
  switch (location) {
    case 'rightShoulder': return 'right-shoulder';
    case 'leftShoulder': return 'left-shoulder';
    case 'rightElbow': return 'right-elbow';
    case 'leftElbow': return 'left-elbow';
    case 'rightWrist': return 'right-hand';
    case 'leftWrist': return 'left-hand';
    case 'rightHip': return 'right-hip';
    case 'leftHip': return 'left-hip';
    case 'rightKnee': return 'right-knee';
    case 'leftKnee': return 'left-knee';
    case 'rightAnkle': return 'right-foot';
    case 'leftAnkle': return 'left-foot';
    case 'upperBack': return 'upper-back';
    case 'lowerBack': return 'lower-back';
    default: return 'chest'; // Default to chest if no matching region
  }
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
    return 'rgba(52, 211, 153, 0.9)'; // Green for mild
  } else if (severity <= 6) {
    return 'rgba(251, 191, 36, 0.9)'; // Yellow for moderate
  } else {
    return 'rgba(239, 68, 68, 0.9)';  // Red for severe
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
