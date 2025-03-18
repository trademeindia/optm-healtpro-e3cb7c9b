
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
      return '/lovable-uploads/5c7b19fc-f7bf-458e-a1ce-eb1e1a46f331.png'; // Updated to use our new muscular image
  }
};

/**
 * Converts symptom entries to hotspots for the anatomical map
 */
export const symptomsToHotspots = (symptoms: SymptomEntry[]): HotSpot[] => {
  if (!symptoms || symptoms.length === 0) {
    console.log('No symptoms to convert to hotspots');
    return [];
  }

  return symptoms.map(symptom => {
    // Map symptom location to anatomical region
    const regionId = mapSymptomLocationToRegion(symptom.location || 'chest');
    
    // Find the corresponding anatomical region
    const region = anatomicalRegions.find(r => r.id === regionId);
    
    // Generate a color based on severity
    const severityColor = getSeverityColor(symptom.painLevel || 1);
    
    return {
      id: symptom.id,
      region: regionId,
      x: region?.x || 50, // Default to center if region not found
      y: region?.y || 50, // Default to center if region not found
      size: getHotspotSize(symptom.painLevel || 1),
      color: severityColor,
      label: getAnatomicalLabel(regionId, symptom.symptomName),
      description: symptom.notes || 'No description provided',
      severity: symptom.painLevel || 1
    };
  });
};

/**
 * Returns proper anatomical label based on region and symptom
 */
const getAnatomicalLabel = (regionId: string, symptomName?: string): string => {
  // Find the formal name from the regions list
  const region = anatomicalRegions.find(r => r.id === regionId);
  
  if (symptomName) {
    return `${region?.name || regionId}: ${symptomName}`;
  }
  
  return region?.name || regionId;
};

/**
 * Maps symptom location from SymptomEntry to region ID
 */
const mapSymptomLocationToRegion = (location: string): string => {
  // Direct mapping if the location matches a region ID
  if (!location) return 'chest';
  
  if (anatomicalRegions.some(region => region.id === location)) {
    return location;
  }

  // Handle special cases or format differences
  switch (location.toLowerCase()) {
    case 'rightshoulder': return 'right-shoulder';
    case 'leftshoulder': return 'left-shoulder';
    case 'rightelbow': return 'right-elbow';
    case 'leftelbow': return 'left-elbow';
    case 'rightforearm': return 'right-forearm';
    case 'leftforearm': return 'left-forearm';
    case 'rightwrist': return 'right-hand';
    case 'leftwrist': return 'left-hand';
    case 'righthip': return 'right-hip';
    case 'lefthip': return 'left-hip';
    case 'rightthigh': return 'right-thigh';
    case 'leftthigh': return 'left-thigh';
    case 'rightknee': return 'right-knee';
    case 'leftknee': return 'left-knee';
    case 'rightcalf': return 'right-calf';
    case 'leftcalf': return 'left-calf';
    case 'rightankle': return 'right-foot';
    case 'leftankle': return 'left-foot';
    case 'upperback': return 'upper-back';
    case 'lowerback': return 'lower-back';
    default: return 'chest'; // Default to chest if no matching region
  }
};

/**
 * Determines hotspot size based on symptom severity
 */
const getHotspotSize = (severity: number): number => {
  // Scale size based on severity (1-10)
  return Math.max(24, Math.min(36, 24 + (severity * 1.5)));
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

/**
 * Get anatomical region by ID
 */
export const getAnatomicalRegionById = (id: string): AnatomicalRegion | undefined => {
  return anatomicalRegions.find(region => region.id === id);
};
