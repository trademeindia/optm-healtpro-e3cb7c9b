
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '@/types/exercise.types'; 
import { Button } from '@/components/ui/button';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import { Play } from 'lucide-react';
import MotionTracker from '@/components/exercises/motion-tracking';

interface ExerciseContentProps {
  exercise: Exercise;
}

const ExerciseContent: React.FC<ExerciseContentProps> = ({ exercise }) => {
  const navigate = useNavigate();
  const [showMotionTracker, setShowMotionTracker] = React.useState(false);
  
  const handleStartExercise = () => {
    setShowMotionTracker(true);
  };
  
  const handleFinishExercise = () => {
    setShowMotionTracker(false);
    // Here you would typically update the completion status
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
        <div className="p-6">
          <h1 className="text-2xl font-bold">{exercise.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {exercise.difficulty}
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {exercise.duration}
            </span>
            {exercise.muscleGroups.map((group) => (
              <span key={group} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {group}
              </span>
            ))}
          </div>
          <p className="mt-4 text-muted-foreground">{exercise.description}</p>
          
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
          exerciseId={exercise.id}
          exerciseName={exercise.title}
          onFinish={handleFinishExercise}
        />
      ) : (
        <ExerciseVideo exercise={exercise} />
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
