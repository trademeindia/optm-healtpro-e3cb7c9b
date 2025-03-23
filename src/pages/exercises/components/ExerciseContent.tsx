
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '@/types/exercise.types'; 
import { Button } from '@/components/ui/button';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import { Play, Dumbbell, Clock, Award } from 'lucide-react';
import MotionTracker from '@/components/exercises/motion-tracking';
import { Card, CardContent } from '@/components/ui/card';

interface ExerciseContentProps {
  filteredExercises: Exercise[];
  selectedExercise: Exercise | null;
  activeCategory: string | null;
  onCategoryFilter: (category: string | null) => void;
  onStartExercise: (exerciseId: string) => void;
  onFinishExercise: () => void;
  showMonitor: boolean;
  setShowMonitor: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExerciseContent: React.FC<ExerciseContentProps> = ({ 
  filteredExercises, 
  selectedExercise, 
  activeCategory, 
  onCategoryFilter, 
  onStartExercise, 
  onFinishExercise, 
  showMonitor, 
  setShowMonitor 
}) => {
  const navigate = useNavigate();
  const [showMotionTracker, setShowMotionTracker] = React.useState(false);
  
  // Check if selectedExercise is null and handle it
  if (!selectedExercise) {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden border shadow-sm">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold">Select an Exercise</h1>
            <p className="mt-4 text-muted-foreground">
              Please select an exercise from the list to get started.
            </p>
            
            {filteredExercises.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">Available Exercises:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredExercises.slice(0, 6).map(exercise => (
                    <Button 
                      key={exercise.id}
                      variant="outline" 
                      onClick={() => onStartExercise(exercise.id)}
                      className="justify-start text-left h-auto py-3 px-4"
                    >
                      <div>
                        <div className="font-medium">{exercise.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{exercise.duration} • {exercise.difficulty}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleStartExercise = () => {
    setShowMotionTracker(true);
  };
  
  const handleFinishExercise = () => {
    setShowMotionTracker(false);
    onFinishExercise();
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold">{selectedExercise.title}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Award className="h-3.5 w-3.5 mr-1" />
              {selectedExercise.difficulty}
            </div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {selectedExercise.duration}
            </div>
            {selectedExercise.muscleGroups.map((group) => (
              <div key={group} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Dumbbell className="h-3.5 w-3.5 mr-1" />
                {group}
              </div>
            ))}
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{selectedExercise.description}</p>
          
          {!showMotionTracker && (
            <Button 
              onClick={handleStartExercise} 
              className="mt-6 gap-2 shadow-sm"
              size="lg"
            >
              <Play className="h-4 w-4" />
              Start Exercise
            </Button>
          )}
        </CardContent>
      </Card>
      
      {showMotionTracker ? (
        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold">Motion Tracking</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Position yourself in front of the camera for analysis</p>
            </div>
            <MotionTracker
              exerciseId={selectedExercise.id}
              exerciseName={selectedExercise.title}
              onFinish={handleFinishExercise}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold">Exercise Demonstration</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Watch the video for proper form guidance</p>
            </div>
            <ExerciseVideo exercise={selectedExercise} />
          </CardContent>
        </Card>
      )}
      
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Exercise Instructions</h2>
          <ol className="list-decimal pl-5 space-y-3 text-sm">
            <li className="pl-1">Position yourself in front of the camera so your full body is visible.</li>
            <li className="pl-1">Follow the exercise demonstration video for proper form.</li>
            <li className="pl-1">The AI will track your movements and provide real-time feedback.</li>
            <li className="pl-1">Complete the recommended number of repetitions with good form.</li>
            <li className="pl-1">Take breaks if needed and focus on quality over quantity.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseContent;
