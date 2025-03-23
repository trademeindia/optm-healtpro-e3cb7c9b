
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ExerciseInstructionsProps {
  exerciseName: string;
}

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ exerciseName }) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Follow these instructions for proper form:
      </p>
      
      <ul className="space-y-2">
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Position yourself so your full body is visible in the camera</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Keep your back straight and feet shoulder-width apart</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Bend your knees while keeping your heels on the ground</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Aim for controlled movements rather than speed</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Complete 10-15 repetitions with good form</span>
        </li>
      </ul>
      
      <p className="text-sm font-medium pt-2">
        The AI will track your movements and provide feedback on your form.
      </p>
    </div>
  );
};

export default ExerciseInstructions;
