
import React from 'react';
import MuscleProgress from '@/components/exercises/MuscleProgress';
import WeeklyGoals from './WeeklyGoals';
import DoctorRecommendations from './DoctorRecommendations';
import { MuscleGroup, ProgressData } from '@/types/exercise.types';

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
      <MuscleProgress 
        muscleGroups={muscleGroups}
        progressData={progressData}
      />
      
      <WeeklyGoals />
      
      <DoctorRecommendations />
    </>
  );
};

export default ProgressTracking;
