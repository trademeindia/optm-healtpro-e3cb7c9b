
import React from 'react';
import { Card } from '@/components/ui/card';
import { HealthMetric, TimeRange } from '@/services/health';
import WorkoutHeader from './WorkoutHeader';
import LatestWorkoutDetails from './LatestWorkoutDetails';
import WorkoutStatistics from './WorkoutStatistics';
import WorkoutEmptyState from './WorkoutEmptyState';
import WorkoutLoadingSkeleton from './WorkoutLoadingSkeleton';

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
  // Sort workouts by date, most recent first
  const latestWorkout = workoutData && workoutData.length > 0 
    ? workoutData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;
  
  if (isLoading) {
    return <WorkoutLoadingSkeleton />;
  }
  
  return (
    <Card>
      <WorkoutHeader timeRange={timeRange} />
      
      {workoutData.length > 0 ? (
        <div className="space-y-4">
          <LatestWorkoutDetails latestWorkout={latestWorkout} />
          <WorkoutStatistics workoutData={workoutData} />
        </div>
      ) : (
        <WorkoutEmptyState />
      )}
    </Card>
  );
};

export default WorkoutSummary;
