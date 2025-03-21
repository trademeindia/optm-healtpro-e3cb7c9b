
import React from 'react';
import { ExerciseType } from './types';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseSelectorProps {
  selectedType: ExerciseType;
  onSelectType: (type: ExerciseType) => void;
}

const exercises = [
  { id: ExerciseType.SQUAT, name: 'Squat', description: 'Lower body strength' },
  { id: ExerciseType.LUNGE, name: 'Lunge', description: 'Lower body stability' },
  { id: ExerciseType.PUSHUP, name: 'Push-up', description: 'Upper body strength' },
  { id: ExerciseType.PLANK, name: 'Plank', description: 'Core stability' }
];

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ selectedType, onSelectType }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {exercises.map((exercise) => (
        <button
          key={exercise.id}
          className={cn(
            "flex flex-col items-start p-3 text-left rounded-lg border transition-colors",
            selectedType === exercise.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => onSelectType(exercise.id)}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">{exercise.name}</span>
            {selectedType === exercise.id && (
              <span className="bg-primary rounded-full p-0.5">
                <Check className="h-3 w-3 text-primary-foreground" />
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {exercise.description}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ExerciseSelector;
