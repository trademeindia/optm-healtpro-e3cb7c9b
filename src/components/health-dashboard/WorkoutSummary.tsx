
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthMetric, TimeRange } from '@/services/health';
import { Dumbbell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkoutSummaryProps {
  workoutData: HealthMetric[];
  timeRange: TimeRange;
  isLoading: boolean;
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workoutData,
  timeRange,
  isLoading
}) => {
  const latestWorkout = workoutData && workoutData.length > 0 
    ? workoutData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[120px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="h-5 w-5 mr-2 text-orange-500" />
          Workout Summary
        </CardTitle>
        <CardDescription>
          Your workout data for the {timeRange} period
        </CardDescription>
      </CardHeader>
      <CardContent>
        {workoutData.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Latest Workout</h3>
              {latestWorkout && (
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
              )}
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold">Workout Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                  <p className="text-xl font-bold">{workoutData.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <p className="text-xl font-bold">
                    {Math.round(workoutData.reduce((sum, w) => sum + w.value, 0) / workoutData.length)} min
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No workout data available for the selected period.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutSummary;
