
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ExerciseInstructionsProps {
  exerciseName: string;
}

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ exerciseName }) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-3">{exerciseName}</h3>
        <div className="space-y-2.5">
          {instructionSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const instructionSteps = [
  "Stand with feet shoulder-width apart",
  "Keep your back straight and core engaged",
  "Lower your body by bending at the knees and hips",
  "Keep knees aligned with toes, not extending past them",
  "Aim for a 90-degree angle at the knees at bottom position",
  "Return to standing position with control",
  "Maintain consistent breathing throughout"
];

export default ExerciseInstructions;
