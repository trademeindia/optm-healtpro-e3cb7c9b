
import { AnatomicalRegion } from './types';

// Updated anatomical regions with accurate coordinates
export const anatomicalRegions: Record<string, AnatomicalRegion> = {
  head: { id: 'region-head', name: 'Head', x: 50, y: 9 },
  neck: { id: 'region-neck', name: 'Neck', x: 50, y: 15 },
  rightShoulder: { id: 'region-r-shoulder', name: 'Right Shoulder', x: 41, y: 21 },
  leftShoulder: { id: 'region-l-shoulder', name: 'Left Shoulder', x: 59, y: 21 },
  chest: { id: 'region-chest', name: 'Chest', x: 50, y: 25 },
  upperBack: { id: 'region-upper-back', name: 'Upper Back', x: 50, y: 25 },
  rightElbow: { id: 'region-r-elbow', name: 'Right Elbow', x: 35, y: 35 },
  leftElbow: { id: 'region-l-elbow', name: 'Left Elbow', x: 65, y: 35 },
  abdomen: { id: 'region-abdomen', name: 'Abdomen', x: 50, y: 36 },
  lowerBack: { id: 'region-lower-back', name: 'Lower Back', x: 50, y: 37 },
  rightWrist: { id: 'region-r-wrist', name: 'Right Wrist', x: 33, y: 44 },
  leftWrist: { id: 'region-l-wrist', name: 'Left Wrist', x: 67, y: 44 },
  rightHip: { id: 'region-r-hip', name: 'Right Hip', x: 42, y: 48 },
  leftHip: { id: 'region-l-hip', name: 'Left Hip', x: 58, y: 48 },
  rightKnee: { id: 'region-r-knee', name: 'Right Knee', x: 42, y: 67 },
  leftKnee: { id: 'region-l-knee', name: 'Left Knee', x: 58, y: 67 },
  rightAnkle: { id: 'region-r-ankle', name: 'Right Ankle', x: 42, y: 84 },
  leftAnkle: { id: 'region-l-ankle', name: 'Left Ankle', x: 58, y: 84 },
  rightFoot: { id: 'region-r-foot', name: 'Right Foot', x: 43, y: 91 },
  leftFoot: { id: 'region-l-foot', name: 'Left Foot', x: 57, y: 91 },
  rightHand: { id: 'region-r-hand', name: 'Right Hand', x: 31, y: 48 },
  leftHand: { id: 'region-l-hand', name: 'Left Hand', x: 69, y: 48 },
  rightFinger: { id: 'region-r-finger', name: 'Right Finger', x: 30, y: 51 },
  leftFinger: { id: 'region-l-finger', name: 'Left Finger', x: 70, y: 51 },
};

// Helper function to get hotspot position based on region
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
