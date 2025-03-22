
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import PostureMonitor from '@/components/exercises/PostureMonitor';
import CategoryFilter from './CategoryFilter';
import { Exercise } from '@/types/exercise.types';
import BodyTrackerExercisePage from '@/components/exercises/body-tracker/BodyTrackerExercisePage';

interface ExerciseContentProps {
  showMonitor: boolean;
  selectedExercise: Exercise | null;
  filteredExercises: Exercise[];
  activeCategory: string | null;
  onCategoryFilter: (category: string | null) => void;
  onStartExercise: (exerciseId: string) => void;
  onFinishExercise: () => void;
  setShowMonitor: (show: boolean) => void;
}

const ExerciseContent: React.FC<ExerciseContentProps> = ({
  showMonitor,
  selectedExercise,
  filteredExercises,
  activeCategory,
  onCategoryFilter,
  onStartExercise,
  onFinishExercise,
  setShowMonitor
}) => {
  return (
    <>
      {showMonitor ? (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => setShowMonitor(false)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Exercises</span>
          </Button>
          
          <PostureMonitor 
            exerciseId={selectedExercise?.id || null}
            exerciseName={selectedExercise?.title || null}
            onFinish={onFinishExercise}
          />
        </div>
      ) : (
        <>
          <CategoryFilter 
            activeCategory={activeCategory}
            onCategoryFilter={onCategoryFilter}
          />
          
          {/* Add the BodyTracker component at the top of the exercise list */}
          <BodyTrackerExercisePage />
          
          <ExerciseList 
            exercises={filteredExercises}
            onStartExercise={onStartExercise}
          />
        </>
      )}
    </>
  );
};

export default ExerciseContent;

// Extracted ExerciseList component
interface ExerciseListProps {
  exercises: Exercise[];
  onStartExercise: (exerciseId: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onStartExercise }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
      {exercises.map((exercise) => (
        <ExerciseVideo
          key={exercise.id}
          id={exercise.id}
          title={exercise.title}
          description={exercise.description}
          videoUrl={exercise.videoUrl}
          thumbnailUrl={exercise.thumbnailUrl}
          duration={exercise.duration}
          difficulty={exercise.difficulty}
          muscleGroups={exercise.muscleGroups}
          onStartExercise={onStartExercise}
        />
      ))}
    </div>
  );
};
