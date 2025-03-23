
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExerciseInstructionsProps {
  exerciseName: string;
}

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ exerciseName }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">{exerciseName}</h3>
        <div className="space-y-2 text-sm">
          <p>• Stand with feet shoulder-width apart</p>
          <p>• Keep your back straight and core engaged</p>
          <p>• Lower your body by bending at the knees and hips</p>
          <p>• Keep knees aligned with toes, not extending past them</p>
          <p>• Aim for a 90-degree angle at the knees at bottom position</p>
          <p>• Return to standing position with control</p>
          <p>• Maintain consistent breathing throughout</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseInstructions;
