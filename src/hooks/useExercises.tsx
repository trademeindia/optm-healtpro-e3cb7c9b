
import { useState, useEffect } from 'react';

// Define exercise types
export interface Exercise {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  category: 'rehabilitation' | 'strength' | 'flexibility' | 'cardio';
  completionStatus?: 'completed' | 'in-progress' | 'not-started';
}

export interface MuscleGroup {
  id: string;
  name: string;
  progress: number;
}

export interface ProgressData {
  date: string;
  strength: number;
  flexibility: number;
  endurance: number;
}

// Mock data for exercises
const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    title: 'Lower Back Stretches',
    description: 'Gentle stretches to alleviate lower back pain and improve flexibility',
    videoUrl: 'https://cdn.videvo.net/videvo_files/video/premium/video0294/large_watermarked/901-1_901-0068_preview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    duration: '8 mins',
    difficulty: 'beginner',
    muscleGroups: ['Lower Back', 'Core'],
    category: 'rehabilitation',
    completionStatus: 'completed'
  },
  {
    id: 'ex2',
    title: 'Shoulder Mobility Exercises',
    description: 'Improve range of motion and reduce pain with these shoulder exercises',
    videoUrl: 'https://cdn.videvo.net/videvo_files/video/premium/video0294/large_watermarked/901-1_901-0374_preview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80',
    duration: '10 mins',
    difficulty: 'beginner',
    muscleGroups: ['Shoulders', 'Upper Back'],
    category: 'rehabilitation',
    completionStatus: 'in-progress'
  },
  {
    id: 'ex3',
    title: 'Core Strengthening',
    description: 'Build a stronger core to support your spine and improve posture',
    videoUrl: 'https://cdn.videvo.net/videvo_files/video/premium/video0294/large_watermarked/901-1_901-0095_preview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    duration: '15 mins',
    difficulty: 'intermediate',
    muscleGroups: ['Abs', 'Core', 'Lower Back'],
    category: 'strength',
    completionStatus: 'not-started'
  },
  {
    id: 'ex4',
    title: 'Hip Mobility Routine',
    description: 'Increase hip mobility and reduce stiffness with these targeted exercises',
    videoUrl: 'https://cdn.videvo.net/videvo_files/video/premium/video0294/large_watermarked/901-1_901-0226_preview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544216575-c8ab683ae801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    duration: '12 mins',
    difficulty: 'beginner',
    muscleGroups: ['Hip Flexors', 'Glutes'],
    category: 'flexibility',
    completionStatus: 'not-started'
  },
  {
    id: 'ex5',
    title: 'Full Body Stretching',
    description: 'A complete stretching routine to improve flexibility and reduce muscle tension',
    videoUrl: 'https://cdn.videvo.net/videvo_files/video/premium/video0294/large_watermarked/901-1_901-0107_preview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    duration: '20 mins',
    difficulty: 'intermediate',
    muscleGroups: ['Full Body'],
    category: 'flexibility',
    completionStatus: 'not-started'
  },
  {
    id: 'ex6',
    title: 'Low Impact Cardio',
    description: 'Gentle cardio exercises that are easy on the joints but effective for heart health',
    videoUrl: 'https://cdn.videvo.net/videvo_files/video/premium/video0294/large_watermarked/901-1_901-0265_preview.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    duration: '25 mins',
    difficulty: 'intermediate',
    muscleGroups: ['Cardiovascular'],
    category: 'cardio',
    completionStatus: 'not-started'
  }
];

// Mock data for muscle groups
const mockMuscleGroups: MuscleGroup[] = [
  { id: 'm1', name: 'Lower Back', progress: 68 },
  { id: 'm2', name: 'Core', progress: 75 },
  { id: 'm3', name: 'Shoulders', progress: 45 },
  { id: 'm4', name: 'Upper Back', progress: 52 },
  { id: 'm5', name: 'Hip Flexors', progress: 38 },
  { id: 'm6', name: 'Glutes', progress: 58 },
  { id: 'm7', name: 'Hamstrings', progress: 42 },
  { id: 'm8', name: 'Quadriceps', progress: 60 }
];

// Mock data for progress chart
const mockProgressData: ProgressData[] = [
  { date: 'May 1', strength: 30, flexibility: 40, endurance: 25 },
  { date: 'May 8', strength: 35, flexibility: 42, endurance: 30 },
  { date: 'May 15', strength: 40, flexibility: 45, endurance: 35 },
  { date: 'May 22', strength: 43, flexibility: 48, endurance: 38 },
  { date: 'May 29', strength: 48, flexibility: 50, endurance: 42 },
  { date: 'Jun 5', strength: 52, flexibility: 54, endurance: 45 },
  { date: 'Jun 12', strength: 58, flexibility: 60, endurance: 50 }
];

const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>(mockMuscleGroups);
  const [progressData, setProgressData] = useState<ProgressData[]>(mockProgressData);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Function to mark exercise as completed
  const markExerciseCompleted = (exerciseId: string) => {
    setExercises(prevExercises => 
      prevExercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, completionStatus: 'completed' } 
          : ex
      )
    );
    
    // In a real app, we would also update the progress data based on completion
    // For demo, we'll just add a bit to the latest progress data point
    setProgressData(prev => {
      const lastIndex = prev.length - 1;
      const lastItem = prev[lastIndex];
      
      return [
        ...prev.slice(0, lastIndex),
        {
          ...lastItem,
          strength: Math.min(lastItem.strength + 2, 100),
          flexibility: Math.min(lastItem.flexibility + 2, 100),
          endurance: Math.min(lastItem.endurance + 2, 100)
        }
      ];
    });
    
    // Update muscle groups progress
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setMuscleGroups(prev => 
        prev.map(muscle => 
          exercise.muscleGroups.includes(muscle.name)
            ? { ...muscle, progress: Math.min(muscle.progress + 5, 100) }
            : muscle
        )
      );
    }
  };

  // Function to start an exercise (mark as in-progress)
  const startExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      
      setExercises(prevExercises => 
        prevExercises.map(ex => 
          ex.id === exerciseId && ex.completionStatus !== 'completed'
            ? { ...ex, completionStatus: 'in-progress' } 
            : ex
        )
      );
    }
  };

  // Function to filter exercises by category
  const filterExercisesByCategory = (category: string | null) => {
    if (!category) return exercises;
    return exercises.filter(ex => ex.category === category);
  };

  // Function to get a specific exercise by ID
  const getExerciseById = (id: string) => {
    return exercises.find(ex => ex.id === id) || null;
  };

  return {
    exercises,
    muscleGroups,
    progressData,
    selectedExercise,
    setSelectedExercise,
    markExerciseCompleted,
    startExercise,
    filterExercisesByCategory,
    getExerciseById
  };
};

export default useExercises;
