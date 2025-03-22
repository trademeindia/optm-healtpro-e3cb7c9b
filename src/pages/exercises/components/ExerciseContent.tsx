
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import PostureMonitor from '@/components/exercises/PostureMonitor';
import CategoryFilter from './CategoryFilter';
import { Exercise } from '@/types/exercise.types';
import ErrorBoundary from '@/components/ErrorBoundary';

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
    <ErrorBoundary>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
            {filteredExercises.map((exercise) => (
              <ExerciseVideo
                key={exercise.id}
                id={exercise.id}
                title={exercise.title}
                description={exercise.description}
                duration={exercise.duration}
                difficulty={exercise.difficulty}
                thumbnailUrl={exercise.thumbnailUrl}
                videoUrl={exercise.videoUrl}
                muscleGroups={exercise.muscleGroups}
                onStart={() => onStartExercise(exercise.id)}
                status={exercise.completionStatus || 'not-started'}
              />
            ))}
            {filteredExercises.length === 0 && (
              <div className="col-span-full p-8 text-center bg-muted rounded-lg">
                <p className="text-muted-foreground">No exercises found for this category.</p>
              </div>
            )}
          </div>
        </>
      )}
    </ErrorBoundary>
  );
};

export default ExerciseContent;
