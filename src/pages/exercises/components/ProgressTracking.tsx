
import React from 'react';
import MuscleProgress from '@/components/exercises/MuscleProgress';
import WeeklyGoals from './WeeklyGoals';
import DoctorRecommendations from './DoctorRecommendations';
import { MuscleGroup, ProgressData } from '@/types/exercise.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressTrackingProps {
  muscleGroups: MuscleGroup[];
  progressData: ProgressData[];
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  muscleGroups,
  progressData
}) => {
  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <MuscleProgress 
            muscleGroups={muscleGroups}
            progressData={progressData}
          />
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyGoals />
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorRecommendations />
        </CardContent>
      </Card>
    </>
  );
};

export default ProgressTracking;
