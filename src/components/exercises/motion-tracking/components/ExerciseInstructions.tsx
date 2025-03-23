
import React from 'react';
import { Card } from '@/components/ui/card';

const ExerciseInstructions: React.FC = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Exercise Instructions</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
            <span className="font-semibold">1</span>
          </div>
          <div>
            <h4 className="font-medium">Position Yourself</h4>
            <p className="text-sm text-muted-foreground">
              Stand 5-6 feet away from your camera so your entire body is visible.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
            <span className="font-semibold">2</span>
          </div>
          <div>
            <h4 className="font-medium">Perform the Exercise</h4>
            <p className="text-sm text-muted-foreground">
              Perform squats with proper form. Keep your back straight and knees aligned with toes.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
            <span className="font-semibold">3</span>
          </div>
          <div>
            <h4 className="font-medium">Follow Feedback</h4>
            <p className="text-sm text-muted-foreground">
              Watch the real-time feedback and adjust your form based on the recommendations.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExerciseInstructions;
