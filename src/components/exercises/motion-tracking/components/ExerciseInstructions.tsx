
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ExerciseInstructionsProps {
  exerciseName: string;
}

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ exerciseName }) => {
  // Define instruction content based on exercise type
  const getInstructions = () => {
    // Default to basic squat instructions
    return [
      "Position yourself so your full body is visible in the camera",
      "Keep your back straight and feet shoulder-width apart",
      "Bend your knees while keeping your heels on the ground",
      "Aim for controlled movements rather than speed",
      "Complete 10-15 repetitions with good form"
    ];
  };
  
  const instructions = getInstructions();
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Follow these instructions for proper form:
      </p>
      
      <ul className="space-y-3">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
      
      <p className="text-sm font-medium pt-2">
        The AI will track your movements and provide feedback on your form.
      </p>
    </div>
  );
};

export default ExerciseInstructions;
