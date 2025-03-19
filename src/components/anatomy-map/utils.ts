
import { PainSymptom, BodyRegion } from './types';
import { HealthIssue } from '@/components/patient-dashboard/anatomical-map/types';
import { HotSpot } from './types';

// Helper to get pain color based on severity
export const getPainSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'severe':
    case 'high':
      return 'bg-red-500';
    case 'moderate':
    case 'medium':
      return 'bg-orange-500';
    case 'mild':
    case 'low':
    default:
      return 'bg-yellow-500';
  }
};

// Convert symptoms to hotspots for display on the map
export const symptomsToHotspots = (symptoms: PainSymptom[]): HotSpot[] => {
  if (!symptoms || symptoms.length === 0) return [];
  
  return symptoms
    .filter(symptom => symptom.isActive !== false) // Only show active symptoms
    .map(symptom => {
      return {
        id: symptom.id,
        position: {
          x: getCoordinateByRegionId(symptom.bodyRegionId)?.x || 50,
          y: getCoordinateByRegionId(symptom.bodyRegionId)?.y || 50,
        },
        label: symptom.painType,
        description: symptom.description,
        color: getPainSeverityColor(symptom.severity),
        type: 'symptom',
        metadata: {
          severity: symptom.severity,
          createdAt: symptom.createdAt,
          regionId: symptom.bodyRegionId
        }
      };
    });
};

// Convert health issues to hotspots
export const healthIssuesToHotspots = (healthIssues: HealthIssue[]): HotSpot[] => {
  if (!healthIssues || healthIssues.length === 0) return [];
  
  return healthIssues.map(issue => {
    return {
      id: `anatomical-${issue.id}`,
      position: {
        x: issue.location.x,
        y: issue.location.y
      },
      label: issue.name,
      description: issue.description,
      color: getPainSeverityColor(issue.severity),
      type: 'health-issue',
      metadata: {
        severity: issue.severity,
        muscleGroup: issue.muscleGroup,
        symptoms: issue.symptoms,
        recommendedActions: issue.recommendedActions
      }
    };
  });
};

// Helper to get region coordinates by ID
const getCoordinateByRegionId = (regionId: string): { x: number; y: number } | null => {
  // Map region IDs to coordinates
  const regionCoordinates: Record<string, { x: number; y: number }> = {
    'head': { x: 50, y: 10 },
    'neck': { x: 50, y: 15 },
    'chest': { x: 50, y: 25 },
    'abdomen': { x: 50, y: 35 },
    'leftShoulder': { x: 35, y: 20 },
    'rightShoulder': { x: 65, y: 20 },
    'leftArm': { x: 30, y: 30 },
    'rightArm': { x: 70, y: 30 },
    'leftHand': { x: 25, y: 40 },
    'rightHand': { x: 75, y: 40 },
    'lowerBack': { x: 50, y: 45 },
    'pelvis': { x: 50, y: 55 },
    'leftLeg': { x: 40, y: 70 },
    'rightLeg': { x: 60, y: 70 },
    'leftFoot': { x: 40, y: 90 },
    'rightFoot': { x: 60, y: 90 },
    // Add more regions as needed
  };
  
  return regionCoordinates[regionId] || null;
};

// Add to types.ts if needed
export interface HotSpot {
  id: string;
  position: {
    x: number;
    y: number;
  };
  label: string;
  description: string;
  color: string;
  type: 'symptom' | 'health-issue';
  metadata: {
    severity: string;
    [key: string]: any;
  };
}
