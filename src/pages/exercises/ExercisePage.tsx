
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Dumbbell } from 'lucide-react';
import MotionTracker from '@/components/exercises/motion-tracker/MotionTracker';

const ExercisePage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<{ id: string; name: string } | null>(null);
  
  const exercises = [
    { id: 'squat', name: 'Squats' },
    { id: 'lunge', name: 'Lunges' },
    { id: 'pushup', name: 'Push-ups' }
  ];
  
  const handleSelectExercise = (exercise: { id: string; name: string }) => {
    setSelectedExercise(exercise);
  };
  
  const handleFinishExercise = () => {
    setSelectedExercise(null);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Exercise Tracker</h1>
      
      {!selectedExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
                <CardDescription>AI-guided motion tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Dumbbell className="h-8 w-8 text-primary" />
                  </div>
                  <Button onClick={() => handleSelectExercise(exercise)}>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <MotionTracker
          exerciseId={selectedExercise.id}
          exerciseName={selectedExercise.name}
          onFinish={handleFinishExercise}
        />
      )}
    </div>
  );
};

export default ExercisePage;
