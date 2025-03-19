
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { HealthMetric } from '@/services/health';

interface LatestWorkoutDetailsProps {
  latestWorkout: HealthMetric | null;
}

const LatestWorkoutDetails: React.FC<LatestWorkoutDetailsProps> = ({ latestWorkout }) => {
  if (!latestWorkout) return null;
  
  return (
    <CardContent className="pt-0">
      <div>
        <h3 className="text-lg font-semibold">Latest Workout</h3>
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted-foreground">
            Type: {latestWorkout.metadata?.workoutType || 'Unknown'}
          </p>
          <p className="text-sm text-muted-foreground">
            Duration: {latestWorkout.value} {latestWorkout.unit}
          </p>
          <p className="text-sm text-muted-foreground">
            Date: {new Date(latestWorkout.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default LatestWorkoutDetails;
