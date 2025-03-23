
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExerciseInstructions: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Position yourself in front of the camera so your full body is visible.</li>
          <li>Stand upright with feet shoulder-width apart to begin.</li>
          <li>After starting tracking, perform the exercise with controlled movements.</li>
          <li>Follow the real-time feedback to maintain proper form.</li>
          <li>Try to keep all movements smooth and controlled for best results.</li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default ExerciseInstructions;
