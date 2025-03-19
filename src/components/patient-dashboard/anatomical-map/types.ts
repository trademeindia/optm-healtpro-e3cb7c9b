
// Health issue interface for anatomical map visualization
export interface HealthIssue {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location: {
    x: number;
    y: number;
  };
  muscleGroup?: string;
  symptoms?: string[];
  recommendedActions?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// Muscle flexion data for visualization
export interface MuscleFlexion {
  id: string;
  muscleGroup: string;
  muscle: string; // Added muscle property
  flexionPercentage: number;
  status: 'normal' | 'limited' | 'excessive' | 'weak' | 'overworked' | 'healthy'; // Added missing statuses
  region: string;
  relatedIssues: string[];
  lastReading?: Date; // Added lastReading property
}
