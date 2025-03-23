
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const ExerciseInstructions: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <Info className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">Exercise Instructions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ol className="space-y-2 list-decimal list-inside text-sm">
          <li>Stand in front of the camera so your full body is visible</li>
          <li>Ensure good lighting and a clear background</li>
          <li>Maintain proper posture throughout the exercise</li>
          <li>Follow the real-time feedback to improve your form</li>
          <li>Complete your repetitions with controlled movements</li>
          <li>Use the motion analysis metrics to track your progress</li>
        </ol>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p className="font-medium">Note:</p>
          <p>The AI analysis is designed to provide guidance, but always listen to your body and avoid movements that cause pain.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseInstructions;
