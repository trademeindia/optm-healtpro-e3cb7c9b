
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
      return '/lovable-uploads/79c52bff-8e92-4d16-ac74-e5b73ead47d8.png';
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
    
    // Get precise position with fine-tuned adjustments for accurate alignment
    const position = getPrecisePosition(region?.x || 50, region?.y || 50, symptom.location);
    
    // Constrain position to stay within the image boundaries (5-95% range)
    const constrainedPosition = {
      x: Math.min(Math.max(position.x, 5), 95),
      y: Math.min(Math.max(position.y, 5), 95)
    };
    
    return {
      id: symptom.id,
      region: regionId,
      x: constrainedPosition.x, 
      y: constrainedPosition.y,
      label: symptom.symptomName,
      description: symptom.notes || 'No description provided',
      severity: symptom.painLevel || 1
    };
  });
};

/**
 * Fine-tune position based on specific body part for precise alignment
 */
const getPrecisePosition = (x: number, y: number, location: string) => {
  // Better adjustments for more accurate placement on the muscular system
  switch(location) {
    // Head and neck region
    case 'head':
      return { x, y: y - 2 };
    case 'neck':
      return { x, y };
      
    // Upper body regions
    case 'right-shoulder':
    case 'rightShoulder':
      return { x: x - 1, y };
    case 'left-shoulder':
    case 'leftShoulder':
      return { x: x + 1, y };
    case 'chest':
      return { x, y: y - 0.5 };
    case 'upper-back':
    case 'upperBack':
      return { x, y: y - 1 };
      
    // Mid body regions
    case 'abdomen':
      return { x, y };
    case 'lower-back':
    case 'lowerBack':
      return { x, y: y + 1 };
      
    // Arms and hands
    case 'right-elbow':
    case 'rightElbow':
      return { x: x - 1, y };
    case 'left-elbow':
    case 'leftElbow':
      return { x: x + 1, y };
    case 'right-hand':
    case 'rightWrist':
    case 'rightHand':
      return { x: x - 1, y };
    case 'left-hand':
    case 'leftWrist':
    case 'leftHand':
      return { x: x + 1, y };
      
    // Lower body
    case 'right-hip':
    case 'rightHip':
      return { x: x - 1, y };
    case 'left-hip':
    case 'leftHip':
      return { x: x + 1, y };
    case 'right-knee':
    case 'rightKnee':
      return { x: x - 0.5, y };
    case 'left-knee':
    case 'leftKnee':
      return { x: x + 0.5, y };
    case 'right-foot':
    case 'rightAnkle':
    case 'rightFoot':
      return { x: x - 0.5, y };
    case 'left-foot':
    case 'leftAnkle':
    case 'leftFoot':
      return { x: x + 0.5, y };
      
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
    case 'rightWrist': 
    case 'rightHand': return 'right-hand';
    case 'leftWrist': 
    case 'leftHand': return 'left-hand';
    case 'rightHip': return 'right-hip';
    case 'leftHip': return 'left-hip';
    case 'rightKnee': return 'right-knee';
    case 'leftKnee': return 'left-knee';
    case 'rightAnkle': 
    case 'rightFoot': return 'right-foot';
    case 'leftAnkle': 
    case 'leftFoot': return 'left-foot';
    case 'upperBack': return 'upper-back';
    case 'lowerBack': return 'lower-back';
    default: return 'chest'; // Default to chest if no matching region
  }
};

/**
 * Get text color for contrast against the background
 */
export const getContrastTextColor = (backgroundColor: string): string => {
  return 'white'; // Using white consistently for text contrast
};
