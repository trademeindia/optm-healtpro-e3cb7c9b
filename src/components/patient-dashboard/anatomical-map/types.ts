
export interface HealthIssue {
  id: string;
  name: string;
  location: { x: number; y: number };
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface MuscleFlexion {
  muscle: string;
  flexionPercentage: number;
  status: 'healthy' | 'weak' | 'overworked';
  lastReading: string;
}
