
import { useState, useCallback } from 'react';
import { Exercise, MuscleGroup, ProgressData } from '@/types/exercise.types';

// Mock data for development
const mockExercises: Exercise[] = [
  {
    id: '1',
    title: 'Squat Form Check',
    description: 'Perfect your squat technique with AI-powered form guidance.',
    videoUrl: '/videos/squat.mp4',
    thumbnailUrl: '/images/squat.jpg',
    duration: '5 min',
    difficulty: 'beginner',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    category: 'squat',
    completionStatus: 'not-started'
  },
  {
    id: '2',
    title: 'Lunge Form Analysis',
    description: 'Improve your lunge technique with real-time feedback.',
    videoUrl: '/videos/lunge.mp4',
    thumbnailUrl: '/images/lunge.jpg',
    duration: '7 min',
    difficulty: 'intermediate',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    category: 'squat',
    completionStatus: 'not-started'
  },
  {
    id: '3',
    title: 'Shoulder Mobility',
    description: 'Enhance your shoulder range of motion with targeted exercises.',
    videoUrl: '/videos/shoulder.mp4',
    thumbnailUrl: '/images/shoulder.jpg',
    duration: '10 min',
    difficulty: 'beginner',
    muscleGroups: ['Shoulders', 'Upper Back'],
    category: 'flexibility',
    completionStatus: 'not-started'
  },
  {
    id: '4',
    title: 'Posture Correction',
    description: 'Improve your standing and sitting posture with guided exercises.',
    videoUrl: '/videos/posture.mp4',
    thumbnailUrl: '/images/posture.jpg',
    duration: '8 min',
    difficulty: 'beginner',
    muscleGroups: ['Upper Back', 'Core', 'Neck'],
    category: 'rehabilitation',
    completionStatus: 'not-started'
  }
];

const mockMuscleGroups: MuscleGroup[] = [
  { id: '1', name: 'Quadriceps', progress: 65 },
  { id: '2', name: 'Hamstrings', progress: 40 },
  { id: '3', name: 'Glutes', progress: 75 },
  { id: '4', name: 'Core', progress: 60 },
  { id: '5', name: 'Upper Back', progress: 50 }
];

const mockProgressData: ProgressData[] = [
  { date: '2023-05-01', strength: 60, flexibility: 40, endurance: 30 },
  { date: '2023-05-15', strength: 65, flexibility: 45, endurance: 35 },
  { date: '2023-06-01', strength: 70, flexibility: 50, endurance: 40 },
  { date: '2023-06-15', strength: 75, flexibility: 55, endurance: 45 },
  { date: '2023-07-01', strength: 80, flexibility: 60, endurance: 50 }
];

const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Filter exercises by category
  const filterExercisesByCategory = useCallback((category: string | null) => {
    if (!category) return exercises;
    return exercises.filter(exercise => exercise.category === category);
  }, [exercises]);
  
  // Start an exercise by ID
  const startExercise = useCallback((exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      
      // Update exercise status to in-progress
      setExercises(prev => 
        prev.map(ex => 
          ex.id === exerciseId 
            ? { ...ex, completionStatus: 'in-progress' as const } 
            : ex
        )
      );
    }
  }, [exercises]);
  
  // Mark exercise as completed
  const markExerciseCompleted = useCallback((exerciseId: string) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, completionStatus: 'completed' as const } 
          : ex
      )
    );
  }, []);
  
  return {
    exercises,
    muscleGroups: mockMuscleGroups,
    progressData: mockProgressData,
    selectedExercise,
    setSelectedExercise,
    filterExercisesByCategory,
    startExercise,
    markExerciseCompleted
  };
};

export default useExercises;
