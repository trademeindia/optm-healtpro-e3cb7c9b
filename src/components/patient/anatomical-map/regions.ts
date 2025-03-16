
import { AnatomicalRegion } from './types';

export const anatomicalRegions: AnatomicalRegion[] = [
  {
    id: 'head',
    name: 'Head',
    x: 50,
    y: 8
  },
  {
    id: 'neck',
    name: 'Neck',
    x: 50,
    y: 15
  },
  {
    id: 'chest',
    name: 'Chest',
    x: 50,
    y: 25
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    x: 50,
    y: 38
  },
  {
    id: 'pelvis',
    name: 'Pelvis',
    x: 50,
    y: 50
  },
  {
    id: 'left-shoulder',
    name: 'Left Shoulder',
    x: 35,
    y: 20
  },
  {
    id: 'right-shoulder',
    name: 'Right Shoulder',
    x: 65,
    y: 20
  },
  {
    id: 'left-arm',
    name: 'Left Arm',
    x: 28,
    y: 30
  },
  {
    id: 'right-arm',
    name: 'Right Arm',
    x: 72,
    y: 30
  },
  {
    id: 'left-elbow',
    name: 'Left Elbow',
    x: 25,
    y: 37
  },
  {
    id: 'right-elbow',
    name: 'Right Elbow',
    x: 75,
    y: 37
  },
  {
    id: 'left-hand',
    name: 'Left Hand',
    x: 20,
    y: 45
  },
  {
    id: 'right-hand',
    name: 'Right Hand',
    x: 80,
    y: 45
  },
  {
    id: 'left-hip',
    name: 'Left Hip',
    x: 43,
    y: 50
  },
  {
    id: 'right-hip',
    name: 'Right Hip',
    x: 57,
    y: 50
  },
  {
    id: 'left-thigh',
    name: 'Left Thigh',
    x: 40,
    y: 60
  },
  {
    id: 'right-thigh',
    name: 'Right Thigh',
    x: 60,
    y: 60
  },
  {
    id: 'left-knee',
    name: 'Left Knee',
    x: 40,
    y: 70
  },
  {
    id: 'right-knee',
    name: 'Right Knee',
    x: 60,
    y: 70
  },
  {
    id: 'left-calf',
    name: 'Left Calf',
    x: 40,
    y: 80
  },
  {
    id: 'right-calf',
    name: 'Right Calf',
    x: 60,
    y: 80
  },
  {
    id: 'left-foot',
    name: 'Left Foot',
    x: 40,
    y: 93
  },
  {
    id: 'right-foot',
    name: 'Right Foot',
    x: 60,
    y: 93
  },
  {
    id: 'upper-back',
    name: 'Upper Back',
    x: 50,
    y: 25
  },
  {
    id: 'lower-back',
    name: 'Lower Back',
    x: 50,
    y: 42
  }
];

// Helper function to get position from region ID
export const getHotspotPosition = (regionId: string): { x: number; y: number } => {
  const region = anatomicalRegions.find(r => r.id === regionId);
  return {
    x: region?.x || 50, // Default to center if region not found
    y: region?.y || 50
  };
};
