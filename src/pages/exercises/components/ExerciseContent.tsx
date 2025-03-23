
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '@/types/exercise.types'; 
import { Button } from '@/components/ui/button';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import { Play } from 'lucide-react';
import MotionTracker from '@/components/exercises/motion-tracking';

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
    // Display a message or return a placeholder when no exercise is selected
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Select an Exercise</h1>
            <p className="mt-4 text-muted-foreground">
              Please select an exercise from the list to get started.
            </p>
            
            {filteredExercises.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">Available Exercises:</h2>
                <ul className="space-y-2">
                  {filteredExercises.slice(0, 5).map(exercise => (
                    <li key={exercise.id}>
                      <Button 
                        variant="ghost" 
                        onClick={() => onStartExercise(exercise.id)}
                        className="w-full justify-start text-left"
                      >
                        {exercise.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  const handleStartExercise = () => {
    setShowMotionTracker(true);
  };
  
  const handleFinishExercise = () => {
    setShowMotionTracker(false);
    // Here you would typically update the completion status
    onFinishExercise();
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
        <div className="p-6">
          <h1 className="text-2xl font-bold">{selectedExercise.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {selectedExercise.difficulty}
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {selectedExercise.duration}
            </span>
            {selectedExercise.muscleGroups.map((group) => (
              <span key={group} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {group}
              </span>
            ))}
          </div>
          <p className="mt-4 text-muted-foreground">{selectedExercise.description}</p>
          
          {!showMotionTracker && (
            <Button 
              onClick={handleStartExercise} 
              className="mt-6 gap-2"
            >
              <Play className="h-4 w-4" />
              Start Exercise
            </Button>
          )}
        </div>
      </div>
      
      {showMotionTracker ? (
        <MotionTracker
          exerciseId={selectedExercise.id}
          exerciseName={selectedExercise.title}
          onFinish={handleFinishExercise}
        />
      ) : (
        <ExerciseVideo exercise={selectedExercise} />
      )}
      
      <div className="bg-card rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Exercise Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Position yourself in front of the camera so your full body is visible.</li>
          <li>Follow the exercise demonstration video for proper form.</li>
          <li>The AI will track your movements and provide real-time feedback.</li>
          <li>Complete the recommended number of repetitions with good form.</li>
          <li>Take breaks if needed and focus on quality over quantity.</li>
        </ol>
      </div>
    </div>
  );
};

export default ExerciseContent;
