import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealthData } from '@/hooks/useHealthData';
import { HealthMetric, HealthMetricType } from '@/services/health';
import { Dumbbell } from 'lucide-react';

const WorkoutSummary: React.FC = () => {
  const { metrics } = useHealthData();
  
  const workoutMetric: HealthMetric | null = metrics.workout;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="h-5 w-5 mr-2 text-orange-500" />
          Workout Summary
        </CardTitle>
        <CardDescription>
          Your latest workout details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {workoutMetric ? (
          <div>
            <p className="text-sm text-muted-foreground">
              Type: {workoutMetric.metadata?.workoutType || 'Unknown'}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {workoutMetric.value} {workoutMetric.unit}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {new Date(workoutMetric.timestamp).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No workout data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutSummary;

